import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import type { ReactNode } from 'react';
import { RootDocument } from '@/components/layout/RootDocument';
import { rootMetadata, rootViewport } from '@/lib/metadata';
import '../globals.css';

/**
 * Fallback for the brand fonts (al-fares / ae_Hor). Self-hosted at build time by next/font.
 * Not preloaded: once the brand font files are in /public/fonts it is never downloaded.
 */
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = rootMetadata('ar');
export const viewport: Viewport = rootViewport;

/** Root layout — Arabic (default locale, RTL). Serves `/`, `/about/`, … */
export default function ArabicRootLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument locale="ar" fontClassName={cairo.variable}>
      {children}
    </RootDocument>
  );
}
