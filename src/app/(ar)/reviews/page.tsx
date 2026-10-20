import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ReviewsView } from '@/views/ReviewsView';

export const metadata: Metadata = pageMetadata('ar', 'reviews');

export default function Page() {
  return <ReviewsView locale="ar" />;
}
