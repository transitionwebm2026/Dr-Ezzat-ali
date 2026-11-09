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
  | { type: 'select'; name: string; label: string; options: { value: string; label: string }[]; hint?: string }
  | { type: 'image'; name: string; label: string; hint?: string }
  /** Uploaded video + its compulsory thumbnail (+ optional YouTube alternative). */
  | { type: 'video'; name: string; thumbnail: string; youtube?: string; label: string }
  /** Title that splits a long form into sections (writes no column). */
  | { type: 'heading'; name: string; label: string; hint?: string }
  /** Card look: icon + colour + optional photo, with a live preview. */
  | { type: 'visual'; name: string; label: string; icon: string; tone: string; image: string; imageHint?: string }
  /** Animated illustration of a technique (`SceneKey`), with a live preview. */
  | { type: 'scene'; name: string; label: string; hint?: string }
  /** jsonb array of objects; each item is edited with `fields` (one level — no repeater inside a repeater). */
  | {
      type: 'repeater';
      name: string;
      label: string;
      /** Singular, for "إضافة …" and the item headers. */
      itemLabel: string;
      hint?: string;
      fields: FieldDef[];
      defaults: Row;
      /** Column that must be unique among the items. */
      keyField?: string;
      /** Column shown in the collapsed item header. */
      titleField?: string;
      /** Optional status shown next to the title in the collapsed item header. */
      badge?: (item: Row) => string | null;
    };

export type Flag = { name: string; label: string; offLabel?: string; tone: 'green' | 'blue' | 'amber' };

/** Shortcut to a related dashboard page, shown under the page title. */
export type RelatedLink = { href: string; label: string };

export type CollectionConfig = {
  table: 'specialties' | 'reviews' | 'videos' | 'articles' | 'faqs';
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
  related?: RelatedLink[];
};

const text = (value: unknown) => (typeof value === 'string' ? value : '');

const published: Flag = { name: 'is_published', label: 'منشور', offLabel: 'مسودة', tone: 'green' };
const featured: Flag = { name: 'is_featured_on_home', label: 'في الرئيسية', tone: 'blue' };

const publishedToggle: FieldDef = { type: 'toggle', name: 'is_published', label: 'منشور على الموقع', hint: 'أوقفه لحفظ العنصر كمسودة دون أن يظهر للزوار.' };
const featuredToggle = (hint: string): FieldDef => ({ type: 'toggle', name: 'is_featured_on_home', label: 'عرض في الصفحة الرئيسية', hint });

const count = (value: unknown) => (Array.isArray(value) ? value.length : 0);

/** Pages that edit the rest of the services content, so every part is one click away. */
const servicesLinks = {
  specialties: { href: '/admin/specialties/', label: 'الخدمات والتخصصات' },
  texts: { href: '/admin/sections/?page=services', label: 'نصوص صفحة الخدمات (الواجهة، العناوين، خطوات العلاج)' },
  homeTexts: { href: '/admin/sections/?page=home', label: 'عناوين أقسام الصفحة الرئيسية' },
  faqs: { href: '/admin/faqs/?group=services_before', label: 'دليل ما قبل العملية وبعدها' },
} satisfies Record<string, RelatedLink>;

/** Home-page sections whose cards are picked from the services page (see `homeCards` in src/lib/cms/content.ts). */
const homeSectionOptions = [
  { value: '', label: 'لا يظهر في الصفحة الرئيسية' },
  { value: 'surgeries', label: 'قسم «أبرز الجراحات» في الرئيسية' },
  { value: 'treatments', label: 'قسم «علاجات متقدمة دون جراحة» في الرئيسية' },
];

const homeLabels: Record<string, string> = { surgeries: 'الجراحات', treatments: 'العلاجات' };

const homeTag = (placeholder: string): FieldDef => ({
  type: 'text',
  name: 'tag',
  label: 'وسم قصير على بطاقة الرئيسية (اختياري)',
  ltr: true,
  placeholder,
});

const techniqueFields: FieldDef[] = [
  { type: 'bilingual', name: 'name', label: 'اسم التقنية', required: true },
  { type: 'bilingual', name: 'detail', label: 'شرح مختصر', multiline: true, rows: 2 },
  {
    type: 'text',
    name: 'key',
    label: 'المعرّف (بالإنجليزية)',
    ltr: true,
    required: true,
    slugFrom: 'name_en',
    hint: 'يُولَّد تلقائياً من الاسم الإنجليزي، مثل: femto-lasik — لا يتكرر داخل نفس التخصص.',
  },
  { type: 'scene', name: 'scene', label: 'الرسمة المتحركة', hint: 'تظهر في لوحة العرض عند اختيار الزائر لهذه التقنية.' },
  { type: 'image', name: 'image_url', label: 'صورة حقيقية بدل الرسمة (اختيارية)', hint: 'إن رفعتها تحل محل الرسمة المتحركة. يُفضّل صورة رأسية بنسبة 4:5.' },
  {
    type: 'select',
    name: 'home_section',
    label: 'الظهور في الصفحة الرئيسية',
    options: homeSectionOptions,
    hint: 'تظهر التقنية كبطاقة بالاسم والشرح والرسمة، وتفتح قسم التخصص عند الضغط عليها.',
  },
  homeTag('Anti-VEGF'),
];

