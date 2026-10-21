import type { Metadata } from 'next';
import { ContactSettingsForm } from '@/admin/forms/ContactSettingsForm';
import { AdminPage } from '@/admin/layout/AdminPage';

export const metadata: Metadata = { title: 'التواصل والأزرار العائمة' };

export default function Page() {
  return (
    <AdminPage
      title="التواصل والأزرار العائمة"
      description="رقم الهاتف وواتساب يغذيان الهيدر وشريط التواصل وصفحة التواصل والفوتر والأزرار العائمة أسفل يسار كل صفحة."
    >
      <ContactSettingsForm />
    </AdminPage>
  );
}
