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
  titleLine3: string;
  titleLine4: string;
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

export type SiteContentApiResponse = {
  version: number;
  updatedAt: string;
  data: SiteContentData;
};

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  hero: {
    badgeText: "Est. 2017 · Medical technology",
    titleLine1: "Build",
    titleLine2: "Smarter",
    titleLine3: "Grow",
    titleLine4: "Faster.",
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=900&fit=crop&q=80";

/** Legacy DB rows may include removed `gradient` quote cards — coerce to image cards. */
export function normalizeProductCardsFromUnknown(
  raw: unknown,
): ProductCard[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: ProductCard[] = [];
  for (const item of raw) {
    if (!isPlainObject(item)) continue;
    const id =
      typeof item.id === "string" && item.id.length > 0
        ? item.id
        : `prod-${out.length}`;
    const name = typeof item.name === "string" ? item.name : "Name";
    const roleLine = typeof item.roleLine === "string" ? item.roleLine : "Role";

    if (item.kind === "image") {
      const quote = typeof item.quote === "string" ? item.quote : "";
      const imageSrc =
        typeof item.imageSrc === "string"
          ? item.imageSrc
          : DEFAULT_PRODUCT_IMAGE;
      const imageAlt =
        typeof item.imageAlt === "string" ? item.imageAlt : `${name} photo`;
      out.push({
        kind: "image",
        id,
        name,
        roleLine,
        quote,
        imageSrc,
        imageAlt,
      });
      continue;
    }

    if (item.kind === "gradient") {
      const quote = typeof item.blurb === "string" ? item.blurb : "";
      out.push({
        kind: "image",
        id,
        name,
        roleLine,
        quote,
        imageSrc: DEFAULT_PRODUCT_IMAGE,
        imageAlt: `${name} photo`,
      });
    }
  }
  return out.length > 0 ? out : undefined;
}

/** Deep-merge partial API payload over defaults so older DB rows stay compatible. */
export function mergeSiteContent(
  defaults: SiteContentData,
  partial: unknown,
): SiteContentData {
  if (!isPlainObject(partial)) return defaults;
  const out: SiteContentData = { ...defaults };
  (Object.keys(defaults) as (keyof SiteContentData)[]).forEach((key) => {
    const patch = partial[key];
    if (patch === undefined) return;
    if (key === "contact" && isPlainObject(patch)) {
      out.contact = {
        ...defaults.contact,
        ...patch,
        info: Array.isArray(patch.info)
          ? (patch.info as ContactInfoItem[])
          : defaults.contact.info,
      };
      return;
    }
    if (key === "hero" && isPlainObject(patch)) {
      const p = patch as Partial<HeroSectionContent>;
      out.hero = {
        ...defaults.hero,
        ...p,
        stats: Array.isArray(p.stats)
          ? (p.stats as HeroStatItem[])
          : defaults.hero.stats,
      };
      return;
    }
    if (key === "about" && isPlainObject(patch)) {
      const p = patch as Partial<AboutPart2Content>;
      out.about = {
        ...defaults.about,
        ...p,
        paragraphs:
          Array.isArray(p.paragraphs) && p.paragraphs.length >= 2
            ? ([p.paragraphs[0], p.paragraphs[1]] as [string, string])
            : defaults.about.paragraphs,
      };
      return;
    }
    if (key === "missionVision" && isPlainObject(patch)) {
      const p = patch as Partial<MissionVisionSectionContent>;
      out.missionVision = {
        ...defaults.missionVision,
        ...p,
        cards: Array.isArray(p.cards)
          ? (p.cards as MissionVisionCard[])
          : defaults.missionVision.cards,
      };
      return;
    }
    if (key === "services" && isPlainObject(patch)) {
      const p = patch as Partial<ServicesSectionContent>;
      out.services = {
        ...defaults.services,
        ...p,
        slides: Array.isArray(p.slides)
          ? (p.slides as ServiceSlide[])
          : defaults.services.slides,
      };
      return;
    }
    if (key === "advantages" && isPlainObject(patch)) {
      const p = patch as Partial<AdvantagesSectionContent>;
      out.advantages = {
        ...defaults.advantages,
        ...p,
        cards: Array.isArray(p.cards)
          ? (p.cards as AdvantagesCard[])
          : defaults.advantages.cards,
      };
      return;
    }
    if (key === "products" && isPlainObject(patch)) {
      const p = patch as Partial<ProductsSectionContent>;
      let cards = defaults.products.cards;
      if (Array.isArray(p.cards)) {
        const normalized = normalizeProductCardsFromUnknown(p.cards);
        if (normalized !== undefined) cards = normalized;
      }
      out.products = {
        ...defaults.products,
        ...p,
        cards,
      };
      return;
    }
    if (key === "footer" && isPlainObject(patch)) {
      out.footer = {
        ...defaults.footer,
        ...(patch as Partial<FooterSectionContent>),
      };
      return;
    }
    if (key === "ticker" && isPlainObject(patch)) {
      const p = patch as Partial<TickerSectionContent>;
      out.ticker = {
        ...defaults.ticker,
        ...p,
        items: Array.isArray(p.items)
          ? p.items.filter((v): v is string => typeof v === "string")
          : defaults.ticker.items,
      };
    }
  });
  return out;
}
