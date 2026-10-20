import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { VideosView } from '@/views/VideosView';

export const metadata: Metadata = pageMetadata('ar', 'videos');

export default function Page() {
  return <VideosView locale="ar" />;
}
