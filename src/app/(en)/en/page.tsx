import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { HomeView } from '@/views/HomeView';

export const metadata: Metadata = pageMetadata('en', 'home');

export default function Page() {
  return <HomeView locale="en" />;
}
