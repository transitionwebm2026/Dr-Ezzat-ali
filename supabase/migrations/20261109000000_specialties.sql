-- ════════════════════════════════════════════════════════════════════════════
--  Services page specialties (dashboard: الخدمات → تخصصات صفحة الخدمات)
--
--  One row per specialty on /services/: its quick-jump card, its deep-dive section
--  (conditions treated, technique cards, procedure time, recovery) and its link in the
--  footer "Specialties" column. Previously these lived only in the dictionaries.
--
--  The table is filled with the four specialties currently on the site (only when it is empty),
--  so the dashboard starts with exactly what visitors see.
--
--  Run after the earlier migrations: Supabase → SQL Editor → paste & run.
--  The file is idempotent, so running it again is safe.
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.specialties (
  id              uuid primary key default gen_random_uuid(),
  -- Stable English id: the section anchor (/services/#key) and the default icon / colour.
  key             text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_ar        text not null,
  title_en        text not null default '',
  -- One line under the title on the quick-jump card.
  short_ar        text not null default '',
  short_en        text not null default '',
  description_ar  text not null default '',
  description_en  text not null default '',
  conditions_ar   text[] not null default '{}',
  conditions_en   text[] not null default '{}',
  -- [{ "key": "femto-lasik", "name_ar": "…", "name_en": "…", "detail_ar": "…", "detail_en": "…",
  --    "scene": "femto", "image_url": null }]   scene = animated illustration, image_url = optional photo
  techniques      jsonb not null default '[]'::jsonb check (jsonb_typeof(techniques) = 'array'),
  duration_ar     text not null default '',
  duration_en     text not null default '',
  recovery_ar     text not null default '',
  recovery_en     text not null default '',
  -- NULL = the default for `key` in src/content/media.ts.
  icon            text,
  tone            text check (tone is null or tone in ('cyan', 'navy', 'sky', 'deep', 'teal', 'frost')),
  -- Optional photo for the quick-jump card (replaces the illustration).
  image_url       text,
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);


-- ─── Row Level Security (same model as the other content libraries) ─────────

alter table public.specialties enable row level security;

drop policy if exists "Public read" on public.specialties;
create policy "Public read" on public.specialties
  for select to anon, authenticated
  using (is_published);

drop policy if exists "Admin full access" on public.specialties;
create policy "Admin full access" on public.specialties
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

revoke all on public.specialties from anon, authenticated;
grant select on public.specialties to anon;
grant select, insert, update, delete on public.specialties to authenticated;

drop trigger if exists set_updated_at on public.specialties;
create trigger set_updated_at before update on public.specialties
  for each row execute function public.set_updated_at();


-- ─── Current site content (generated from src/i18n/dictionaries + src/content/media.ts) ──

do $seed$
begin
  if not exists (select 1 from public.specialties) then
    insert into public.specialties (key, title_ar, title_en, short_ar, short_en, description_ar, description_en, conditions_ar, conditions_en, techniques, duration_ar, duration_en, recovery_ar, recovery_en, icon, tone, image_url, sort_order) values
      ('lasik', 'الليزك وجراحات تصحيح الإبصار', 'LASIK & Refractive Surgery', 'ودّع النظارة والعدسات اللاصقة', 'Say goodbye to glasses and contacts', 'نوفر طيفاً كاملاً من جراحات تصحيح الإبصار، ونختار التقنية الأنسب لكل مريض بناءً على سمك القرنية وشكلها ودرجة الانكسار ونمط الحياة، لتحقيق أفضل رؤية ممكنة بأعلى درجات الأمان.', 'We offer the full spectrum of vision-correction procedures and select the right technique for each patient based on corneal thickness and shape, prescription and lifestyle — for the best possible vision with the highest safety.', array['قصر النظر', 'طول النظر', 'الاستجماتيزم (اللابؤرية)', 'طول النظر الشيخوخي']::text[], array['Myopia (short-sightedness)', 'Hyperopia (long-sightedness)', 'Astigmatism', 'Presbyopia']::text[], '[{"key":"femto-lasik","name_ar":"الفيمتو ليزك (Femto-LASIK)","name_en":"Femto-LASIK","detail_ar":"صنع شريحة القرنية بالليزر بدلاً من الشفرة لدقة وأمان أعلى.","detail_en":"The corneal flap is created by laser instead of a blade for greater precision and safety.","scene":"femto","image_url":null},{"key":"smile","name_ar":"الفيمتو سمايل (SMILE)","name_en":"SMILE","detail_ar":"تصحيح عبر فتحة صغيرة دون شريحة، مثالي للرياضيين ومرضى جفاف العين.","detail_en":"Flapless correction through a tiny incision — ideal for athletes and dry-eye patients.","scene":"smile","image_url":null},{"key":"prk","name_ar":"التصحيح السطحي (PRK / Trans-PRK)","name_en":"Surface ablation (PRK / Trans-PRK)","detail_ar":"بديل آمن للقرنيات الرقيقة دون أي ملامسة للعين.","detail_en":"A safe, no-touch alternative for thinner corneas.","scene":"prk","image_url":null},{"key":"icl","name_ar":"زراعة العدسات (ICL)","name_en":"Phakic lens implant (ICL)","detail_ar":"للدرجات العالية من قصر النظر أو عند عدم ملاءمة الليزك.","detail_en":"For high prescriptions or when LASIK is not suitable.","scene":"icl","image_url":null}]'::jsonb, '10 – 15 دقيقة للعينين', '10 – 15 min for both eyes', 'عودة للأنشطة اليومية خلال 24 – 48 ساعة', 'Back to daily activities within 24 – 48 hours', 'crosshair', 'cyan', null, 10),
      ('cataract', 'المياه البيضاء وزراعة العدسات', 'Cataract & Lens Implantation', 'استعد صفاء الرؤية من جديد', 'See the world clearly again', 'إزالة عدسة العين المعتمة بتقنية الفاكو عبر جرح دقيق لا يحتاج إلى غرز، واستبدالها بعدسة صناعية عالية الجودة تُختار بعناية وفق القياسات الحيوية الدقيقة واحتياجات المريض اليومية.', 'The clouded natural lens is removed by phacoemulsification through a stitch-free micro-incision and replaced with a high-quality artificial lens, carefully chosen from precise biometry and your daily visual needs.', array['المياه البيضاء المرتبطة بالتقدم في العمر', 'المياه البيضاء لدى مرضى السكري', 'المياه البيضاء الناتجة عن الإصابات أو الكورتيزون', 'المياه البيضاء الخلقية لدى الأطفال']::text[], array['Age-related cataract', 'Diabetic cataract', 'Traumatic or steroid-induced cataract', 'Congenital cataract in children']::text[], '[{"key":"phaco","name_ar":"الفاكو بالموجات فوق الصوتية","name_en":"Ultrasound phacoemulsification","detail_ar":"تفتيت العدسة المعتمة وإزالتها عبر فتحة لا تتجاوز 2.2 مم.","detail_en":"The cloudy lens is broken up and removed through an opening of just 2.2 mm.","scene":"phaco","image_url":null},{"key":"multifocal","name_ar":"العدسات متعددة البؤر","name_en":"Multifocal lenses","detail_ar":"رؤية واضحة للبعيد والمتوسط والقريب وتقليل الاعتماد على النظارة.","detail_en":"Clear distance, intermediate and near vision with less reliance on glasses.","scene":"multifocal","image_url":null},{"key":"toric","name_ar":"عدسات التوريك (Toric)","name_en":"Toric lenses","detail_ar":"تصحيح الاستجماتيزم مع إزالة المياه البيضاء في الإجراء نفسه.","detail_en":"Corrects astigmatism during the same cataract procedure.","scene":"toric","image_url":null},{"key":"edof","name_ar":"عدسات العمق الممتد (EDOF)","name_en":"Extended depth-of-focus (EDOF)","detail_ar":"مدى رؤية ممتد مع انتقال سلس بين المسافات.","detail_en":"An extended range of vision with smooth transitions between distances.","scene":"edof","image_url":null}]'::jsonb, '15 – 20 دقيقة', '15 – 20 min', 'تحسن ملحوظ خلال أيام واستقرار تام خلال 4 أسابيع', 'Noticeable improvement within days; fully stable in 4 weeks', 'aperture', 'navy', null, 20),
      ('retina', 'الشبكية والجسم الزجاجي', 'Retina & Vitreous', 'حماية مركز الإبصار', 'Protecting the centre of your vision', 'تشخيص وعلاج أمراض الشبكية بدقة عالية باستخدام التصوير المقطعي وأحدث تقنيات الليزر والحقن والجراحة المجهرية، للحفاظ على البصر ومنع تدهوره.', 'Precise diagnosis and treatment of retinal diseases using OCT imaging and the latest laser, injection and micro-surgical techniques — to preserve sight and prevent deterioration.', array['اعتلال الشبكية السكري', 'الضمور البقعي المرتبط بالعمر', 'انفصال الشبكية', 'ثقب مركز الإبصار والغشاء فوق الشبكي', 'نزيف الجسم الزجاجي']::text[], array['Diabetic retinopathy', 'Age-related macular degeneration', 'Retinal detachment', 'Macular hole & epiretinal membrane', 'Vitreous haemorrhage']::text[], '[{"key":"vitrectomy","name_ar":"استئصال الجسم الزجاجي (Vitrectomy)","name_en":"Pars plana vitrectomy","detail_ar":"جراحة مجهرية دقيقة بمقاس 23/25G لعلاج الانفصال والنزيف.","detail_en":"Precise 23/25G micro-surgery for detachments and haemorrhage.","scene":"vitrectomy","image_url":null},{"key":"anti-vegf","name_ar":"حقن مضادات VEGF","name_en":"Anti-VEGF injections","detail_ar":"حقن داخل العين لعلاج التورم والأوعية الدموية غير الطبيعية.","detail_en":"Intravitreal injections for oedema and abnormal blood vessels.","scene":"injection","image_url":null},{"key":"retinal-laser","name_ar":"الليزر الضوئي للشبكية","name_en":"Retinal laser photocoagulation","detail_ar":"لعلاج الاعتلال السكري وثقوب الشبكية الطرفية.","detail_en":"For diabetic retinopathy and peripheral retinal tears.","scene":"photocoagulation","image_url":null},{"key":"oct","name_ar":"التصوير المقطعي (OCT)","name_en":"Optical coherence tomography (OCT)","detail_ar":"تشخيص دقيق ومتابعة طبقات الشبكية بدقة ميكرونية.","detail_en":"Micron-level imaging to diagnose and monitor the retinal layers.","scene":"oct","image_url":null}]'::jsonb, '30 – 90 دقيقة حسب الحالة', '30 – 90 min depending on the case', 'يختلف حسب الإجراء مع متابعة دورية منتظمة', 'Varies by procedure, with regular scheduled follow-up', 'scanEye', 'deep', null, 30),
      ('glaucoma', 'الجلوكوما (المياه الزرقاء)', 'Glaucoma', 'اكتشاف مبكر يحمي العصب البصري', 'Early detection that protects the optic nerve', 'الجلوكوما مرض صامت قد يُفقد البصر تدريجياً دون أعراض واضحة. نعتمد على التشخيص المبكر الدقيق وخطط علاج مستمرة تهدف إلى ضبط ضغط العين وحماية العصب البصري مدى الحياة.', 'Glaucoma is a silent disease that can gradually steal sight without obvious symptoms. We rely on precise early diagnosis and long-term treatment plans that control eye pressure and protect the optic nerve for life.', array['الجلوكوما مفتوحة الزاوية', 'الجلوكوما ضيقة الزاوية', 'الجلوكوما الثانوية', 'الجلوكوما الخلقية']::text[], array['Open-angle glaucoma', 'Angle-closure glaucoma', 'Secondary glaucoma', 'Congenital glaucoma']::text[], '[{"key":"medical-therapy","name_ar":"العلاج الدوائي الموجّه","name_en":"Targeted medical therapy","detail_ar":"برامج قطرات مخصصة مع متابعة منتظمة لضغط العين.","detail_en":"Personalised eye-drop regimens with regular pressure monitoring.","scene":"drops","image_url":null},{"key":"slt","name_ar":"الليزر الانتقائي (SLT)","name_en":"Selective laser trabeculoplasty (SLT)","detail_ar":"خفض ضغط العين بالليزر دون جراحة وفي دقائق معدودة.","detail_en":"Lowers eye pressure by laser, without surgery, in minutes.","scene":"slt","image_url":null},{"key":"yag-iridotomy","name_ar":"ليزر القزحية (YAG)","name_en":"YAG laser iridotomy","detail_ar":"للوقاية والعلاج في حالات الزاوية الضيقة.","detail_en":"Prevention and treatment for narrow-angle cases.","scene":"iridotomy","image_url":null},{"key":"glaucoma-surgery","name_ar":"الجراحات المتقدمة والصمامات","name_en":"Advanced surgery & drainage devices","detail_ar":"عند عدم كفاية العلاج الدوائي والليزر.","detail_en":"When drops and laser are not enough.","scene":"shunt","image_url":null}]'::jsonb, '5 – 45 دقيقة حسب الإجراء', '5 – 45 min depending on the procedure', 'متابعة منتظمة مدى الحياة للحفاظ على النتيجة', 'Lifelong regular follow-up to maintain results', 'gauge', 'sky', null, 40);
  end if;
end
$seed$;

-- Let the API see the new table right away.
notify pgrst, 'reload schema';
