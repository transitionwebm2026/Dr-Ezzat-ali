import type { Dictionary } from './ar';

/**
 * English dictionary — must mirror the Arabic dictionary shape exactly.
 *
 * ⚠️ PLACEHOLDER CONTENT: statistics, career dates, certificates, clinic address/hours and patient
 * reviews are realistic samples for layout purposes. Replace them with verified information before launch.
 */
const en: Dictionary = {
  meta: {
    siteName: 'Dr. Ezzat Ali',
    titleTemplate: '%s | Dr. Ezzat Ali – Consultant Ophthalmologist',
    defaultTitle: 'Dr. Ezzat Ali – Consultant Ophthalmologist & Eye Surgeon',
    description:
      'Dr. Ezzat Ali’s eye clinic: LASIK & vision correction, cataract surgery & lens implants, retina, glaucoma and corneal cross-linking with the latest technology.',
    keywords: [
      'ophthalmologist',
      'eye surgeon',
      'LASIK',
      'SMILE',
      'cataract surgery',
      'lens implants',
      'retina specialist',
      'glaucoma',
      'keratoconus',
      'Dr. Ezzat Ali',
    ],
    pages: {
      home: {
        title: 'Home',
        description:
          'Dr. Ezzat Ali, Consultant Ophthalmologist — complete eye care with advanced diagnostics and surgery: LASIK, cataract, retina and glaucoma.',
      },
      about: {
        title: 'About the Doctor',
        description:
          'Meet Dr. Ezzat Ali: academic and professional journey, areas of expertise, certificates and accreditations in ophthalmology.',
      },
      services: {
        title: 'Services & Specialties',
        description:
          'LASIK & vision correction, cataract & lens implantation, retina & vitreous and glaucoma — conditions treated, techniques and treatment steps.',
      },
      reviews: {
        title: 'Patient Reviews',
        description: 'Real experiences from Dr. Ezzat Ali’s patients after LASIK, cataract, retina surgery and advanced eye treatments.',
      },
      videos: {
        title: 'Educational Videos',
        description: 'Short videos in which Dr. Ezzat Ali explains key eye-health topics and procedures in plain language.',
      },
      articles: {
        title: 'Medical Articles',
        description: 'Trusted medical articles on vision correction, cataract, retina, glaucoma and dry eye.',
      },
      contact: {
        title: 'Contact Us',
        description: 'Book your appointment with Dr. Ezzat Ali via WhatsApp or phone, and find the clinic address and opening hours.',
      },
    },
  },

  doctor: {
    name: 'Dr. Ezzat Ali',
    title: 'Consultant Ophthalmologist & Eye Surgeon',
    shortTitle: 'Consultant Ophthalmologist',
    portraitAlt: 'Portrait of Dr. Ezzat Ali, Consultant Ophthalmologist',
  },

  common: {
    bookAppointment: 'Book Appointment',
    exploreServices: 'Explore Services',
    contactUs: 'Contact Us',
    whatsapp: 'WhatsApp',
    chatOnWhatsapp: 'Chat on WhatsApp',
    callNow: 'Call Now',
    callUs: 'Call us',
    followUs: 'Follow us',
    learnMore: 'Learn more',
    readArticle: 'Read article',
    playVideo: 'Play video',
    videoSoon: 'Coming soon',
    minRead: 'min read',
    home: 'Home',
    previous: 'Previous',
    next: 'Next',
    goToSlide: 'Go to slide',
    of: 'of',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
    switchLanguageAria: 'التبديل إلى العربية',
    backToArticles: 'Back to articles',
    relatedArticles: 'Related articles',
    keyTakeaways: 'Key takeaways',
    publishedOn: 'Published on',
    medicalDisclaimer: 'Content is for educational purposes only and does not replace an in-person medical examination.',
    step: 'Step',
  },

  notFound: {
    title: 'Page not found',
    description: 'Sorry, the page you’re looking for doesn’t exist or has been moved.',
    back: 'Back to home',
  },

  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    reviews: 'Reviews',
    videos: 'Videos',
    articles: 'Articles',
    contact: 'Contact',
  },

  whatsapp: {
    defaultMessage: 'Hello Dr. Ezzat, I would like to book a consultation.',
    serviceMessage: 'Hello Dr. Ezzat, I would like to book a consultation about: {service}',
  },

  floating: {
    whatsapp: 'Chat on WhatsApp',
    call: 'Call the clinic',
  },

  clinic: {
    address: 'Example Street, District, Cairo, Egypt',
    hours: [
      { days: 'Saturday – Wednesday', time: '4:00 PM – 10:00 PM' },
      { days: 'Thursday', time: '4:00 PM – 8:00 PM' },
      { days: 'Friday', time: 'Closed' },
    ],
  },

  footer: {
    about: 'Complete eye care that combines clinical expertise with the latest diagnostic and surgical technology, to international safety standards.',
    quickLinks: 'Quick links',
    specialties: 'Specialties',
    contactInfo: 'Contact info',
    workingHours: 'Opening hours',
    rights: 'All rights reserved.',
    creditAria: 'Website design & development by Transition — opens their site in a new tab',
  },

  stats: {
    title: 'Numbers built on years of trust',
    subtitle: 'Every number here is a patient who regained clear vision and a better quality of life.',
    items: [
      { id: 'patients', value: 15000, suffix: '+', label: 'Patients with restored vision' },
      { id: 'surgeries', value: 8000, suffix: '+', label: 'Successful surgeries' },
      { id: 'years', value: 20, suffix: '+', label: 'Years of experience' },
    ],
  },

  cta: {
    home: {
      title: 'Clearer Vision for a Better Life…',
      subtitle: 'Start your eye care journey today and book your consultation with Dr. Ezzat Ali.',
    },
    about: {
      title: 'Expertise you can trust…',
      subtitle: 'Discover the treatment plan that suits your eyes in a personal consultation with the doctor.',
    },
    services: {
      title: 'Every eye deserves its own plan…',
      subtitle: 'Book a comprehensive exam and together we’ll choose the most precise and safest procedure for you.',
    },
    reviews: {
      title: 'Be our next success story…',
      subtitle: 'Join thousands of patients who regained clear vision — and their confidence.',
    },
    videos: {
      title: 'Have a question about your eyes?',
      subtitle: 'Reach out directly — we’ll answer your questions and find the right appointment for you.',
    },
    articles: {
      title: 'Knowledge is the first step to better vision…',
      subtitle: 'But nothing replaces a precise examination — book your visit today.',
    },
    contact: {
      title: 'We’re here for you…',
      subtitle: 'Our team is ready to answer your questions and confirm your appointment as quickly as possible.',
    },
  },

  home: {
    hero: {
      title: 'Your eyes deserve',
      highlight: 'clearer, sharper vision',
      lead: 'Comprehensive eye care that combines years of clinical expertise with the latest diagnostic and surgical technology.',
    },
    intro: {
      title: 'Expertise that sees every detail',
      paragraphs: [
        'Dr. Ezzat Ali is a Consultant Ophthalmologist who has dedicated his career to helping patients regain clear vision with the highest standards of precision and safety.',
        'He believes every eye is unique, so he always begins with a thorough diagnosis and an honest conversation, then builds a treatment plan that fits the eye, the patient’s lifestyle and their expectations.',
      ],
      points: [
        'Extensive experience in vision correction and cataract surgery',
        'Advanced diagnostic and optical coherence imaging',
        'Personal, attentive follow-up until full recovery',
      ],
      cta: 'More about the doctor',
      videoLabel: 'Intro video',
      videoTitle: 'Inside the clinic — a message from Dr. Ezzat Ali',
      experienceBadge: 'Years of experience',
    },
    surgeries: {
      title: 'Key Surgeries',
      subtitle: 'Advanced surgical procedures performed with state-of-the-art equipment and the strictest standards of precision and sterility.',
      cta: 'Explore all services',
    },
    // The cards of both sections come from the services page (specialties / techniques chosen for the home page).
    treatments: {
      title: 'Advanced Non-Surgical Treatments',
      subtitle: 'Modern therapeutic and diagnostic solutions that protect your sight and halt disease progression early.',
      cta: 'Explore all treatments',
    },
    why: {
      title: 'Why Choose Dr. Ezzat Ali?',
      subtitle: 'Because your eyes deserve the highest level of precision and safety, we combine expertise, technology and genuine human care.',
      equipmentTitle: 'Clinic equipment',
      equipment: ['Retinal OCT imaging', 'Pentacam corneal tomography', 'Optical biometry for IOLs', 'Modern laser platforms'],
      items: [
        {
          title: 'Advanced diagnostic equipment',
          description: 'Retinal OCT, corneal tomography and precise optical biometry to choose the ideal lens for your eye.',
        },
        {
          title: 'International safety & sterility',
          description: 'Strict sterilisation protocols, single-use instruments and operating rooms built to the highest infection-control standards.',
        },
        {
          title: 'Extensive surgical experience',
          description: 'Thousands of successful refractive, cataract and retinal procedures, continuously updated with the latest techniques.',
        },
        {
          title: 'Personal, ongoing follow-up',
          description: 'Direct contact after surgery and a clear follow-up schedule until full recovery — your peace of mind is part of the treatment.',
        },
      ],
    },
    journey: {
      title: 'Your Journey to Clearer Vision',
      subtitle: 'Four clear, carefully planned steps — and we’re with you at every one of them.',
      steps: [
        {
          title: 'Consultation',
          duration: '30 – 45 min',
          description: 'A one-to-one meeting with the doctor to understand your concerns, medical history and expectations.',
          details: ['Medical history & medication review', 'Initial visual acuity check', 'Clear answers to all your questions'],
        },
        {
          title: 'Diagnostics',
          duration: '45 – 60 min',
          description: 'Comprehensive tests on the latest devices to build a complete, precise picture of your eye.',
          details: ['Retinal OCT imaging', 'Corneal topography', 'Eye pressure & corneal thickness'],
        },
        {
          title: 'Procedure',
          duration: 'Case-dependent',
          description: 'The right procedure performed to the highest standards of precision and safety, with every step explained first.',
          details: ['Numbing drops in most cases', 'Gentle, pain-free techniques', 'A specialised, trained team'],
        },
        {
          title: 'Recovery',
          duration: 'Until fully healed',
          description: 'A structured follow-up programme and clear instructions for the best possible result and fastest recovery.',
          details: ['Scheduled follow-up visits', 'Direct contact for any question', 'Written eye-care instructions'],
        },
      ],
    },
    reviews: {
      title: 'Success Stories We Treasure',
      subtitle: 'Our patients’ trust is our greatest achievement — here are a few of their words after treatment.',
      cta: 'All patient reviews',
    },
    videos: {
      title: 'Medical Insights in Minutes',
      subtitle: 'Short videos in which Dr. Ezzat Ali explains what you need to know about your eye health.',
      cta: 'All videos',
    },
    articles: {
      title: 'Latest Medical Insights',
      subtitle: 'Trusted articles in plain language to help you understand your condition and make the right decision.',
      cta: 'All articles',
    },
    faq: {
      title: 'Answers to Your Key Questions',
      subtitle: 'The questions our patients ask most often. Didn’t find your answer? Contact us directly.',
      items: [
        {
          q: 'Am I a good candidate for LASIK?',
          a: 'That’s determined after a comprehensive exam including corneal mapping, corneal thickness and confirming your prescription has been stable for at least a year. Candidates are usually over 18 with healthy corneas. If LASIK isn’t suitable, safe alternatives such as SMILE, surface ablation (PRK) or ICL lens implants are available.',
        },
        {
          q: 'Is cataract surgery painful? How long does it take?',
          a: 'The procedure is painless and usually done under numbing drops, taking around 15–20 minutes per eye. Most patients go home the same day and notice a clear improvement within a few days.',
        },
        {
          q: 'When should people with diabetes have a retinal exam?',
          a: 'People with diabetes should have a dilated retinal exam at least once a year, even with normal vision, because diabetic retinopathy can progress without symptoms in its early stages — and early detection protects sight.',
        },
        {
          q: 'How can I book an appointment?',
          a: 'Book easily via the WhatsApp button, by calling the clinic directly, or through the booking form on the Contact page — our team will get back to you to confirm a suitable time.',
        },
      ],
    },
  },

  about: {
    hero: {
      title: 'Dr. Ezzat Ali',
      highlight: 'A passion for clear vision',
      lead: 'Consultant Ophthalmologist combining academic depth with advanced surgical practice.',
    },
    message: {
      title: 'From the Heart',
      paragraphs: [
        'From my first day at medical school, I understood that sight is more than a sense — it is our window onto life and onto the people we love. My goal has always been to give every patient that window back, clear and bright.',
        'I believe real medicine begins with listening. I listen carefully to every patient, explain their condition simply and honestly, and never recommend a procedure I wouldn’t choose for my own family.',
        'I make a point of keeping up with every advance in ophthalmology, but technology alone is not enough. Precision, honesty and continuous follow-up are what truly make the difference in my patients’ lives.',
      ],
      signature: 'Dr. Ezzat Ali',
      role: 'Consultant Ophthalmologist',
    },
    timeline: {
      title: 'A Continuous Academic & Clinical Journey',
      subtitle: 'Academic and professional milestones that built deep expertise in caring for eye patients.',
      items: [
        {
          year: '2002',
          title: 'Bachelor of Medicine & Surgery (MBBCh)',
          place: 'Faculty of Medicine',
          description: 'Graduated with honours and discovered a passion for ophthalmology.',
        },
        {
          year: '2007',
          title: 'Master’s Degree in Ophthalmology',
          place: 'Faculty of Medicine',
          description: 'In-depth study of eye diseases and the foundations of micro-surgery.',
        },
        {
          year: '2011',
          title: 'Doctorate (MD) in Ophthalmology',
          place: 'Faculty of Medicine',
          description: 'Specialised research in corneal and refractive surgery.',
        },
        {
          year: '2013',
          title: 'International Fellowship in Refractive Surgery',
          place: 'International training programme',
          description: 'Advanced training in Femto-LASIK, SMILE and phakic lens implantation.',
        },
        {
          year: '2016',
          title: 'Consultant Ophthalmologist',
          place: 'Leading hospitals & eye centres',
          description: 'Leading surgical teams and successfully performing thousands of procedures.',
        },
        {
          year: '2019',
          title: 'Founded His Private Clinic',
          place: 'Dr. Ezzat Ali Eye Clinic',
          description: 'Launched a fully equipped clinic with the latest diagnostic and treatment technology.',
        },
      ],
    },
    video: {
      title: 'Get to Know Dr. Ezzat Ali',
      subtitle: 'A tour of the clinic and a candid conversation about his philosophy of treatment and care.',
      label: 'Intro video',
    },
    expertise: {
      title: 'Sub-specialised Eye Care',
      subtitle: 'Comprehensive expertise across ophthalmology’s finest sub-specialties — from early diagnosis to advanced surgery.',
      cta: 'Explore all services',
      items: [
        {
          id: 'refractive',
          title: 'Refractive Surgery',
          description: 'Femto-LASIK, SMILE, surface ablation and ICL implants for life beyond glasses.',
        },
        {
          id: 'cataract',
          title: 'Cataract & Lens Implants',
          description: 'Phaco cataract removal with monofocal, multifocal and toric lens implants.',
        },
        {
          id: 'retina',
          title: 'Retina & Vitreous',
          description: 'Diabetic retinopathy, retinal detachment and macular disease treatment.',
        },
      ],
    },
    certificates: {
      title: 'Accreditations & Memberships',
      subtitle: 'A lasting commitment to continuing medical education and the highest local and international standards.',
      kinds: { degree: 'Academic degree', fellowship: 'Fellowship', membership: 'Professional membership', certification: 'Certification' },
      items: [
        { kind: 'degree', title: 'Doctorate (MD) in Ophthalmology', issuer: 'Faculty of Medicine', year: '2011' },
        { kind: 'fellowship', title: 'Fellowship in Cornea & Refractive Surgery', issuer: 'International fellowship programme', year: '2013' },
        { kind: 'membership', title: 'Egyptian Ophthalmological Society', issuer: 'EOS', year: 'Full member' },
        { kind: 'membership', title: 'European Society of Cataract & Refractive Surgeons', issuer: 'ESCRS', year: 'Member' },
        { kind: 'membership', title: 'American Academy of Ophthalmology', issuer: 'AAO', year: 'International member' },
        { kind: 'certification', title: 'Femto-LASIK & SMILE Certification', issuer: 'Technology certification programme', year: '2015' },
      ],
    },
  },

  services: {
    hero: {
      title: 'Complete care',
      highlight: 'for every detail of your eyes',
      lead: 'From vision correction to delicate retinal surgery — integrated services under one roof.',
    },
    specialties: {
      navLabel: 'Precision specialties',
      title: 'Choose a Specialty to Explore',
      subtitle: 'Four core specialties covering most eye-health needs, using the latest surgical and therapeutic techniques.',
      conditionsLabel: 'Conditions treated',
      techniquesLabel: 'Techniques we use',
      durationLabel: 'Procedure time',
      recoveryLabel: 'Recovery',
      bookService: 'Book a consultation for this specialty',
      jumpHint: 'Jump to details',
      techniquesHint: 'Tap any technique to preview it in the visual',
      previewTechnique: 'Tap to preview',
      nowShowing: 'Now showing',
      items: [
        {
          id: 'lasik',
          title: 'LASIK & Refractive Surgery',
          short: 'Say goodbye to glasses and contacts',
          summary: 'Correct myopia, hyperopia and astigmatism with Femto-LASIK and SMILE — micron-level precision and a fast recovery.',
          description:
            'We offer the full spectrum of vision-correction procedures and select the right technique for each patient based on corneal thickness and shape, prescription and lifestyle — for the best possible vision with the highest safety.',
          conditions: ['Myopia (short-sightedness)', 'Hyperopia (long-sightedness)', 'Astigmatism', 'Presbyopia'],
          techniques: [
            { id: 'femto-lasik', name: 'Femto-LASIK', detail: 'The corneal flap is created by laser instead of a blade for greater precision and safety.' },
            { id: 'smile', name: 'SMILE', detail: 'Flapless correction through a tiny incision — ideal for athletes and dry-eye patients.' },
            { id: 'prk', name: 'Surface ablation (PRK / Trans-PRK)', detail: 'A safe, no-touch alternative for thinner corneas.' },
            { id: 'icl', name: 'Phakic lens implant (ICL)', detail: 'For high prescriptions or when LASIK is not suitable.' },
          ],
          duration: '10 – 15 min for both eyes',
          recovery: 'Back to daily activities within 24 – 48 hours',
        },
        {
          id: 'cataract',
          title: 'Cataract & Lens Implantation',
          short: 'See the world clearly again',
          summary: 'Stitch-free phaco cataract removal through a micro-incision, with monofocal or multifocal lens implants.',
          description:
            'The clouded natural lens is removed by phacoemulsification through a stitch-free micro-incision and replaced with a high-quality artificial lens, carefully chosen from precise biometry and your daily visual needs.',
          conditions: ['Age-related cataract', 'Diabetic cataract', 'Traumatic or steroid-induced cataract', 'Congenital cataract in children'],
          techniques: [
            { id: 'phaco', name: 'Ultrasound phacoemulsification', detail: 'The cloudy lens is broken up and removed through an opening of just 2.2 mm.' },
            { id: 'multifocal', name: 'Multifocal lenses', detail: 'Clear distance, intermediate and near vision with less reliance on glasses.' },
            { id: 'toric', name: 'Toric lenses', detail: 'Corrects astigmatism during the same cataract procedure.' },
            { id: 'edof', name: 'Extended depth-of-focus (EDOF)', detail: 'An extended range of vision with smooth transitions between distances.' },
          ],
          duration: '15 – 20 min',
          recovery: 'Noticeable improvement within days; fully stable in 4 weeks',
        },
        {
          id: 'retina',
          title: 'Retina & Vitreous',
          short: 'Protecting the centre of your vision',
          summary: 'Treatment of retinal detachment, macular holes and vitreous haemorrhage with modern micro-surgical techniques.',
          description:
            'Precise diagnosis and treatment of retinal diseases using OCT imaging and the latest laser, injection and micro-surgical techniques — to preserve sight and prevent deterioration.',
          conditions: [
            'Diabetic retinopathy',
            'Age-related macular degeneration',
            'Retinal detachment',
            'Macular hole & epiretinal membrane',
            'Vitreous haemorrhage',
          ],
          techniques: [
            { id: 'vitrectomy', name: 'Pars plana vitrectomy', detail: 'Precise 23/25G micro-surgery for detachments and haemorrhage.' },
            { id: 'anti-vegf', name: 'Anti-VEGF injections', detail: 'Intravitreal injections for oedema and abnormal blood vessels.' },
            { id: 'retinal-laser', name: 'Retinal laser photocoagulation', detail: 'For diabetic retinopathy and peripheral retinal tears.' },
            { id: 'oct', name: 'Optical coherence tomography (OCT)', detail: 'Micron-level imaging to diagnose and monitor the retinal layers.' },
          ],
          duration: '30 – 90 min depending on the case',
          recovery: 'Varies by procedure, with regular scheduled follow-up',
        },
        {
          id: 'glaucoma',
          title: 'Glaucoma',
          short: 'Early detection that protects the optic nerve',
          summary: 'Precise early diagnosis and treatment with drops, laser and surgery to control eye pressure and protect the optic nerve.',
          description:
            'Glaucoma is a silent disease that can gradually steal sight without obvious symptoms. We rely on precise early diagnosis and long-term treatment plans that control eye pressure and protect the optic nerve for life.',
          conditions: ['Open-angle glaucoma', 'Angle-closure glaucoma', 'Secondary glaucoma', 'Congenital glaucoma'],
          techniques: [
            { id: 'medical-therapy', name: 'Targeted medical therapy', detail: 'Personalised eye-drop regimens with regular pressure monitoring.' },
            { id: 'slt', name: 'Selective laser trabeculoplasty (SLT)', detail: 'Lowers eye pressure by laser, without surgery, in minutes.' },
            { id: 'yag-iridotomy', name: 'YAG laser iridotomy', detail: 'Prevention and treatment for narrow-angle cases.' },
            { id: 'glaucoma-surgery', name: 'Advanced surgery & drainage devices', detail: 'When drops and laser are not enough.' },
          ],
          duration: '5 – 45 min depending on the procedure',
          recovery: 'Lifelong regular follow-up to maintain results',
        },
      ],
    },
    process: {
      title: 'A Treatment Plan Built on Precision',
      subtitle: 'We never recommend a procedure before we fully understand your eyes. These are the steps we follow with every patient.',
      steps: [
        {
          title: 'Comprehensive history',
          description: 'We start by understanding your concerns, health history, medications, work and lifestyle.',
        },
        {
          title: 'Advanced diagnostics',
          description: 'Visual acuity, eye pressure, corneal mapping, OCT imaging and optical biometry on the latest equipment.',
        },
        {
          title: 'Analysis & candidacy',
          description: 'The doctor carefully analyses all data to determine which procedures suit you — and which to avoid for your safety.',
        },
        {
          title: 'Plan & decision',
          description: 'We explain every option, its benefits and expected results, so you can decide with confidence and peace of mind.',
        },
      ],
    },
    faq: {
      title: 'Your Complete Pre- & Post-Op Guide',
      subtitle: 'Important guidance to help you prepare well and ensure a safe, speedy recovery.',
      groups: [
        {
          id: 'before',
          label: 'Before surgery',
          items: [
            {
              q: 'Should I stop wearing contact lenses before my exam?',
              a: 'Yes. Stop soft lenses one week before your exam and rigid lenses two to three weeks before, as they temporarily change the shape of the cornea and can affect the accuracy of measurements.',
            },
            {
              q: 'Do I need to fast or have tests before surgery?',
              a: 'Most eye procedures are done under local anaesthesia and don’t require fasting. Some patients may need simple tests such as blood sugar and blood pressure — we’ll tell you everything you need in advance.',
            },
            {
              q: 'Should I keep taking my usual medication?',
              a: 'Continue your usual medication unless the doctor advises otherwise, and let us know about any blood thinners or prostate medication, as they may require special precautions.',
            },
            {
              q: 'What should I bring on the day of surgery?',
              a: 'Bring your ID, previous test results and a list of your medications, plus a companion to take you home. Wear comfortable clothes and avoid make-up around the eyes.',
            },
          ],
        },
        {
          id: 'after',
          label: 'After surgery',
          items: [
            {
              q: 'When can I return to work?',
              a: 'After LASIK most patients return to office work within one to two days, and after cataract surgery within 3–5 days. Retinal surgery needs a longer period, which the doctor determines case by case.',
            },
            {
              q: 'How should I use my eye drops after surgery?',
              a: 'Follow your written drop schedule precisely, wash your hands before each use, leave at least 5 minutes between different drops, and never stop a drop without consulting the doctor.',
            },
            {
              q: 'Which activities should I avoid?',
              a: 'Avoid rubbing your eyes, swimming, dusty places and eye make-up for at least two weeks, and avoid contact sports until the doctor gives you the all-clear.',
            },
            {
              q: 'Which symptoms need immediate contact?',
              a: 'Contact us immediately if you experience severe pain, a sudden drop in vision, increasing redness, or flashes of light and a dark curtain across your vision.',
            },
          ],
        },
      ],
    },
  },

  reviews: {
    hero: {
      title: 'Our patients’ trust',
      highlight: 'is our greatest achievement',
      lead: 'Real experiences from patients who regained clear vision and quality of life.',
    },
    grid: {
      title: 'What Our Patients Say',
      subtitle: 'Stories from patients who underwent LASIK, cataract, retina surgery and advanced eye treatments.',
    },
    items: [
      {
        name: 'Ahmed M.',
        procedure: 'Femto-LASIK',
        rating: 5,
        quote:
          'I wore glasses for fifteen years. After Femto-LASIK I could see clearly the very next day. What reassured me most was how patiently the doctor explained every step.',
      },
      {
        name: 'Suad A.',
        procedure: 'Cataract & multifocal lens',
        rating: 5,
        quote:
          'I had cataract surgery on both eyes, and the colours are vivid again just like before — I can even read without glasses. Thank you to the doctor and his team for their care.',
      },
      {
        name: 'Mohamed K.',
        procedure: 'Retinal injections',
        rating: 5,
        quote:
          'My father has had diabetes for years and suffered from macular swelling. After the injection sessions and regular follow-up his vision improved noticeably. An honest, respectful doctor.',
      },
      {
        name: 'Reem S.',
        procedure: 'Corneal cross-linking',
        rating: 5,
        quote:
          'I was diagnosed with keratoconus at university and was very scared. The doctor calmly explained everything, I had cross-linking, and my cornea is stable now.',
      },
      {
        name: 'Khaled Y.',
        procedure: 'SMILE',
        rating: 5,
        quote:
          'With my job and sports routine I needed a safe solution. After thorough tests the doctor recommended SMILE — it was faster and easier than I ever expected.',
      },
      {
        name: 'Nadia F.',
        procedure: 'Dry eye therapy',
        rating: 5,
        quote:
          'I suffered from chronic dryness and burning from long hours at the computer. After IPL sessions and the treatment programme, my daily life completely changed.',
      },
      {
        name: 'Hassan A.',
        procedure: 'Glaucoma laser treatment',
        rating: 5,
        quote:
          'The doctor detected glaucoma during a routine check before I had any symptoms. I had an SLT laser session and my pressure is now under control. Grateful for his precision and honesty.',
      },
      {
        name: 'Mona R.',
        procedure: 'ICL lens implant',
        rating: 5,
        quote:
          'My prescription was very high and I was told LASIK wasn’t suitable. The doctor offered an ICL implant, and the result exceeded all my expectations.',
      },
      {
        name: 'Youssef T.',
        procedure: 'Retinal surgery',
        rating: 5,
        quote:
          'I had a sudden retinal detachment and the doctor operated quickly and professionally. The follow-up was excellent and I regained a large part of my vision.',
      },
    ],
  },

  videos: {
    hero: {
      title: 'Medical knowledge',
      highlight: 'at your fingertips',
      lead: 'Short, simple videos on the most important eye-health topics and procedures.',
    },
    grid: {
      title: 'Latest Educational Videos',
      subtitle: 'Pick the topic that matters to you and watch a short, trustworthy explanation.',
    },
    items: [
      { id: 'what-is-lasik', title: 'What is LASIK and how is it done?', category: 'Vision correction', duration: '1:45' },
      { id: 'femto-vs-smile', title: 'Femto-LASIK vs SMILE: the difference', category: 'Vision correction', duration: '2:10' },
      { id: 'cataract-timing', title: 'When does a cataract need surgery?', category: 'Cataract', duration: '1:30' },
      { id: 'choosing-iol', title: 'How to choose the right lens implant', category: 'Cataract', duration: '2:25' },
      { id: 'diabetic-retina', title: 'Diabetes and your retina', category: 'Retina', duration: '1:55' },
      { id: 'glaucoma-thief', title: 'Glaucoma: the silent thief of sight', category: 'Glaucoma', duration: '1:40' },
      { id: 'keratoconus-cxl', title: 'Keratoconus and cross-linking', category: 'Cornea', duration: '2:05' },
      { id: 'dry-eye-screens', title: 'Dry eye and screen time', category: 'Ocular surface', duration: '1:20' },
      { id: 'after-lasik-tips', title: 'Golden tips after LASIK', category: 'Tips', duration: '1:50' },
    ],
  },

  articles: {
    hero: {
      title: 'Articles that enrich',
      highlight: 'your eye-health awareness',
      lead: 'Trusted medical content in clear language to help you understand your eyes.',
    },
    featuredLabel: 'Featured article',
    grid: {
      title: 'Read with Confidence',
      subtitle: 'Selected articles answering the questions we hear most often in the clinic.',
    },
    items: [
      {
        slug: 'vision-correction-guide',
        category: 'Vision correction',
        title: 'Your Complete Guide to Vision Correction: Which Procedure Suits You?',
        excerpt:
          'Femto-LASIK, SMILE, surface ablation or ICL implants… understand the real differences between the techniques and who the ideal candidate is for each.',
        readTime: 7,
        date: '2026-09-28',
        body: [
          'Vision correction is no longer a single procedure for everyone. Today several techniques are available, differing in how they work, how quickly you recover and who they suit. Choosing the right one always starts with a precise assessment of corneal thickness, shape and prescription.',
          'Femto-LASIK creates a thin corneal flap with a laser and corrects the prescription beneath it, with a very fast recovery. SMILE works through a small incision without a flap, making it an excellent option for athletes and people with dry eyes. Surface ablation remains a safe alternative for thinner corneas.',
          'When short-sightedness is very high or the cornea is unsuitable for laser, an ICL lens implant is an effective solution that preserves corneal tissue. So don’t ask “what’s the best procedure?” — ask “what’s the best procedure for my eyes?” The answer only comes after a comprehensive exam.',
        ],
        takeaways: [
          'No single technique suits everyone',
          'Corneal thickness and shape define your options',
          'Lens implants are a safe choice for high prescriptions',
        ],
      },
      {
        slug: 'cataract-early-signs',
        category: 'Cataract',
        title: 'Cataract: Early Signs and When It’s Time for Surgery',
        excerpt: 'Blurring, glare around lights and faded colours… signs that may point to an early cataract. When is surgery the right decision?',
        readTime: 5,
        date: '2026-09-14',
        body: [
          'A cataract is the gradual clouding of the eye’s natural lens and one of the most common causes of reduced vision with age. It usually starts with mild symptoms that many people mistake for tiredness or needing new glasses.',
          'Key signs include gradually blurred vision, glare and halos around lights — especially when driving at night — faded colours and frequently changing glasses prescriptions.',
          'There’s no longer any need to wait for a cataract to “ripen”, as was once believed. Surgery is recommended when reduced vision starts affecting your daily activities. Thanks to phacoemulsification, the procedure is quick and safe, with lens options that reduce dependence on glasses.',
        ],
        takeaways: [
          'Early symptoms can feel like ordinary tiredness',
          'No need to wait for a cataract to “ripen”',
          'Modern lenses may free you from glasses',
        ],
      },
      {
        slug: 'diabetic-retinopathy-screening',
        category: 'Retina',
        title: 'Diabetes: Why an Annual Retinal Exam Is Essential',
        excerpt: 'Diabetic retinopathy can progress silently for years. Discover how regular screening protects your sight before symptoms appear.',
        readTime: 6,
        date: '2026-08-30',
        body: [
          'Chronically high blood sugar damages the tiny blood vessels of the retina, causing leakage, bleeding and swelling that can reach the centre of vision. The danger is that the early stages of diabetic retinopathy cause no symptoms at all.',
          'That’s why ophthalmologists recommend a dilated retinal exam at least once a year for everyone with diabetes — and more often during pregnancy or when blood sugar is poorly controlled. OCT imaging detects swelling at its earliest stages with high precision.',
          'When retinopathy is caught early, effective treatments such as intravitreal injections and laser preserve sight and prevent deterioration. Waiting for symptoms can mean arriving at a stage where lost vision is hard to recover.',
        ],
        takeaways: ['Early stages have no symptoms', 'Have a retinal exam at least yearly', 'Controlling sugar and blood pressure protects the retina'],
      },
      {
        slug: 'glaucoma-silent-thief',
        category: 'Glaucoma',
        title: 'Glaucoma: How to Protect Your Sight from the “Silent Thief”',
        excerpt: 'Glaucoma steals your field of vision gradually and painlessly. Learn the risk factors and why regular pressure and optic-nerve checks matter.',
        readTime: 5,
        date: '2026-08-12',
        body: [
          'Glaucoma is a group of diseases that gradually damage the optic nerve, often linked to raised eye pressure. It starts with a very slow loss of peripheral vision that patients don’t notice until advanced stages.',
          'The risk rises after the age of forty, and in people with a family history, diabetes, high myopia or long-term steroid use.',
          'Glaucoma damage cannot be reversed — but it can be stopped. With early diagnosis through pressure measurement, optic-nerve imaging and visual-field testing, drops, laser or surgery can preserve sight for life.',
        ],
        takeaways: [
          'Vision loss starts at the edges, painlessly',
          'Check your eye pressure regularly after forty',
          'Damage can’t be reversed — but it can be stopped',
        ],
      },
      {
        slug: 'keratoconus-early-diagnosis',
        category: 'Cornea',
        title: 'Keratoconus in Young People: Early Diagnosis Makes the Difference',
        excerpt: 'Frequently changing glasses and increasing astigmatism? It could be keratoconus. Learn how cross-linking halts its progression.',
        readTime: 6,
        date: '2026-07-26',
        body: [
          'Keratoconus is a condition in which the corneal fibres weaken, making the cornea thinner and gradually cone-shaped. This causes blurred vision and irregular astigmatism, and usually appears in the teenage and young-adult years.',
          'Warning signs include rapidly changing glasses prescriptions, increasing astigmatism and not achieving clear vision even with glasses. Frequent eye rubbing and allergies are among the factors most associated with its progression.',
          'Corneal cross-linking halts the disease by strengthening the bonds between corneal fibres using riboflavin (vitamin B2) and UV light. The earlier it’s performed, the better the vision we preserve — and the more likely we avoid a corneal transplant in the future.',
        ],
        takeaways: ['Usually appears in young adults', 'Avoid frequent eye rubbing', 'Early cross-linking preserves the cornea'],
      },
      {
        slug: 'dry-eye-screens',
        category: 'Ocular surface',
        title: 'Dry Eye in the Screen Era: Causes and Solutions',
        excerpt: 'Burning, a gritty feeling and tired eyes by the end of the day? Here are the causes of digital dry eye and the latest treatments.',
        readTime: 4,
        date: '2026-07-08',
        body: [
          'When we focus on screens we blink far less often than usual, causing the tear film to evaporate and leading to dry-eye symptoms such as burning, redness and intermittent blurred vision.',
          'Other factors make it worse, including air conditioning, contact lenses, certain medications and meibomian gland dysfunction in the eyelids — the most common cause of chronic dry eye.',
          'Treatment starts by identifying the exact cause, then includes suitable lubricating drops, warm compresses and the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. In chronic cases, Intense Pulsed Light (IPL) sessions deliver excellent results for gland inflammation.',
        ],
        takeaways: ['Screens reduce your blink rate', 'Follow the 20-20-20 rule', 'IPL is an effective option for chronic dry eye'],
      },
      {
        slug: 'glasses-lenses-or-lasik',
        category: 'Vision correction',
        title: 'Glasses, Contact Lenses or LASIK? A Practical Comparison',
        excerpt: 'Each option has its benefits and limits. A clear comparison to help you choose what suits your eyes and lifestyle.',
        readTime: 5,
        date: '2026-06-20',
        body: [
          'Glasses remain the safest and simplest option, but they can be inconvenient during sports or in certain professions, and they don’t provide a full peripheral field of view.',
          'Contact lenses provide natural vision and a wider field of view, but they require strict hygiene and can cause dryness or infections if misused or worn overnight.',
          'Vision-correction surgery offers a long-term solution that frees you from both glasses and contacts — provided you’re a suitable candidate after examination. The best decision balances the safety of your eyes with the needs of your daily life.',
        ],
        takeaways: [
          'Glasses: the safest and simplest',
          'Contact lenses: require strict care',
          'LASIK: a long-term solution for the right candidate',
        ],
      },
    ],
  },

  contact: {
    hero: {
      title: 'Book your visit',
      highlight: 'in a few simple steps',
      lead: 'By phone, on WhatsApp or with our quick booking form.',
    },
    form: {
      title: 'Consultation Booking Form',
      subtitle: 'Fill in your details and you’ll be taken straight to WhatsApp to confirm your appointment.',
      name: 'Full name',
      namePlaceholder: 'Your name',
      phone: 'Phone number',
      phonePlaceholder: '+20 1xx xxx xxxx',
      date: 'Preferred date',
      type: 'Consultation type',
      typePlaceholder: 'Select a consultation type',
      types: [
        'General check-up & full eye exam',
        'LASIK & vision correction consultation',
        'Cataract & lens implantation',
        'Retina & intravitreal injections',
        'Glaucoma',
        'Keratoconus',
        'Dry eye',
        'Post-operative follow-up',
      ],
      notes: 'Additional notes (optional)',
      notesPlaceholder: 'Briefly describe your concern…',
      submit: 'Send via WhatsApp',
      privacy: 'Your details are sent to the clinic via WhatsApp and stored securely, only to follow up on your request.',
      errors: {
        name: 'Please enter your name (at least 2 characters).',
        phone: 'Please enter a valid phone number.',
        date: 'Please choose a valid date (today or later).',
        type: 'Please select a consultation type.',
      },
      successTitle: 'Your message is ready!',
      successText: 'We opened a WhatsApp chat with your pre-filled message. If it didn’t open automatically, tap the button below.',
      openWhatsapp: 'Open WhatsApp',
      newRequest: 'New request',
      message: {
        intro: 'Hello Dr. Ezzat Ali,\nI would like to book a consultation with the following details:',
        name: 'Name',
        phone: 'Phone',
        date: 'Preferred date',
        type: 'Consultation type',
        notes: 'Notes',
        outro: 'Thank you.',
      },
    },
    info: {
      title: 'Visit Our Clinic',
      address: 'Address',
      phones: 'Phone',
      emergency: 'Emergencies',
      email: 'Email',
      hours: 'Opening hours',
      directions: 'Get directions',
      mapTitle: 'Clinic location on Google Maps',
    },
  },
};

export default en;
