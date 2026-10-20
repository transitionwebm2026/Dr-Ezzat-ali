import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { RootDocument } from '@/components/layout/RootDocument';
import { rootMetadata, rootViewport } from '@/lib/metadata';
import '../globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = rootMetadata('en');
export const viewport: Viewport = rootViewport;

/** Root layout — English (LTR). Serves `/en/`, `/en/about/`, … */
export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument locale="en" fontClassName={jakarta.variable}>
      {children}
    </RootDocument>
  );
}
