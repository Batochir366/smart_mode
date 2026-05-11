import { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import CountUp from '@/components/CountUp'
import { InlineField } from '@/components/admin/InlineField'
import {
  HeroTrailMark,
  HERO_TRAIL_ELLIPSE_COUNT,
  HERO_TRAIL_HEAD,
  HEAD_R,
  HERO_TRAIL_LABEL_WORD_SELECTOR,
  HERO_TRAIL_VIEW_H,
} from '@/components/HeroTrailMark'
import { scrollToSection } from '@/lib/scroll'
import { useSiteContent } from '@/site/SiteContentContext'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const heroTitleClass =
  'font-sans text-[clamp(3rem,9vw,7.25rem)] font-bold leading-[0.92] tracking-[-0.02em] text-white'
const heroTitleAccentClass =
  'bg-gradient-to-r from-[#e8f7f0] via-[#b9f1d8] to-[#28d293] bg-clip-text text-transparent'
const heroTopPad = 'pt-20 sm:pt-24 md:pt-28 lg:pt-32'

// ─── Trail helpers (unchanged from original) ─────────────────────────────────
const HERO_TRAIL_COMPACT_MAX_W = 640
const HERO_TRAIL_LABEL_FADE_IN_START = 0.12
const HERO_TRAIL_LABEL_FADE_IN_END = 0.38
const HERO_TRAIL_EXIT_FADE_AT = 0.66
const HERO_INITIAL_VISIBLE_ELLIPSES = 3
const HERO_TRAIL_X_OFFSET = -120
const HERO_TRAIL_X_OFFSET_COMPACT = -20

function heroTrailScale(vw: number, vh: number) {
  const vmin = Math.min(vw, vh)
  const raw = (vmin * 0.42) / HERO_TRAIL_VIEW_H
  if (vw < HERO_TRAIL_COMPACT_MAX_W) return Math.min(3.5, Math.max(1.15, raw * 0.86))
  return Math.min(5.5, Math.max(2, raw))
}

function heroPathStrokePx(vw: number, vh: number) {
  return Math.max(10, Math.min(52, Math.round(Math.min(vw, vh) * 0.026)))
}

function heroTrailXOffset(vw: number) {
  return vw < HERO_TRAIL_COMPACT_MAX_W ? HERO_TRAIL_X_OFFSET_COMPACT : HERO_TRAIL_X_OFFSET
}

function heroTrailPathCenterY(vw: number, vh: number) {
  return vw < HERO_TRAIL_COMPACT_MAX_W ? vh * 0.4 : vh / 2
}

function trailLabelOpacity(p: number) {
  const t0 = HERO_TRAIL_LABEL_FADE_IN_START
  const t1 = HERO_TRAIL_LABEL_FADE_IN_END
  if (p <= t0) return 0
  if (p >= t1) return 1
  return (p - t0) / (t1 - t0)
}

function trailLabelWordOpacity(master: number, i: number, n: number) {
  if (n <= 0) return 0
  const start = i / n
  const end = (i + 1) / n
  if (master <= start) return 0
  if (master >= end) return 1
  return (master - start) / (end - start)
}

function trailExitFactor(p: number) {
  if (p <= HERO_TRAIL_EXIT_FADE_AT) return 0
  return (p - HERO_TRAIL_EXIT_FADE_AT) / (1 - HERO_TRAIL_EXIT_FADE_AT)
}

// ─── Repel ────────────────────────────────────────────────────────────────────
const REPEL_EXTRA_RADIUS_PX = 40
const REPEL_MAX_PUSH_PX = 80

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

// ─── Shared heading markup — used in both slide1 and slide2 ──────────────────
// data-repel-word only needed in slide2 (where trail lives), but harmless everywhere
function HeadingContent({
  repel = false,
  variant,
}: {
  repel?: boolean
  variant: import('@/site/SiteContentContext').SiteContentVariant
}) {
  const { data, setData } = useSiteContent()
  const hero = data.hero
  const rw = repel ? { 'data-repel-word': true } : {}
  const stats = hero.stats.slice(0, 3)
  return (
    <>
      <div className="mb-6 inline-flex max-w-max items-center rounded-full border border-brand/40 bg-brand/5 px-3 py-1.5 text-[10px] font-medium uppercase text-brand/90 sm:text-[11px]">
        <span className="mr-1.5 text-brand" aria-hidden>•</span>
        <InlineField
          variant={variant}
          className="text-[10px] font-medium uppercase text-brand/90 sm:text-[11px]"
          value={hero.badgeText}
          onChange={(next) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, badgeText: next },
            }))
          }
        />
      </div>
      <h1 className={`${heroTitleClass} flex flex-col`}>
        <span className="block will-change-transform">
          <InlineField
            variant={variant}
            className="block max-w-[95vw] whitespace-normal"
            value={hero.titleLine1}
            onChange={(next) =>
              setData((d) => ({
                ...d,
                hero: { ...d.hero, titleLine1: next },
              }))
            }
          />
        </span>
        <span className="mt-1 block will-change-transform">
          <InlineField
            variant={variant}
            className={`block max-w-[95vw] whitespace-normal ${heroTitleAccentClass}`}
            value={hero.titleLine2}
            onChange={(next) =>
              setData((d) => ({
                ...d,
                hero: { ...d.hero, titleLine2: next },
              }))
            }
          />
        </span>
      </h1>
      <div className="mt-12 flex max-w-xl items-start gap-5 sm:gap-6">
        <InlineField
          variant={variant}
          as="textarea"
          rows={3}
          className="font-sans text-[15px] font-medium leading-relaxed text-white sm:text-base will-change-transform"
          value={hero.description}
          onChange={(next) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, description: next },
            }))
          }
        />
      </div>
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-neutral-950 transition hover:brightness-105 active:brightness-95 text-nowrap will-change-transform"
          {...rw}
          onClick={() => scrollToSection('brands')}
        >
          <InlineField
            variant={variant}
            className={`text-sm font-semibold ${variant !== 'admin' ? 'text-neutral-950' : 'text-white'} text-nowrap`}
            value={hero.primaryCtaLabel}
            onChange={(next) =>
              setData((d) => ({
                ...d,
                hero: { ...d.hero, primaryCtaLabel: next },
              }))
            }
          />
        </button>
        <button
          type="button"
          className="rounded-full border border-neutral-600 bg-transparent px-6 py-2 text-sm font-semibold text-neutral-100 transition hover:border-neutral-400 text-nowrap will-change-transform"
          {...rw}
          onClick={() => scrollToSection('about')}
        >
          <InlineField
            variant={variant}
            className="text-sm font-semibold text-neutral-100"
            value={hero.secondaryCtaLabel}
            onChange={(next) =>
              setData((d) => ({
                ...d,
                hero: { ...d.hero, secondaryCtaLabel: next },
              }))
            }
          />
        </button>
      </div>
      <dl className="mt-12 grid grid-cols-3 gap-x-4 gap-y-8 sm:flex sm:flex-wrap sm:gap-x-32">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className={`flex min-w-0 flex-col gap-2 will-change-transform ${index === 2 ? 'sm:max-w-40' : 'sm:max-w-36'}`}
            {...rw}
          >
            <dd
              className="font-sans text-[clamp(2rem,5.8vw,3rem)] font-bold leading-none tabular-nums text-nowrap text-white"
            >
              {variant === 'admin' ? (
                <>
                  <InlineField
                    variant={variant}
                    className="inline min-w-[2ch] text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-none tabular-nums"
                    value={stat.value}
                    onChange={(next) =>
                      setData((d) => ({
                        ...d,
                        hero: {
                          ...d.hero,
                          stats: d.hero.stats.map((s) =>
                            s.id === stat.id ? { ...s, value: next } : s,
                          ),
                        },
                      }))
                    }
                  />
                  <InlineField
                    variant={variant}
                    className="inline ml-1 min-w-[2ch] text-[clamp(1.4rem,4vw,2rem)] font-bold leading-none tabular-nums"
                    value={stat.suffix}
                    onChange={(next) =>
                      setData((d) => ({
                        ...d,
                        hero: {
                          ...d.hero,
                          stats: d.hero.stats.map((s) =>
                            s.id === stat.id ? { ...s, suffix: next } : s,
                          ),
                        },
                      }))
                    }
                  />
                </>
              ) : (
                <>
                  <CountUp
                    className="inline text-nowrap"
                    duration={index === 2 ? 2.2 : 2}
                    delay={index === 1 ? 0.08 : index === 2 ? 0.12 : 0}
                    to={Number(stat.value) || 0}
                  />
                  {stat.suffix}
                </>
              )}
            </dd>
            <dt className="font-sans text-xs leading-snug text-neutral-500 sm:text-sm">
              <InlineField
                variant={variant}
                className="text-xs leading-snug text-neutral-500 sm:text-sm"
                value={stat.label}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    hero: {
                      ...d.hero,
                      stats: d.hero.stats.map((s) =>
                        s.id === stat.id ? { ...s, label: next } : s,
                      ),
                    },
                  }))
                }
              />
            </dt>
          </div>
        ))}
      </dl>
    </>
  )
}

