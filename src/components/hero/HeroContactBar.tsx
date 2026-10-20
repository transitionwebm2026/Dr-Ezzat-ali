import { Phone } from 'lucide-react';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { siteConfig } from '@/config/site';
import { getDictionary, type Locale } from '@/i18n';
import { telUrl } from '@/lib/contact';

/** Social icons + direct phone line, shown under the CTAs in every hero. */
export function HeroContactBar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
      <div className="glass inline-flex items-center gap-2 rounded-full p-1.5 shadow-soft">
        <span className="pe-1 ps-2.5 font-heading text-xs font-bold text-slate-500">{t.common.followUs}</span>
        <SocialLinks size="sm" />
      </div>
      <a
        href={telUrl()}
        className="group inline-flex items-center gap-2.5 rounded-full bg-secondary py-1.5 pe-5 ps-1.5 text-white shadow-soft transition-all duration-300 hover:bg-primary hover:shadow-glow"
      >
        <span className="grid size-9 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:scale-110">
          <Phone aria-hidden className="size-4" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.68rem] text-white/70">{t.common.callUs}</span>
          <span dir="ltr" className="font-heading text-sm font-bold tabular-nums">
            {siteConfig.phoneDisplay}
          </span>
        </span>
      </a>
    </div>
  );
}
