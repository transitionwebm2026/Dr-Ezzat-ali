import { absoluteUrl, siteConfig } from '@/config/site';
import { getDictionary, localePath, type Locale } from '@/i18n';

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** schema.org Physician entity — helps search engines show rich results for the clinic. */
export function PhysicianJsonLd({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Physician',
        '@id': `${siteConfig.url}/#physician`,
        name: t.doctor.name,
        description: t.meta.description,
        url: `${siteConfig.url}${localePath(locale, '/')}`,
        image: absoluteUrl(siteConfig.doctorPortrait),
        logo: absoluteUrl(siteConfig.logo.full.src),
        telephone: siteConfig.phone,
        email: siteConfig.email,
        knowsAbout: ['Ophthalmology', 'LASIK', 'SMILE', 'Cataract surgery', 'Retina', 'Glaucoma', 'Keratoconus'],
        address: { '@type': 'PostalAddress', streetAddress: t.clinic.address, addressCountry: 'EG' },
        sameAs: Object.values(siteConfig.social),
        availableLanguage: ['ar', 'en'],
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }}
    />
  );
}
