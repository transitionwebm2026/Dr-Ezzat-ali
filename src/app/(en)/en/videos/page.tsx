import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { VideosView } from '@/views/VideosView';

export const metadata: Metadata = pageMetadata('en', 'videos');

export default function Page() {
  return <VideosView locale="en" />;
}
