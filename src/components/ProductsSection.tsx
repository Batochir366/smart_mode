import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Reveal } from '@/components/Reveal'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ImageProductCard = {
  kind: 'image'
  name: string
  roleLine: string
  quote: string
  imageSrc: string
  imageAlt: string
}

type GradientProductCard = {
  kind: 'gradient'
  blurb: string
  name: string
  roleLine: string
  initials?: string
}

type ProductRailItem = ImageProductCard | GradientProductCard

const CARDS: ProductRailItem[] = [
  {
    kind: 'image',
    name: 'Dr. Amina Hassan',
    roleLine: 'Head of Telemetry · Bayridge Medical',
    quote:
      'Continuous vitals on the ward finally feel effortless—fewer bedside hooks, clearer escalation paths.',
    imageSrc:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=900&fit=crop&q=80',
    imageAlt: 'Healthcare professional reviewing patient data',
  },
  {
    kind: 'gradient',
    blurb:
      'Field diagnostics shipped in days, not quarters. Calibration and QA checks run automatically before every session.',
    name: 'Jordan Lee',
    roleLine: 'Product Lead · Diagnostics',
    initials: 'JL',
  },
  {
    kind: 'image',
    name: 'Dr. Tomas Varga',
    roleLine: 'Rural Outreach Program',
    quote:
      'Portable imaging that doesn’t punish remote clinics—that’s what changes access, not brochures.',
    imageSrc:
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&h=900&fit=crop&q=80',
    imageAlt: 'Clinical setting with diagnostic equipment',
  },
  {
    kind: 'gradient',
    blurb:
      'Our workflow is now 80% automated, saving clinicians hours weekly. Deployments landed without disrupting patient flow.',
    name: 'Maya Patel',
    roleLine: 'COO · Northline Health Partners',
    initials: 'MP',
  },
  {
    kind: 'image',
    name: 'Elena Ruiz',
    roleLine: 'Director of Connected Care',
    quote:
      'Unified device telemetry meant our command center stopped chasing spreadsheets and started spotting risk early.',
    imageSrc:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=900&fit=crop&q=80',
    imageAlt: 'Care team collaborating in a modern clinic',
  },
  {
    kind: 'image',
    name: 'Dr. Amina Hassan',
    roleLine: 'Head of Telemetry · Bayridge Medical',
    quote:
      'Continuous vitals on the ward finally feel effortless—fewer bedside hooks, clearer escalation paths.',
    imageSrc:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=900&fit=crop&q=80',
    imageAlt: 'Healthcare professional reviewing patient data',
  },
  {
    kind: 'gradient',
    blurb:
      'Field diagnostics shipped in days, not quarters. Calibration and QA checks run automatically before every session.',
    name: 'Jordan Lee',
    roleLine: 'Product Lead · Diagnostics',
    initials: 'JL',
  },
  {
    kind: 'image',
    name: 'Dr. Tomas Varga',
    roleLine: 'Rural Outreach Program',
    quote:
      'Portable imaging that doesn’t punish remote clinics—that’s what changes access, not brochures.',
    imageSrc:
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&h=900&fit=crop&q=80',
    imageAlt: 'Clinical setting with diagnostic equipment',
  },
  {
    kind: 'gradient',
    blurb:
      'Our workflow is now 80% automated, saving clinicians hours weekly. Deployments landed without disrupting patient flow.',
    name: 'Maya Patel',
    roleLine: 'COO · Northline Health Partners',
    initials: 'MP',
  },
  {
    kind: 'image',
    name: 'Elena Ruiz',
    roleLine: 'Director of Connected Care',
    quote:
      'Unified device telemetry meant our command center stopped chasing spreadsheets and started spotting risk early.',
    imageSrc:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=900&fit=crop&q=80',
    imageAlt: 'Care team collaborating in a modern clinic',
  },
]

/** Matches `scroll-mt-24` / nav clearance used elsewhere. */
const PIN_TOP_OFFSET_PX = 160

/**
 * Matches the title row inset (`px-6 md:px-12 lg:px-16` + centered `max-w-screen-2xl` / 1536px).
 * Applied only at the start of the card track so horizontal scroll/GSAP scrub can expose full bleed.
 */
