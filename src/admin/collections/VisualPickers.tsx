'use client';

import { Check } from 'lucide-react';
import { MediaUpload } from '@/admin/media/MediaUpload';
import { Field, FieldGroup, Select } from '@/admin/ui/primitives';
import { Icon, isIconKey, type IconKey } from '@/components/icons/registry';
import { isSceneKey, sceneKeys, TechniqueScene, type SceneKey } from '@/components/services/TechniqueScene';
import { OpticArt, toneClasses } from '@/components/ui/OpticArt';
import { isTone, tones, type Tone } from '@/content/media';
import { cn } from '@/lib/cn';

const iconLabels: Record<IconKey, string> = {
  eye: 'عين',
  scanEye: 'فحص العين',
  crosshair: 'تصويب (ليزر)',
  aperture: 'عدسة',
  layers: 'طبقات القرنية',
  gauge: 'ضغط العين',
  droplets: 'قطرات',
  syringe: 'حقن',
  microscope: 'مجهر',
  glasses: 'نظارة',
  stethoscope: 'سماعة طبية',
  activity: 'نبض / مؤشر',
  heartPulse: 'رعاية',
  shieldCheck: 'أمان',
  sparkles: 'وضوح',
  clipboardList: 'قائمة فحص',
  calendarCheck: 'موعد',
  badgeCheck: 'اعتماد',
  award: 'جائزة',
  graduationCap: 'شهادة',
  userRound: 'مريض',
};

/** Medical icons first, generic ones last (the Record type keeps the list in sync with the registry). */
const iconOrder = Object.keys(iconLabels) as IconKey[];

const toneLabels: Record<Tone, string> = {
  cyan: 'سماوي',
  navy: 'كحلي',
  sky: 'أزرق فاتح',
  deep: 'أزرق داكن',
  teal: 'فيروزي',
  frost: 'أبيض ثلجي',
};

export const sceneLabels: Record<SceneKey, string> = {
  femto: 'الفيمتو ليزك — شريحة القرنية بالليزر',
  smile: 'السمايل — فتحة صغيرة دون شريحة',
  prk: 'التصحيح السطحي — شعاع الإكسيمر',
  icl: 'زراعة العدسة ICL',
  phaco: 'الفاكو — تفتيت المياه البيضاء',
  multifocal: 'عدسة متعددة البؤر',
  toric: 'عدسة التوريك',
  edof: 'عدسة العمق الممتد EDOF',
  vitrectomy: 'استئصال الجسم الزجاجي',
  injection: 'حقن داخل العين',
  photocoagulation: 'ليزر الشبكية',
  oct: 'التصوير المقطعي OCT',
  drops: 'قطرات وضبط ضغط العين',
  slt: 'الليزر الانتقائي SLT',
  iridotomy: 'ليزر القزحية YAG',
  shunt: 'صمام / جراحة الجلوكوما',
};

type VisualFieldProps = {
  label: string;
  icon: unknown;
  tone: unknown;
  image: string | null;
  folder: string;
  imageHint?: string;
  onChange: (part: 'icon' | 'tone' | 'image', value: string | null) => void;
};

/** Icon grid + colour swatches + optional photo, next to a live preview of the card. */
export function VisualField({ label, icon, tone, image, folder, imageHint, onChange }: VisualFieldProps) {
  const iconKey = isIconKey(icon) ? icon : undefined;
  const toneKey = isTone(tone) ? tone : undefined;

  return (
    <FieldGroup label={label}>
      <div className="grid gap-5 md:grid-cols-[1fr_220px]">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-bold text-slate-500">الأيقونة</p>
            <div role="radiogroup" aria-label="الأيقونة" className="grid grid-cols-6 gap-1.5 sm:grid-cols-7">
              {iconOrder.map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={iconKey === key}
                  aria-label={iconLabels[key]}
                  title={iconLabels[key]}
                  onClick={() => onChange('icon', key)}
                  className={cn(
                    'grid aspect-square place-items-center rounded-xl border transition',
                    iconKey === key ? 'border-primary bg-primary-50 text-primary-700 ring-2 ring-primary/20' : 'border-slate-200 bg-white text-secondary-600 hover:border-primary-200',
                  )}
                >
                  <Icon name={key} className="size-5" strokeWidth={1.7} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-slate-500">لون الخلفية</p>
            <div role="radiogroup" aria-label="لون الخلفية" className="flex flex-wrap gap-2">
              {tones.map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={toneKey === key}
                  onClick={() => onChange('tone', key)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border bg-white py-1.5 pe-3 ps-1.5 text-xs font-bold transition',
                    toneKey === key ? 'border-primary text-primary-700 ring-2 ring-primary/20' : 'border-slate-200 text-secondary-700 hover:border-primary-200',
                  )}
                >
                  <span className={cn('grid size-7 place-items-center rounded-lg bg-gradient-to-br', toneClasses[key])}>
                    {toneKey === key && <Check aria-hidden className={cn('size-4', key === 'frost' ? 'text-primary-700' : 'text-white')} />}
                  </span>
                  {toneLabels[key]}
                </button>
              ))}
            </div>
          </div>

          <MediaUpload kind="image" folder={folder} label="صورة البطاقة" hint={imageHint} value={image} onChange={(url) => onChange('image', url)} />
        </div>

        <div>
          <p className="mb-2 text-xs font-bold text-slate-500">معاينة</p>
          <OpticArt tone={toneKey ?? 'cyan'} icon={iconKey ?? 'eye'} image={image ?? undefined} sizes="220px" className="aspect-[4/3] rounded-2xl shadow-sm" />
          {image && <p className="mt-2 text-xs text-slate-500">الصورة المرفوعة تظهر بدل الرسمة، والأيقونة واللون يظهران في قسم التفاصيل.</p>}
        </div>
      </div>
    </FieldGroup>
  );
}

/** Dropdown of the animated technique illustrations, with the selected one playing beside it. */
export function SceneField({ label, hint, value, onChange }: { label: string; hint?: string; value: unknown; onChange: (scene: SceneKey) => void }) {
  const scene = isSceneKey(value) ? value : 'femto';
  return (
    <div className="flex items-start gap-4">
      <Field label={label} hint={hint} className="min-w-0 flex-1">
        <Select value={scene} onChange={(e) => onChange(e.target.value as SceneKey)}>
          {sceneKeys.map((key) => (
            <option key={key} value={key}>
              {sceneLabels[key]}
            </option>
          ))}
        </Select>
      </Field>
      <div aria-hidden className="grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-secondary-600 via-secondary-800 to-[#021a30] p-1.5 text-white shadow-sm">
        <TechniqueScene scene={scene} className="size-full" />
      </div>
    </div>
  );
}
