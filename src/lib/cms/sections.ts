/**
 * Page-section registry + merge helpers, shared by the static build and the admin dashboard.
 *
 * Each section maps to a path in the dictionaries (`src/i18n/dictionaries/*.ts`). The dictionary value
 * is both the default content and the schema: the admin form is generated from its shape, and saved
 * overrides are coerced back into that shape, so a malformed row can never break a page.
 * Lists managed by their own tables (reviews, videos, FAQs…) are listed in `omit`.
 */

export type SectionPage = 'global' | 'home' | 'about' | 'services' | 'reviews' | 'videos' | 'articles' | 'contact';

export type SectionDef = {
  /** Dictionary path, also the `page_sections.section_key`. */
  key: string;
  page: SectionPage;
  label: string;
  /** Paths (relative to the section) managed elsewhere. `*` matches every array item. */
  omit?: string[];
  /** Arrays whose length is fixed (items can be edited but not added/removed). */
  fixed?: string[];
};

export const sectionPages: { id: SectionPage; label: string }[] = [
  { id: 'global', label: 'عناصر عامة' },
  { id: 'home', label: 'الرئيسية' },
  { id: 'about', label: 'عن الطبيب' },
  { id: 'services', label: 'الخدمات' },
  { id: 'reviews', label: 'آراء المرضى' },
  { id: 'videos', label: 'الفيديوهات' },
  { id: 'articles', label: 'المقالات' },
  { id: 'contact', label: 'تواصل معنا' },
];

export const sectionRegistry: SectionDef[] = [
  { page: 'global', key: 'doctor', label: 'بيانات الطبيب' },
  { page: 'global', key: 'meta', label: 'محركات البحث (SEO)', omit: ['defaultTitle', 'titleTemplate'] },
  { page: 'global', key: 'common', label: 'نصوص الأزرار والعناصر العامة' },
  { page: 'global', key: 'whatsapp', label: 'رسائل واتساب الجاهزة' },
  { page: 'global', key: 'floating', label: 'أزرار التواصل العائمة' },
  { page: 'global', key: 'stats', label: 'الأرقام والإحصائيات' },
  { page: 'global', key: 'footer', label: 'عناوين الفوتر', omit: ['about', 'rights'] },
  { page: 'global', key: 'notFound', label: 'صفحة 404' },

  { page: 'home', key: 'home.hero', label: 'الواجهة (Hero)' },
  { page: 'home', key: 'home.intro', label: 'التعريف والفيديو' },
  { page: 'home', key: 'home.surgeries', label: 'عنوان قسم الجراحات', omit: ['items'] },
  { page: 'home', key: 'home.treatments', label: 'عنوان قسم العلاجات', omit: ['items'] },
  { page: 'home', key: 'home.why', label: 'لماذا تختارنا' },
  { page: 'home', key: 'home.journey', label: 'رحلة المريض' },
  { page: 'home', key: 'home.reviews', label: 'عنوان قسم الآراء' },
  { page: 'home', key: 'home.videos', label: 'عنوان قسم الفيديوهات' },
  { page: 'home', key: 'home.articles', label: 'عنوان قسم المقالات' },
  { page: 'home', key: 'home.faq', label: 'عنوان قسم الأسئلة الشائعة', omit: ['items'] },
  { page: 'home', key: 'cta.home', label: 'دعوة الحجز في آخر الصفحة' },

  { page: 'about', key: 'about.hero', label: 'الواجهة (Hero)' },
  { page: 'about', key: 'about.message', label: 'كلمة الطبيب' },
  { page: 'about', key: 'about.timeline', label: 'المسيرة العلمية والمهنية' },
  { page: 'about', key: 'about.video', label: 'الفيديو التعريفي' },
  { page: 'about', key: 'about.expertise', label: 'مجالات الخبرة' },
  { page: 'about', key: 'about.certificates', label: 'الشهادات والعضويات' },
  { page: 'about', key: 'cta.about', label: 'دعوة الحجز في آخر الصفحة' },

  { page: 'services', key: 'services.hero', label: 'الواجهة (Hero)' },
  { page: 'services', key: 'services.specialties', label: 'التخصصات والتقنيات' },
  { page: 'services', key: 'services.process', label: 'خطوات تحديد العلاج' },
  { page: 'services', key: 'services.faq', label: 'عنوان دليل ما قبل وبعد العملية', omit: ['groups.*.items'], fixed: ['groups'] },
  { page: 'services', key: 'cta.services', label: 'دعوة الحجز في آخر الصفحة' },

  { page: 'reviews', key: 'reviews', label: 'نصوص الصفحة', omit: ['items'] },
  { page: 'reviews', key: 'cta.reviews', label: 'دعوة الحجز في آخر الصفحة' },

  { page: 'videos', key: 'videos', label: 'نصوص الصفحة', omit: ['items'] },
  { page: 'videos', key: 'cta.videos', label: 'دعوة الحجز في آخر الصفحة' },

  { page: 'articles', key: 'articles', label: 'نصوص الصفحة', omit: ['items'] },
  { page: 'articles', key: 'cta.articles', label: 'دعوة الحجز في آخر الصفحة' },

  { page: 'contact', key: 'contact.hero', label: 'الواجهة (Hero)' },
  { page: 'contact', key: 'contact.form', label: 'نموذج الحجز' },
  { page: 'contact', key: 'contact.info', label: 'بيانات العيادة والخريطة' },
  { page: 'contact', key: 'cta.contact', label: 'دعوة الحجز في آخر الصفحة' },
];

