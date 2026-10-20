import type { ReactNode } from 'react';
import { HeroContactBar } from '@/components/hero/HeroContactBar';
import { HeroPortrait } from '@/components/hero/HeroPortrait';
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb';
import { Container } from '@/components/ui/Container';
import type { Locale } from '@/i18n';
import { cn } from '@/lib/cn';

type UnifiedHeroProps = {
  locale: Locale;
  variant?: 'home' | 'page';
  title: string;
  highlight?: string;
  /** Short line under the headline. */
  lead?: string;
  /** Two CTAs, shown side by side under the lead. */
  actions?: ReactNode;
  breadcrumb?: Crumb[];
  portraitAlt: string;
};

/**
 * Unified hero used by all 7 pages.
 *
 * One stack in the start column: headline → lead → CTAs (side by side) → social & phone bar.
 * Layout contract (lg+): a 3-column grid — [text] [portrait] [quiet end column]. The end column
 * holds nothing, so it is narrower and the text column gets room for both CTAs on one row.
 * The portrait owns the centre column, so text can never overlap it.
 * Below lg, the columns stack (text → portrait).
 */
export function UnifiedHero({ locale, variant = 'page', title, highlight, lead, actions, breadcrumb, portraitAlt }: UnifiedHeroProps) {
  const home = variant === 'home';

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-surface-tint via-white to-white">
      {/* Backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="mask-radial absolute inset-0 bg-grid opacity-70" />
        <div className="absolute -top-40 size-[520px] rounded-full bg-primary-200/40 blur-[110px] ltr:-left-40 rtl:-right-40" />
        <div className="absolute -bottom-32 size-[460px] rounded-full bg-secondary-200/35 blur-[110px] ltr:-right-32 rtl:-left-32" />
      </div>

      <Container
        className={cn(
          'relative grid items-center gap-y-8 pt-[calc(var(--header-h)+2.5rem)] lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1.15fr)_minmax(0,0.6fr)] lg:gap-x-8 lg:pt-[var(--header-h)] xl:gap-x-12',
          home ? 'lg:min-h-[min(100svh,980px)]' : 'lg:min-h-[640px]',
        )}
      >
        {/* Start column — headline, lead, CTAs & contact bar */}
        <div className="relative z-10 flex flex-col items-center text-center lg:col-start-1 lg:row-start-1 lg:items-start lg:py-16 lg:text-start">
          {breadcrumb && (
            <div className="mb-6 animate-fade-in-up">
              <Breadcrumb items={breadcrumb} />
            </div>
          )}
          <h1
            className={cn(
              'animate-fade-in-up [animation-delay:80ms]',
              home
                ? 'text-[2.4rem] sm:text-5xl lg:text-[2.75rem] xl:text-[3.3rem] xl:leading-[1.2]'
                : 'text-4xl sm:text-5xl lg:text-[2.6rem] xl:text-[3.2rem] xl:leading-[1.2]',
            )}
          >
            {title}
            {highlight && <span className="text-gradient mt-1 block pb-1">{highlight}</span>}
          </h1>
          {lead && <p className="mt-5 max-w-md animate-fade-in-up text-base text-slate-500 [animation-delay:160ms] sm:text-lg">{lead}</p>}
          {actions && (
            <div className="mt-8 flex animate-fade-in-up flex-wrap justify-center gap-3 [animation-delay:240ms] lg:justify-start">{actions}</div>
          )}
          <div className="mt-8 animate-fade-in-up [animation-delay:320ms]">
            <HeroContactBar locale={locale} />
          </div>
        </div>

        {/* Centre column — portrait (kept clear of all text) */}
        <HeroPortrait
          alt={portraitAlt}
          size={home ? 'lg' : 'md'}
          // Mobile: last in the stack (bottom-anchored). lg+: explicit centre cell.
          className="order-last lg:order-none lg:col-start-2 lg:row-start-1 lg:self-end"
        />
      </Container>

      {/* Soft floor so the portrait melts into the page */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
