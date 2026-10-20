import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { siteConfig } from '@/config/site';
import { getDictionary, type Locale } from '@/i18n';
import { mailUrl, telUrl, whatsappUrl } from '@/lib/contact';

function InfoTile({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="card card-hover group h-full p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary-600 transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-glow">
          {icon}
        </span>
        <h3 className="text-base">{title}</h3>
      </div>
      <div className="mt-4 space-y-1.5 text-[0.95rem] text-slate-600">{children}</div>
    </div>
  );
}

/** Google Maps embed (no API key required) with address, phone, email and opening hours. */
export function ClinicInfo({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.map.query)}&hl=${locale}&z=15&output=embed`;

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="card overflow-hidden p-2 shadow-elevated">
        <iframe
          title={t.contact.info.mapTitle}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-72 w-full rounded-[1.25rem] border-0 grayscale-[15%] sm:h-80 lg:h-[22rem]"
        />
      </div>

      <div className="grid flex-1 gap-5 sm:grid-cols-2">
        <InfoTile icon={<MapPin aria-hidden className="size-5" />} title={t.contact.info.address}>
          <p>{t.clinic.address}</p>
          <a
            href={siteConfig.map.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 mt-2 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-primary-600 hover:text-primary-700"
          >
            <Navigation aria-hidden className="size-4" />
            {t.contact.info.directions}
          </a>
        </InfoTile>

        <InfoTile icon={<Phone aria-hidden className="size-5" />} title={t.contact.info.phones}>
          <a href={telUrl()} dir="ltr" className="block font-heading font-bold text-secondary-700 hover:text-primary-600 rtl:text-right">
            {siteConfig.phoneDisplay}
          </a>
          <a
            href={whatsappUrl(t.whatsapp.defaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-heading text-sm font-bold text-whatsapp-dark hover:text-whatsapp"
          >
            <BrandIcon name="whatsapp" className="size-4" />
            {t.common.chatOnWhatsapp}
          </a>
        </InfoTile>

        <InfoTile icon={<Mail aria-hidden className="size-5" />} title={t.contact.info.email}>
          <a href={mailUrl()} className="break-all hover:text-primary-600">
            {siteConfig.email}
          </a>
        </InfoTile>

        <InfoTile icon={<Clock aria-hidden className="size-5" />} title={t.contact.info.hours}>
          <dl className="space-y-1.5">
            {t.clinic.hours.map((slot) => (
              <div key={slot.days} className="flex flex-wrap items-baseline justify-between gap-x-3">
                <dt className="text-slate-500">{slot.days}</dt>
                <dd className="font-bold text-secondary-700">{slot.time}</dd>
              </div>
            ))}
          </dl>
        </InfoTile>
      </div>
    </div>
  );
}
