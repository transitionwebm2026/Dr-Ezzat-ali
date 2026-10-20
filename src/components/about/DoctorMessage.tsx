import { Quote } from 'lucide-react';
import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import { Container } from '@/components/ui/Container';
import { IrisRings } from '@/components/ui/OpticArt';
import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/i18n';

type DoctorMessageProps = {
  content: Dictionary['about']['message'];
  portraitAlt: string;
  title: string;
};

/** Portrait on the physical right, first-person message on the left (both languages). */
export function DoctorMessage({ content, portraitAlt, title }: DoctorMessageProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Portrait — first in DOM: right in RTL; moved last (right) in LTR */}
        <Reveal scale={0.96} className="lg:col-span-5 ltr:lg:order-last">
          <div className="relative mx-auto max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-primary-100 via-surface-tint to-white shadow-elevated">
              <IrisRings className="absolute left-1/2 top-[38%] w-[120%] -translate-x-1/2 -translate-y-1/2 animate-spin-slower text-primary-300/40" />
              <div aria-hidden className="absolute inset-x-[15%] top-[18%] aspect-square rounded-full bg-white/80 blur-2xl" />
              <Image
                src={siteConfig.doctorPortrait}
                alt={portraitAlt}
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-contain object-bottom drop-shadow-[0_25px_35px_rgba(7,80,140,0.25)]"
              />
            </div>
            <div className="glass absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-3xl px-5 py-4 text-center shadow-elevated">
              <p className="font-heading text-lg font-bold text-secondary-700">{content.signature}</p>
              <p className="text-sm text-primary-600">{title}</p>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem]">{content.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="relative mt-8">
            <Quote aria-hidden className="absolute -top-4 size-16 fill-primary-50 text-primary-50 ltr:-left-3 rtl:-right-3 rtl:-scale-x-100" />
            <div className="relative space-y-5 text-base leading-loose text-slate-600 sm:text-lg">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex items-center gap-4">
            <span aria-hidden className="h-px w-14 bg-brand-gradient" />
            <span>
              <span className="block font-heading text-2xl font-bold text-secondary-700">{content.signature}</span>
              <span className="block text-sm text-slate-500">{content.role}</span>
            </span>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