export const collections: Record<CollectionConfig['table'], CollectionConfig> = {
  specialties: {
    table: 'specialties',
    title: 'الخدمات والتخصصات',
    description:
      'كل تخصص يظهر في صفحة «الخدمات» كبطاقة في أعلى الصفحة وقسم تفاصيل كامل (الحالات، التقنيات، مدة الإجراء والتعافي)، ويظهر رابطه في عمود «التخصصات» بالفوتر. ومن هنا أيضاً تختار ما يظهر في قسمي «الجراحات» و«العلاجات» بالصفحة الرئيسية — تخصص كامل أو تقنية من داخله. رتّبها بالأسهم.',
    singular: 'تخصص',
    folder: 'specialties',
    fields: [
      { type: 'heading', name: '_basics', label: 'البيانات الأساسية' },
      { type: 'bilingual', name: 'title', label: 'اسم التخصص', required: true },
      { type: 'bilingual', name: 'short', label: 'سطر تعريفي قصير', hint: 'يظهر تحت الاسم في بطاقة التخصص أعلى الصفحة.' },
      { type: 'bilingual', name: 'description', label: 'الوصف', multiline: true, rows: 4, hint: 'الفقرة التي تظهر تحت اسم التخصص في قسم التفاصيل.' },
      {
        type: 'text',
        name: 'key',
        label: 'المعرّف (بالإنجليزية)',
        ltr: true,
        required: true,
        slugFrom: 'title_en',
        hint: 'رابط القسم في صفحة الخدمات: /services/#المعرّف (مثل lasik).',
      },

      { type: 'heading', name: '_conditions', label: 'الحالات التي نعالجها', hint: 'تظهر كشارات في قسم التخصص — اتركها فارغة لإخفاء الجزء.' },
      { type: 'bilingual-list', name: 'conditions', label: 'الحالات' },

      {
        type: 'heading',
        name: '_techniques',
        label: 'التقنيات المستخدمة',
        hint: 'كل تقنية بطاقة يضغط عليها الزائر فتظهر رسمتها المتحركة (أو صورتها) في لوحة العرض. الترتيب هنا هو ترتيب الظهور. ويمكن عرض أي تقنية في الصفحة الرئيسية من داخلها.',
      },
      {
        type: 'repeater',
        name: 'techniques',
        label: 'التقنيات',
        itemLabel: 'تقنية',
        keyField: 'key',
        titleField: 'name_ar',
        badge: (item) => (homeLabels[text(item.home_section)] ? `في الرئيسية: ${homeLabels[text(item.home_section)]}` : null),
        fields: techniqueFields,
        defaults: { key: '', name_ar: '', name_en: '', detail_ar: '', detail_en: '', scene: 'femto', image_url: null, home_section: null, tag: null },
      },

      { type: 'heading', name: '_facts', label: 'مدة الإجراء والتعافي', hint: 'تظهر أسفل لوحة العرض. اترك الحقل فارغاً لإخفائه.' },
      { type: 'bilingual', name: 'duration', label: 'مدة الإجراء' },
      { type: 'bilingual', name: 'recovery', label: 'التعافي' },

      { type: 'heading', name: '_look', label: 'شكل البطاقة' },
      {
        type: 'visual',
        name: 'visual',
        label: 'الأيقونة واللون والصورة',
        icon: 'icon',
        tone: 'tone',
        image: 'image_url',
        imageHint: 'اختيارية — بدونها تظهر الرسمة المميزة بالأيقونة واللون المختارين. نسبة 4:3.',
      },

      {
        type: 'heading',
        name: '_home',
        label: 'الظهور في الصفحة الرئيسية',
        hint: 'بطاقة التخصص في الرئيسية تأخذ اسمه وأيقونته ولونه وصورته من هنا، وتفتح قسمه في صفحة الخدمات عند الضغط عليها.',
      },
      { type: 'select', name: 'home_section', label: 'يظهر التخصص في', options: homeSectionOptions },
      { type: 'bilingual', name: 'summary', label: 'وصف البطاقة في الرئيسية', multiline: true, rows: 2, hint: 'جملة أو جملتان. إن تُرك فارغاً يُستخدم «الوصف».' },
      homeTag('Femto-LASIK · SMILE'),
      publishedToggle,
    ],
    defaults: {
      key: '', title_ar: '', title_en: '', short_ar: '', short_en: '', description_ar: '', description_en: '',
      conditions_ar: [], conditions_en: [], techniques: [], duration_ar: '', duration_en: '', recovery_ar: '', recovery_en: '',
      icon: 'eye', tone: 'cyan', image_url: null, home_section: null, summary_ar: '', summary_en: '', tag: null, is_published: true,
    },
    summary: (row) => {
      const onHome = [
        homeLabels[text(row.home_section)] ? `التخصص في ${homeLabels[text(row.home_section)]}` : '',
        ...(Array.isArray(row.techniques) ? row.techniques : []).filter((item) => homeLabels[text(item?.home_section)]).map((item) => `«${text(item.name_ar)}» في ${homeLabels[text(item.home_section)]}`),
      ].filter(Boolean);
      return {
        title: text(row.title_ar),
        subtitle: [
          `#${text(row.key)} · ${count(row.techniques)} تقنيات · ${count(row.conditions_ar)} حالات`,
          onHome.length ? `في الرئيسية: ${onHome.join('، ')}` : 'لا يظهر في الرئيسية',
        ].join(' — '),
        image: row.image_url as string | null,
      };
    },
    flags: [published],
    related: [servicesLinks.texts, servicesLinks.homeTexts, servicesLinks.faqs],
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
    related: [servicesLinks.specialties, servicesLinks.texts],
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
