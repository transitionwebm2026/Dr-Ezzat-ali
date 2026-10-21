import type { Metadata } from 'next';
import { HeroVideoForm } from '@/admin/forms/HeroVideoForm';
import { AdminPage } from '@/admin/layout/AdminPage';

export const metadata: Metadata = { title: 'صورة الواجهة والفيديو التعريفي' };

export default function Page() {
  return (
    <AdminPage
      title="صورة الواجهة والفيديو التعريفي"
      description="صورة الواجهة (Hero) في أعلى كل الصفحات، والفيديو التعريفي المشترك بين الصفحة الرئيسية وصفحة «عن الطبيب» مع صورة الغلاف."
    >
      <HeroVideoForm />
    </AdminPage>
  );
}
