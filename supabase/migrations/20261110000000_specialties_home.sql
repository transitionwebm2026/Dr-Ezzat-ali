-- ════════════════════════════════════════════════════════════════════════════
--  Home-page service cards picked from the services page
--  (dashboard: مكتبات المحتوى → الخدمات والتخصصات → «الظهور في الصفحة الرئيسية»)
--
--  The home sections «أبرز الجراحات» and «علاجات متقدمة دون جراحة» no longer have their own lists
--  (the old `surgeries` / `treatments` tables are not read any more and can be dropped later).
--  Their cards now come from the services page: a whole specialty, or one technique inside it.
--
--    specialties.home_section          'surgeries' | 'treatments' | NULL (not on the home page)
--    specialties.tag                   short tag on the home card, e.g. 'Femto-LASIK · SMILE'
--    specialties.summary_ar / _en      short text of the home card (empty → the description)
--    techniques[].home_section / .tag  same, for a single technique card
--
--  Starting choices (applied only while nothing is placed on the home page yet):
--    surgeries  → LASIK, cataract, retina (as on the home page today)
--    treatments → anti-VEGF injections, retinal laser, SLT (non-surgical techniques of the services page)
--
--  Run after 20261109000000_specialties.sql: Supabase → SQL Editor → paste & run.
--  The file is idempotent, so running it again is safe.
-- ════════════════════════════════════════════════════════════════════════════

alter table public.specialties
  add column if not exists home_section text check (home_section is null or home_section in ('surgeries', 'treatments')),
  add column if not exists tag          text,
  add column if not exists summary_ar   text not null default '',
  add column if not exists summary_en   text not null default '';

do $$
begin
  if exists (select 1 from public.specialties where home_section is not null or techniques @? '$[*].home_section') then
    raise notice 'Home-page choices already set in the dashboard — left unchanged.';
    return;
  end if;

  update public.specialties as s
  set home_section = v.home_section, tag = v.tag, summary_ar = v.summary_ar, summary_en = v.summary_en
  from (values
      ('lasik', 'surgeries', 'Femto-LASIK · SMILE', 'تصحيح قصر وطول النظر والاستجماتيزم بتقنيات الفيمتو ليزك والسمايل بدقة ميكرونية وتعافٍ سريع.', 'Correct myopia, hyperopia and astigmatism with Femto-LASIK and SMILE — micron-level precision and a fast recovery.'),
      ('cataract', 'surgeries', 'Phaco · Premium IOL', 'إزالة المياه البيضاء بالفاكو عبر جرح دقيق دون غرز، مع زراعة عدسات أحادية أو متعددة البؤر.', 'Stitch-free phaco cataract removal through a micro-incision, with monofocal or multifocal lens implants.'),
      ('retina', 'surgeries', 'Vitrectomy', 'علاج انفصال الشبكية وثقب مركز الإبصار ونزيف الجسم الزجاجي بأحدث تقنيات الجراحة المجهرية.', 'Treatment of retinal detachment, macular holes and vitreous haemorrhage with modern micro-surgical techniques.'),
      ('glaucoma', null, null, 'تشخيص مبكر دقيق وعلاج بالقطرات والليزر والجراحة لضبط ضغط العين وحماية العصب البصري.', 'Precise early diagnosis and treatment with drops, laser and surgery to control eye pressure and protect the optic nerve.')
  ) as v(key, home_section, tag, summary_ar, summary_en)
  where s.key = v.key;

  update public.specialties as s
  set techniques = (
    select coalesce(jsonb_agg(
      case when v.key is null then e.item
           else e.item || jsonb_build_object('home_section', v.home_section, 'tag', v.tag) end
      order by e.ord), '[]'::jsonb)
    from jsonb_array_elements(s.techniques) with ordinality as e(item, ord)
    left join (values
      ('retina', 'anti-vegf', 'treatments', 'Anti-VEGF'),
      ('retina', 'retinal-laser', 'treatments', 'Laser'),
      ('glaucoma', 'slt', 'treatments', 'SLT')
    ) as v(specialty, key, home_section, tag)
      on v.specialty = s.key and v.key = e.item ->> 'key'
  )
  where s.key in ('retina', 'glaucoma');
end
$$;

-- Let the API see the new columns right away.
notify pgrst, 'reload schema';
