import type { TalentDomainKey, TalentQuestion } from '../types/platform';

export const TALENT_DOMAINS: TalentDomainKey[] = [
  'ai_engineering',
  'research_science',
  'entrepreneurship',
  'leadership',
  'design_architecture',
  'social_impact',
];

export const DEFAULT_TALENT_QUESTIONS: TalentQuestion[] = [
  {
    id: 'q_ai_1',
    order: 1,
    domain: 'ai_engineering',
    textUz: "Murakkab muammolarni algoritmlar, dasturiy kod yoki sun'iy intellekt yordamida avtomatlashtirish menga qiziq.",
    textRu: 'Мне интересно решать сложные задачи с помощью алгоритмов, программного кода и искусственного интеллекта.',
    textEn: 'I enjoy solving complex problems using algorithms, software code, or artificial intelligence systems.',
    active: true,
  },
  {
    id: 'q_ai_2',
    order: 2,
    domain: 'ai_engineering',
    textUz: "Yangi raqamli vositalar, robototexnika yoki ma'lumotlarni tahlil qilish tizimlarining ichki ishlashini o'rganishni yoqtiraman.",
    textRu: 'Мне нравится разбираться в устройстве цифровых систем, робототехники и аналитики данных.',
    textEn: 'I like exploring how digital platforms, robotics, and data analytics pipelines work under the hood.',
    active: true,
  },
  {
    id: 'q_res_1',
    order: 3,
    domain: 'research_science',
    textUz: "Tajriba o'tkazish, ilmiy farazlarni tekshirish va hodisalarning sabablarini chuqur tahlil qilish meni ilhomlantiradi.",
    textRu: 'Меня вдохновляет проведение экспериментов, проверка гипотез и глубокий научный анализ причин явлений.',
    textEn: 'Running experiments, testing hypotheses, and analyzing root scientific causes genuinely excites me.',
    active: true,
  },
  {
    id: 'q_res_2',
    order: 4,
    domain: 'research_science',
    textUz: "Fizika, biologiya, kimyo yoki matematika bo'yicha murakkab tadqiqot masalalarini yechishga uzoq vaqt ajrata olaman.",
    textRu: 'Я могу сосредоточенно работать над сложными исследовательскими задачами по математике, физике, химии или биологии.',
    textEn: 'I can focus deeply on challenging analytical questions in mathematics, physics, chemistry, or biology.',
    active: true,
  },
  {
    id: 'q_ent_1',
    order: 5,
    domain: 'entrepreneurship',
    textUz: "Kundalik hayotdagi muammolarni ko'rib, ularni foydali mahsulot yoki startap loyihasiga aylantirish haqida o'ylayman.",
    textRu: 'Замечая проблемы вокруг, я сразу думаю, как превратить их решение в полезный продукт или стартап.',
    textEn: 'When I spot everyday inefficiencies, I immediately think about turning solutions into real products or ventures.',
    active: true,
  },
  {
    id: 'q_ent_2',
    order: 6,
    domain: 'entrepreneurship',
    textUz: "Resurslarni rejalashtirish, g'oyani himoya qilish va amaliy natijaga olib chiqish menga kuch beradi.",
    textRu: 'Планирование ресурсов, презентация идеи и доведение её до измеримого результата придают мне энергию.',
    textEn: 'Planning resources, pitching a clear value proposition, and shipping practical outcomes energize me.',
    active: true,
  },
  {
    id: 'q_lead_1',
    order: 7,
    domain: 'leadership',
    textUz: "Jamoa ichida vazifalarni to'g'ri taqsimlash va barchani umumiy maqsad sari birlashtirish qo'limdan keladi.",
    textRu: 'У меня получается распределять роли в команде и объединять участников вокруг общей цели.',
    textEn: 'I naturally coordinate tasks inside a team and align different people around a shared goal.',
    active: true,
  },
  {
    id: 'q_lead_2',
    order: 8,
    domain: 'leadership',
    textUz: "Noaniq vaziyatlarda mas'uliyatni o'z zimmamga olib, qaror qabul qilishdan qo'rqmayman.",
    textRu: 'В условиях неопределённости я готов брать ответственность и принимать взвешенные решения.',
    textEn: 'In uncertain situations, I am comfortable stepping up, taking ownership, and making structured decisions.',
    active: true,
  },
  {
    id: 'q_des_1',
    order: 9,
    domain: 'design_architecture',
    textUz: "Murakkab g'oyalarni tushunarli chizma, interfeys, prototip yoki muhandislik modeli ko'rinishida tasvirlashni yoqtiraman.",
    textRu: 'Мне нравится превращать сложные идеи в понятные схемы, интерфейсы, прототипы и визуальные модели.',
    textEn: 'I love turning abstract ideas into clear visual architectures, interfaces, prototypes, or spatial models.',
    active: true,
  },
  {
    id: 'q_des_2',
    order: 10,
    domain: 'design_architecture',
    textUz: "Foydalanuvchilar uchun qulay, estetik va mantiqiy tizimlarni loyihalashga alohida e'tibor beraman.",
    textRu: 'Я уделяю особое внимание удобству, эстетике и логичной структуре систем для конечного пользователя.',
    textEn: 'I pay close attention to usability, structural elegance, and clarity when designing tools for people.',
    active: true,
  },
  {
    id: 'q_soc_1',
    order: 11,
    domain: 'social_impact',
    textUz: "Maktabim, hududim yoki tengdoshlarimning ta'lim sifatini yaxshilashga qaratilgan tashabbuslarda faol qatnashmoqchiman.",
    textRu: 'Я хочу активно участвовать в инициативах, улучшающих образование и жизнь в моей школе и регионе.',
    textEn: 'I want to actively build initiatives that improve education and opportunity in my school and local region.',
    active: true,
  },
  {
    id: 'q_soc_2',
    order: 12,
    domain: 'social_impact',
    textUz: "Boshqa o'quvchilar bilan bilim almashish, bahs-munozara qilish va o'zaro o'sish muhiti yaratish men uchun muhim.",
    textRu: 'Для меня важно обмениваться знаниями со сверстниками, участвовать в дебатах и создавать среду взаимного развития.',
    textEn: 'Sharing knowledge with peers, debating real issues, and building collaborative learning circles matters deeply to me.',
    active: true,
  },
];

