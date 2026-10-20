import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ServicesView } from '@/views/ServicesView';

export const metadata: Metadata = pageMetadata('en', 'services');

export default function Page() {
  return <ServicesView locale="en" />;
}
