'use client';

import { Field, Select, TextInput } from './primitives';

export const pagePresets: { path: string; label: string }[] = [
  { path: '/', label: 'الرئيسية' },
  { path: '/about/', label: 'عن الطبيب' },
  { path: '/services/', label: 'الخدمات' },
  { path: '/services/#lasik', label: 'الخدمات ← الليزك وتصحيح الإبصار' },
  { path: '/services/#cataract', label: 'الخدمات ← المياه البيضاء' },
  { path: '/services/#retina', label: 'الخدمات ← الشبكية' },
  { path: '/services/#glaucoma', label: 'الخدمات ← الجلوكوما' },
  { path: '/reviews/', label: 'آراء المرضى' },
  { path: '/videos/', label: 'الفيديوهات' },
  { path: '/articles/', label: 'المقالات' },
  { path: '/contact/', label: 'تواصل معنا' },
];

const CUSTOM = '__custom__';

export function isValidLinkPath(path: string): boolean {
  return /^(\/|https?:\/\/)\S*$/.test(path.trim());
}

/** Page picker with a "custom link" escape hatch. Paths are stored without the /en prefix — the site adds it. */
export function LinkPathInput({ value, onChange, error }: { value: string; onChange: (path: string) => void; error?: string }) {
  const preset = pagePresets.some((page) => page.path === value) ? value : CUSTOM;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="الصفحة" error={error}>
        <Select value={preset} onChange={(e) => onChange(e.target.value === CUSTOM ? (preset === CUSTOM ? value : '') : e.target.value)}>
          {pagePresets.map((page) => (
            <option key={page.path} value={page.path}>
              {page.label}
            </option>
          ))}
          <option value={CUSTOM}>رابط مخصص…</option>
        </Select>
      </Field>
      {preset === CUSTOM && (
        <Field label="الرابط" hint="مسار داخلي يبدأ بـ / أو رابط كامل يبدأ بـ https://">
          <TextInput dir="ltr" value={value} placeholder="/about/ أو https://…" onChange={(e) => onChange(e.target.value)} invalid={Boolean(error)} />
        </Field>
      )}
    </div>
  );
}
