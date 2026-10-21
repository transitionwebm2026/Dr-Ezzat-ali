import type { Metadata } from 'next';
import { GeneralSettingsForm } from '@/admin/forms/GeneralSettingsForm';
import { AdminPage } from '@/admin/layout/AdminPage';

export const metadata: Metadata = { title: 'الإعدادات العامة' };

export default function Page() {
  return (
    <AdminPage title="الهوية والعنوان والمواعيد" description="عنوان الموقع، الشعار، صورة الطبيب، عنوان العيادة ومواعيد العمل.">
      <GeneralSettingsForm />
    </AdminPage>
  );
}
