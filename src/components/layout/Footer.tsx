import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowForward } from '@/components/icons/registry';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { IrisRings } from '@/components/ui/OpticArt';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { siteConfig, type SocialNetwork } from '@/config/site';
import { getDictionary, localePath, navOrder, pagePaths, type Locale } from '@/i18n';
import { cmsFooterLinks, cmsSiteFlags } from '@/lib/cms/content';
import { mailUrl, telUrl } from '@/lib/contact';

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();
  const quickLinks =
    cmsFooterLinks(locale)?.map((link) => ({ key: link.key, label: link.label, href: link.external ? link.path : localePath(locale, link.path) })) ??
    navOrder.map((key) => ({ key, label: t.nav[key], href: localePath(locale, pagePaths[key]) }));
  const hiddenSocial = (Object.keys(cmsSiteFlags.footerSocial) as SocialNetwork[]).filter((network) => cmsSiteFlags.footerSocial[network] === false);

  return (
    <footer className="relative isolate overflow-hidden bg-navy-gradient text-secondary-100/75">
      <div aria-hidden className="mask-radial absolute inset-0 -z-10 bg-grid-light opacity-60" />
      <IrisRings className="absolute -top-40 -z-10 w-[640px] text-white/[0.05] ltr:-right-40 rtl:-left-40" />
      <div aria-hidden className="absolute -bottom-40 -z-10 size-[480px] rounded-full bg-primary/20 blur-[120px] ltr:-left-40 rtl:-right-40" />

      {/* Mobile bottom padding clears the floating action stack (2 × 56px + gap + offset). */}
      <Container className="pb-40 pt-16 sm:pb-10 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href={localePath(locale, '/')} aria-label={t.doctor.name} className="inline-block rounded-2xl">
              <Logo name={t.doctor.name} title={t.doctor.title} theme="dark" />
            </Link>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">{t.footer.about}</p>
            <SocialLinks theme="dark" exclude={hiddenSocial} className="mt-7" />
          </div>

          <div className={cmsSiteFlags.showFooterSpecialties ? 'lg:col-span-2' : 'lg:col-span-5'}>
            <h2 className="font-heading text-base font-bold text-white">{t.footer.quickLinks}</h2>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                    <ArrowForward className="size-3.5 text-primary-300 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {cmsSiteFlags.showFooterSpecialties && (
            <div className="lg:col-span-3">
              <h2 className="font-heading text-base font-bold text-white">{t.footer.specialties}</h2>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {t.services.specialties.items.map((item) => (
                  <li key={item.id}>
                    <Link href={localePath(locale, `/services/#${item.id}`)} className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                      <ArrowForward className="size-3.5 text-primary-300 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="lg:col-span-3">
            <h2 className="font-heading text-base font-bold text-white">{t.footer.contactInfo}</h2>
            <ul className="mt-5 space-y-4 text-[0.95rem]">
              <li className="flex gap-3">
                <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-primary-300" />
                <span>{t.clinic.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden className="mt-1 size-4 shrink-0 text-primary-300" />
                <a href={telUrl()} className="transition-colors hover:text-white" dir="ltr">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail aria-hidden className="mt-1 size-4 shrink-0 text-primary-300" />
                <a href={mailUrl()} className="break-all transition-colors hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden className="mt-1 size-4 shrink-0 text-primary-300" />
                <div className="space-y-1">
                  <span className="block font-bold text-white/90">{t.footer.workingHours}</span>
                  {t.clinic.hours.map((slot) => (
                    <span key={slot.days} className="block text-sm">
                      {slot.days}: <span className="text-white/90">{slot.time}</span>
                    </span>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Physical left padding keeps the text clear of the floating WhatsApp/call buttons (bottom-left)
            until the centred container is wide enough to clear them by itself. */}
        <div className="mt-16 flex flex-col items-center gap-6 border-t border-white/10 pt-7 text-center text-sm sm:pl-20 lg:flex-row lg:justify-between lg:text-start min-[1400px]:pl-0">
          <div className="space-y-1.5">
            <p>
              © <span dir="ltr">{year}</span> {t.doctor.name}. {t.footer.rights}
            </p>
            <p className="text-secondary-100/55">{t.common.medicalDisclaimer}</p>
          </div>
          <SiteCredit ariaLabel={t.footer.creditAria} />
        </div>
      </Container>
    </footer>
  );
}

/** "Transition — Design & Development" badge linking to the agency's website, in the site's brand gradient. */
function SiteCredit({ ariaLabel }: { ariaLabel: string }) {
  const { name, tagline, url, logo } = siteConfig.credit;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      lang="en"
      dir="ltr"
      className="group relative inline-flex max-w-full shrink-0 items-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(90deg,#07508C_0%,#1C7DA6_45%,#269AC8_80%,#4DB4DD_100%)] px-3.5 py-1.5 text-white shadow-glow ring-1 ring-white/20 transition-all duration-300 ease-optical [text-shadow:0_1px_2px_rgba(3,36,63,0.35)] hover:-translate-y-0.5 hover:shadow-glow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-900 min-[360px]:gap-2.5 sm:gap-3 sm:px-5 sm:py-2"
    >
      {/* Light sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
      />
      <span className="relative font-heading text-base font-extrabold tracking-tight sm:text-lg">{name}</span>
      <span className="relative grid size-8 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm sm:size-9">
        <Image src={logo} width={120} height={120} alt="" className="size-6 sm:size-7" />
      </span>
      <span className="relative whitespace-nowrap font-heading text-[0.72rem] font-bold min-[360px]:text-xs sm:text-sm">{tagline}</span>
    </a>
  );
}
