import type {
  CommunitySlug,
  Language,
  OpportunityCategory,
  PostType,
  ProjectStatus,
  ProjectTrack,
  TalentDomainKey,
  UserRole,
} from '../types/platform';

export const UZBEKISTAN_REGIONS = [
  'Navoiy viloyati',
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand viloyati',
  'Buxoro viloyati',
  'Farg‘ona viloyati',
  'Andijon viloyati',
  'Namangan viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Jizzax viloyati',
  'Sirdaryo viloyati',
  'Xorazm viloyati',
  'Qoraqalpog‘iston Respublikasi',
] as const;

export const NAVOI_DISTRICTS = [
  'Navoiy shahri',
  'Zarafshon shahri',
  'G‘ozg‘on shahri',
  'Karmana tumani',
  'Qiziltepa tumani',
  'Navbahor tumani',
  'Nurota tumani',
  'Xatirchi tumani',
  'Konimex tumani',
  'Tomdi tumani',
  'Uchquduq tumani',
] as const;

export const GRADES = ['7-sinf', '8-sinf', '9-sinf', '10-sinf', '11-sinf', 'Ustoz / Mentor', 'Koordinator'] as const;

export interface TranslationBundle {
  nav: {
    talentMap: string;
    schoolHack: string;
    knowledgeBridge: string;
    opportunityRelay: string;
    dashboard: string;
    admin: string;
    signIn: string;
    signOut: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    mission: string;
    ctaExplore: string;
    ctaDiscover: string;
    ctaProject: string;
    launchBadge: string;
  };
  home: {
    modulesTitle: string;
    modulesSubtitle: string;
    openModule: string;
    pathTitle: string;
    pathSteps: string[];
    scalabilityTitle: string;
    scalabilitySubtitle: string;
    activeStatus: string;
    inDevelopmentStatus: string;
    principlesTitle: string;
    principlesItems: string[];
    visionTitle: string;
    visionSubtitle: string;
    aboutTitle: string;
    aboutBody: string;
  };
  modules: {
    talentMap: { code: string; title: string; tagline: string; desc: string };
    schoolHack: { code: string; title: string; tagline: string; desc: string };
    knowledgeBridge: { code: string; title: string; tagline: string; desc: string };
    opportunityRelay: { code: string; title: string; tagline: string; desc: string };
  };
  domains: Record<TalentDomainKey, { label: string; short: string; desc: string }>;
  tracks: Record<ProjectTrack, string>;
  projectStatus: Record<ProjectStatus, string>;
  communities: Record<CommunitySlug, string>;
  postTypes: Record<PostType, string>;
  opportunityCategories: Record<OpportunityCategory, string>;
  roles: Record<UserRole, string>;
  talentMapPage: {
    title: string;
    subtitle: string;
    likertLabels: [string, string, string, string, string];
    progressLabel: string;
    submitTest: string;
    savingTest: string;
    retakeTest: string;
    signInPrompt: string;
    resultTitle: string;
    primaryStrength: string;
    secondaryStrength: string;
    aiAnalyzeBtn: string;
    aiAnalyzing: string;
    aiSummaryTitle: string;
    aiRoadmapTitle: string;
    aiIdeasTitle: string;
    startProjectFromIdea: string;
    historyTitle: string;
    noResultsYet: string;
    answerAllNotice: string;
    deterministicNotice: string;
  };
  schoolHackPage: {
    title: string;
    subtitle: string;
    newProject: string;
    allPublic: string;
    myProjects: string;
    createTitle: string;
    editTitle: string;
    fieldTitle: string;
    fieldTrack: string;
    fieldSummary: string;
    fieldProblem: string;
    fieldSolution: string;
    fieldVisibility: string;
    publicLabel: string;
    privateLabel: string;
    teamSection: string;
    addMemberPlaceholder: string;
    addMemberBtn: string;
    tasksSection: string;
    taskTitlePlaceholder: string;
    taskAssigneePlaceholder: string;
    addTaskBtn: string;
    saveDraft: string;
    submitProject: string;
    deleteProject: string;
    cancel: string;
    aiReviewBtn: string;
    aiReviewLoading: string;
    aiReviewTitle: string;
    emptyProjects: string;
    progressLabel: string;
    moderatorFeedback: string;
    approvedLockedNotice: string;
  };
  knowledgeBridgePage: {
    title: string;
    subtitle: string;
    newPost: string;
    allCommunities: string;
    fieldCommunity: string;
    fieldType: string;
    fieldTitle: string;
    fieldContent: string;
    fieldEventDate: string;
    publishBtn: string;
    commentsTitle: string;
    commentPlaceholder: string;
    sendComment: string;
    emptyPosts: string;
    signInToParticipate: string;
  };
  opportunityRelayPage: {
    title: string;
    subtitle: string;
    verificationPolicy: string;
    allCategories: string;
    saveOpportunity: string;
    savedLabel: string;
    verifiedBy: string;
    sourceLabel: string;
    eligibilityLabel: string;
    deadlineLabel: string;
    emptyOpportunities: string;
  };
  dashboardPage: {
    title: string;
    subtitle: string;
    tabs: {
      profile: string;
      talent: string;
      projects: string;
      activities: string;
      saved: string;
      notifications: string;
    };
    saveProfile: string;
    savedSuccess: string;
    regionLabel: string;
    districtLabel: string;
    schoolLabel: string;
    gradeLabel: string;
    bioLabel: string;
    interestsLabel: string;
    roleLabel: string;
    markRead: string;
    noNotifications: string;
    noSaved: string;
    noActivities: string;
    signInRequired: string;
  };
  adminPage: {
    title: string;
    subtitle: string;
    accessDenied: string;
    realStatsNotice: string;
    stats: {
      users: string;
      talentTests: string;
      projects: string;
      communityPosts: string;
      verifiedOpportunities: string;
    };
    tabs: {
      overview: string;
      users: string;
      projects: string;
      questions: string;
      opportunities: string;
      posts: string;
      settings: string;
    };
    publishOpportunityTitle: string;
    addQuestionTitle: string;
    seedDefaultQuestions: string;
    approveBtn: string;
    requestRevisionBtn: string;
    archiveBtn: string;
    restoreBtn: string;
    saveSettings: string;
  };
  common: {
    loading: string;
    signInGoogle: string;
    errorPrefix: string;
    close: string;
    edit: string;
    view: string;
    searchPlaceholder: string;
    inDevelopment: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  uz: {
    nav: {
      talentMap: 'Talent Map',
      schoolHack: 'School Hack 72',
      knowledgeBridge: 'Knowledge Bridge',
      opportunityRelay: 'Opportunity Relay',
      dashboard: 'Kabinet',
      admin: 'Admin',
      signIn: 'Kirish',
      signOut: 'Chiqish',
    },
    hero: {
      eyebrow: 'Navoiy viloyatidan butun O‘zbekistongacha — Raqamli Ta’lim Ekotizimi',
      headline: 'FROM POTENTIAL TO REAL IMPACT.',
      subheadline: 'Har bir iqtidor munosib imkoniyatga ega bo‘lishi kerak.',
      mission:
        '7–11-sinf o‘quvchilari uchun o‘z kuchli tomonlarini aniqlash, amaliy loyihalar yaratish, viloyatlararo bilim almashish va tasdiqlangan imkoniyatlarga chiqish uchun yagona raqamli infratuzilma.',
      ctaExplore: 'Explore Platform',
      ctaDiscover: 'Discover Your Talent',
      ctaProject: 'Start a Project',
      launchBadge: 'Boshlang‘ich hudud: Navoiy viloyati · Milliy miqyoslash arxitekturasi',
    },
    home: {
      modulesTitle: 'To‘rtta o‘zaro bog‘langan asosiy modul',
      modulesSubtitle:
        'Har bir modul o‘quvchini nazariy qiziqishdan amaliy yechim, jamoaviy ish va real natijagacha izchil olib boradi.',
      openModule: 'Modulga o‘tish',
      pathTitle: 'Rivojlanish trayektoriyasi',
      pathSteps: ['DISCOVER', 'DEVELOP', 'CREATE', 'CONNECT', 'ACHIEVE IMPACT'],
      scalabilityTitle: 'Milliy miqyosdagi kengayuvchan arxitektura',
      scalabilitySubtitle:
        'Platforma yangi yo‘nalishlarni bosqichma-bosqich ulashga mo‘ljallangan. Hali ishga tushmagan yo‘nalishlar shaffof tarzda «Ishlab chiqilmoqda» deb belgilanadi.',
      activeStatus: 'Faol',
      inDevelopmentStatus: 'Ishlab chiqilmoqda',
      principlesTitle: 'Shaffoflik va haqiqiy ma’lumotlar tamoyili',
      principlesItems: [
        'Soxta reytinglar va sun’iy yutuqlar ko‘rsatilmaydi.',
        'TALENT MAP natijalari faqat o‘quvchining haqiqiy test javoblari asosida hisoblanadi.',
        'OPPORTUNITY RELAY bo‘limida faqat tekshirilgan va manbasi ko‘rsatilgan imkoniyatlar chop etiladi.',
        'Platforma statistikasi faqat ma’lumotlar bazasidagi haqiqiy yozuvlarni aks ettiradi.',
      ],
      visionTitle: 'EVERY TALENT DESERVES AN OPPORTUNITY.',
      visionSubtitle:
        'TALENT TO IMPACT — o‘quvchi shunchaki bilim iste’molchisi emas, balki tadqiqotchi, muhandis va o‘z hududi uchun real yechim yaratuvchiga aylanadigan tizim.',
      aboutTitle: 'Ekotizim haqida',
      aboutBody:
        'TALENT TO IMPACT ta’lim, sun’iy intellekt, tadbirkorlik, innovatsiya, liderlik, loyiha boshqaruvi, tarmoq aloqalari va mentorlikni yagona raqamli muhitda birlashtiradi. Navoiy viloyatida boshlanib, O‘zbekistonning barcha maktablari uchun ochiq arxitektura asosida yaratilgan.',
    },
    modules: {
      talentMap: {
        code: '01. TALENT MAP',
        title: 'Discover Your Potential',
        tagline: 'Qiziqishlar va qobiliyatlarning intellektual diagnostikasi',
        desc: 'Haqiqiy savollar asosida 6 ta asosiy yo‘nalish bo‘yicha shaxsiy xarita va sun’iy intellekt yordamida rivojlanish rejasi.',
      },
      schoolHack: {
        code: '02. SCHOOL HACK 72',
        title: 'Turn Ideas Into Projects',
        tagline: 'G‘oyadan real loyiha va jamoaviy ishlanmagacha',
        desc: 'Muammo va yechimni shakllantiring, jamoa va vazifalarni boshqaring, taraqqiyotni kuzating va loyihangizni taqdim eting.',
      },
      knowledgeBridge: {
        code: '03. KNOWLEDGE BRIDGE',
        title: 'Connect. Learn. Share.',
        tagline: 'Hududlar va maktablararo bilim hamjamiyati',
        desc: 'Mavzuli jamoalar, ta’lim materiallari, ochiq debatlar va maktablararo tadbirlar orqali o‘quvchilarni bog‘lovchi muhit.',
      },
      opportunityRelay: {
        code: '04. OPPORTUNITY RELAY',
        title: 'Discover Opportunities',
        tagline: 'Faqat tasdiqlangan olimpiada, grant va mentorlik dasturlari',
        desc: 'Koordinatorlar tomonidan manbasi tekshirilgan ta’lim dasturlari, tanlovlar, amaliyotlar va mentorlik imkoniyatlari.',
      },
    },
    domains: {
      ai_engineering: {
        label: 'AI & Muhandislik',
        short: 'AI / Eng',
        desc: 'Algoritmlar, dasturlash, sun’iy intellekt va texnik tizimlar.',
      },
      research_science: {
        label: 'Ilmiy Tadqiqot',
        short: 'Fan',
        desc: 'Tajriba, tahlil, matematika va tabiiy fanlar.',
      },
      entrepreneurship: {
        label: 'Tadbirkorlik',
        short: 'Startap',
        desc: 'Mahsulot yaratish, resurslarni rejalashtirish va amaliy qiymat.',
      },
      leadership: {
        label: 'Liderlik',
        short: 'Liderlik',
        desc: 'Jamoa koordinatsiyasi, qaror qabul qilish va strategik boshqaruv.',
      },
      design_architecture: {
        label: 'Dizayn & Arxitektura',
        short: 'Dizayn',
        desc: 'Tizim prototiplash, vizual tafakkur va muhandislik dizayni.',
      },
      social_impact: {
        label: 'Ijtimoiy Ta’sir',
        short: 'Ta’sir',
        desc: 'Jamiyat muammolarini hal qilish, ta’lim va kommunikatsiya.',
      },
    },
    tracks: {
      ai_engineering: 'AI & Muhandislik',
      research_science: 'Tadqiqot va Fan',
      entrepreneurship: 'Tadbirkorlik',
      leadership: 'Liderlik tashabbusi',
      ecology_smart_city: 'Ekologiya va Aqlli shahar',
      education_tech: 'Ta’lim texnologiyalari (EdTech)',
    },
    projectStatus: {
      draft: 'Qoralama',
      in_progress: 'Jarayonda',
      submitted: 'Tekshiruvga yuborildi',
      approved: 'Tasdiqlangan',
      revision_needed: 'Qayta ishlash kerak',
    },
    communities: {
      ai_engineering: 'AI & Engineering',
      research_science: 'Research & Science',
      entrepreneurship: 'Entrepreneurship',
      leadership: 'Leadership & Debate',
      navoi_schools: 'Navoiy Maktablari Tarmog‘i',
    },
    postTypes: {
      material: 'Ta’lim materiali',
      debate: 'Debat / Muhokama',
      event: 'Tadbir / Uchrashuv',
    },
    opportunityCategories: {
      program: 'Ta’lim dasturi',
      olympiad: 'Olimpiada / Tanlov',
      internship: 'Amaliyot',
      mentorship: 'Mentorlik',
      entrepreneurship: 'Tadbirkorlik',
    },
    roles: {
      student: 'O‘quvchi',
      mentor: 'Mentor / Ustoz',
      coordinator: 'Maktab koordinatori',
      admin: 'Administrator',
    },
    talentMapPage: {
      title: 'TALENT MAP',
      subtitle: 'Har bir bayonotga samimiy baho bering. Natijalar faqat sizning haqiqiy javoblaringiz asosida hisoblanadi.',
      likertLabels: ['Umuman mos emas', 'Kam mos', 'O‘rtacha', 'Mos keladi', 'To‘liq mos'],
      progressLabel: 'Javob berilgan savollar',
      submitTest: 'Natijani hisoblash va saqlash',
      savingTest: 'Saqlanmoqda...',
      retakeTest: 'Testni qayta topshirish',
      signInPrompt: 'Natijangizni shaxsiy kabinetda saqlash va AI rivojlanish xaritasini olish uchun hisobingizga kiring.',
      resultTitle: 'Shaxsiy TALENT MAP natijangiz',
      primaryStrength: 'Asosiy yo‘nalish',
      secondaryStrength: 'Qo‘shimcha kuchli yo‘nalish',
      aiAnalyzeBtn: 'Gemini AI orqali rivojlanish xaritasini tuzish',
      aiAnalyzing: 'Gemini tahlil qilmoqda...',
      aiSummaryTitle: 'Intellektual tahlil',
      aiRoadmapTitle: 'Shaxsiy rivojlanish qadamlari',
      aiIdeasTitle: 'SCHOOL HACK 72 uchun loyiha g‘oyalari',
      startProjectFromIdea: 'Shu g‘oyadan loyiha boshlash',
      historyTitle: 'Oldingi test natijalaringiz',
      noResultsYet: 'Hali saqlangan test natijalari yo‘q.',
      answerAllNotice: 'Aniq natija uchun barcha savollarga javob bering.',
      deterministicNotice: 'Hisoblash shaffofligi: barcha foizlar faqat siz belgilagan javoblarning o‘rtacha qiymatidan aniqlanadi.',
    },
    schoolHackPage: {
      title: 'SCHOOL HACK 72',
      subtitle: 'G‘oyani aniq muammo, yechim, jamoa va bajariladigan vazifalar rejasiga aylantiring.',
      newProject: 'Yangi loyiha yaratish',
      allPublic: 'Ochiq loyihalar',
      myProjects: 'Mening loyihalarim',
      createTitle: 'Yangi loyiha pasporti',
      editTitle: 'Loyihani tahrirlash',
      fieldTitle: 'Loyiha nomi',
      fieldTrack: 'Yo‘nalish',
      fieldSummary: 'Qisqa tavsif',
      fieldProblem: 'Hal qilinayotgan muammo',
      fieldSolution: 'Taklif etilayotgan yechim',
      fieldVisibility: 'Ko‘rinish darajasi',
      publicLabel: 'Ochiq (hamjamiyat ko‘radi)',
      privateLabel: 'Shaxsiy (faqat siz)',
      teamSection: 'Jamoa a’zolari (8 tagacha)',
      addMemberPlaceholder: 'Ism va roli (masalan: Sardor — Frontend)',
      addMemberBtn: 'Qo‘shish',
      tasksSection: 'Vazifalar ro‘yxati (25 tagacha)',
      taskTitlePlaceholder: 'Vazifa nomi',
      taskAssigneePlaceholder: 'Mas’ul a’zo',
      addTaskBtn: 'Vazifa qo‘shish',
      saveDraft: 'Saqlash',
      submitProject: 'Moderatsiyaga yuborish',
      deleteProject: 'O‘chirish',
      cancel: 'Bekor qilish',
      aiReviewBtn: 'Gemini AI texnik sharhini olish',
      aiReviewLoading: 'Loyiha tahlil qilinmoqda...',
      aiReviewTitle: 'Gemini AI loyiha tahlili',
      emptyProjects: 'Hozircha bu bo‘limda loyihalar yo‘q. Birinchi amaliy loyihangizni boshlang.',
      progressLabel: 'Vazifalar bajarilishi',
      moderatorFeedback: 'Koordinator izohi',
      approvedLockedNotice: 'Loyiha tasdiqlangan. Tasdiqlangan loyihani faqat koordinator/admin o‘zgartira oladi.',
    },
    knowledgeBridgePage: {
      title: 'KNOWLEDGE BRIDGE',
      subtitle: 'Maktablar va hududlar o‘rtasida bilim almashish, debatlar va ochiq ta’lim tadbirlari makoni.',
      newPost: 'Material yoki debat yaratish',
      allCommunities: 'Barcha hamjamiyatlar',
      fieldCommunity: 'Hamjamiyat',
      fieldType: 'Turi',
      fieldTitle: 'Sarlavha',
      fieldContent: 'Mazmun',
      fieldEventDate: 'Tadbir sanasi (ixtiyoriy)',
      publishBtn: 'Nashr etish',
      commentsTitle: 'Muhokama',
      commentPlaceholder: 'Fikringiz yoki savolingizni yozing...',
      sendComment: 'Yuborish',
      emptyPosts: 'Tanlangan hamjamiyatda hali materiallar yo‘q. Birinchi bo‘lib bilim ulashing.',
      signInToParticipate: 'Material joylash va muhokamalarda qatnashish uchun tizimga kiring.',
    },
    opportunityRelayPage: {
      title: 'OPPORTUNITY RELAY',
      subtitle: 'Olimpiadalar, ta’lim dasturlari, amaliyotlar va mentorlik bo‘yicha tasdiqlangan imkoniyatlar.',
      verificationPolicy:
        'Faqat tasdiqlangan ma’lumotlar: ushbu bo‘limdagi har bir e’lon administrator yoki maktab koordinatori tomonidan rasmiy manbasi tekshirilgandan so‘ng chop etiladi.',
      allCategories: 'Barcha yo‘nalishlar',
      saveOpportunity: 'Saqlash',
      savedLabel: 'Saqlangan',
      verifiedBy: 'Tasdiqladi',
      sourceLabel: 'Tasdiqlash manbasi',
      eligibilityLabel: 'Kimlar qatnasha oladi',
      deadlineLabel: 'Oxirgi muddat',
      emptyOpportunities:
        'Hozircha tasdiqlangan imkoniyatlar e’lon qilinmagan. Administrator yoki koordinator tasdiqlangan dastur qo‘shishi bilan bu yerda paydo bo‘ladi.',
    },
    dashboardPage: {
      title: 'Shaxsiy kabinet',
      subtitle: 'Profil, TALENT MAP tarixi, loyihalar, hamjamiyat faolligi va saqlangan imkoniyatlar.',
      tabs: {
        profile: 'Profil',
        talent: 'Talent Map',
        projects: 'Loyihalarim',
        activities: 'Faollik',
        saved: 'Saqlanganlar',
        notifications: 'Bildirishnomalar',
      },
      saveProfile: 'Profilni saqlash',
      savedSuccess: 'Profil muvaffaqiyatli yangilandi.',
      regionLabel: 'Viloyat / Hudud',
      districtLabel: 'Tuman / Shahar',
      schoolLabel: 'Maktab / Ta’lim muassasasi',
      gradeLabel: 'Sinf / Maqom',
      bioLabel: 'O‘zingiz haqingizda',
      interestsLabel: 'Qiziqishlar (vergul bilan ajrating)',
      roleLabel: 'Tizimdagi rol',
      markRead: 'O‘qilgan deb belgilash',
      noNotifications: 'Yangi bildirishnomalar yo‘q.',
      noSaved: 'Saqlangan imkoniyatlar yo‘q.',
      noActivities: 'Hali e’lon qilingan material yoki debatlar yo‘q.',
      signInRequired: 'Shaxsiy kabinetga kirish uchun Google hisobingiz bilan avtorizatsiyadan o‘ting.',
    },
    adminPage: {
      title: 'Boshqaruv paneli',
      subtitle: 'Foydalanuvchilar, loyihalar moderatsiyasi, test savollari va tasdiqlangan imkoniyatlarni boshqarish.',
      accessDenied: 'Ushbu bo‘lim faqat Administrator va Koordinator rollari uchun ochiq.',
      realStatsNotice: 'Barcha ko‘rsatkichlar real vaqtda Firestore bazasidagi haqiqiy yozuvlar sonidan hisoblanadi.',
      stats: {
        users: 'Foydalanuvchilar',
        talentTests: 'Topshirilgan testlar',
        projects: 'O‘quvchi loyihalari',
        communityPosts: 'Hamjamiyat postlari',
        verifiedOpportunities: 'Tasdiqlangan imkoniyatlar',
      },
      tabs: {
        overview: 'Statistika',
        users: 'Foydalanuvchilar',
        projects: 'Loyihalar',
        questions: 'Talent Map test',
        opportunities: 'Imkoniyatlar',
        posts: 'Kontent',
        settings: 'Sozlamalar',
      },
      publishOpportunityTitle: 'Tasdiqlangan imkoniyat e’lon qilish',
      addQuestionTitle: 'Yangi diagnostika savoli qo‘shish',
      seedDefaultQuestions: '12 ta bazaviy savolni bazaga yuklash',
      approveBtn: 'Tasdiqlash',
      requestRevisionBtn: 'Qayta ishlashga qaytarish',
      archiveBtn: 'Arxivlash',
      restoreBtn: 'Tiklash',
      saveSettings: 'Sozlamalarni saqlash',
    },
    common: {
      loading: 'Yuklanmoqda...',
      signInGoogle: 'Google orqali kirish',
      errorPrefix: 'Xatolik',
      close: 'Yopish',
      edit: 'Tahrirlash',
      view: 'Ko‘rish',
      searchPlaceholder: 'Qidiruv...',
      inDevelopment: 'Ishlab chiqilmoqda',
    },
  },
  ru: {
    nav: {
      talentMap: 'Talent Map',
      schoolHack: 'School Hack 72',
      knowledgeBridge: 'Knowledge Bridge',
      opportunityRelay: 'Opportunity Relay',
      dashboard: 'Кабинет',
      admin: 'Админ',
      signIn: 'Войти',
      signOut: 'Выйти',
    },
    hero: {
      eyebrow: 'От Навоийской области ко всему Узбекистану — Цифровая образовательная экосистема',
      headline: 'FROM POTENTIAL TO REAL IMPACT.',
      subheadline: 'Каждый талант заслуживает возможности.',
      mission:
        'Единая цифровая инфраструктура для школьников 7–11 классов: диагностика сильных сторон, создание практических проектов, межшкольный обмен знаниями и доступ к проверенным возможностям.',
      ctaExplore: 'Explore Platform',
      ctaDiscover: 'Discover Your Talent',
      ctaProject: 'Start a Project',
      launchBadge: 'Точка запуска: Навоийская область · Архитектура национального масштабирования',
    },
    home: {
      modulesTitle: 'Четыре взаимосвязанных модуля экосистемы',
      modulesSubtitle:
        'Каждый модуль последовательно ведёт школьника от выявления потенциала к командной разработке и реальному результату.',
      openModule: 'Открыть модуль',
      pathTitle: 'Траектория развития участника',
      pathSteps: ['DISCOVER', 'DEVELOP', 'CREATE', 'CONNECT', 'ACHIEVE IMPACT'],
      scalabilityTitle: 'Масштабируемая национальная архитектура',
      scalabilitySubtitle:
        'Платформа спроектирована для подключения новых образовательных треков. Незапущенные направления честно обозначены статусом «В разработке».',
      activeStatus: 'Активен',
      inDevelopmentStatus: 'В разработке',
      principlesTitle: 'Принципы достоверности и прозрачности',
      principlesItems: [
        'Никаких фиктивных рейтингов и вымышленных достижений пользователей.',
        'Результаты TALENT MAP рассчитываются строго по реальным ответам тестирования.',
        'В OPPORTUNITY RELAY публикуются только подтверждённые программы с указанием источника.',
        'Статистика платформы отражает исключительно фактические записи в базе данных.',
      ],
      visionTitle: 'EVERY TALENT DESERVES AN OPPORTUNITY.',
      visionSubtitle:
        'TALENT TO IMPACT — среда, в которой школьник перестаёт быть пассивным слушателем и становится исследователем, инженером и автором реальных решений.',
      aboutTitle: 'О цифровой экосистеме',
      aboutBody:
        'TALENT TO IMPACT объединяет образование, искусственный интеллект, предпринимательство, инновации, лидерство, проектную деятельность, нетворкинг и наставничество. Проект стартует в Навоийской области с архитектурой для масштабирования на все регионы Узбекистана.',
    },
    modules: {
      talentMap: {
        code: '01. TALENT MAP',
        title: 'Discover Your Potential',
        tagline: 'Интеллектуальная диагностика интересов и способностей',
        desc: 'Реальное тестирование по 6 ключевым направлениям, радар-профиль и персональная карта развития на базе ИИ.',
      },
      schoolHack: {
        code: '02. SCHOOL HACK 72',
        title: 'Turn Ideas Into Projects',
        tagline: 'От идеи до рабочего прототипа и командной реализации',
        desc: 'Сформулируйте проблему и решение, соберите команду, ведите список задач, отслеживайте прогресс и получите технический разбор.',
      },
      knowledgeBridge: {
        code: '03. KNOWLEDGE BRIDGE',
        title: 'Connect. Learn. Share.',
        tagline: 'Межшкольная образовательная и коммуникационная среда',
        desc: 'Тематические сообщества, публикация материалов, открытые дебаты и региональные образовательные мероприятия.',
      },
      opportunityRelay: {
        code: '04. OPPORTUNITY RELAY',
        title: 'Discover Opportunities',
        tagline: 'Проверенные олимпиады, программы, стажировки и наставничество',
        desc: 'Только подтверждённые координаторами и администраторами возможности с прозрачным источником верификации.',
      },
    },
    domains: {
      ai_engineering: {
        label: 'ИИ и Инженерия',
        short: 'ИИ / Инж',
        desc: 'Алгоритмы, программирование, искусственный интеллект и цифровые системы.',
      },
      research_science: {
        label: 'Наука и Исследования',
        short: 'Наука',
        desc: 'Эксперименты, гипотезы, математика и естественные науки.',
      },
      entrepreneurship: {
        label: 'Предпринимательство',
        short: 'Стартап',
        desc: 'Создание продуктов, планирование ресурсов и практическая ценность.',
      },
      leadership: {
        label: 'Лидерство',
        short: 'Лидерство',
        desc: 'Координация команды, ответственность и принятие решений.',
      },
      design_architecture: {
        label: 'Дизайн и Архитектура',
        short: 'Дизайн',
        desc: 'Прототипирование, системная структура и визуальное моделирование.',
      },
      social_impact: {
        label: 'Социальное влияние',
        short: 'Влияние',
        desc: 'Образовательные инициативы, дебаты и развитие локального сообщества.',
      },
    },
    tracks: {
      ai_engineering: 'ИИ и Инженерия',
      research_science: 'Исследования и Наука',
      entrepreneurship: 'Предпринимательство',
      leadership: 'Лидерская инициатива',
      ecology_smart_city: 'Экология и Умный город',
      education_tech: 'Образовательные технологии (EdTech)',
    },
    projectStatus: {
      draft: 'Черновик',
      in_progress: 'В работе',
      submitted: 'На модерации',
      approved: 'Одобрен',
      revision_needed: 'Нужна доработка',
    },
    communities: {
      ai_engineering: 'AI & Engineering',
      research_science: 'Research & Science',
      entrepreneurship: 'Entrepreneurship',
      leadership: 'Leadership & Debate',
      navoi_schools: 'Сеть школ Навои',
    },
    postTypes: {
      material: 'Учебный материал',
      debate: 'Дебаты / Дискуссия',
      event: 'Мероприятие',
    },
    opportunityCategories: {
      program: 'Образовательная программа',
      olympiad: 'Олимпиада / Конкурс',
      internship: 'Стажировка',
      mentorship: 'Наставничество',
      entrepreneurship: 'Предпринимательство',
    },
    roles: {
      student: 'Школьник',
      mentor: 'Наставник / Учитель',
      coordinator: 'Школьный координатор',
      admin: 'Администратор',
    },
    talentMapPage: {
      title: 'TALENT MAP',
      subtitle: 'Оцените каждое утверждение честно. Профиль рассчитывается строго на основе ваших реальных ответов.',
      likertLabels: ['Совсем не про меня', 'Скорее нет', 'Нейтрально', 'Скорее да', 'Полностью про меня'],
      progressLabel: 'Отвечено вопросов',
      submitTest: 'Рассчитать и сохранить результат',
      savingTest: 'Сохранение...',
      retakeTest: 'Пройти тест заново',
      signInPrompt: 'Войдите в аккаунт, чтобы сохранить результаты в личном кабинете и получить ИИ-карту развития.',
      resultTitle: 'Ваш профиль TALENT MAP',
      primaryStrength: 'Ведущее направление',
      secondaryStrength: 'Второе сильное направление',
      aiAnalyzeBtn: 'Сформировать карту развития через Gemini AI',
      aiAnalyzing: 'Gemini анализирует профиль...',
      aiSummaryTitle: 'Аналитический вывод',
      aiRoadmapTitle: 'Персональные шаги развития',
      aiIdeasTitle: 'Идеи проектов для SCHOOL HACK 72',
      startProjectFromIdea: 'Создать проект по этой идее',
      historyTitle: 'История ваших тестирований',
      noResultsYet: 'Сохранённых результатов пока нет.',
      answerAllNotice: 'Пожалуйста, ответьте на все вопросы для точного расчёта.',
      deterministicNotice: 'Прозрачность расчёта: все показатели вычисляются детерминированно исключительно из ваших ответов.',
    },
    schoolHackPage: {
      title: 'SCHOOL HACK 72',
      subtitle: 'Превратите идею в структурированный проект с проблемой, решением, командой и трекером задач.',
      newProject: 'Создать проект',
      allPublic: 'Открытые проекты',
      myProjects: 'Мои проекты',
      createTitle: 'Паспорт нового проекта',
      editTitle: 'Редактирование проекта',
      fieldTitle: 'Название проекта',
      fieldTrack: 'Направление',
      fieldSummary: 'Краткое описание',
      fieldProblem: 'Определение проблемы',
      fieldSolution: 'Предлагаемое решение',
      fieldVisibility: 'Видимость',
      publicLabel: 'Публичный (виден сообществу)',
      privateLabel: 'Приватный (только вы)',
      teamSection: 'Участники команды (до 8)',
      addMemberPlaceholder: 'Имя и роль (например: Азиза — Исследователь)',
      addMemberBtn: 'Добавить',
      tasksSection: 'Задачи проекта (до 25)',
      taskTitlePlaceholder: 'Название задачи',
      taskAssigneePlaceholder: 'Ответственный',
      addTaskBtn: 'Добавить задачу',
      saveDraft: 'Сохранить',
      submitProject: 'Отправить на модерацию',
      deleteProject: 'Удалить',
      cancel: 'Отмена',
      aiReviewBtn: 'Получить технический разбор от Gemini AI',
      aiReviewLoading: 'Анализ архитектуры проекта...',
      aiReviewTitle: 'Экспертный разбор Gemini AI',
      emptyProjects: 'В этом разделе пока нет проектов. Создайте свой первый практический проект.',
      progressLabel: 'Прогресс выполнения задач',
      moderatorFeedback: 'Комментарий координатора',
      approvedLockedNotice: 'Проект одобрен. Вносить изменения в одобренный проект может только координатор или администратор.',
    },
    knowledgeBridgePage: {
      title: 'KNOWLEDGE BRIDGE',
      subtitle: 'Пространство для межшкольного обмена знаниями, научных дебатов и образовательных событий.',
      newPost: 'Опубликовать материал или дебат',
      allCommunities: 'Все сообщества',
      fieldCommunity: 'Сообщество',
      fieldType: 'Формат',
      fieldTitle: 'Заголовок',
      fieldContent: 'Содержание',
      fieldEventDate: 'Дата мероприятия (опционально)',
      publishBtn: 'Опубликовать',
      commentsTitle: 'Обсуждение',
      commentPlaceholder: 'Напишите ваш аргумент или вопрос...',
      sendComment: 'Отправить',
      emptyPosts: 'В выбранном сообществе пока нет публикаций. Поделитесь знаниями первым.',
      signInToParticipate: 'Войдите в аккаунт, чтобы публиковать материалы и участвовать в обсуждениях.',
    },
    opportunityRelayPage: {
      title: 'OPPORTUNITY RELAY',
      subtitle: 'Подтверждённые олимпиады, образовательные программы, стажировки и наставничество.',
      verificationPolicy:
        'Только подтверждённые данные: каждая запись публикуется администратором или координатором исключительно после проверки официального источника.',
      allCategories: 'Все категории',
      saveOpportunity: 'Сохранить',
      savedLabel: 'Сохранено',
      verifiedBy: 'Проверил',
      sourceLabel: 'Источник подтверждения',
      eligibilityLabel: 'Условия участия',
      deadlineLabel: 'Дедлайн',
      emptyOpportunities:
        'Подтверждённые возможности пока не опубликованы. Как только координатор или администратор добавит проверенную программу, она появится здесь.',
    },
    dashboardPage: {
      title: 'Личный кабинет',
      subtitle: 'Персональный профиль, результаты TALENT MAP, проекты, активности и сохранённые возможности.',
      tabs: {
        profile: 'Профиль',
        talent: 'Talent Map',
        projects: 'Мои проекты',
        activities: 'Активности',
        saved: 'Сохранённые',
        notifications: 'Уведомления',
      },
      saveProfile: 'Сохранить профиль',
      savedSuccess: 'Профиль успешно обновлён.',
      regionLabel: 'Область / Регион',
      districtLabel: 'Район / Город',
      schoolLabel: 'Школа / Учебное заведение',
      gradeLabel: 'Класс / Статус',
      bioLabel: 'О себе',
      interestsLabel: 'Интересы (через запятую)',
      roleLabel: 'Роль в системе',
      markRead: 'Отметить прочитанным',
      noNotifications: 'Новых уведомлений нет.',
      noSaved: 'Сохранённых возможностей пока нет.',
      noActivities: 'Опубликованных материалов и дебатов пока нет.',
      signInRequired: 'Войдите через Google, чтобы открыть личный кабинет и сохранять свой прогресс.',
    },
    adminPage: {
      title: 'Панель администрирования',
      subtitle: 'Управление пользователями, модерация проектов, редактор тестов и публикация проверенных возможностей.',
      accessDenied: 'Этот раздел доступен только пользователям с ролью Администратора или Координатора.',
      realStatsNotice: 'Вся статистика рассчитывается в реальном времени строго по фактическим документам в базе Firestore.',
      stats: {
        users: 'Пользователи',
        talentTests: 'Пройдено тестов',
        projects: 'Ученические проекты',
        communityPosts: 'Публикации сообщества',
        verifiedOpportunities: 'Проверенные возможности',
      },
      tabs: {
        overview: 'Статистика',
        users: 'Пользователи',
        projects: 'Проекты',
        questions: 'Тесты Talent Map',
        opportunities: 'Возможности',
        posts: 'Контент',
        settings: 'Настройки',
      },
      publishOpportunityTitle: 'Опубликовать проверенную возможность',
      addQuestionTitle: 'Добавить диагностический вопрос',
      seedDefaultQuestions: 'Загрузить 12 базовых вопросов в БД',
      approveBtn: 'Одобрить',
      requestRevisionBtn: 'На доработку',
      archiveBtn: 'В архив',
      restoreBtn: 'Восстановить',
      saveSettings: 'Сохранить настройки',
    },
    common: {
      loading: 'Загрузка...',
      signInGoogle: 'Войти через Google',
      errorPrefix: 'Ошибка',
      close: 'Закрыть',
      edit: 'Изменить',
      view: 'Открыть',
      searchPlaceholder: 'Поиск...',
      inDevelopment: 'В разработке',
    },
  },
  en: {
    nav: {
      talentMap: 'Talent Map',
      schoolHack: 'School Hack 72',
      knowledgeBridge: 'Knowledge Bridge',
      opportunityRelay: 'Opportunity Relay',
      dashboard: 'Dashboard',
      admin: 'Admin',
      signIn: 'Sign In',
      signOut: 'Sign Out',
    },
    hero: {
      eyebrow: 'Launching in Navoi Region · Scaling Across Uzbekistan',
      headline: 'FROM POTENTIAL TO REAL IMPACT.',
      subheadline: 'Every talent deserves an opportunity.',
      mission:
        'A unified digital educational infrastructure where grade 7–11 students discover their strengths, build real-world projects, collaborate across schools, and access verified opportunities.',
      ctaExplore: 'Explore Platform',
      ctaDiscover: 'Discover Your Talent',
      ctaProject: 'Start a Project',
      launchBadge: 'Initial Hub: Navoi Region · National Scalable Architecture',
    },
    home: {
      modulesTitle: 'Four Integrated Ecosystem Modules',
      modulesSubtitle:
        'Each module guides students progressively from structured self-discovery to collaborative engineering and verified real-world impact.',
      openModule: 'Open Module',
      pathTitle: 'Student Growth Trajectory',
      pathSteps: ['DISCOVER', 'DEVELOP', 'CREATE', 'CONNECT', 'ACHIEVE IMPACT'],
      scalabilityTitle: 'Built for National Expansion',
      scalabilitySubtitle:
        'Modular architecture ready for additional academic and industry tracks. Upcoming tracks are transparently marked as In Development.',
      activeStatus: 'Active',
      inDevelopmentStatus: 'In Development',
      principlesTitle: 'Integrity & Verifiable Data Principles',
      principlesItems: [
        'No fabricated leaderboards or invented user achievements.',
        'TALENT MAP profiles are computed deterministically from real submitted test responses.',
        'OPPORTUNITY RELAY publishes strictly verified programs with documented official sources.',
        'Platform analytics reflect live database counts only — never synthetic metrics.',
      ],
      visionTitle: 'EVERY TALENT DESERVES AN OPPORTUNITY.',
      visionSubtitle:
        'TALENT TO IMPACT transforms students from passive learners into researchers, builders, and leaders solving real problems in their regions.',
      aboutTitle: 'About the Ecosystem',
      aboutBody:
        'TALENT TO IMPACT unites Education, Artificial Intelligence, Entrepreneurship, Innovation, Leadership, Project Development, Networking, and Mentorship in one scalable infrastructure starting in Navoi region and built for all of Uzbekistan.',
    },
    modules: {
      talentMap: {
        code: '01. TALENT MAP',
        title: 'Discover Your Potential',
        tagline: 'Structured interest and capability diagnostics',
        desc: 'Real multi-domain assessment across 6 core dimensions with a radar map and personalized AI learning roadmap.',
      },
      schoolHack: {
        code: '02. SCHOOL HACK 72',
        title: 'Turn Ideas Into Projects',
        tagline: 'From problem statement to working student team project',
        desc: 'Define a real problem and solution, organize your team and tasks, track completion, and request AI engineering critique.',
      },
      knowledgeBridge: {
        code: '03. KNOWLEDGE BRIDGE',
        title: 'Connect. Learn. Share.',
        tagline: 'Inter-school learning communities and open debates',
        desc: 'Thematic communities, student-authored study materials, structured debates, and regional educational events.',
      },
      opportunityRelay: {
        code: '04. OPPORTUNITY RELAY',
        title: 'Discover Opportunities',
        tagline: 'Verified olympiads, programs, internships, and mentorship',
        desc: 'Strictly verified listings published by administrators and coordinators with documented source transparency.',
      },
    },
    domains: {
      ai_engineering: {
        label: 'AI & Engineering',
        short: 'AI / Eng',
        desc: 'Algorithms, software systems, artificial intelligence, and robotics.',
      },
      research_science: {
        label: 'Research & Science',
        short: 'Science',
        desc: 'Experimentation, hypothesis testing, math, and natural sciences.',
      },
      entrepreneurship: {
        label: 'Entrepreneurship',
        short: 'Venture',
        desc: 'Product creation, resource planning, and measurable practical value.',
      },
      leadership: {
        label: 'Leadership',
        short: 'Leadership',
        desc: 'Team alignment, ownership, and structured decision-making.',
      },
      design_architecture: {
        label: 'Design & Architecture',
        short: 'Design',
        desc: 'Systems prototyping, visual clarity, and human-centered modeling.',
      },
      social_impact: {
        label: 'Social Impact',
        short: 'Impact',
        desc: 'Educational outreach, debates, and regional community development.',
      },
    },
    tracks: {
      ai_engineering: 'AI & Engineering',
      research_science: 'Research & Science',
      entrepreneurship: 'Entrepreneurship',
      leadership: 'Leadership Initiative',
      ecology_smart_city: 'Ecology & Smart City',
      education_tech: 'Education Technology (EdTech)',
    },
    projectStatus: {
      draft: 'Draft',
      in_progress: 'In Progress',
      submitted: 'Submitted',
      approved: 'Approved',
      revision_needed: 'Revision Needed',
    },
    communities: {
      ai_engineering: 'AI & Engineering',
      research_science: 'Research & Science',
      entrepreneurship: 'Entrepreneurship',
      leadership: 'Leadership & Debate',
      navoi_schools: 'Navoi Schools Network',
    },
    postTypes: {
      material: 'Study Material',
      debate: 'Debate / Discussion',
      event: 'Event',
    },
    opportunityCategories: {
      program: 'Educational Program',
      olympiad: 'Olympiad / Contest',
      internship: 'Internship',
      mentorship: 'Mentorship',
      entrepreneurship: 'Entrepreneurship',
    },
    roles: {
      student: 'Student',
      mentor: 'Mentor / Teacher',
      coordinator: 'School Coordinator',
      admin: 'Administrator',
    },
    talentMapPage: {
      title: 'TALENT MAP',
      subtitle: 'Rate each statement honestly. Your profile is computed strictly from your real responses.',
      likertLabels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      progressLabel: 'Questions Answered',
      submitTest: 'Compute & Save Profile',
      savingTest: 'Saving...',
      retakeTest: 'Retake Assessment',
      signInPrompt: 'Sign in to persist your Talent Map profile in your personal dashboard and generate an AI roadmap.',
      resultTitle: 'Your TALENT MAP Profile',
      primaryStrength: 'Primary Domain',
      secondaryStrength: 'Secondary Strength',
      aiAnalyzeBtn: 'Generate Personalized Roadmap with Gemini AI',
      aiAnalyzing: 'Gemini is synthesizing your roadmap...',
      aiSummaryTitle: 'Analytical Profile',
      aiRoadmapTitle: 'Personalized Learning Steps',
      aiIdeasTitle: 'Recommended SCHOOL HACK 72 Project Directions',
      startProjectFromIdea: 'Start Project from This Idea',
      historyTitle: 'Previous Saved Assessments',
      noResultsYet: 'No saved assessments yet.',
      answerAllNotice: 'Please answer every question for an accurate computation.',
      deterministicNotice: 'Transparent scoring: every percentage is calculated deterministically from your submitted answers.',
    },
    schoolHackPage: {
      title: 'SCHOOL HACK 72',
      subtitle: 'Turn ideas into structured projects with clear problem statements, solutions, teams, and task tracking.',
      newProject: 'New Project',
      allPublic: 'Public Projects',
      myProjects: 'My Projects',
      createTitle: 'Create Project Blueprint',
      editTitle: 'Edit Project',
      fieldTitle: 'Project Title',
      fieldTrack: 'Track',
      fieldSummary: 'Short Summary',
      fieldProblem: 'Problem Statement',
      fieldSolution: 'Proposed Solution',
      fieldVisibility: 'Visibility',
      publicLabel: 'Public (visible to ecosystem)',
      privateLabel: 'Private (only you)',
      teamSection: 'Team Members (up to 8)',
      addMemberPlaceholder: 'Name & role (e.g., Dilshod — ML Engineer)',
      addMemberBtn: 'Add',
      tasksSection: 'Project Tasks (up to 25)',
      taskTitlePlaceholder: 'Task title',
      taskAssigneePlaceholder: 'Assignee',
      addTaskBtn: 'Add Task',
      saveDraft: 'Save',
      submitProject: 'Submit for Review',
      deleteProject: 'Delete',
      cancel: 'Cancel',
      aiReviewBtn: 'Request Gemini AI Architecture Critique',
      aiReviewLoading: 'Reviewing project architecture...',
      aiReviewTitle: 'Gemini AI Project Critique',
      emptyProjects: 'No projects in this view yet. Launch your first practical project.',
      progressLabel: 'Task Completion',
      moderatorFeedback: 'Coordinator Note',
      approvedLockedNotice: 'This project is approved. Only coordinators or administrators can modify approved projects.',
    },
    knowledgeBridgePage: {
      title: 'KNOWLEDGE BRIDGE',
      subtitle: 'Inter-school learning communities, open debates, and collaborative regional educational events.',
      newPost: 'Publish Material or Debate',
      allCommunities: 'All Communities',
      fieldCommunity: 'Community',
      fieldType: 'Format',
      fieldTitle: 'Title',
      fieldContent: 'Content',
      fieldEventDate: 'Event Date (optional)',
      publishBtn: 'Publish',
      commentsTitle: 'Discussion',
      commentPlaceholder: 'Share your argument or question...',
      sendComment: 'Post Reply',
      emptyPosts: 'No publications in this community yet. Be the first to contribute.',
      signInToParticipate: 'Sign in to publish educational materials and join discussions.',
    },
    opportunityRelayPage: {
      title: 'OPPORTUNITY RELAY',
      subtitle: 'Verified olympiads, educational programs, internships, and mentorship pathways.',
      verificationPolicy:
        'Verified data only: every listing here is published exclusively by an administrator or school coordinator after confirming its official source.',
      allCategories: 'All Categories',
      saveOpportunity: 'Save',
      savedLabel: 'Saved',
      verifiedBy: 'Verified by',
      sourceLabel: 'Verification Source',
      eligibilityLabel: 'Eligibility',
      deadlineLabel: 'Deadline',
      emptyOpportunities:
        'No verified opportunities published yet. Listings will appear here once an administrator or coordinator publishes confirmed programs.',
    },
    dashboardPage: {
      title: 'Personal Dashboard',
      subtitle: 'Your profile, TALENT MAP results, projects, community contributions, and saved opportunities.',
      tabs: {
        profile: 'Profile',
        talent: 'Talent Map',
        projects: 'My Projects',
        activities: 'Activities',
        saved: 'Saved',
        notifications: 'Notifications',
      },
      saveProfile: 'Save Profile',
      savedSuccess: 'Profile updated successfully.',
      regionLabel: 'Region',
      districtLabel: 'District / City',
      schoolLabel: 'School / Institution',
      gradeLabel: 'Grade / Status',
      bioLabel: 'Bio',
      interestsLabel: 'Interests (comma-separated)',
      roleLabel: 'Account Role',
      markRead: 'Mark as read',
      noNotifications: 'No notifications yet.',
      noSaved: 'No saved opportunities yet.',
      noActivities: 'No published materials or debates yet.',
      signInRequired: 'Sign in with Google to access your personal dashboard and persist your work.',
    },
    adminPage: {
      title: 'Administration Console',
      subtitle: 'Manage users, moderate projects, edit diagnostic questions, and publish verified opportunities.',
      accessDenied: 'This console is restricted to Administrator and Coordinator roles.',
      realStatsNotice: 'Every metric below reflects live document counts directly from Firestore.',
      stats: {
        users: 'Users',
        talentTests: 'Completed Tests',
        projects: 'Student Projects',
        communityPosts: 'Community Posts',
        verifiedOpportunities: 'Verified Opportunities',
      },
      tabs: {
        overview: 'Analytics',
        users: 'Users',
        projects: 'Projects',
        questions: 'Talent Map Tests',
        opportunities: 'Opportunities',
        posts: 'Content',
        settings: 'Settings',
      },
      publishOpportunityTitle: 'Publish Verified Opportunity',
      addQuestionTitle: 'Add Diagnostic Question',
      seedDefaultQuestions: 'Load 12 Default Questions to DB',
      approveBtn: 'Approve',
      requestRevisionBtn: 'Request Revision',
      archiveBtn: 'Archive',
      restoreBtn: 'Restore',
      saveSettings: 'Save Settings',
    },
    common: {
      loading: 'Loading...',
      signInGoogle: 'Sign In with Google',
      errorPrefix: 'Error',
      close: 'Close',
      edit: 'Edit',
      view: 'View',
      searchPlaceholder: 'Search...',
      inDevelopment: 'In Development',
    },
  },
};
