/** Shared between Vite app and Express server — keep in sync with Mongo `data` field. */

export type ContactInfoIcon = "mail" | "phone" | "pin";

export type ContactInfoItem = {
  id: string;
  label: string;
  value: string;
  copyText?: string;
  icon: ContactInfoIcon;
};

export type ContactSectionContent = {
  eyebrow: string;
  title: string;
  info: ContactInfoItem[];
};

export type AboutPart2Content = {
  eyebrow: string;
  titleLine1: string;
  titleLine2Prefix: string;
  titleHighlight: string;
  paragraphs: [string, string];
  ctaLabel: string;
};

export type MissionVisionCard = {
  id: string;
  title: string;
  description: string;
};

export type MissionVisionSectionContent = {
  headerEyebrow: string;
  headerTitleLine1: string;
  headerTitleLine2: string;
  headerTitleHighlight: string;
  cards: MissionVisionCard[];
};

export type HeroSectionContent = {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  trailPhrase: string;
  stats: HeroStatItem[];
};

export type HeroStatItem = {
  id: string;
  value: string;
  suffix: string;
  label: string;
  highlight?: boolean;
};

export type ServiceSlide = {
  id: string;
  heading: string;
  headerDesc: string;
  productDesc: string;
  imageUrl: string;
  backgroundPosition?: string;
};

export type ServicesSectionContent = {
  headerLeft: string;
  headerLinkLabel: string;
  slides: ServiceSlide[];
};

export type ProductCard = {
  kind: "image";
  id: string;
  name: string;
  roleLine: string;
  quote: string;
  imageSrc: string;
  imageAlt: string;
};

export type ProductsSectionContent = {
  eyebrow: string;
  title: string;
  cards: ProductCard[];
};

export type AdvantagesCard = {
  id: string;
  step: string;
  title: string;
  description: string;
};

export type AdvantagesSectionContent = {
  eyebrow: string;
  title: string;
  cards: AdvantagesCard[];
};

export type FooterSectionContent = {
  logoTop: string;
  logoBottom: string;
  taglineLine1: string;
  taglineHighlight: string;
  taglineLine2: string;
  qrUrl: string;
  qrLabel: string;
  phonePrefix: string;
  phoneValue: string;
  webPrefix: string;
  webValue: string;
  emailPrefix: string;
  emailValue: string;
  copyrightText: string;
};

export type TickerSectionContent = {
  items: string[];
  separator: string;
};

/** Editable homepage payload stored in Mongo. */
export type SiteContentData = {
  hero: HeroSectionContent;
  contact: ContactSectionContent;
  about: AboutPart2Content;
  missionVision: MissionVisionSectionContent;
  services: ServicesSectionContent;
  advantages: AdvantagesSectionContent;
  products: ProductsSectionContent;
  footer: FooterSectionContent;
  ticker: TickerSectionContent;
};

export type SiteLocale = "en" | "mn";

/** Stored in Mongo `SiteSettings.data` — English + Mongolian home payloads. */
export type BilingualSiteContent = {
  en: SiteContentData;
  mn: SiteContentData;
};

export type SiteContentApiResponse = {
  version: number;
  updatedAt: string;
  data: BilingualSiteContent;
};

