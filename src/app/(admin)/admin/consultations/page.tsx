import type { Metadata } from 'next';
import { ConsultationsInbox } from '@/admin/consultations/ConsultationsInbox';
import { AdminPage } from '@/admin/layout/AdminPage';

export const metadata: Metadata = { title: 'طلبات الحجز' };

export default function Page() {
  return (
    <AdminPage title="طلبات الحجز" description="الطلبات المرسلة من نموذج الحجز في صفحة التواصل. هذه البيانات خاصة ولا تظهر على الموقع.">
      <ConsultationsInbox />
    </AdminPage>
  );
}
