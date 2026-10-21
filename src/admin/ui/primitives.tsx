'use client';

import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

// ─── Buttons ─────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-glow hover:bg-primary-600',
  secondary: 'bg-secondary text-white hover:bg-secondary-800',
  outline: 'border border-slate-200 bg-white text-secondary-700 hover:border-primary hover:text-primary-700',
  ghost: 'text-secondary-600 hover:bg-slate-100',
  danger: 'border border-rose-200 bg-white text-rose-600 hover:bg-rose-50',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({ variant = 'primary', size = 'md', loading, icon, className, children, disabled, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-heading font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' ? 'min-h-9 px-3 text-xs' : 'min-h-11 px-4 text-sm',
        buttonVariants[variant],
        className,
      )}
      {...rest}
    >
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

/** Square icon-only button; `label` is announced to screen readers and shown as a tooltip. */
export function IconButton({ label, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-secondary-700 disabled:pointer-events-none disabled:opacity-30',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export function Card({ title, description, actions, children, className }: { title?: ReactNode; description?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6', className)}>
      {(title || actions) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-heading text-lg font-bold text-secondary-800">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle aria-hidden className={cn('size-6 animate-spin text-primary', className)} />;
}

export function LoadingBlock({ label = 'جاري التحميل…' }: { label?: string }) {
  return (
    <div role="status" className="grid place-items-center gap-3 py-16 text-sm text-slate-500">
      <Spinner />
      {label}
    </div>
  );
}

export function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <span>{message}</span>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}

export function Badge({ tone = 'slate', children }: { tone?: 'slate' | 'green' | 'blue' | 'amber' | 'rose'; children: ReactNode }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    blue: 'bg-primary-50 text-primary-700 ring-primary-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold ring-1 ring-inset ring-transparent', tones[tone])}>{children}</span>;
}

export function Tabs<T extends string>({ tabs, value, onChange, className }: { tabs: { id: T; label: ReactNode }[]; value: T; onChange: (id: T) => void; className?: string }) {
  return (
    <div role="tablist" className={cn('flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === value}
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-lg px-3.5 py-2 font-heading text-sm font-bold transition-colors',
            tab.id === value ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-secondary-700',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Form controls ───────────────────────────────────────────────────────────

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-secondary-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-slate-50 aria-[invalid=true]:border-rose-300';

type FieldProps = { label: ReactNode; hint?: ReactNode; error?: string; required?: boolean; className?: string; children: ReactNode };

/** Label wrapping a single control (implicit association). */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 flex items-center gap-1 text-sm font-bold text-secondary-800">
        {label}
        {required && <span className="text-rose-500" aria-hidden>*</span>}
      </span>
      {children}
      {error ? (
        <span role="alert" className="mt-1 block text-xs font-medium text-rose-600">
          {error}
        </span>
      ) : (
        hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>
      )}
    </label>
  );
}

/** Heading for a group of controls that cannot share one <label>. */
export function FieldGroup({ label, hint, className, children }: { label: ReactNode; hint?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div role="group" className={className}>
      <p className="mb-1.5 text-sm font-bold text-secondary-800">{label}</p>
      {hint && <p className="-mt-1 mb-2 text-xs text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}

export function TextInput({ className, invalid, ...rest }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={cn(inputClass, className)} {...rest} />;
}

export function TextArea({ className, invalid, rows = 4, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea rows={rows} aria-invalid={invalid || undefined} className={cn(inputClass, 'resize-y leading-relaxed', className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputClass, 'cursor-pointer', className)} {...rest}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (value: boolean) => void; label: ReactNode; description?: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-start transition hover:border-primary-200 disabled:opacity-60"
    >
      <span className={cn('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-slate-300')}>
        <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', checked ? 'start-[1.375rem]' : 'start-0.5')} />
      </span>
      <span>
        <span className="block text-sm font-bold text-secondary-800">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
      </span>
    </button>
  );
}

type BilingualProps = {
  label: string;
  ar: string;
  en: string;
  onChange: (locale: 'ar' | 'en', value: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  hint?: ReactNode;
  errors?: { ar?: string; en?: string };
};

/** Arabic + English inputs side by side for one bilingual column pair (`x_ar` / `x_en`). */
export function BilingualField({ label, ar, en, onChange, multiline, rows, required, hint, errors }: BilingualProps) {
  const control = (locale: 'ar' | 'en', value: string) =>
    multiline ? (
      <TextArea dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale} rows={rows} value={value} invalid={Boolean(errors?.[locale])} onChange={(e) => onChange(locale, e.target.value)} />
    ) : (
      <TextInput dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale} value={value} invalid={Boolean(errors?.[locale])} onChange={(e) => onChange(locale, e.target.value)} />
    );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label={`${label} (عربي)`} required={required} error={errors?.ar} hint={hint}>
        {control('ar', ar)}
      </Field>
      <Field label={`${label} (English)`} error={errors?.en}>
        {control('en', en)}
      </Field>
    </div>
  );
}

/** Sticky save bar. `dirty` warns that uploads / edits are not on the site until saved. */
export function PageActions({ dirty, children }: { dirty?: boolean; children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {dirty && (
        <p role="status" className="me-auto text-sm font-bold text-amber-600">
          لديك تعديلات غير محفوظة — اضغط «حفظ» لتظهر على الموقع.
        </p>
      )}
      {children}
    </div>
  );
}
