import type { Metadata } from 'next';
import { CollectionManager } from '@/admin/collections/CollectionManager';

export const metadata: Metadata = { title: 'الفيديوهات' };

export default function Page() {
  return <CollectionManager collection="videos" />;
}
