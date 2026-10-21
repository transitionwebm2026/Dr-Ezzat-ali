import {
  CircleQuestionMark,
  Clapperboard,
  ImagePlay,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  Newspaper,
  PanelBottom,
  PanelTop,
  Phone,
  Pill,
  Scissors,
  Settings,
  Star,
  type LucideIcon,
} from 'lucide-react';

export type AdminNavItem = { href: string; label: string; icon: LucideIcon };
export type AdminNavGroup = { label: string; items: AdminNavItem[] };

export const adminNav: AdminNavGroup[] = [
  {
    label: 'عام',
    items: [
      { href: '/admin/', label: 'نظرة عامة', icon: LayoutDashboard },
      { href: '/admin/consultations/', label: 'طلبات الحجز', icon: Inbox },
    ],
  },
  {
    label: 'إعدادات الموقع العامة',
    items: [
      { href: '/admin/settings/', label: 'الهوية والعنوان والمواعيد', icon: Settings },
      { href: '/admin/contact/', label: 'التواصل والأزرار العائمة', icon: Phone },
    ],
  },
  {
    label: 'القائمة والفوتر',
    items: [
      { href: '/admin/navigation/', label: 'الهيدر وروابط القائمة', icon: PanelTop },
      { href: '/admin/footer/', label: 'الفوتر', icon: PanelBottom },
    ],
  },
  {
    label: 'محتوى الصفحات',
    items: [
      { href: '/admin/hero-video/', label: 'صورة الواجهة والفيديو', icon: ImagePlay },
      { href: '/admin/sections/', label: 'نصوص أقسام الصفحات', icon: LayoutTemplate },
    ],
  },
  {
    label: 'مكتبات المحتوى',
    items: [
      { href: '/admin/surgeries/', label: 'الجراحات', icon: Scissors },
      { href: '/admin/treatments/', label: 'العلاجات', icon: Pill },
      { href: '/admin/reviews/', label: 'آراء المرضى', icon: Star },
      { href: '/admin/videos/', label: 'الفيديوهات', icon: Clapperboard },
      { href: '/admin/articles/', label: 'المقالات', icon: Newspaper },
      { href: '/admin/faqs/', label: 'الأسئلة الشائعة', icon: CircleQuestionMark },
    ],
  },
];
