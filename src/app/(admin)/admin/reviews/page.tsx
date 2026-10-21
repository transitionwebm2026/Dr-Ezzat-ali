import type { Metadata } from 'next';
import { CollectionManager } from '@/admin/collections/CollectionManager';

export const metadata: Metadata = { title: 'آراء المرضى' };

export default function Page() {
  return <CollectionManager collection="reviews" />;
}
