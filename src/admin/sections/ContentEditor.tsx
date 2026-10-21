'use client';

import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { ListControls, moveItem } from '@/admin/ui/ListControls';
import { Button, Field, FieldGroup, TextArea, TextInput, Toggle } from '@/admin/ui/primitives';
import { emptyLike, isPlainObject } from '@/lib/cms/sections';

/** Arabic labels for the dictionary keys; unknown keys fall back to the raw key. */
const keyLabels: Record<string, string> = {
  title: 'العنوان',
  subtitle: 'العنوان الفرعي',
  highlight: 'الجزء المميز من العنوان',
  lead: 'النص التمهيدي',
  cta: 'نص الزر',
  label: 'التسمية',
  description: 'الوصف',
  paragraphs: 'الفقرات',
  points: 'النقاط',
  items: 'العناصر',
  steps: 'الخطوات',
  details: 'التفاصيل',
  duration: 'المدة',
  name: 'الاسم',
  shortTitle: 'اللقب المختصر',
  portraitAlt: 'وصف صورة الطبيب (لقارئات الشاشة)',
  signature: 'التوقيع',
  role: 'الصفة',
  year: 'السنة',
  place: 'المكان',
  issuer: 'الجهة المانحة',
  kind: 'النوع',
  kinds: 'أسماء الأنواع',
  value: 'القيمة',
  suffix: 'اللاحقة',
  id: 'المعرّف التقني',
  q: 'السؤال',
  a: 'الإجابة',
  short: 'الوصف القصير',
  conditions: 'الحالات',
  techniques: 'التقنيات',
  detail: 'التفاصيل',
  recovery: 'التعافي',
  equipment: 'التجهيزات',
  equipmentTitle: 'عنوان التجهيزات',
  groups: 'المجموعات',
  pages: 'الصفحات',
  keywords: 'الكلمات المفتاحية',
  siteName: 'اسم الموقع',
  errors: 'رسائل الأخطاء',
  message: 'نص رسالة واتساب',
  types: 'أنواع الاستشارة',
  hero: 'الواجهة',
  grid: 'الشبكة',
  featuredLabel: 'شارة المقال المميز',
  videoLabel: 'شارة الفيديو',
  videoTitle: 'عنوان الفيديو',
  experienceBadge: 'شارة سنوات الخبرة',
  defaultMessage: 'الرسالة الافتراضية',
  serviceMessage: 'رسالة حجز خدمة',
};

const keyHints: Record<string, string> = {
  id: 'بالإنجليزية — يُستخدم في الروابط والأيقونات. لا تغيّره للعناصر الموجودة.',
  kind: 'degree · fellowship · membership · certification',
  serviceMessage: 'اترك {service} كما هو — يُستبدل باسم الخدمة.',
};

function labelFor(key: string) {
  return keyLabels[key] ?? key;
}

type EditorProps = {
  template: unknown;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string;
  dir: 'rtl' | 'ltr';
  /** Paths (with `*` for array items) hidden from the form. */
  omit: string[];
  /** Arrays whose length cannot change. */
  fixed: string[];
  label?: string;
};

function childPath(path: string, key: string) {
  return path ? `${path}.${key}` : key;
}

/** Recursive form for one section: strings, numbers, booleans, string lists, objects and lists of objects. */
export function ContentEditor({ template, value, onChange, path, dir, omit, fixed, label }: EditorProps): ReactNode {
  if (typeof template === 'string') {
    const text = typeof value === 'string' ? value : '';
    const key = path.split('.').pop() ?? '';
    const ltr = key === 'id' || key === 'kind';
    const long = template.length > 90 || template.includes('\n');
    return (
      <Field label={label ?? labelFor(key)} hint={keyHints[key]}>
        {long ? (
          <TextArea dir={ltr ? 'ltr' : dir} rows={Math.min(8, Math.max(3, Math.ceil(template.length / 90)))} value={text} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <TextInput dir={ltr ? 'ltr' : dir} value={text} onChange={(e) => onChange(e.target.value)} />
        )}
      </Field>
    );
  }

  if (typeof template === 'number') {
    const key = path.split('.').pop() ?? '';
    return (
      <Field label={label ?? labelFor(key)}>
        <TextInput type="number" dir="ltr" value={typeof value === 'number' ? value : 0} onChange={(e) => onChange(Number(e.target.value))} />
      </Field>
    );
  }

  if (typeof template === 'boolean') {
    return <Toggle checked={Boolean(value)} onChange={onChange} label={label ?? labelFor(path.split('.').pop() ?? '')} />;
  }

  if (Array.isArray(template)) {
    const list = Array.isArray(value) ? value : [];
    const itemTemplate = template[0];
    const canResize = !fixed.includes(path.replace(/\.\d+(?=\.|$)/g, '.*'));
    const heading = label ?? labelFor(path.split('.').pop() ?? '');
    const update = (index: number, item: unknown) => onChange(list.map((entry, i) => (i === index ? item : entry)));

    return (
      <FieldGroup label={heading}>
        <div className="space-y-2.5">
          {list.map((item, index) => {
            const nested = isPlainObject(itemTemplate) || Array.isArray(itemTemplate);
            const controls = canResize ? (
              <ListControls index={index} count={list.length} onMove={(to) => onChange(moveItem(list, index, to))} onRemove={() => onChange(list.filter((_, i) => i !== index))} />
            ) : null;
            const editor = (
              <ContentEditor
                template={itemTemplate}
                value={item}
                onChange={(next) => update(index, next)}
                path={`${path}.${index}`}
                dir={dir}
                omit={omit}
                fixed={fixed}
                label={nested ? undefined : `${heading} ${index + 1}`}
              />
            );
            return nested ? (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                  {controls}
                </div>
                {editor}
              </div>
            ) : (
              <div key={index} className="flex items-end gap-1">
                <div className="flex-1">{editor}</div>
                {controls}
              </div>
            );
          })}
          {canResize && itemTemplate !== undefined && (
            <Button variant="outline" size="sm" icon={<Plus aria-hidden className="size-3.5" />} onClick={() => onChange([...list, emptyLike(itemTemplate)])}>
              إضافة
            </Button>
          )}
        </div>
      </FieldGroup>
    );
  }

  if (isPlainObject(template)) {
    const object = isPlainObject(value) ? value : {};
    const keys = Object.keys(template).filter((key) => !omit.includes(childPath(path, key).replace(/\.\d+(?=\.|$)/g, '.*')));
    return (
      <div className="space-y-4">
        {label && <p className="text-sm font-bold text-secondary-800">{label}</p>}
        {keys.map((key) => (
          <ContentEditor
            key={key}
            template={template[key]}
            value={object[key]}
            onChange={(next) => onChange({ ...object, [key]: next })}
            path={childPath(path, key)}
            dir={dir}
            omit={omit}
            fixed={fixed}
          />
        ))}
      </div>
    );
  }

  return null;
}
