import type { Metadata } from 'next';
import { AdminPage } from '@/admin/layout/AdminPage';
import { SectionsManager } from '@/admin/sections/SectionsManager';

export const metadata: Metadata = { title: 'نصوص أقسام الصفحات' };

export default function Page() {
  return (
    <AdminPage
      title="نصوص أقسام الصفحات"
      description="كل العناوين والفقرات والأزرار في صفحات الموقع، بالعربية والإنجليزية. «استعادة الأصل» يرجع القسم لنصوصه الأصلية."
    >
      <SectionsManager />
    </AdminPage>
  );
}
