import { CalendarCheck } from 'lucide-react';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { ArrowForward } from '@/components/icons/registry';
import { ButtonLink } from '@/components/ui/Button';
import type { Crumb } from '@/components/ui/Breadcrumb';
import { getDictionary, localePath, pagePaths, type Locale, type PageKey } from '@/i18n';
import { whatsappUrl } from '@/lib/contact';

/** Home hero CTAs: "Book Appointment" + "Explore Services". */
export function HomeHeroActions({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <ButtonLink href={localePath(locale, pagePaths.contact)}>
        <CalendarCheck aria-hidden className="size-5" />
        {t.common.bookAppointment}
      </ButtonLink>
      <ButtonLink href={localePath(locale, pagePaths.services)} variant="outline">
        {t.common.exploreServices}
        <ArrowForward className="size-4" />
      </ButtonLink>
    </>
  );
}

/** Inner-page hero CTAs: "Book Appointment" + WhatsApp. */
export function PageHeroActions({ locale, bookHref }: { locale: Locale; bookHref?: string }) {
  const t = getDictionary(locale);
  return (
    <>
      <ButtonLink href={bookHref ?? localePath(locale, pagePaths.contact)}>
        <CalendarCheck aria-hidden className="size-5" />
        {t.common.bookAppointment}
      </ButtonLink>
      <ButtonLink href={whatsappUrl(t.whatsapp.defaultMessage)} variant="whatsapp">
        <BrandIcon name="whatsapp" className="size-5" />
        {t.common.whatsapp}
      </ButtonLink>
    </>
  );
}

export function pageCrumbs(locale: Locale, page: PageKey, extra?: Crumb[]): Crumb[] {
  const t = getDictionary(locale);
  const crumbs: Crumb[] = [{ label: t.common.home, href: localePath(locale, '/') }];
  if (extra?.length) crumbs.push({ label: t.nav[page], href: localePath(locale, pagePaths[page]) }, ...extra);
  else crumbs.push({ label: t.nav[page] });
  return crumbs;
}
