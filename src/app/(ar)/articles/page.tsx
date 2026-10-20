import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ArticlesView } from '@/views/ArticlesView';

export const metadata: Metadata = pageMetadata('ar', 'articles');

export default function Page() {
  return <ArticlesView locale="ar" />;
}
