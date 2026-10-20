import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { AboutView } from '@/views/AboutView';

export const metadata: Metadata = pageMetadata('en', 'about');

export default function Page() {
  return <AboutView locale="en" />;
}
