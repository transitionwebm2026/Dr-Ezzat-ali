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
  Settings,
  Star,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

export type AdminNavItem = { href: string; label: string; icon: LucideIcon };
export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
  /** Every item is a content table named after its path (/admin/<table>/) — counted on the overview page. */
  library?: boolean;
};

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
    // Each library feeds its own page and the matching home-page section.
    label: 'مكتبات المحتوى',
    library: true,
    items: [
      { href: '/admin/specialties/', label: 'الخدمات والتخصصات', icon: Stethoscope },
      { href: '/admin/reviews/', label: 'آراء المرضى', icon: Star },
      { href: '/admin/videos/', label: 'الفيديوهات', icon: Clapperboard },
      { href: '/admin/articles/', label: 'المقالات', icon: Newspaper },
      { href: '/admin/faqs/', label: 'الأسئلة الشائعة', icon: CircleQuestionMark },
    ],
  },
];
