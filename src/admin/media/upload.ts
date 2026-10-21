import { getSupabase } from '@/lib/supabase/client';
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase/env';

export type Bucket = 'site-images' | 'site-videos';

/** Mirrors the bucket limits set in the migration (Supabase enforces them again server-side). */
export const mediaRules: Record<Bucket, { types: string[]; maxMb: number; label: string }> = {
  'site-images': { types: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'], maxMb: 10, label: 'JPG / PNG / WebP / AVIF' },
  'site-videos': { types: ['video/mp4', 'video/webm', 'video/quicktime'], maxMb: 50, label: 'MP4 / WebM / MOV' },
};

/** ASCII-only, collision-free object path: `<folder>/<timestamp>-<random>-<name>.<ext>`. */
function objectPath(folder: string, file: File): string {
  const dot = file.name.lastIndexOf('.');
  const ext = (dot > -1 ? file.name.slice(dot + 1) : '').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const base =
    (dot > -1 ? file.name.slice(0, dot) : file.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'file';
  return `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${base}.${ext}`;
}

export function validateMedia(bucket: Bucket, file: File): string | null {
  const rules = mediaRules[bucket];
  if (!rules.types.includes(file.type)) return `نوع الملف غير مدعوم. المسموح: ${rules.label}.`;
  if (file.size > rules.maxMb * 1024 * 1024) return `حجم الملف أكبر من ${rules.maxMb} ميجابايت.`;
  return null;
}

/**
 * Uploads straight from the browser to Supabase Storage with the admin's access token
 * (Storage RLS only lets admins write). Uses XHR rather than supabase-js to report progress.
 * Returns the public URL.
 */
export async function uploadMedia(bucket: Bucket, folder: string, file: File, onProgress?: (fraction: number) => void): Promise<string> {
  const invalid = validateMedia(bucket, file);
  if (invalid) throw new Error(invalid);

  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('انتهت الجلسة. سجّل الدخول مرة أخرى.');

  const path = objectPath(folder, file);
  const endpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', supabaseAnonKey);
    xhr.setRequestHeader('Content-Type', file.type);
    // File names are unique, so the CDN may cache them for a year.
    xhr.setRequestHeader('Cache-Control', 'max-age=31536000');
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let message = `فشل الرفع (${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText);
        if (body?.message) message = `فشل الرفع: ${body.message}`;
      } catch {
        // keep the generic message
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error('انقطع الاتصال أثناء الرفع.'));
    xhr.send(file);
  });

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
