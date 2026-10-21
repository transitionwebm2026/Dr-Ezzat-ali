import { extractYoutubeId } from '@/admin/lib/text';

export type Row = Record<string, unknown> & { id?: string; sort_order?: number };

export type FieldDef =
  | { type: 'bilingual'; name: string; label: string; required?: boolean; multiline?: boolean; rows?: number; hint?: string }
  | { type: 'bilingual-list'; name: string; label: string; hint?: string }
  | { type: 'text'; name: string; label: string; required?: boolean; ltr?: boolean; placeholder?: string; hint?: string; slugFrom?: string }
  | { type: 'number'; name: string; label: string; min: number; max: number; hint?: string }
  | { type: 'rating'; name: string; label: string }
  | { type: 'date'; name: string; label: string }
  | { type: 'toggle'; name: string; label: string; hint?: string }
  | { type: 'select'; name: string; label: string; options: { value: string; label: string }[] }
  | { type: 'image'; name: string; label: string; hint?: string }
  /** Uploaded video + its compulsory thumbnail (+ optional YouTube alternative). */
  | { type: 'video'; name: string; thumbnail: string; youtube?: string; label: string };

export type Flag = { name: string; label: string; offLabel?: string; tone: 'green' | 'blue' | 'amber' };

export type CollectionConfig = {
  table: 'surgeries' | 'treatments' | 'reviews' | 'videos' | 'articles' | 'faqs';
  title: string;
  description: string;
  singular: string;
  /** Storage folder for uploads. */
  folder: string;
  fields: FieldDef[];
  defaults: Row;
  summary: (row: Row) => { title: string; subtitle?: string; image?: string | null };
  /** Boolean columns shown as badges with a one-click toggle. */
  flags: Flag[];
  groupBy?: { name: string; options: { value: string; label: string }[] };
  validate?: (row: Row) => Record<string, string>;
};

const text = (value: unknown) => (typeof value === 'string' ? value : '');

const published: Flag = { name: 'is_published', label: 'منشور', offLabel: 'مسودة', tone: 'green' };
const featured: Flag = { name: 'is_featured_on_home', label: 'في الرئيسية', tone: 'blue' };

const publishedToggle: FieldDef = { type: 'toggle', name: 'is_published', label: 'منشور على الموقع', hint: 'أوقفه لحفظ العنصر كمسودة دون أن يظهر للزوار.' };
const featuredToggle = (hint: string): FieldDef => ({ type: 'toggle', name: 'is_featured_on_home', label: 'عرض في الصفحة الرئيسية', hint });

const serviceFields: FieldDef[] = [
  { type: 'bilingual', name: 'title', label: 'العنوان', required: true },
  { type: 'bilingual', name: 'description', label: 'الوصف المختصر', multiline: true, rows: 3, required: true },
  {
    type: 'text',
    name: 'key',
    label: 'المعرّف (بالإنجليزية)',
    ltr: true,
    required: true,
    slugFrom: 'title_en',
    hint: 'يحدد أيقونة البطاقة ورابطها في صفحة الخدمات، مثل: lasik · cataract · retina · glaucoma · anti-vegf',
  },
  { type: 'text', name: 'tag', label: 'وسم قصير على الصورة', ltr: true, placeholder: 'Femto-LASIK · SMILE' },
  { type: 'image', name: 'image_url', label: 'صورة البطاقة (اختيارية)', hint: 'بدونها تظهر رسمة العيادة المميزة. نسبة 16:10.' },
  publishedToggle,
];

const serviceDefaults: Row = { key: '', tag: '', title_ar: '', title_en: '', description_ar: '', description_en: '', image_url: null, is_published: true };

