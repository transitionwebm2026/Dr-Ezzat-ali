import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ReviewsView } from '@/views/ReviewsView';

export const metadata: Metadata = pageMetadata('en', 'reviews');

export default function Page() {
  return <ReviewsView locale="en" />;
}
