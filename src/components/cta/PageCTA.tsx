import { CalendarCheck } from 'lucide-react';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { IrisRings } from '@/components/ui/OpticArt';
import { getDictionary, localePath, pagePaths, type Locale } from '@/i18n';
import { whatsappUrl } from '@/lib/contact';

type PageCTAProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  /** Override the "Contact Us" target (e.g. the form anchor on the contact page). */
  contactHref?: string;
};

/** Standardised closing call-to-action block used at the end of every page. */
export function PageCTA({ locale, title, subtitle, contactHref }: PageCTAProps) {
  const t = getDictionary(locale);

  return (
    <section className="relative py-20 sm:py-24">
      <Container>
        <Reveal
          scale={0.97}
          className="relative isolate overflow-hidden rounded-[2rem] bg-navy-gradient px-6 py-16 text-center shadow-elevated sm:rounded-[2.5rem] sm:px-12 lg:px-20 lg:py-20"
        >
          <div aria-hidden className="mask-radial absolute inset-0 -z-10 bg-grid-light" />
          <IrisRings className="absolute -top-24 -z-10 w-[380px] animate-spin-slower text-white/[0.07] ltr:-left-24 rtl:-right-24" />
          <IrisRings className="absolute -bottom-32 -z-10 w-[440px] animate-spin-slow text-white/[0.06] ltr:-right-28 rtl:-left-28" />
          <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-56 w-2/3 -translate-x-1/2 rounded-full bg-primary/30 blur-[90px]" />

          <h2 className="mx-auto max-w-3xl text-3xl text-white sm:text-4xl lg:text-5xl lg:leading-[1.2]">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-secondary-100/80 sm:text-lg">{subtitle}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href={contactHref ?? localePath(locale, pagePaths.contact)} variant="light" size="lg" className="w-full sm:w-auto">
              <CalendarCheck aria-hidden className="size-5 text-primary" />
              {t.common.contactUs}
            </ButtonLink>
            <ButtonLink href={whatsappUrl(t.whatsapp.defaultMessage)} variant="whatsapp" size="lg" className="w-full sm:w-auto">
              <BrandIcon name="whatsapp" className="size-5" />
              {t.common.whatsapp}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
