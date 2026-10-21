'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronDown, CircleCheck, NotebookPen, Phone, ShieldCheck, Stethoscope, UserRound } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { EASE_OPTICAL } from '@/components/motion/Reveal';
import { buttonClasses } from '@/components/ui/Button';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ar';
import { cn } from '@/lib/cn';
import { whatsappUrl } from '@/lib/contact';
import { formatDate } from '@/lib/format';
import { saveConsultation } from '@/lib/supabase/consultations';

type FormLabels = Dictionary['contact']['form'];
type Field = 'name' | 'phone' | 'date' | 'type' | 'notes';
type Values = Record<Field, string>;
type Errors = Partial<Record<Exclude<Field, 'notes'>, string>>;

const initialValues: Values = { name: '', phone: '', date: '', type: '', notes: '' };
const validatedFields = ['name', 'phone', 'date', 'type'] as const;

/** Local calendar date as YYYY-MM-DD (avoids UTC off-by-one around midnight). */
function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Converts Arabic-Indic / Persian digits to Latin so phone validation works for every keyboard. */
function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

function validate(values: Values, labels: FormLabels, minDate: string): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = labels.errors.name;

  const phone = normalizeDigits(values.phone).trim();
  const digits = phone.replace(/\D/g, '');
  if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 8 || digits.length > 15) errors.phone = labels.errors.phone;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || values.date < minDate) errors.date = labels.errors.date;
  if (!values.type) errors.type = labels.errors.type;
  return errors;
}

function buildMessage(values: Values, labels: FormLabels, locale: Locale): string {
  const m = labels.message;
  const lines = [
    m.intro,
    '',
    `• ${m.name}: ${values.name.trim()}`,
    `• ${m.phone}: ${normalizeDigits(values.phone).trim()}`,
    `• ${m.date}: ${formatDate(values.date, locale, { weekday: 'long' })}`,
    `• ${m.type}: ${values.type}`,
  ];
  if (values.notes.trim()) lines.push(`• ${m.notes}: ${values.notes.trim()}`);
  lines.push('', m.outro);
  return lines.join('\n');
}

type FieldShellProps = {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
};

