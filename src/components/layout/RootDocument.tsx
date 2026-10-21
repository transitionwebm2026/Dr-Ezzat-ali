import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { Header, type NavItem } from '@/components/layout/Header';
import { PhysicianJsonLd } from '@/components/layout/JsonLd';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { siteConfig } from '@/config/site';
import { getDictionary, localeMeta, localePath, navOrder, pagePaths, type Locale } from '@/i18n';
import { cmsNavigation, cmsSiteFlags, type NavLink } from '@/lib/cms/content';
import { telUrl, whatsappUrl } from '@/lib/contact';

function toNavItem(locale: Locale, link: NavLink): NavItem {
  return {
    key: link.key,
    label: link.label,
    href: link.external ? link.path : localePath(locale, link.path),
    path: link.path,
    external: link.external,
    children: link.children.map((child) => toNavItem(locale, child)),
  };
}

type RootDocumentProps = {
  locale: Locale;
  /** next/font CSS-variable class names for this locale. */
  fontClassName: string;
  children: ReactNode;
};

/**
 * Shared <html>/<body> shell rendered by both root layouts.
 * `lang` and `dir` are baked into the static HTML, so there is no direction flash on load.
 */
export function RootDocument({ locale, fontClassName, children }: RootDocumentProps) {
  const t = getDictionary(locale);
  const { dir, htmlLang } = localeMeta[locale];
  const whatsappHref = whatsappUrl(t.whatsapp.defaultMessage);
  const telHref = telUrl();

  const navItems: NavItem[] =
    cmsNavigation(locale)?.map((link) => toNavItem(locale, link)) ??
    navOrder.map((key) => ({
      key,
      label: t.nav[key],
      href: localePath(locale, pagePaths[key]),
      path: pagePaths[key],
    }));

  return (
    <html lang={htmlLang} dir={dir} className={fontClassName} data-scroll-behavior="smooth">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-secondary focus:px-5 focus:py-3 focus:font-bold focus:text-white"
        >
          {t.common.skipToContent}
        </a>
        <MotionProvider>
          <Header
            locale={locale}
            items={navItems}
            homeHref={localePath(locale, '/')}
            bookHref={localePath(locale, pagePaths.contact)}
            showBook={cmsSiteFlags.showBookCta}
            whatsappHref={whatsappHref}
            telHref={telHref}
            phoneDisplay={siteConfig.phoneDisplay}
            doctor={{ name: t.doctor.name, title: t.doctor.shortTitle }}
            labels={{
              book: t.common.bookAppointment,
              openMenu: t.common.openMenu,
              closeMenu: t.common.closeMenu,
              switchLanguageAria: t.common.switchLanguageAria,
              callNow: t.common.callNow,
              whatsapp: t.common.whatsapp,
            }}
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer locale={locale} />
          <FloatingActions whatsappHref={whatsappHref} telHref={telHref} labels={t.floating} />
        </MotionProvider>
        <PhysicianJsonLd locale={locale} />
      </body>
    </html>
  );
}
