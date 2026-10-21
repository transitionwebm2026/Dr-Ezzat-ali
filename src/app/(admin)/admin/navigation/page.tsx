import type { Metadata } from 'next';
import { NavigationManager } from '@/admin/forms/NavigationManager';
import { AdminPage } from '@/admin/layout/AdminPage';

export const metadata: Metadata = { title: 'الهيدر والقائمة' };

export default function Page() {
  return (
    <AdminPage title="الهيدر وروابط القائمة" description="الشعار، زر الحجز، وروابط شريط التنقل العلوي (مع القوائم المنسدلة).">
      <NavigationManager />
    </AdminPage>
  );
}