/** English defaults (primary). Mongolian: `DEFAULT_SITE_CONTENT_MN`. */
export const DEFAULT_SITE_CONTENT: SiteContentData = {
  hero: {
    badgeText: "Est. 2017 · Medical technology",
    titleLine1: "Build Smarter",
    titleLine2: "Grow Faster.",
    description:
      "Mongolia's leading provider of smart, portable, and AI-powered medical devices and healthcare solutions.",
    primaryCtaLabel: "Explore Products",
    secondaryCtaLabel: "Our Story",
    trailPhrase: "Make it simple.",
    stats: [
      {
        id: "hero-stat-years",
        value: "20",
        suffix: "+",
        label: "Years of Innovation",
      },
      {
        id: "hero-stat-brands",
        value: "8",
        suffix: "+",
        label: "Main Brands",
      },
      {
        id: "hero-stat-devices",
        value: "3",
        suffix: "K+",
        label: "Devices Deployed",
        highlight: true,
      },
    ],
  },
  contact: {
    eyebrow: "Get In Touch",
    title: "Contact",
    info: [
      {
        id: "contact-mail",
        label: "Mail",
        value: "info@smartmode.mn",
        icon: "mail",
      },
      {
        id: "contact-phone",
        label: "Phone",
        value: "+976 7711 6644",
        copyText: "+97677116644",
        icon: "phone",
      },
      {
        id: "contact-office",
        label: "Office",
        value: "Ulaanbaatar, Mongolia — www.smartmode.mn",
        copyText: "Ulaanbaatar, Mongolia — https://www.smartmode.mn",
        icon: "pin",
      },
    ],
  },
  about: {
    eyebrow: "About us",
    titleLine1: "Smart Medicine",
    titleLine2Prefix: "For ",
    titleHighlight: "Everyone",
    paragraphs: [
      "Smart Mode LLC was established in 2017 and operates in the medical device industry. We focus on delivering modern, smart, and portable solutions that improve accessibility and efficiency in healthcare services.",
      "From wearable health monitors to AI-driven diagnostic platforms, we bridge the gap between cutting-edge technology and everyday clinical practice — making quality care available anywhere, anytime.",
    ],
    ctaLabel: "Partner with us",
  },
  missionVision: {
    headerEyebrow: "Our Foundation",
    headerTitleLine1: "Mission, Vision &",
    headerTitleLine2: "Core ",
    headerTitleHighlight: "Values",
    cards: [
      {
        id: "mv-mission",
        title: "Our Mission",
        description:
          "To enhance healthcare quality by providing easy-to-use, portable, and highly efficient medical devices that empower clinicians and patients alike.",
      },
      {
        id: "mv-vision",
        title: "Our Vision",
        description:
          "To become a leading provider of smart and portable medical technologies — making advanced healthcare accessible across Mongolia and beyond.",
      },
      {
        id: "mv-quality",
        title: "Quality",
        description: "Uncompromising standards in every device we deliver.",
      },
      {
        id: "mv-innovation",
        title: "Innovation",
        description:
          "Continuously pushing the boundaries of medical technology.",
      },
      {
        id: "mv-trust",
        title: "Trust",
        description:
          "Building lasting relationships with clients and partners.",
      },
    ],
  },
  services: {
    headerLeft: "Services",
    headerLinkLabel: "Inspiration",
    slides: [
      {
        id: "svc-1",
        heading: "Smart Medical Devices",
        headerDesc: "We offer the following products and solutions",
        productDesc:
          "Wearables and connected devices empowering real-time health monitoring and proactive care.",
        imageUrl: "https://picsum.photos/seed/smartmode-services-1/1920/1080",
      },
      {
        id: "svc-2",
        heading: "Portable Diagnostic Equipment",
        headerDesc: "Fast diagnostics wherever care is delivered",
        productDesc:
          "Portable tools for screening, triage, and point-of-care decision support in any setting.",
        imageUrl: "https://picsum.photos/seed/smartmode-services-2/1920/1080",
      },
      {
        id: "svc-3",
        heading: "Technology-Driven Healthcare Solutions",
        headerDesc: "Integrated systems for modern care teams",
        productDesc:
          "Data-driven platforms that connect devices, workflows, and insights across the care journey.",
        imageUrl: "https://picsum.photos/seed/smartmode-services-3/1920/1080",
        backgroundPosition: "50% 45%",
      },
    ],
  },
  advantages: {
    eyebrow: "Advantages",
    title: "Why use Smart Mode?",
    cards: [
      {
        id: "adv-01",
        step: "01",
        title: "Share Your Workflow",
        description:
          "From lead gen to client onboarding, share your workflow and the tools you use.",
      },
      {
        id: "adv-02",
        step: "02",
        title: "We Build the System",
        description:
          "We design and set up custom automations that connect your tools with AI-so work happens while you sleep.",
      },
      {
        id: "adv-03",
        step: "03",
        title: "Launch and Take Control",
        description:
          "You get a plug-and-play dashboard with a guided walkthrough to manage everything easily.",
      },
      {
        id: "adv-04",
        step: "04",
        title: "Scalable and Flexible",
        description:
          "Our system grows with your business, adapting to new tools and workflows without you lifting a finger.",
      },
    ],
  },
  products: {
    eyebrow: "Products",
    title: "What powers smarter care",
    cards: [
      {
        kind: "image",
        id: "prod-001",
        name: "Dr. Amina Hassan",
        roleLine: "Head of Telemetry · Bayridge Medical",
        quote:
          "Continuous vitals on the ward finally feel effortless—fewer bedside hooks, clearer escalation paths.",
        imageSrc:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=900&fit=crop&q=80",
        imageAlt: "Healthcare professional reviewing patient data",
      },
      {
        kind: "image",
        id: "prod-002",
        name: "Jordan Lee",
        roleLine: "Product Lead · Diagnostics",
        quote:
          "Field diagnostics shipped in days, not quarters. Calibration and QA checks run automatically before every session.",
        imageSrc:
          "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&h=900&fit=crop&q=80",
        imageAlt: "Jordan Lee portrait",
      },
      {
        kind: "image",
        id: "prod-003",
        name: "Dr. Tomas Varga",
        roleLine: "Rural Outreach Program",
        quote:
          "Portable imaging that doesn’t punish remote clinics—that’s what changes access, not brochures.",
        imageSrc:
          "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&h=900&fit=crop&q=80",
        imageAlt: "Clinical setting with diagnostic equipment",
      },
      {
        kind: "image",
        id: "prod-004",
        name: "Maya Patel",
        roleLine: "COO · Northline Health Partners",
        quote:
          "Our workflow is now 80% automated, saving clinicians hours weekly. Deployments landed without disrupting patient flow.",
        imageSrc:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&h=900&fit=crop&q=80",
        imageAlt: "Maya Patel portrait",
      },
      {
        kind: "image",
        id: "prod-005",
        name: "Elena Ruiz",
        roleLine: "Director of Connected Care",
        quote:
          "Unified device telemetry meant our command center stopped chasing spreadsheets and started spotting risk early.",
        imageSrc:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=900&fit=crop&q=80",
        imageAlt: "Care team collaborating in a modern clinic",
      },
      {
        kind: "image",
        id: "prod-006",
        name: "Dr. Amina Hassan",
        roleLine: "Head of Telemetry · Bayridge Medical",
        quote:
          "Continuous vitals on the ward finally feel effortless—fewer bedside hooks, clearer escalation paths.",
        imageSrc:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=900&fit=crop&q=80",
        imageAlt: "Healthcare professional reviewing patient data",
      },
      {
        kind: "image",
        id: "prod-007",
        name: "Jordan Lee",
        roleLine: "Product Lead · Diagnostics",
        quote:
          "Field diagnostics shipped in days, not quarters. Calibration and QA checks run automatically before every session.",
        imageSrc:
          "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&h=900&fit=crop&q=80",
        imageAlt: "Jordan Lee portrait",
      },
      {
        kind: "image",
        id: "prod-008",
        name: "Dr. Tomas Varga",
        roleLine: "Rural Outreach Program",
        quote:
          "Portable imaging that doesn’t punish remote clinics—that’s what changes access, not brochures.",
        imageSrc:
          "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&h=900&fit=crop&q=80",
        imageAlt: "Clinical setting with diagnostic equipment",
      },
      {
        kind: "image",
        id: "prod-009",
        name: "Maya Patel",
        roleLine: "COO · Northline Health Partners",
        quote:
          "Our workflow is now 80% automated, saving clinicians hours weekly. Deployments landed without disrupting patient flow.",
        imageSrc:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&h=900&fit=crop&q=80",
        imageAlt: "Maya Patel portrait",
      },
      {
        kind: "image",
        id: "prod-010",
        name: "Elena Ruiz",
        roleLine: "Director of Connected Care",
        quote:
          "Unified device telemetry meant our command center stopped chasing spreadsheets and started spotting risk early.",
        imageSrc:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=900&fit=crop&q=80",
        imageAlt: "Care team collaborating in a modern clinic",
      },
    ],
  },
  footer: {
    logoTop: "Smart",
    logoBottom: "MODE",
    taglineLine1: "Build",
    taglineHighlight: "Smarter",
    taglineLine2: "Grow Faster.",
    qrUrl: "https://www.smartmode.mn",
    qrLabel: "www.smartmode.mn",
    phonePrefix: "+976",
    phoneValue: "77116644",
    webPrefix: "www.",
    webValue: "smartmode.mn",
    emailPrefix: "info@",
    emailValue: "smartmode.mn",
    copyrightText: "Smart Mode LLC. All rights reserved.",
  },
  ticker: {
    items: [
      "Smart Medical Devices",
      "Portable Diagnostics",
      "AI-Powered Healthcare",
      "Build Smarter, Grow Faster",
      "Mongolia's Healthcare Leader",
    ],
    separator: "✦",
  },
};