const registryByKey = new Map(sectionRegistry.map((def) => [def.key, def]));

export function getSectionDef(key: string): SectionDef | undefined {
  return registryByKey.get(key);
}

type PlainObject = Record<string, unknown>;

export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getAtPath(root: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => (isPlainObject(node) ? node[key] : undefined), root);
}

export function setAtPath(root: PlainObject, path: string, value: unknown): void {
  const keys = path.split('.');
  const last = keys.pop()!;
  let node: PlainObject = root;
  for (const key of keys) {
    if (!isPlainObject(node[key])) return;
    node = node[key] as PlainObject;
  }
  node[last] = value;
}

/** Empty value of the same type as `template` ('' / 0 / false / [] / object of empties). */
export function emptyLike(template: unknown): unknown {
  if (Array.isArray(template)) return [];
  if (isPlainObject(template)) return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, emptyLike(value)]));
  if (typeof template === 'number') return 0;
  if (typeof template === 'boolean') return false;
  return '';
}

/** Coerces `value` into the shape of `template`; missing or mistyped leaves become empty values. */
function conform(template: unknown, value: unknown): unknown {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return [];
    const item = template[0];
    return item === undefined ? value : value.map((entry) => conform(item, entry));
  }
  if (isPlainObject(template)) {
    const source = isPlainObject(value) ? value : {};
    return Object.fromEntries(Object.keys(template).map((key) => [key, conform(template[key], source[key])]));
  }
  return typeof value === typeof template ? value : emptyLike(template);
}

/**
 * Overlays `override` onto `base`. Objects merge key by key (only keys that exist in `base`),
 * arrays are replaced as a whole (each item coerced to the shape of the default items),
 * primitives are replaced when the type matches.
 */
export function mergeContent<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base;
    const item = base[0];
    return (item === undefined ? override : override.map((entry) => conform(item, entry))) as T;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(override)) return base;
    return Object.fromEntries(Object.keys(base).map((key) => [key, mergeContent(base[key], override[key])])) as T;
  }
  return (typeof override === typeof base ? override : base) as T;
}

/** Returns a copy of `value` without the given paths (`*` = every array item). */
export function omitPaths(value: unknown, paths: string[] | undefined): unknown {
  if (!paths?.length) return value;
  const copy = structuredClone(value);
  for (const path of paths) removePath(copy, path.split('.'));
  return copy;
}

function removePath(node: unknown, keys: string[]): void {
  const [key, ...rest] = keys;
  if (key === '*') {
    if (Array.isArray(node)) node.forEach((item) => removePath(item, rest));
    return;
  }
  if (!isPlainObject(node) || !(key in node)) return;
  if (rest.length === 0) delete node[key];
  else removePath(node[key], rest);
}

/** Default value + saved override → the section content shown on the site. */
export function resolveSection(def: SectionDef, defaults: unknown, override: unknown): unknown {
  return mergeContent(defaults, omitPaths(override, def.omit));
}
