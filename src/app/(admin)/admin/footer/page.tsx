import type { Metadata } from 'next';
import { FooterForm } from '@/admin/forms/FooterForm';
import { AdminPage } from '@/admin/layout/AdminPage';

export const metadata: Metadata = { title: 'الفوتر' };

export default function Page() {
  return (
    <AdminPage title="الفوتر" description="نبذة العيادة، الروابط السريعة، حقوق النشر وروابط التواصل الاجتماعي.">
      <FooterForm />
    </AdminPage>
  );
}
