import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { ButtonLink } from '@/components/ui/Button';
import { LogoMark } from '@/components/ui/Logo';
import { IrisRings } from '@/components/ui/OpticArt';
import { getDictionary } from '@/i18n';
import './globals.css';

// Not preloaded: Next would otherwise add this 404-only font preload to every page.
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: '404 — الصفحة غير موجودة | Page not found',
  robots: { index: false },
};

/** Single bilingual 404 page shared by both root layouts (exported as /404.html). */
export default function GlobalNotFound() {
  const ar = getDictionary('ar').notFound;
  const en = getDictionary('en').notFound;

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>
        <main className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-gradient-to-b from-surface-tint via-white to-white px-4 py-16">
          <div aria-hidden className="mask-radial absolute inset-0 -z-10 bg-grid" />
          <IrisRings className="absolute left-1/2 top-1/2 -z-10 w-[min(760px,140vw)] -translate-x-1/2 -translate-y-1/2 animate-spin-slower text-primary-200/60" />

          <div className="max-w-lg animate-fade-in-up text-center">
            <LogoMark className="mx-auto size-16" />
            <p dir="ltr" className="text-gradient mt-8 font-heading text-8xl font-bold sm:text-9xl">
              404
            </p>
            <h1 className="mt-4 text-3xl">{ar.title}</h1>
            <p className="mt-3 text-slate-500">{ar.description}</p>
            <div lang="en" dir="ltr" className="mt-6 border-t border-slate-200/80 pt-6">
              <p className="font-heading text-lg font-bold text-secondary-700">{en.title}</p>
              <p className="mt-1 text-sm text-slate-500">{en.description}</p>
            </div>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/">{ar.back}</ButtonLink>
              <ButtonLink href="/en/" variant="outline">
                <span lang="en">{en.back}</span>
              </ButtonLink>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
