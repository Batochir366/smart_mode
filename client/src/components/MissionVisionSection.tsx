import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { InlineField } from '@/components/admin/InlineField'
import { useSiteContent } from '@/site/SiteContentContext'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SLOT_VH = 30
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

  const { data, variant, setData } = useSiteContent()
  const mv = data.missionVision
  const cards = mv.cards

  const cardAnimKey = useMemo(
    () => cards.map((c) => `${c.id}:${c.title}:${c.description}`).join('\u241e'),
    [cards],
  )

  useGSAP(
    () => {
      if (variant === 'admin') return

      const path = pathRef.current
      const dot = dotRef.current
      const layoutEl = layout.current
      const stageEl = stage.current
      const svgEl = svgRef.current
      if (!path || !dot || !layoutEl || !stageEl || !svgEl) return

      const mm = gsap.matchMedia()

      const attachCurveAnimations = () => {
        let length = 0
        const count = cards.length

        const setup = () => {
          const w = layoutEl.offsetWidth
          const totalH = layoutEl.offsetHeight
          const stageH = stageEl.offsetHeight
          if (!w || !totalH || !stageH || count === 0) return
          const layoutRect = layoutEl.getBoundingClientRect()
          const stageRect = stageEl.getBoundingClientRect()
          const stageTopY = Math.max(0, stageRect.top - layoutRect.top)
          const d = buildCurvePath(w, totalH, count, stageTopY, stageH)
          path.setAttribute('d', d)
          path.setAttribute('stroke-width', w < 768 ? '2' : '3')
          svgEl.setAttribute('viewBox', `0 0 ${w} ${totalH}`)
          length = path.getTotalLength()
        }

        setup()
        if (!count) return () => undefined
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.set(dot, { autoAlpha: 0 })

        for (let i = 0; i < count; i++) {
          const cardEl = layoutEl.querySelector<HTMLElement>(`.mv-card-${i}`)
          if (cardEl) gsap.set(cardEl, { autoAlpha: 0.25, scale: 0.97 })
        }

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
        for (let i = 0; i < count; i++) {
          const el = layoutEl.querySelector<HTMLElement>(`.mv-card-${i}`)
          if (!el) continue
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
        }

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
    {
      scope: root,
      dependencies: [cardAnimKey, variant],
      revertOnUpdate: true,
    },
  )

  return (
    <section
      ref={root}
      id="mission"
      className={`relative scroll-mt-24 bg-black px-6 md:px-12 lg:px-16 ${variant === 'live' ? 'overflow-hidden' : 'overflow-x-hidden overflow-y-visible pb-16'
        }`}
    >


      <div className={`relative mx-auto ${variant === 'live' ? 'max-w-7xl' : 'max-w-screen-2xl'}`}>
        <div ref={layout} className="relative">
          {variant === 'live' ? (
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
          ) : null}

          <header className="relative z-10 pt-20 md:pt-24 lg:pt-32">
            <InlineField
              variant={variant}
              className="text-sm font-semibold uppercase tracking-widest text-brand"
              value={mv.headerEyebrow}
              onChange={(next) =>
                setData((d) => ({
                  ...d,
                  missionVision: { ...d.missionVision, headerEyebrow: next },
                }))
              }
            />
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl font-benzin">
              {variant === 'live' ? (
                <>
                  <span>{mv.headerTitleLine1}</span>
                  <br />
                  <span className="text-white">
                    {mv.headerTitleLine2}
                    <span className="text-brand">{mv.headerTitleHighlight}</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="block">
                    <InlineField
                      variant={variant}
                      className="text-3xl font-bold md:text-3xl lg:text-4xl"
                      value={mv.headerTitleLine1}
                      onChange={(next) =>
                        setData((d) => ({
                          ...d,
                          missionVision: { ...d.missionVision, headerTitleLine1: next },
                        }))
                      }
                    />
                  </span>
                  <br />
                  <span className="inline-flex flex-wrap items-center gap-1">
                    <InlineField
                      variant={variant}
                      className="text-3xl font-bold md:text-3xl lg:text-4xl"
                      value={mv.headerTitleLine2}
                      onChange={(next) =>
                        setData((d) => ({
                          ...d,
                          missionVision: { ...d.missionVision, headerTitleLine2: next },
                        }))
                      }
                    />
                    <InlineField
                      variant={variant}
                      className="text-3xl font-bold text-brand md:text-3xl lg:text-4xl"
                      value={mv.headerTitleHighlight}
                      onChange={(next) =>
                        setData((d) => ({
                          ...d,
                          missionVision: { ...d.missionVision, headerTitleHighlight: next },
                        }))
                      }
                    />
                  </span>
                </>
              )}
            </h2>
          </header>

          {variant === 'admin' ? (
            <div className="relative z-20 mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    missionVision: {
                      ...d.missionVision,
                      cards: [
                        ...d.missionVision.cards,
                        {
                          id: `mv-${Date.now()}`,
                          title: 'Шинэ карт',
                          description: 'Тайлбарыг энд засна уу.',
                        },
                      ],
                    },
                  }))
                }
              >
                Карт нэмэх
              </button>
            </div>
          ) : null}

          {variant === 'admin' ? (
            <div className="relative z-10 mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
              {cards.map((item, i) => (
                <article
                  key={item.id}
                  className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-md shadow-lg md:mx-auto md:max-w-3xl md:p-6 lg:p-7"
                >
                  <h3 className="text-base font-semibold md:text-lg lg:text-2xl font-benzin">
                    <InlineField
                      variant={variant}
                      className="font-benzin text-base font-semibold md:text-lg lg:text-2xl"
                      value={item.title}
                      onChange={(next) =>
                        setData((d) => {
                          const nextCards = [...d.missionVision.cards]
                          if (!nextCards[i]) return d
                          nextCards[i] = { ...nextCards[i], title: next }
                          return {
                            ...d,
                            missionVision: { ...d.missionVision, cards: nextCards },
                          }
                        })
                      }
                    />
                  </h3>
                  <div className="mt-2 text-sm leading-relaxed text-neutral-300 md:text-[0.9rem]">
                    <InlineField
                      variant={variant}
                      as="textarea"
                      rows={5}
                      className="leading-relaxed text-neutral-300"
                      value={item.description}
                      onChange={(next) =>
                        setData((d) => {
                          const nextCards = [...d.missionVision.cards]
                          if (!nextCards[i]) return d
                          nextCards[i] = { ...nextCards[i], description: next }
                          return {
                            ...d,
                            missionVision: { ...d.missionVision, cards: nextCards },
                          }
                        })
                      }
                    />
                  </div>
                  {cards.length > 1 ? (
                    <button
                      type="button"
                      className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-200 hover:bg-red-500/20"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          missionVision: {
                            ...d.missionVision,
                            cards: d.missionVision.cards.filter((c) => c.id !== item.id),
                          },
                        }))
                      }
                    >
                      Устгах
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div
              ref={stage}
              className="relative z-10 mt-12 min-h-(--mv-stage-h-mobile) md:mt-16 md:min-h-(--mv-stage-h)"
              style={
                {
                  '--mv-stage-h': `${Math.max(1, cards.length) * SLOT_VH}vh`,
                  '--mv-stage-h-mobile': `${Math.max(1, cards.length) * SLOT_VH_MOBILE}vh`,
                } as React.CSSProperties
              }
            >
              {cards.map((item, i) => {
                const isLeft = i % 2 === 0
                const topPct = ((i + 0.5) / cards.length) * 100
                return (
                  <article
                    key={item.id}
                    className={`mv-card-${i} absolute z-10 max-w-[76%] -translate-y-1/2 rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/10 md:max-w-[40%] md:p-6 lg:max-w-[34%] lg:p-7 ${isLeft ? 'left-[3%] md:left-[4%]' : 'right-[3%] md:right-[4%]'
                      }`}
                    style={{ top: `${topPct}%` }}
                  >
                    <h3 className="text-base font-semibold md:text-lg lg:text-2xl font-benzin">
                      <InlineField
                        variant={variant}
                        className="font-benzin text-base font-semibold md:text-lg lg:text-2xl"
                        value={item.title}
                        onChange={(next) =>
                          setData((d) => {
                            const nextCards = [...d.missionVision.cards]
                            if (!nextCards[i]) return d
                            nextCards[i] = { ...nextCards[i], title: next }
                            return {
                              ...d,
                              missionVision: { ...d.missionVision, cards: nextCards },
                            }
                          })
                        }
                      />
                    </h3>
                    <div className="mt-2 text-sm leading-relaxed text-neutral-300 md:text-[0.9rem]">
                      <InlineField
                        variant={variant}
                        as="textarea"
                        rows={5}
                        className="leading-relaxed text-neutral-300"
                        value={item.description}
                        onChange={(next) =>
                          setData((d) => {
                            const nextCards = [...d.missionVision.cards]
                            if (!nextCards[i]) return d
                            nextCards[i] = { ...nextCards[i], description: next }
                            return {
                              ...d,
                              missionVision: { ...d.missionVision, cards: nextCards },
                            }
                          })
                        }
                      />
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