// ─── Admin: document scroll only (no pin / horizontal scrub) ──────────────────
function HeroSectionAdminVertical() {
  const { data, setData } = useSiteContent()
  const hero = data.hero
  return (
    <div className="border-b border-white/10 bg-black">
      <p className="mx-auto max-w-screen-2xl px-6 pt-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-brand md:px-12">
        Эх дэлгэц
      </p>
      <section
        id="heroContent"
        className="hero-content relative z-10 w-full scroll-mt-24 bg-black pb-14 sm:pb-16 md:pb-20"
        aria-label="Smart Mode — hero"
      >
        <div className={`mx-auto flex max-w-screen-2xl flex-col px-6 md:px-12 lg:px-16 ${heroTopPad}`}>
          <HeadingContent variant="admin" />
          <div className="mt-8 max-w-md space-y-2 rounded-lg border border-white/10 bg-neutral-950/60 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Дагалдах өгүүлбэр</p>
            <InlineField
              variant="admin"
              className="text-sm text-white"
              value={hero.trailPhrase}
              onChange={(next) =>
                setData((d) => ({
                  ...d,
                  hero: { ...d.hero, trailPhrase: next },
                }))
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Live: pinned hero + scroll-driven trail ───────────────────────────────────
function HeroSectionLivePinned() {
  const { data } = useSiteContent()
  const hero = data.hero
  const trailGradId = useId().replace(/:/g, '')
  const containerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Slide 2 refs — heading + trail live here together
  const slide2HeadingRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const trailMarkRef = useRef<SVGGElement>(null)

  const prefersReducedMotion = usePrefersReducedMotion()

  // Repel cache in viewport-local coords (rebuilt each frame in onUpdate)
  const repelCacheRef = useRef<Array<{ el: HTMLElement; cx: number; cy: number }>>([])

  const buildRepelCache = (slide2: HTMLDivElement) => {
    const r = slide2.getBoundingClientRect()
    const words = slide2.querySelectorAll<HTMLElement>('[data-repel-word]')
    repelCacheRef.current = Array.from(words).map((el) => {
      const er = el.getBoundingClientRect()
      return {
        el,
        // coords relative to slide2 left edge (= SVG x=0)
        cx: er.left - r.left + er.width / 2,
        cy: er.top - r.top + er.height / 2,
      }
    })
  }

  const applyRepel = (ballX: number, ballY: number, scale: number) => {
    const renderedR = HEAD_R * scale + REPEL_EXTRA_RADIUS_PX
    repelCacheRef.current.forEach(({ el, cx, cy }) => {
      const dx = cx - ballX
      const dy = cy - ballY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < renderedR && dist > 0) {
        const proximity = 1 - dist / renderedR
        gsap.set(el, { x: (dx / dist) * proximity * REPEL_MAX_PUSH_PX })
      } else {
        gsap.set(el, { x: 0 })
      }
    })
  }

  const resetRepel = () => {
    repelCacheRef.current.forEach(({ el }) => gsap.set(el, { x: 0 }))
  }

  useGSAP(
    () => {
      if (prefersReducedMotion) return

      const container = containerRef.current
      const track = trackRef.current
      const slide2Heading = slide2HeadingRef.current
      const svgEl = svgRef.current
      const path = pathRef.current
      const trailMark = trailMarkRef.current

      if (!container || !track || !slide2Heading || !svgEl || !path || !trailMark) return

      // slide2 is the parent of slide2Heading
      const slide2 = slide2Heading.parentElement as HTMLDivElement

      const vw = () => window.innerWidth
      const vh = () => window.innerHeight

      let pathLen = 0
      let currentScale = 1

      // ── Trail label helpers ──────────────────────────────────────────────
      const setTrailLabelOpacity = (p: number) => {
        const nodes = trailMark.querySelectorAll<SVGTSpanElement>(HERO_TRAIL_LABEL_WORD_SELECTOR)
        const master = trailLabelOpacity(p)
        const n = nodes.length
        nodes.forEach((node, i) => gsap.set(node, { opacity: trailLabelWordOpacity(master, i, n) }))
      }

      const setTrailTransform = (px: number, py: number) => {
        const xOffset = heroTrailXOffset(vw())
        gsap.set(trailMark, {
          attr: {
            transform: `translate(${px + xOffset} ${py}) scale(${currentScale}) translate(${-HERO_TRAIL_HEAD.cx} ${-HERO_TRAIL_HEAD.cy})`,
          },
        })
        // Repel uses coords relative to slide2
        buildRepelCache(slide2)
        applyRepel(px, py, currentScale)
      }

      const syncEllipses = (p: number) => {
        const n = HERO_TRAIL_ELLIPSE_COUNT
        const nodes = trailMark.querySelectorAll<SVGEllipseElement>('[data-hero-trail-ellipse]')
        nodes.forEach((el, i) => {
          const base = Number(el.getAttribute('data-base-opacity') ?? 1)
          if (p <= 0) { gsap.set(el, { opacity: i < HERO_INITIAL_VISIBLE_ELLIPSES ? base : 0 }); return }
          const t0 = i / n, t1 = (i + 1) / n
          let o = 0
          if (p >= t1) o = base
          else if (p > t0) o = base * ((p - t0) / (t1 - t0))
          gsap.set(el, { opacity: o })
        })
      }

      // ── Setup: sizes SVG and path to match slide2 ────────────────────────
      const setup = () => {
        const w = vw(), h = vh()
        currentScale = heroTrailScale(w, h)

        // SVG fills slide2 (which is 100vw × 100vh)
        svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`)
        svgEl.setAttribute('width', String(w))
        svgEl.setAttribute('height', String(h))

        // Path: right→left, vertically centred in slide2
        // Mirrors the original heroTrailPathCenterY logic (track-centre based)
        const cy = heroTrailPathCenterY(w, h)
        const pad = Math.max(w * 0.08, 64)
        const rightX = w + pad
        const leftX = -pad - currentScale * 135
        path.setAttribute('d', `M ${rightX.toFixed(1)} ${cy.toFixed(2)} L ${leftX.toFixed(1)} ${cy.toFixed(2)}`)
        path.setAttribute('stroke-width', String(heroPathStrokePx(w, h)))

        pathLen = path.getTotalLength()
        gsap.set(path, { strokeDasharray: pathLen, strokeDashoffset: pathLen, opacity: 1 })
        gsap.set(trailMark, { autoAlpha: 1, visibility: 'visible' })

        if (pathLen > 0) {
          const p0 = path.getPointAtLength(0)
          setTrailTransform(p0.x, p0.y)
        }
        syncEllipses(0)
        setTrailLabelOpacity(0)
        resetRepel()
      }

      setup()

      // ── Timeline ─────────────────────────────────────────────────────────
      // 2 slides × 100vw = 200vw total track width
      // Scroll distance = 2 × vw so each slide gets equal scroll budget
      const progressProxy = { value: 0 }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${vw() * 2}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => { setup() },
        },
      })

      // First half (0→0.5): heading moves horizontally in a single slide.
      // Second half (0.5→1): trail animation plays.
      tl.fromTo(
        slide2Heading,
        { x: 0 },
        { x: () => -vw() * 1.5, duration: 0.6 },
        0
      )

      // Trail path draws during second half of scroll
      tl.fromTo(
        path,
        { strokeDashoffset: () => pathLen },
        { strokeDashoffset: 0, duration: 1 },
        0
      )

      tl.fromTo(
        progressProxy,
        { value: 0 },
        {
          value: 1,
          duration: 1,
          onUpdate() {
            const p = progressProxy.value
            if (pathLen <= 0) return

            const exit = trailExitFactor(p)
            const vis = 1 - exit
            gsap.set(trailMark, { autoAlpha: vis })
            gsap.set(path, { opacity: vis })
            setTrailLabelOpacity(p)

            const pt = path.getPointAtLength(pathLen * p)
            setTrailTransform(pt.x, pt.y)
            syncEllipses(p)

            if (exit >= 1) resetRepel()
          },
        },
        0
      )

      let alive = true
      void document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh() })
      return () => { alive = false; tl.kill(); resetRepel() }
    },
    { dependencies: [prefersReducedMotion], revertOnUpdate: true },
  )

  if (prefersReducedMotion) {
    return (
      <section id="heroContent" className="hero-content relative z-10 min-h-screen w-full">
        <div className={`flex h-full flex-col justify-center px-4 sm:px-5 md:px-10 lg:px-[60px] ${heroTopPad}`}>
          <HeadingContent variant="live" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="heroContent"
      ref={containerRef}
      className="hero-content relative z-10 w-full h-screen overflow-hidden"
    >
      {/* Track: 2 slides, each 100vw */}
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: '100vw' }}
      >

        {/* ── Slide 2: Heading + Trail together ──────────────────────────── */}
        <div
          className="relative flex h-full shrink-0 flex-col justify-center overflow-hidden px-4 sm:px-5 md:px-10 lg:px-[60px]"
          style={{ width: '100vw' }}
        >
          {/*
            SVG is absolute inset-0 inside slide2 — same coordinate space
            as the heading so repel works correctly.
          */}
          <svg
            ref={svgRef}
            className="pointer-events-none absolute inset-0 z-10"
            aria-hidden
          >
            <defs>
              <linearGradient id="hero-trail-path-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="50%" stopColor="#2ecc71" stopOpacity={1} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              fill="none"
              stroke="url(#hero-trail-path-grad)"
              strokeWidth={24}
              strokeLinecap="round"
            />
            <g ref={trailMarkRef}>
              <HeroTrailMark
                idPrefix={`hero-trail-${trailGradId}`}
                label={hero.trailPhrase}
              />
            </g>
          </svg>

          {/* Heading content inside slide2 — same spacing as slide1 */}
          <div ref={slide2HeadingRef} className={`relative z-20 ${heroTopPad}`}>
            <HeadingContent repel variant="live" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function HeroSection() {
  const { variant } = useSiteContent()
  if (variant === 'admin') {
    return <HeroSectionAdminVertical />
  }
  return <HeroSectionLivePinned />
}
