import type { Metadata } from 'next';
import { CollectionManager } from '@/admin/collections/CollectionManager';

export const metadata: Metadata = { title: 'الأسئلة الشائعة' };

export default function Page() {
  return <CollectionManager collection="faqs" />;
}