function FieldShell({ id, label, icon, error, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-heading text-sm font-bold text-secondary-700">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute start-4 top-[1.15rem] text-primary-500">
          {icon}
        </span>
        {children}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden pt-1.5 text-xs font-medium text-rose-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

type ConsultationFormProps = {
  locale: Locale;
  labels: FormLabels;
};

export function ConsultationForm({ locale, labels }: ConsultationFormProps) {
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Computed after mount so the static HTML never bakes in the build date.
  useEffect(() => setMinDate(todayIso()), []);

  const onChange = (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next, labels, minDate || todayIso()));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values, labels, minDate || todayIso());
    setErrors(found);

    const firstInvalid = validatedFields.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const url = whatsappUrl(buildMessage(values, labels, locale));
    // Opened synchronously, before any network call, so the browser still treats it as a user action.
    const popup = window.open(url, '_blank');
    if (popup) popup.opener = null;
    else window.location.href = url; // Popup blocked → open in the same tab.
    setSentUrl(url);

    // Copy for the clinic's dashboard (/admin → consultations).
    saveConsultation({
      patient_name: values.name.trim(),
      phone: normalizeDigits(values.phone).trim(),
      preferred_date: values.date || null,
      consultation_type: values.type,
      notes: values.notes.trim() || null,
      locale,
    });
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitted(false);
    setSentUrl(null);
  };

  const describedBy = (field: keyof Errors) => (errors[field] ? `cf-${field}-error` : undefined);
  const fieldClass = (field: keyof Errors) => cn('field ps-11', errors[field] && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100');

  return (
    <div className="card relative overflow-hidden p-6 shadow-elevated sm:p-8 lg:p-10">
      <div aria-hidden className="absolute -top-24 size-64 rounded-full bg-primary-100/70 blur-3xl ltr:-right-16 rtl:-left-16" />

      <AnimatePresence mode="wait" initial={false}>
        {sentUrl ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: EASE_OPTICAL }}
            className="relative flex min-h-[420px] flex-col items-center justify-center text-center"
            role="status"
          >
            <span className="grid size-20 place-items-center rounded-full bg-whatsapp/10 text-whatsapp">
              <CircleCheck aria-hidden className="size-10" strokeWidth={1.6} />
            </span>
            <h3 className="mt-6 text-2xl sm:text-3xl">{labels.successTitle}</h3>
            <p className="mt-3 max-w-md text-slate-500">{labels.successText}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={sentUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('whatsapp', 'lg')}>
                <BrandIcon name="whatsapp" className="size-5" />
                {labels.openWhatsapp}
              </a>
              <button type="button" onClick={reset} className={buttonClasses('outline', 'lg')}>
                {labels.newRequest}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <h2 className="text-2xl sm:text-3xl">{labels.title}</h2>
            <p className="mt-2 text-slate-500">{labels.subtitle}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <FieldShell id="cf-name" label={labels.name} icon={<UserRound className="size-[1.1rem]" />} error={errors.name}>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={onChange('name')}
                  placeholder={labels.namePlaceholder}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy('name')}
                  className={fieldClass('name')}
                />
              </FieldShell>

              <FieldShell id="cf-phone" label={labels.phone} icon={<Phone className="size-[1.1rem]" />} error={errors.phone}>
                <input
                  id="cf-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  value={values.phone}
                  onChange={onChange('phone')}
                  placeholder={labels.phonePlaceholder}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy('phone')}
                  // The input is forced LTR (phone digits) inside an RTL page, so mirror its padding physically.
                  className={cn(fieldClass('phone'), 'rtl:pl-4 rtl:pr-11 rtl:text-right')}
                />
              </FieldShell>

              <FieldShell id="cf-date" label={labels.date} icon={<CalendarDays className="size-[1.1rem]" />} error={errors.date}>
                <input
                  id="cf-date"
                  name="date"
                  type="date"
                  min={minDate || undefined}
                  value={values.date}
                  onChange={onChange('date')}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={describedBy('date')}
                  className={cn(fieldClass('date'), 'min-h-[3.25rem]')}
                />
              </FieldShell>

              <FieldShell id="cf-type" label={labels.type} icon={<Stethoscope className="size-[1.1rem]" />} error={errors.type}>
                <select
                  id="cf-type"
                  name="type"
                  value={values.type}
                  onChange={onChange('type')}
                  aria-invalid={Boolean(errors.type)}
                  aria-describedby={describedBy('type')}
                  className={cn(fieldClass('type'), 'cursor-pointer appearance-none pe-11', !values.type && 'text-slate-400')}
                >
                  <option value="" disabled>
                    {labels.typePlaceholder}
                  </option>
                  {labels.types.map((type) => (
                    <option key={type} value={type} className="text-secondary-800">
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden className="pointer-events-none absolute end-4 top-[1.15rem] size-[1.1rem] text-slate-400" />
              </FieldShell>

              <div className="sm:col-span-2">
                <FieldShell id="cf-notes" label={labels.notes} icon={<NotebookPen className="size-[1.1rem]" />}>
                  <textarea
                    id="cf-notes"
                    name="notes"
                    rows={3}
                    value={values.notes}
                    onChange={onChange('notes')}
                    placeholder={labels.notesPlaceholder}
                    className="field resize-none ps-11"
                  />
                </FieldShell>
              </div>
            </div>

            <button type="submit" className={buttonClasses('whatsapp', 'lg', 'mt-8 w-full')}>
              <BrandIcon name="whatsapp" className="size-5" />
              {labels.submit}
            </button>
            <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs text-slate-400">
              <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-400" />
              {labels.privacy}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