export const DEFAULT_SITE_CONTENT_MN: SiteContentData = {
  hero: {
    badgeText: "2017 онд үүсгэсэн · Эмнэлгийн технологи",
    titleLine1: "Ухаалагаар бүтээ",
    titleLine2: "Хурдан өс.",
    description:
      "Монгол Улсад ухаалаг, зөөврийн, хиймэл оюун ухаанд суурилсан эмнэлгийн хэрэгсэл болон эрүүл мэндийн шийдлүүдийг нийлүүлдэг тэргүүлэгч компани.",
    primaryCtaLabel: "Бүтээгдэхүүн үзэх",
    secondaryCtaLabel: "Бидний түүх",
    trailPhrase: "Энгийн болгоё.",
    stats: [
      {
        id: "hero-stat-years",
        value: "20",
        suffix: "+",
        label: "Шинэлэгийн жил",
      },
      {
        id: "hero-stat-brands",
        value: "8",
        suffix: "+",
        label: "Үндсэн брэнд",
      },
      {
        id: "hero-stat-devices",
        value: "3",
        suffix: "K+",
        label: "Суурилуулсан төхөөрөмж",
        highlight: true,
      },
    ],
  },
  contact: {
    eyebrow: "Холбоо барих",
    title: "Холбоо барих",
    info: [
      {
        id: "contact-mail",
        label: "И-мэйл",
        value: "info@smartmode.mn",
        icon: "mail",
      },
      {
        id: "contact-phone",
        label: "Утас",
        value: "+976 7711 6644",
        copyText: "+97677116644",
        icon: "phone",
      },
      {
        id: "contact-office",
        label: "Хаяг",
        value: "Улаанбаатар, Монгол Улс — www.smartmode.mn",
        copyText: "Улаанбаатар, Монгол Улс — https://www.smartmode.mn",
        icon: "pin",
      },
    ],
  },
  about: {
    eyebrow: "Бидний тухай",
    titleLine1: "Ухаалаг эм",
    titleLine2Prefix: "Бүх ",
    titleHighlight: "хүнд",
    paragraphs: [
      "Смарт Мод ХХК нь 2017 онд байгуулагдаж, эмнэлгийн хэрэгслийн салбарт үйл ажиллагаа явуулдаг. Бид эрүүл мэндийн үйлчилгээнд хүртээмж, үр ашгийг нэмэгдүүлэх орчин үеийн ухаалаг, зөөврийн шийдлүүдийг нийлүүлэхэд төвлөрдөг.",
      "Өмнөх эрүүл мэндийн хянагчаас эхлээд хиймэл оюун ухаанд суурилсан оношлогооны платформ хүртэл — шинэ технологи, өдөр тутмын эмнэлзүйн практикийг холбож, чанартай тусламжийг хаана ч, хэзээ ч боломжтой болгоно.",
    ],
    ctaLabel: "Хамтран ажиллах",
  },
  missionVision: {
    headerEyebrow: "Бидний үндэс",
    headerTitleLine1: "Эрхэм зорилго, алсын",
    headerTitleLine2: "хараа ба ",
    headerTitleHighlight: "үзэл баримтлал",
    cards: [
      {
        id: "mv-mission",
        title: "Эрхэм зорилго",
        description:
          "Ашиглахад хялбар, зөөврийн, өндөр үр ашигтай эмнэлгийн хэрэгслээр эмч, өвчтөн хоёуланд хүч өгч, эрүүл мэндийн тусламжийн чанарыг дээшлүүлнэ.",
      },
      {
        id: "mv-vision",
        title: "Алсын хараа",
        description:
          "Ухаалаг, зөөврийн эмнэлгийн технологийн тэргүүлэгч нийлүүлэгч болж, Монгол болон түүнээс цааш өндөр түвшний эмчилгээнд хүртээмжийг нээх.",
      },
      {
        id: "mv-quality",
        title: "Чанар",
        description: "Нийлүүлэх бүх төхөөрөмжид эргэлзээгүй стандарт.",
      },
      {
        id: "mv-innovation",
        title: "Шинэлэг",
        description: "Эмнэлгийн технологийн хязгаарыг тасралтгүй өргөжүүлнэ.",
      },
      {
        id: "mv-trust",
        title: "Итгэлцэл",
        description:
          "Үйлчлүүлэгч, түншүүдтэй урт хугацааны харилцаа холбоо тогтооно.",
      },
    ],
  },
  services: {
    headerLeft: "Үйлчилгээ",
    headerLinkLabel: "Урам зориг",
    slides: [
      {
        id: "svc-1",
        heading: "Ухаалаг эмнэлгийн хэрэгсэл",
        headerDesc: "Дараах бүтээгдэхүүн, шийдлүүдийг санал болгож байна",
        productDesc:
          "Цаг хугацааны эрүүл мэндийн мэдээлэл, урьдчилан сэргийлэх үзлэгийг дэмжих зөөвсөр холбогдсон төхөөрөмжүүд.",
        imageUrl: "https://picsum.photos/seed/smartmode-services-1/1920/1080",
      },
      {
        id: "svc-2",
        heading: "Зөөврийн оношлуурын төхөөрөмж",
        headerDesc: "Тусламж үзүүлж байгаа газар хаана ч хурдан оношилгоо",
        productDesc:
          "Аль ч нөхцөлд скрининг, эмнэлзүйн ангилал, цэгийн тусламжийн шийдвэрийг дэмжих зөөврийн хэрэгсэл.",
        imageUrl: "https://picsum.photos/seed/smartmode-services-2/1920/1080",
      },
      {
        id: "svc-3",
        heading: "Технологид суурилсан эрүүл мэндийн шийдэл",
        headerDesc: "Орчин үеийн эмнэлгийн багийн нэгдсэн системүүд",
        productDesc:
          "Эмчилгээний бүх үе шатыг төхөөрөмж, урсгал, дүн шинжилгээгээр холбох өгөгдөлд суурилсан платформууд.",
        imageUrl: "https://picsum.photos/seed/smartmode-services-3/1920/1080",
        backgroundPosition: "50% 45%",
      },
    ],
  },
  advantages: {
    eyebrow: "Давуу тал",
    title: "Яагаад Смарт Мод вэ?",
    cards: [
      {
        id: "adv-01",
        step: "01",
        title: "Ажлын урсгалаа хуваалцаарай",
        description:
          "Хэрэглэгч олж авахаас эхлээд бүртгэл хүртэлх ажлын урсгал, ашиглаж байгаа хэрэгслүүдээ бидэнтэй хуваалцаарай.",
      },
      {
        id: "adv-02",
        step: "02",
        title: "Бид системийг бүтээнэ",
        description:
          "Таны хэрэгслүүдийг холбож, хиймэл оюун ухаанд суурилсан автоматжуулалтыг тохируулан ажил тань өөрөө явагдахаар зохион бүтээнэ.",
      },
      {
        id: "adv-03",
        step: "03",
        title: "Нээж, хяналтаа атгаарай",
        description:
          "Бүх зүйлийг хялбар удирдах заавартай, шууд ашиглах боломжтой самбарыг гардуулна.",
      },
      {
        id: "adv-04",
        step: "04",
        title: "Өргөтгөх боломжтой, уян хатан",
        description:
          "Бизнес өсөхтэй эвсэлдэн шинэ хэрэгсэл, урсгалд тохируулах систем — та өөрөө бага зүйл хийхэд л хангалттай.",
      },
    ],
  },
  products: {
    eyebrow: "Бүтээгдэхүүн",
    title: "Илүү ухаалаг тусламжийг юу хангаж байна вэ",
    cards: [
      {
        kind: "image",
        id: "prod-001",
        name: "Эмч Батбаяр Энхтуяа",
        roleLine: "Телеметрийн тасгийн дарга · УБ-ын Нэгдүгээр Төв Эмнэлэг",
        quote:
          "Өрөөний үзүүлэлт тасралтгүй хянагдаж, ор дээрх утас багасаж, өвчтөний байдал өөрчлөгдөхөд шууд арга хэмжээ авах зам илүү тод болсон.",
        imageSrc:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=900&fit=crop&q=80",
        imageAlt: "Өвчний мэдээлэл шалгаж буй эмнэлгийн мэргэжилтэн",
      },
      {
        kind: "image",
        id: "prod-002",
        name: "Болормаа Алтангэрэл",
        roleLine: "Сумын эрүүл мэндийн төв · Архангай аймаг",
        quote:
          "Зөөврийн оношлуур хэдхэн хоногт ирж, тохируулга, чанарын шалгалт эхний уулзалтаас өмнө автоматаар ажилласан.",
        imageSrc:
          "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&h=900&fit=crop&q=80",
        imageAlt: "Болормаа Алтангэрэл",
      },
      {
        kind: "image",
        id: "prod-003",
        name: "Эмч Ганболд Сүхбат",
        roleLine: "Яарайтын тасаг · Интермед эмнэлэг, Улаанбаатар",
        quote:
          "Яарайтын тасагт хурдан асаадаг, найдвартай дүрс оношилгоо ангиллыг өөрчилнө — тогтвортой өвчтөнийг хотоос өөр эмнэлэг рүү илгээх шаардлага багасна.",
        imageSrc:
          "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&h=900&fit=crop&q=80",
        imageAlt: "Оношлуурын төхөөрөмжтэй эмнэлгийн өрөө",
      },
      {
        kind: "image",
        id: "prod-004",
        name: "Түмэрхуяг Баярсайхан",
        roleLine: "Гүйцэтгэх захирал · Хан-Уул дүүргийн нэгдсэн эмнэлэг",
        quote:
          "Ажлын урсгалын ихэнх хэсэг автоматжсанаар эмч нар долоо хоногт олон цаг хэмнэж байна. Нэвтрүүлэлт нь өвчтөний урсгалыг тасалдуулаагүй.",
        imageSrc:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&h=900&fit=crop&q=80",
        imageAlt: "Түмэрхуяг Баярсайхан",
      },
      {
        kind: "image",
        id: "prod-005",
        name: "Саранцэцэг Долгор",
        roleLine: "Сувилах тусламжийн захирал · Эх, хүүхдийн үндэсний төв",
        quote:
          "Төхөөрөмжийн мэдээлэл нэгдсэн хяналтын төвтэй холбогдсон тул хүснэгт хөөцөлдөх биш, эрсдэлийг эрт илрүүлж байна.",
        imageSrc:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=900&fit=crop&q=80",
        imageAlt: "Орчин үеийн эмнэлэгт хамтран ажиллаж буй баг",
      },
      {
        kind: "image",
        id: "prod-006",
        name: "Эмч Батбаяр Энхтуяа",
        roleLine: "Телеметрийн тасгийн дарга · УБ-ын Нэгдүгээр Төв Эмнэлэг",
        quote:
          "Өрөөний үзүүлэлт тасралтгүй хянагдаж, ор дээрх утас багасаж, өвчтөний байдал өөрчлөгдөхөд шууд арга хэмжээ авах зам илүү тод болсон.",
        imageSrc:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=900&fit=crop&q=80",
        imageAlt: "Өвчний мэдээлэл шалгаж буй эмнэлгийн мэргэжилтэн",
      },
      {
        kind: "image",
        id: "prod-007",
        name: "Болормаа Алтангэрэл",
        roleLine: "Сумын эрүүл мэндийн төв · Архангай аймаг",
        quote:
          "Зөөврийн оношлуур хэдхэн хоногт ирж, тохируулга, чанарын шалгалт эхний уулзалтаас өмнө автоматаар ажилласан.",
        imageSrc:
          "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&h=900&fit=crop&q=80",
        imageAlt: "Болормаа Алтангэрэл",
      },
      {
        kind: "image",
        id: "prod-008",
        name: "Эмч Ганболд Сүхбат",
        roleLine: "Яарайтын тасаг · Интермед эмнэлэг, Улаанбаатар",
        quote:
          "Яарайтын тасагт хурдан асаадаг, найдвартай дүрс оношилгоо ангиллыг өөрчилнө — тогтвортой өвчтөнийг хотоос өөр эмнэлэг рүү илгээх шаардлага багасна.",
        imageSrc:
          "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&h=900&fit=crop&q=80",
        imageAlt: "Оношлуурын төхөөрөмжтэй эмнэлгийн өрөө",
      },
      {
        kind: "image",
        id: "prod-009",
        name: "Түмэрхуяг Баярсайхан",
        roleLine: "Гүйцэтгэх захирал · Хан-Уул дүүргийн нэгдсэн эмнэлэг",
        quote:
          "Ажлын урсгалын ихэнх хэсэг автоматжсанаар эмч нар долоо хоногт олон цаг хэмнэж байна. Нэвтрүүлэлт нь өвчтөний урсгалыг тасалдуулаагүй.",
        imageSrc:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&h=900&fit=crop&q=80",
        imageAlt: "Түмэрхуяг Баярсайхан",
      },
      {
        kind: "image",
        id: "prod-010",
        name: "Саранцэцэг Долгор",
        roleLine: "Сувилах тусламжийн захирал · Эх, хүүхдийн үндэсний төв",
        quote:
          "Төхөөрөмжийн мэдээлэл нэгдсэн хяналтын төвтэй холбогдсон тул хүснэгт хөөцөлдөх биш, эрсдэлийг эрт илрүүлж байна.",
        imageSrc:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=900&fit=crop&q=80",
        imageAlt: "Орчин үеийн эмнэлэгт хамтран ажиллаж буй баг",
      },
    ],
  },
  footer: {
    logoTop: "Smart",
    logoBottom: "MODE",
    taglineLine1: "Бүтээ",
    taglineHighlight: "Ухаалагаар",
    taglineLine2: "Хурдан өс.",
    qrUrl: "https://www.smartmode.mn",
    qrLabel: "www.smartmode.mn",
    phonePrefix: "+976",
    phoneValue: "77116644",
    webPrefix: "www.",
    webValue: "smartmode.mn",
    emailPrefix: "info@",
    emailValue: "smartmode.mn",
    copyrightText: "Смарт Мод ХХК. Бүх эрх хуулиар хамгаалагдсан.",
  },
  ticker: {
    items: [
      "Ухаалаг эмнэлгийн хэрэгсэл",
      "Зөөврийн оношилгоо",
      "Хиймэл оюун ухаанд суурилсан эрүүл мэнд",
      "Ухаалагаар бүтээ, хурдаар өс",
      "Монголын эрүүл мэндийн тэргүүлэгч түнш",
    ],
    separator: "✦",
  },
};

