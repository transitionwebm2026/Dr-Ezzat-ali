import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import type { ReactNode } from 'react';
import { AdminProviders } from '@/admin/AdminProviders';
import '../globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: { default: 'لوحة التحكم | د. عزت علي', template: '%s | لوحة التحكم' },
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#07508C' };

/** Root layout for the CMS dashboard (/admin/*) — client-rendered, never indexed. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="bg-slate-50">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
