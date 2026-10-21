'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, ChevronDown, Menu, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { ArrowForward } from '@/components/icons/registry';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { localeMeta, locales, stripLocale, switchLocalePath, type Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';

export type NavItem = {
  key: string;
  label: string;
  href: string;
  /** Path without locale prefix, used for the active state. */
  path: string;
  /** Absolute URL to another site — opens in a new tab and is never "active". */
  external?: boolean;
  /** Dropdown links (managed in the CMS navigation menu). */
  children?: NavItem[];
};

type NavAnchorProps = { item: NavItem; current?: boolean; className?: string; onClick?: () => void; children: ReactNode };

function NavAnchor({ item, current, className, onClick, children }: NavAnchorProps) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={onClick} aria-current={current ? 'page' : undefined} className={className}>
      {children}
    </Link>
  );
}

type HeaderProps = {
  locale: Locale;
  items: NavItem[];
  homeHref: string;
  bookHref: string;
  /** "Book appointment" button in the navbar (toggled from the CMS). */
  showBook?: boolean;
  whatsappHref: string;
  telHref: string;
  phoneDisplay: string;
  doctor: { name: string; title: string };
  labels: {
    book: string;
    openMenu: string;
    closeMenu: string;
    switchLanguageAria: string;
    callNow: string;
    whatsapp: string;
  };
};

