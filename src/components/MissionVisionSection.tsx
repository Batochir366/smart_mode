import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { NoiseBackground } from '@/components/ui/noise-background'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type FoundationItem = {
  title: string
  description: string
}

const items: FoundationItem[] = [
  {
    title: 'Our Mission',
    description:
      'To enhance healthcare quality by providing easy-to-use, portable, and highly efficient medical devices that empower clinicians and patients alike.',
  },
  {
    title: 'Our Vision',
    description:
      'To become a leading provider of smart and portable medical technologies — making advanced healthcare accessible across Mongolia and beyond.',
  },
  {
    title: 'Quality',
    description: 'Uncompromising standards in every device we deliver.',
  },
  {
    title: 'Innovation',
    description: 'Continuously pushing the boundaries of medical technology.',
  },
  {
    title: 'Trust',
    description: 'Building lasting relationships with clients and partners.',
  },
]

const SLOT_VH = 30
/** Slightly tighter vertical rhythm on narrow viewports (LR absolute layout). */
const SLOT_VH_MOBILE = 44
const LEFT_RATIO = 0.09
const RIGHT_RATIO = 0.74

function buildCurvePath(
  width: number,
  totalHeight: number,
  count: number,
  stageTopY: number,
  stageHeight: number,
  leftRatio = LEFT_RATIO,
  rightRatio = RIGHT_RATIO,
) {
  if (count === 0 || width === 0 || totalHeight === 0 || stageHeight <= 0) return ''
  const leftX = width * leftRatio
  const rightX = width * rightRatio

  const points: Array<[number, number]> = []
  for (let i = 0; i < count; i++) {
    const x = i % 2 === 0 ? leftX : rightX
    const y = stageTopY + ((i + 0.5) / count) * stageHeight
    points.push([x, y])
  }

  let d = `M ${points[0][0].toFixed(1)} 0`
  d += ` L ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i]
    const [px, py] = points[i - 1]
    const midY = (py + y) / 2
    d += ` C ${px.toFixed(1)} ${midY.toFixed(1)}, ${x.toFixed(1)} ${midY.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  const last = points[points.length - 1]
  d += ` L ${last[0].toFixed(1)} ${totalHeight}`
  return d
}

export function MissionVisionSection() {
  const root = useRef<HTMLElement>(null)
  const layout = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)

  useGSAP(
    () => {
      const path = pathRef.current
      const dot = dotRef.current
      const layoutEl = layout.current
      const stageEl = stage.current
      const svgEl = svgRef.current
      if (!path || !dot || !layoutEl || !stageEl || !svgEl) return

      const mm = gsap.matchMedia()

      const attachCurveAnimations = () => {
        let length = 0

        const setup = () => {
          const w = layoutEl.offsetWidth
          const totalH = layoutEl.offsetHeight
          const stageH = stageEl.offsetHeight
          if (!w || !totalH || !stageH) return
          const layoutRect = layoutEl.getBoundingClientRect()
          const stageRect = stageEl.getBoundingClientRect()
          const stageTopY = Math.max(0, stageRect.top - layoutRect.top)
          const d = buildCurvePath(w, totalH, items.length, stageTopY, stageH)
          path.setAttribute('d', d)
          path.setAttribute('stroke-width', w < 768 ? '2' : '3')
          svgEl.setAttribute('viewBox', `0 0 ${w} ${totalH}`)
          length = path.getTotalLength()
        }

        setup()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.set(dot, { autoAlpha: 0 })

        items.forEach((_, i) => {
          const card = layoutEl.querySelector<HTMLElement>(`.mv-card-${i}`)
          if (card) gsap.set(card, { autoAlpha: 0.25, scale: 0.97 })
        })

        const smoothWrapper = document.getElementById('smooth-wrapper')
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: layoutEl,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
            invalidateOnRefresh: true,
            ...(smoothWrapper ? { scroller: smoothWrapper } : {}),
            onRefreshInit: () => {
              setup()
              const dashLen = path.getTotalLength()
              gsap.set(path, { strokeDasharray: dashLen, strokeDashoffset: dashLen })
            },
          },
        })

        const dp = { value: 0 }

        const placeDot = () => {
          const len = path.getTotalLength()
          if (!len || !Number.isFinite(len)) return
          const t = Math.min(1, Math.max(0, dp.value))
          const dist = len * t
          const point = path.getPointAtLength(Math.min(dist, Math.max(0, len - 1e-6)))
          if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return
          gsap.set(dot, { autoAlpha: 1, attr: { cx: point.x, cy: point.y } })
        }

        tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0)
        tl.to(
          dp,
          {
            value: 1,
            duration: 1,
            onUpdate: placeDot,
          },
          0,
        )

        const cardTriggers: ScrollTrigger[] = []
        items.forEach((_, i) => {
          const el = layoutEl.querySelector<HTMLElement>(`.mv-card-${i}`)
          if (!el) return
          cardTriggers.push(
            ScrollTrigger.create({
              trigger: el,
              start: 'top 80%',
              end: 'bottom 25%',
              toggleActions: 'play reverse play reverse',
              ...(smoothWrapper ? { scroller: smoothWrapper } : {}),
              animation: gsap.to(el, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                borderColor: '#00bc7d',
                borderWidth: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
              }),
            }),
          )
        })

        return () => {
          cardTriggers.forEach((st) => st.kill())
          tl.kill()
        }
      }

      mm.add('(min-width: 1px)', () => attachCurveAnimations())

      return () => {
        mm.revert()
      }
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="mission"
      className="relative scroll-mt-24 overflow-hidden bg-black px-6 md:px-12 lg:px-16"
    >
      <NoiseBackground baseClassName="bg-black" gradientClassName="" patternAlpha={0} />

      <div className="relative mx-auto max-w-7xl">
        <div ref={layout} className="relative">
          <svg
            ref={svgRef}
            className="pointer-events-none absolute inset-0 z-0 block h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="mv-curve-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#2ecc71" stopOpacity="1" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            <path
              ref={pathRef}
              fill="none"
              stroke="url(#mv-curve-grad)"
              strokeWidth={3}
              strokeLinecap="round"
              className="motion-safe:filter-[drop-shadow(0_0_4px_rgba(46,204,113,0.35))] md:motion-safe:filter-[drop-shadow(0_0_6px_rgba(46,204,113,0.55))]"
            />

            <circle
              ref={dotRef}
              className="motion-safe:filter-[drop-shadow(0_0_4px_rgba(46,204,113,0.65))] md:motion-safe:filter-[drop-shadow(0_0_6px_rgba(46,204,113,0.9))]"
              r={7}
              fill="#2ecc71"
              style={{
                opacity: 0,
                visibility: 'hidden',
              }}
            />
          </svg>

          <header className="relative z-10 pt-20 md:pt-24 lg:pt-32">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Our Foundation
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl font-benzin">
              Mission, Vision &
              <br />
              <span className="text-brand">Core Values</span>
            </h2>
          </header>

          <div
            ref={stage}
            className="relative z-10 mt-12 min-h-(--mv-stage-h-mobile) md:mt-16 md:min-h-(--mv-stage-h)"
            style={
              {
                '--mv-stage-h': `${items.length * SLOT_VH}vh`,
                '--mv-stage-h-mobile': `${items.length * SLOT_VH_MOBILE}vh`,
              } as React.CSSProperties
            }
          >
            {items.map((item, i) => {
              const isLeft = i % 2 === 0
              const topPct = ((i + 0.5) / items.length) * 100
              return (
                <article
                  key={item.title}
                  className={`mv-card-${i} absolute z-10 max-w-[76%] -translate-y-1/2 rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/10 md:max-w-[40%] md:p-6 lg:max-w-[34%] lg:p-7 ${isLeft ? 'left-[3%] md:left-[4%]' : 'right-[3%] md:right-[4%]'
                    }`}
                  style={{ top: `${topPct}%` }}
                >
                  <h3 className="text-base font-semibold md:text-lg lg:text-2xl font-benzin">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-300 md:text-[0.9rem]">
                    {item.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