export const collections: Record<CollectionConfig['table'], CollectionConfig> = {
  surgeries: {
    table: 'surgeries',
    title: 'الجراحات',
    description: 'بطاقات قسم «أبرز الجراحات» في الصفحة الرئيسية.',
    singular: 'جراحة',
    folder: 'surgeries',
    fields: serviceFields,
    defaults: serviceDefaults,
    summary: (row) => ({ title: text(row.title_ar), subtitle: text(row.description_ar), image: row.image_url as string | null }),
    flags: [published],
  },
  treatments: {
    table: 'treatments',
    title: 'العلاجات',
    description: 'بطاقات قسم «علاجات متقدمة دون جراحة» في الصفحة الرئيسية.',
    singular: 'علاج',
    folder: 'treatments',
    fields: serviceFields,
    defaults: serviceDefaults,
    summary: (row) => ({ title: text(row.title_ar), subtitle: text(row.description_ar), image: row.image_url as string | null }),
    flags: [published],
  },
  reviews: {
    table: 'reviews',
    title: 'آراء المرضى',
    description: 'كل الآراء تظهر في صفحة «آراء المرضى». فعّل «في الرئيسية» لعرض الرأي في شريط الآراء بالصفحة الرئيسية.',
    singular: 'رأي',
    folder: 'reviews',
    fields: [
      { type: 'bilingual', name: 'patient_name', label: 'اسم المريض', required: true, hint: 'يُفضّل الاسم الأول وحرف من اسم العائلة، مثل: أحمد م.' },
      { type: 'rating', name: 'rating', label: 'التقييم' },
      { type: 'bilingual', name: 'procedure_type', label: 'الإجراء / العملية' },
      { type: 'bilingual', name: 'review_text', label: 'نص الرأي', multiline: true, rows: 4, required: true },
      featuredToggle('يظهر في شريط آراء المرضى بالصفحة الرئيسية.'),
      publishedToggle,
    ],
    defaults: { patient_name_ar: '', patient_name_en: '', rating: 5, procedure_type_ar: '', procedure_type_en: '', review_text_ar: '', review_text_en: '', is_featured_on_home: true, is_published: true },
    summary: (row) => ({ title: `${text(row.patient_name_ar)} — ${'★'.repeat(Number(row.rating) || 0)}`, subtitle: text(row.review_text_ar) }),
    flags: [published, featured],
  },
  videos: {
    table: 'videos',
    title: 'الفيديوهات',
    description: 'فيديوهات طولية (9:16) لصفحة الفيديوهات. أول 3 فيديوهات مفعّل لها «في الرئيسية» تظهر في الصفحة الرئيسية.',
    singular: 'فيديو',
    folder: 'videos',
    fields: [
      { type: 'bilingual', name: 'title', label: 'عنوان الفيديو', required: true },
      { type: 'bilingual', name: 'category', label: 'التصنيف', hint: 'مثل: تصحيح الإبصار، المياه البيضاء…' },
      { type: 'text', name: 'duration', label: 'المدة', ltr: true, placeholder: '1:45' },
      { type: 'video', name: 'video_file_url', thumbnail: 'thumbnail_file_url', youtube: 'youtube_id', label: 'الفيديو' },
      featuredToggle('أول 3 فيديوهات مميزة تظهر في الصفحة الرئيسية.'),
      publishedToggle,
    ],
    defaults: { title_ar: '', title_en: '', category_ar: '', category_en: '', duration: '', video_file_url: null, thumbnail_file_url: null, youtube_id: '', is_featured_on_home: false, is_published: true },
    summary: (row) => ({ title: text(row.title_ar), subtitle: [text(row.category_ar), text(row.duration)].filter(Boolean).join(' · '), image: row.thumbnail_file_url as string | null }),
    flags: [published, featured],
    validate: (row) => {
      const errors: Record<string, string> = {};
      if (row.video_file_url && !row.thumbnail_file_url) errors.thumbnail_file_url = 'صورة الغلاف إلزامية لكل فيديو مرفوع.';
      if (text(row.youtube_id).trim() && !extractYoutubeId(text(row.youtube_id))) errors.youtube_id = 'رابط أو معرّف يوتيوب غير صحيح.';
      return errors;
    },
  },
  articles: {
    table: 'articles',
    title: 'المقالات',
    description: 'المقالات الطبية. «المقال الرئيسي» يظهر كبطاقة كبيرة أعلى صفحة المقالات، وأول 3 مقالات مفعّل لها «في الرئيسية» تظهر في الصفحة الرئيسية.',
    singular: 'مقال',
    folder: 'articles',
    fields: [
      { type: 'bilingual', name: 'title', label: 'عنوان المقال', required: true },
      { type: 'text', name: 'slug', label: 'رابط المقال (slug)', ltr: true, required: true, slugFrom: 'title_en', hint: 'أحرف إنجليزية صغيرة وأرقام وشرطات — يُولَّد تلقائياً من العنوان الإنجليزي. تغييره يغيّر رابط المقال.' },
      { type: 'bilingual', name: 'category', label: 'التصنيف' },
      { type: 'bilingual', name: 'summary', label: 'الملخص', multiline: true, rows: 3, required: true },
      { type: 'bilingual', name: 'content', label: 'نص المقال', multiline: true, rows: 14, hint: 'افصل بين الفقرات بسطر فارغ.' },
      { type: 'bilingual-list', name: 'takeaways', label: 'أهم النقاط', hint: 'تظهر في صندوق «أهم النقاط» آخر المقال.' },
      { type: 'number', name: 'read_time_minutes', label: 'مدة القراءة (دقائق)', min: 1, max: 120 },
      { type: 'date', name: 'published_on', label: 'تاريخ النشر' },
      { type: 'image', name: 'featured_image_url', label: 'صورة المقال', hint: 'بدونها تظهر رسمة العيادة المميزة. نسبة 16:9.' },
      { type: 'toggle', name: 'is_hero_article', label: 'المقال الرئيسي (المميز)', hint: 'مقال واحد فقط — تفعيله هنا يلغيه من المقال السابق تلقائياً.' },
      featuredToggle('أول 3 مقالات مميزة تظهر في الصفحة الرئيسية.'),
      publishedToggle,
    ],
    defaults: {
      title_ar: '', title_en: '', slug: '', category_ar: '', category_en: '', summary_ar: '', summary_en: '', content_ar: '', content_en: '',
      takeaways_ar: [], takeaways_en: [], read_time_minutes: 5, published_on: new Date().toISOString().slice(0, 10),
      featured_image_url: null, is_hero_article: false, is_featured_on_home: false, is_published: true,
    },
    summary: (row) => ({ title: text(row.title_ar), subtitle: text(row.summary_ar), image: row.featured_image_url as string | null }),
    flags: [published, featured, { name: 'is_hero_article', label: 'المقال الرئيسي', tone: 'amber' }],
  },
  faqs: {
    table: 'faqs',
    title: 'الأسئلة الشائعة',
    description: 'أسئلة الصفحة الرئيسية، ودليل ما قبل العملية وبعدها في صفحة الخدمات.',
    singular: 'سؤال',
    folder: 'faqs',
    fields: [
      {
        type: 'select',
        name: 'page_location',
        label: 'مكان الظهور',
        options: [
          { value: 'home', label: 'الصفحة الرئيسية' },
          { value: 'services_before', label: 'الخدمات — قبل العملية' },
          { value: 'services_after', label: 'الخدمات — بعد العملية' },
        ],
      },
      { type: 'bilingual', name: 'question', label: 'السؤال', required: true },
      { type: 'bilingual', name: 'answer', label: 'الإجابة', multiline: true, rows: 4, required: true },
      publishedToggle,
    ],
    defaults: { page_location: 'home', question_ar: '', question_en: '', answer_ar: '', answer_en: '', is_published: true },
    summary: (row) => ({ title: text(row.question_ar), subtitle: text(row.answer_ar) }),
    flags: [published],
    groupBy: {
      name: 'page_location',
      options: [
        { value: 'home', label: 'الصفحة الرئيسية' },
        { value: 'services_before', label: 'الخدمات — قبل العملية' },
        { value: 'services_after', label: 'الخدمات — بعد العملية' },
      ],
    },
  },
};

export type CollectionKey = keyof typeof collections;