export const DEFAULT_BILINGUAL: BilingualSiteContent = {
  en: DEFAULT_SITE_CONTENT,
  mn: DEFAULT_SITE_CONTENT_MN,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** Minimal shape check so we do not treat arbitrary JSON as site content. */
function isSiteContentDataLike(value: unknown): value is SiteContentData {
  if (!isPlainObject(value)) return false;
  return (
    "hero" in value &&
    "contact" in value &&
    "about" in value &&
    "missionVision" in value &&
    "services" in value &&
    "advantages" in value &&
    "products" in value &&
    "footer" in value &&
    "ticker" in value
  );
}

/**
 * Build a complete `{ en, mn }` payload from the API.
 * Uses DB fields when present; fills gaps from `DEFAULT_SITE_CONTENT` / `DEFAULT_SITE_CONTENT_MN`.
 * For fetch errors, pass `undefined` — same as bundled defaults (lines above).
 */
export function normalizeBilingualFromApi(raw: unknown): BilingualSiteContent {
  if (!isPlainObject(raw)) {
    return structuredClone(DEFAULT_BILINGUAL) as BilingualSiteContent;
  }

  const o = raw as Record<string, unknown>;

  if (!("en" in o) && !("mn" in o) && isSiteContentDataLike(raw)) {
    return {
      en: structuredClone(raw as SiteContentData),
      mn: structuredClone(DEFAULT_SITE_CONTENT_MN) as SiteContentData,
    };
  }

  const enRaw = o.en;
  const mnRaw = o.mn;

  const en = isSiteContentDataLike(enRaw)
    ? (structuredClone(enRaw as SiteContentData) as SiteContentData)
    : (structuredClone(DEFAULT_SITE_CONTENT) as SiteContentData);
  const mn = isSiteContentDataLike(mnRaw)
    ? (structuredClone(mnRaw as SiteContentData) as SiteContentData)
    : (structuredClone(DEFAULT_SITE_CONTENT_MN) as SiteContentData);

  return { en, mn };
}
