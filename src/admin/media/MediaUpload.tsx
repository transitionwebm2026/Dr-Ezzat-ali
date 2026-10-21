'use client';

import { CloudUpload, ImagePlus, RefreshCw, Trash, Video } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { Button, TextInput } from '@/admin/ui/primitives';
import { cn } from '@/lib/cn';
import { mediaRules, uploadMedia, type Bucket } from './upload';

type MediaUploadProps = {
  kind: 'image' | 'video';
  /** Storage folder inside the bucket, e.g. "reviews", "logo". */
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  /** Poster shown on the video preview. */
  poster?: string | null;
};

/**
 * Drag & drop / click-to-browse uploader with instant preview.
 * Removing a file only clears the field — the object stays in Storage, because the live (static) site
 * may still reference it until the next publish finishes.
 */
export function MediaUpload({ kind, folder, value, onChange, label, hint, required, error, poster }: MediaUploadProps) {
  const bucket: Bucket = kind === 'image' ? 'site-images' : 'site-videos';
  const rules = mediaRules[bucket];
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const shownError = uploadError ?? error;

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    setProgress(0);
    try {
      onChange(await uploadMedia(bucket, folder, file, setProgress));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'فشل الرفع.');
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragging(false);
    void upload(event.dataTransfer.files[0]);
  };

  const Icon = kind === 'image' ? ImagePlus : Video;

  return (
    <div role="group" aria-label={label}>
      <p className="mb-1.5 flex items-center gap-1 text-sm font-bold text-secondary-800">
        {label}
        {required && <span className="text-rose-500" aria-hidden>*</span>}
      </p>

      <input ref={inputRef} type="file" accept={rules.types.join(',')} className="sr-only" tabIndex={-1} onChange={(e) => void upload(e.target.files?.[0])} />

      {value && progress === null ? (
        <div
          className={cn('overflow-hidden rounded-2xl border bg-slate-50', dragging ? 'border-primary ring-4 ring-primary/15' : 'border-slate-200')}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div className="grid place-items-center bg-[repeating-conic-gradient(#f1f5f9_0_25%,#fff_0_50%)] bg-[length:20px_20px] p-3">
            {kind === 'image' ? (
              <img src={value} alt="" className="max-h-56 w-auto max-w-full rounded-lg object-contain" />
            ) : (
              <video src={value} poster={poster ?? undefined} controls preload="metadata" className="max-h-64 w-full rounded-lg bg-black" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-white p-2.5">
            <TextInput dir="ltr" value={value} onChange={(e) => onChange(e.target.value.trim() || null)} aria-label={`${label} — الرابط`} className="min-w-0 flex-1 py-2 text-xs" />
            <Button variant="outline" size="sm" icon={<RefreshCw aria-hidden className="size-3.5" />} onClick={() => inputRef.current?.click()}>
              استبدال
            </Button>
            <Button variant="danger" size="sm" icon={<Trash aria-hidden className="size-3.5" />} onClick={() => onChange(null)}>
              إزالة
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={progress !== null}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors',
            dragging ? 'border-primary bg-primary-50' : shownError ? 'border-rose-300 bg-rose-50/40' : 'border-slate-300 bg-slate-50 hover:border-primary hover:bg-primary-50/50',
          )}
        >
          {progress !== null ? (
            <>
              <CloudUpload aria-hidden className="size-7 animate-pulse text-primary" />
              <span className="text-sm font-bold text-secondary-700">جاري الرفع… {Math.round(progress * 100)}%</span>
              <span className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full rounded-full bg-brand-gradient transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
              </span>
            </>
          ) : (
            <>
              <Icon aria-hidden className="size-7 text-primary" />
              <span className="text-sm font-bold text-secondary-700">اسحب الملف هنا أو اضغط للاختيار من جهازك</span>
              <span className="text-xs text-slate-500">
                {rules.label} — حتى {rules.maxMb} ميجابايت
              </span>
            </>
          )}
        </button>
      )}

      {shownError ? (
        <p role="alert" className="mt-1 text-xs font-medium text-rose-600">
          {shownError}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