export function computeTalentScores(
  questions: TalentQuestion[],
  answers: Record<string, number>,
): {
  scores: Record<TalentDomainKey, number>;
  primaryDomain: TalentDomainKey;
  secondaryDomain: TalentDomainKey;
  answersCount: number;
} {
  const totals: Record<TalentDomainKey, { sum: number; count: number }> = {
    ai_engineering: { sum: 0, count: 0 },
    research_science: { sum: 0, count: 0 },
    entrepreneurship: { sum: 0, count: 0 },
    leadership: { sum: 0, count: 0 },
    design_architecture: { sum: 0, count: 0 },
    social_impact: { sum: 0, count: 0 },
  };

  let answersCount = 0;
  for (const q of questions) {
    const val = answers[q.id];
    if (typeof val === 'number' && val >= 1 && val <= 5) {
      totals[q.domain].sum += val;
      totals[q.domain].count += 1;
      answersCount += 1;
    }
  }

  const scores = {} as Record<TalentDomainKey, number>;
  for (const domain of TALENT_DOMAINS) {
    const { sum, count } = totals[domain];
    // Deterministic conversion: 1..5 scale mapped to 0..100 (where 1=20, 5=100; 0 if unanswered)
    scores[domain] = count > 0 ? Math.round((sum / (count * 5)) * 100) : 0;
  }

  const ranked = [...TALENT_DOMAINS].sort((a, b) => scores[b] - scores[a]);
  return {
    scores,
    primaryDomain: ranked[0],
    secondaryDomain: ranked[1],
    answersCount,
  };
}