const RAIL_START_INSET =
  'ps-6 md:ps-12 lg:ps-[max(4rem,calc((100vw-1536px)/2+4rem))]'

function usePrefersReducedMotion() {
  const [v, set] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const upd = () => set(mq.matches)
    upd()
    mq.addEventListener('change', upd)
    return () => mq.removeEventListener('change', upd)
  }, [])
  return v
}

export function ProductsSection() {
  const rootRef = useRef<HTMLElement>(null)
  const pinWrapRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (prefersReducedMotion) return

      const pin = pinWrapRef.current
      const viewport = viewportRef.current
      const track = trackRef.current
      if (!pin || !viewport || !track) return

      const maxTravel = () => Math.max(0, track.scrollWidth - viewport.clientWidth)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: `top top+=${PIN_TOP_OFFSET_PX}px`,
          end: () => `+=${Math.max(maxTravel(), 1)}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      })

      tl.fromTo(track, { x: 0 }, { x: () => -maxTravel() })

      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh())
      })

      return () => {
        tl.kill()
      }
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  )

  const railFallback = prefersReducedMotion
    ? `flex gap-5 overflow-x-auto overflow-y-hidden pb-6 pt-1 snap-x snap-mandatory scrollbar-hide ${RAIL_START_INSET}`
    : `flex min-w-max gap-5 pb-6 pt-1 will-change-transform ${RAIL_START_INSET}`

  return (
    <section ref={rootRef} id="products" className="scroll-mt-24 my-16 w-full min-w-0 bg-black">
      <div className="relative mt-10 w-full min-w-0">
        <div className="mx-auto max-w-screen-2xl px-6 pb-12 md:px-12 lg:px-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Products</p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold font-benzin tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
                What powers smarter care
              </h2>
            </Reveal>
          </div>
        </div>
        <div ref={pinWrapRef}>
          <div
            ref={viewportRef}
            role="region"
            aria-label="Featured products — scroll with page to move horizontally"
            className={
              prefersReducedMotion ? 'w-full overflow-x-auto overflow-y-hidden scrollbar-hide' : 'w-full overflow-hidden'
            }
          >
            <div ref={trackRef} className={railFallback}>
              {CARDS.map((card, i) =>
                card.kind === 'gradient' ? (
                  <GradientCard key={`g-${card.name}-${i}`} {...card} />
                ) : (
                  <ImageCard key={`img-${card.name}-${i}`} {...card} />
                ),
              )}
              <div aria-hidden className="h-24 w-8 shrink-0 md:w-12" />
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

function ImageCard({
  name,
  roleLine,
  quote,
  imageSrc,
  imageAlt,
}: ImageProductCard) {
  return (
    <article className="relative h-[min(82vh,540px)] w-[min(92vw,430px)] shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-neutral-950 shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:h-[580px]">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        onLoad={() => ScrollTrigger.refresh()}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/35" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
        <span className="truncate text-sm font-semibold text-white">{name}</span>
        <span className="max-w-[58%] text-right text-xs leading-snug text-white/85">{roleLine}</span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 pb-7">
        <p className="text-[15px] font-semibold leading-snug tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] md:text-base">
          {quote}
        </p>
      </div>
    </article>
  )
}

function GradientCard({ blurb, name, roleLine, initials }: GradientProductCard) {
  const monogram =
    initials ??
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <article
      className="relative flex h-[min(82vh,540px)] w-[min(92vw,430px)] shrink-0 flex-col rounded-[18px] border border-emerald-500/20 bg-neutral-950 shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:h-[580px]"
      style={{
        background:
          'linear-gradient(165deg, rgba(46, 204, 113, 0.35) 0%, rgba(8, 28, 18, 0.95) 42%, #020202 100%)',
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
        <p className="text-lg font-semibold leading-relaxed text-white md:text-xl">{blurb}</p>
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 p-6">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/30 text-xs font-bold text-white"
          aria-hidden
        >
          {monogram}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          <p className="truncate text-xs text-white/70">{roleLine}</p>
        </div>
      </div>
    </article>
  )
}
