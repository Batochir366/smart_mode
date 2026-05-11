import { z } from 'zod'

const iconSchema = z.enum(['mail', 'phone', 'pin'])

export const contactInfoItemSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  value: z.string(),
  copyText: z.string().optional(),
  icon: iconSchema,
})

export const contactSectionSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  info: z.array(contactInfoItemSchema),
})

export const aboutPart2Schema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleLine2Prefix: z.string(),
  titleHighlight: z.string(),
  paragraphs: z.tuple([z.string(), z.string()]),
  ctaLabel: z.string(),
})

export const heroSectionSchema = z.object({
  badgeText: z.string(),
  titleLine1: z.string(),
  titleLine2: z.string(),
  description: z.string(),
  primaryCtaLabel: z.string(),
  secondaryCtaLabel: z.string(),
  trailPhrase: z.string(),
  stats: z.array(
    z.object({
      id: z.string().min(1),
      value: z.string(),
      suffix: z.string(),
      label: z.string(),
      highlight: z.boolean().optional(),
    }),
  ),
})

export const missionCardSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  description: z.string(),
})

export const missionVisionSectionSchema = z.object({
  headerEyebrow: z.string(),
  headerTitleLine1: z.string(),
  headerTitleLine2: z.string(),
  headerTitleHighlight: z.string(),
  cards: z.array(missionCardSchema),
})

export const serviceSlideSchema = z.object({
  id: z.string().min(1),
  heading: z.string(),
  headerDesc: z.string().optional(),
  productDesc: z.string().optional(),
  imageUrl: z.string(),
  backgroundPosition: z.string().optional(),
})

export const servicesSectionSchema = z.object({
  headerLeft: z.string(),
  headerLinkLabel: z.string(),
  slides: z.array(serviceSlideSchema),
})

export const productCardSchema = z.object({
  kind: z.literal('image'),
  id: z.string().min(1),
  name: z.string(),
  roleLine: z.string(),
  quote: z.string(),
  imageSrc: z.string(),
  imageAlt: z.string(),
})

export const productsSectionSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  cards: z.array(productCardSchema),
})

export const advantagesCardSchema = z.object({
  id: z.string().min(1),
  step: z.string(),
  title: z.string(),
  description: z.string(),
})

export const advantagesSectionSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  cards: z.array(advantagesCardSchema),
})

export const footerSectionSchema = z.object({
  logoTop: z.string(),
  logoBottom: z.string(),
  taglineLine1: z.string(),
  taglineHighlight: z.string(),
  taglineLine2: z.string(),
  qrUrl: z.string(),
  qrLabel: z.string(),
  phonePrefix: z.string(),
  phoneValue: z.string(),
  webPrefix: z.string(),
  webValue: z.string(),
  emailPrefix: z.string(),
  emailValue: z.string(),
  copyrightText: z.string(),
})

export const tickerSectionSchema = z.object({
  items: z.array(z.string()),
  separator: z.string(),
})

export const siteContentDataSchema = z.object({
  hero: heroSectionSchema,
  contact: contactSectionSchema,
  about: aboutPart2Schema,
  missionVision: missionVisionSectionSchema,
  services: servicesSectionSchema,
  advantages: advantagesSectionSchema,
  products: productsSectionSchema,
  footer: footerSectionSchema,
  ticker: tickerSectionSchema,
})

export const bilingualSiteContentSchema = z.object({
  en: siteContentDataSchema,
  mn: siteContentDataSchema,
})

export const contactFormSchema = z.object({
  name: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  email: z.string().email().max(320),
  message: z.string().min(1).max(20_000),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