export function Header({ locale, items, homeHref, bookHref, showBook = true, whatsappHref, telHref, phoneDisplay, doctor, labels }: HeaderProps) {
  const pathname = usePathname() || '/';
  const current = stripLocale(pathname);
  const otherLocale: Locale = locale === 'ar' ? 'en' : 'ar';
  const switchHref = switchLocalePath(pathname, otherLocale);
  const [switching, setSwitching] = useState(false);
  const shownLocale = switching ? otherLocale : locale;

  const [scrolled, setScrolled] = useState(false);
  // The menu is tied to the path it was opened on, so it closes itself on navigation.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const close = () => setOpenedOn(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Coming back via the back/forward cache restores the old state — put the toggle thumb back.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setSwitching(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenedOn(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const matches = (item: NavItem) => !item.external && (item.path === '/' ? current === '/' : current.startsWith(item.path));
  const isActive = (item: NavItem): boolean => matches(item) || Boolean(item.children?.some(matches));
  const offscreen = localeMeta[locale].dir === 'rtl' ? '-100%' : '100%';

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-optical', scrolled ? 'py-2' : 'py-3 lg:py-4')}>
      <Container>
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-full px-2.5 py-2 transition-all duration-500 ease-optical sm:px-3',
            scrolled ? 'glass shadow-soft' : 'border border-transparent',
          )}
        >
          <Link href={homeHref} className="min-w-0 rounded-2xl pe-2" aria-label={doctor.name}>
            <Logo name={doctor.name} title={doctor.title} compact />
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {items.map((item) => {
                const active = isActive(item);
                const dropdown = Boolean(item.children?.length);
                return (
                  <li key={item.key} className={cn(dropdown && 'group/dd relative')}>
                    <NavAnchor
                      item={item}
                      current={matches(item)}
                      className={cn(
                        'relative block rounded-full px-3.5 py-2 font-heading text-[0.92rem] font-bold transition-colors duration-300',
                        active ? 'text-white' : 'text-secondary-700 hover:text-primary-600',
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full bg-brand-gradient shadow-glow"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative inline-flex items-center gap-1">
                        {item.label}
                        {dropdown && <ChevronDown aria-hidden className="size-3.5 transition-transform duration-300 group-hover/dd:rotate-180" />}
                      </span>
                    </NavAnchor>
                    {dropdown && (
                      <div className="invisible absolute start-0 top-full z-10 pt-2 opacity-0 transition-all duration-200 group-focus-within/dd:visible group-focus-within/dd:opacity-100 group-hover/dd:visible group-hover/dd:opacity-100">
                        <ul className="min-w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-elevated">
                          {item.children!.map((child) => (
                            <li key={child.key}>
                              <NavAnchor
                                item={child}
                                current={matches(child)}
                                className={cn(
                                  'block rounded-xl px-4 py-2.5 font-heading text-sm font-bold transition-colors',
                                  matches(child) ? 'bg-primary-50 text-primary-700' : 'text-secondary-700 hover:bg-primary-50 hover:text-primary-600',
                                )}
                              >
                                {child.label}
                              </NavAnchor>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {/* Language toggle — fixed physical order (ع | EN); the thumb sits on the current language
                and slides across on click while the other-language page loads. */}
            <a
              href={switchHref}
              hrefLang={otherLocale}
              lang={otherLocale}
              dir="ltr"
              aria-label={labels.switchLanguageAria}
              onClick={() => setSwitching(true)}
              className="group relative grid h-10 grid-cols-2 items-center rounded-full border border-secondary/10 bg-white/80 p-1 font-heading text-[0.8rem] font-bold shadow-sm transition-colors duration-300 hover:border-primary"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-brand-gradient shadow-glow transition-transform duration-300 ease-optical',
                  shownLocale === 'en' && 'translate-x-full',
                )}
              />
              {locales.map((code) => (
                <span
                  key={code}
                  aria-hidden
                  className={cn(
                    'relative grid h-full min-w-9 place-items-center px-2 transition-colors duration-300',
                    code === shownLocale ? 'text-white' : 'text-secondary-500 group-hover:text-primary-600',
                  )}
                >
                  {localeMeta[code].short}
                </span>
              ))}
            </a>
            {showBook && (
              <ButtonLink href={bookHref} size="sm" className="hidden md:inline-flex">
                <CalendarCheck aria-hidden className="size-4" />
                {labels.book}
              </ButtonLink>
            )}
            <button
              type="button"
              onClick={() => setOpenedOn(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? labels.closeMenu : labels.openMenu}
              className="grid size-10 place-items-center rounded-full bg-secondary text-white shadow-soft transition-colors duration-300 hover:bg-primary xl:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="menu-overlay"
              className="fixed inset-0 z-40 bg-secondary-950/40 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              key="menu-panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={labels.openMenu}
              className="fixed inset-y-0 end-0 z-50 flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-white shadow-elevated xl:hidden"
              initial={{ x: offscreen }}
              animate={{ x: 0 }}
              exit={{ x: offscreen }}
              transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
                <Logo name={doctor.name} title={doctor.title} />
                <button
                  type="button"
                  onClick={close}
                  aria-label={labels.closeMenu}
                  className="grid size-10 place-items-center rounded-full bg-surface text-secondary-700 transition-colors hover:bg-primary-50 hover:text-primary-600"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 p-4">
                <ul className="space-y-1.5">
                  {items.map((item, index) => {
                    const active = matches(item);
                    return (
                      <motion.li
                        key={item.key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 + index * 0.04, duration: 0.4 }}
                      >
                        <NavAnchor
                          item={item}
                          current={active}
                          onClick={close}
                          className={cn(
                            'flex items-center justify-between rounded-2xl px-4 py-3.5 font-heading text-lg font-bold transition-all duration-300',
                            active ? 'bg-brand-gradient text-white shadow-glow' : 'text-secondary-700 hover:bg-primary-50',
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span className={cn('text-xs tabular-nums', active ? 'text-white/70' : 'text-primary-400')} dir="ltr">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {item.label}
                          </span>
                          <ArrowForward className={cn('size-4', active ? 'text-white' : 'text-primary-400')} />
                        </NavAnchor>
                        {item.children?.length ? (
                          <ul className="mt-1 space-y-1 border-primary-100 ps-6 ltr:ml-4 ltr:border-l-2 rtl:mr-4 rtl:border-r-2">
                            {item.children.map((child) => (
                              <li key={child.key}>
                                <NavAnchor
                                  item={child}
                                  current={matches(child)}
                                  onClick={close}
                                  className={cn(
                                    'block rounded-xl px-4 py-2.5 font-heading text-base font-bold transition-colors',
                                    matches(child) ? 'bg-primary-50 text-primary-700' : 'text-secondary-600 hover:bg-primary-50',
                                  )}
                                >
                                  {child.label}
                                </NavAnchor>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="space-y-3 border-t border-slate-100 bg-surface p-4">
                {showBook && (
                  <ButtonLink href={bookHref} className="w-full">
                    <CalendarCheck aria-hidden className="size-5" />
                    {labels.book}
                  </ButtonLink>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <ButtonLink href={whatsappHref} variant="whatsapp" size="sm">
                    <BrandIcon name="whatsapp" className="size-4" />
                    {labels.whatsapp}
                  </ButtonLink>
                  <ButtonLink href={telHref} variant="outline" size="sm" aria-label={labels.callNow}>
                    <Phone aria-hidden className="size-4" />
                    <span dir="ltr">{phoneDisplay}</span>
                  </ButtonLink>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
