import type { Metadata } from 'next';
import { CollectionManager } from '@/admin/collections/CollectionManager';

export const metadata: Metadata = { title: 'المقالات' };

export default function Page() {
  return <CollectionManager collection="articles" />;
}
