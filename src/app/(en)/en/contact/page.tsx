import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ContactView } from '@/views/ContactView';

export const metadata: Metadata = pageMetadata('en', 'contact');

export default function Page() {
  return <ContactView locale="en" />;
}
