import { BrandIcon, brandLabels } from '@/components/icons/BrandIcon';
import { siteConfig, type SocialNetwork } from '@/config/site';
import { cn } from '@/lib/cn';

type SocialLinksProps = {
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md';
  /** Networks to leave out here (e.g. hidden from the footer in the CMS). */
  exclude?: SocialNetwork[];
  className?: string;
};

export function SocialLinks({ theme = 'light', size = 'md', exclude, className }: SocialLinksProps) {
  const entries = (Object.entries(siteConfig.social) as [SocialNetwork, string][]).filter(([network]) => !exclude?.includes(network));
  if (!entries.length) return null;
  return (
    <ul className={cn('flex items-center gap-2', className)}>
      {entries.map(([network, href]) => (
        <li key={network}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={brandLabels[network]}
            className={cn(
              'grid place-items-center rounded-full transition-all duration-300 ease-optical hover:-translate-y-0.5',
              size === 'sm' ? 'size-9' : 'size-10',
              theme === 'dark'
                ? 'border border-white/15 bg-white/5 text-white/80 hover:border-primary hover:bg-primary hover:text-white'
                : 'border border-secondary/10 bg-white text-secondary-600 shadow-sm hover:border-primary hover:bg-primary hover:text-white hover:shadow-glow',
            )}
          >
            <BrandIcon name={network} className={size === 'sm' ? 'size-3.5' : 'size-4'} />
          </a>
        </li>
      ))}
    </ul>
  );
}
