import { useEffect, useRef, useState } from 'react'

import { Reveal } from '@/components/Reveal'
import { InlineField } from '@/components/admin/InlineField'
import { scrollToSection } from '@/lib/scroll'
import { useSiteContent } from '@/site/SiteContentContext'

/** Fixed asset — not editable in CMS. */
const ABOUT_BUILDING_IMAGE_SRC = '/barilga.png'

export function AboutSection() {
  const cloudBlend = 'mix-blend-screen pointer-events-none select-none'
  const sectionRef = useRef<HTMLElement>(null)
  const [solidOpacity, setSolidOpacity] = useState(0)
  const { data, variant, setData } = useSiteContent()
  const about = data.about

  useEffect(() => {
    if (variant === 'admin') return

    const updateSolidOpacity = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const fadeStart = viewportHeight * 0.9
      const fadeEnd = viewportHeight * 0
      const progress = (fadeStart - rect.top) / (fadeStart - fadeEnd)
      const clamped = Math.max(0, Math.min(1, progress))
      const eased = 1 - Math.pow(1 - clamped, 3)

      setSolidOpacity(1 - eased)
    }

    updateSolidOpacity()
    window.addEventListener('scroll', updateSolidOpacity, { passive: true })
    window.addEventListener('resize', updateSolidOpacity)

    return () => {
      window.removeEventListener('scroll', updateSolidOpacity)
      window.removeEventListener('resize', updateSolidOpacity)
    }
  }, [variant])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-x-clip overflow-y-visible px-0 py-0"
      aria-label="About Smart Mode"
    >
      {variant === 'live' ? (
        <>
          {/* ── Part 1: flags in sky ── */}
          <div className="relative mx-auto max-w-[100vw] overflow-x-clip overflow-y-visible md:rounded-none">
            <div className="relative min-h-[60vh] overflow-x-clip overflow-y-visible md:min-h-[90vh]">
              <div
                className="absolute inset-0 h-full w-full"
                style={{
                  background: `
                radial-gradient(ellipse 90% 60% at 14% 16%, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.12) 42%, transparent 58%),
                radial-gradient(ellipse 55% 40% at 92% 10%, rgba(255,255,255,0.22) 0%, transparent 52%),
                radial-gradient(ellipse 100% 70% at 50% 110%, rgba(186, 230, 253, 0.45) 0%, transparent 50%),
                linear-gradient(168deg, #a8e3f5 0%, #6ecae8 32%, #4ab8dd 58%, #3aa6cf 100%)
              `,
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 h-full w-full bg-black transition-opacity duration-1000"
                style={{ opacity: solidOpacity }}
                aria-hidden
              />
              <img
                src="/Uul-5.png"
                alt=""
                className={`absolute -right-[15%] top-0 z-[5] w-[min(92vw,920px)] max-w-[920px] object-contain object-right-top opacity-90 sm:w-[min(64vw,480px)] md:max-w-[900px] lg:w-[min(82vw,1720px)] about-bridge-clouds-drift-reverse ${cloudBlend}`}
                decoding="async"
              />
              <div className="pointer-events-none bottom-[80px] absolute inset-x-0 z-10 flex items-end justify-start max-w-screen-2xl mx-auto pb-0">
                <img
                  src="/Tug-2.png"
                  alt=""
                  className={`h-auto w-[min(58vw,330px)] max-w-[600px] object-contain object-bottom sm:w-[min(54vw,380px)] md:w-[min(50vw,440px)] lg:w-[min(54vw,640px)] ${cloudBlend}`}
                  decoding="async"
                />
                <img
                  src="/Tug.png"
                  alt=""
                  className={`h-auto w-[min(52vw,300px)] max-w-[520px] object-contain object-bottom sm:w-[min(48vw,340px)] md:w-[min(44vw,400px)] lg:w-[min(48vw,580px)] ${cloudBlend}`}
                  decoding="async"
                />
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none relative z-20 -mt-26 mx-auto w-full max-w-none overflow-visible sm:-mt-14"
            aria-hidden
          >
            <img
              src="/Uul-3.png"
              alt=""
              className={`absolute left-1/2 top-1/2 w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center about-bridge-clouds-drift ${cloudBlend}`}
              decoding="async"
            />
            <img
              src="/Uul-5.png"
              alt=""
              className={`absolute left-[32%] top-[50%] z-1 w-[62%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center about-bridge-clouds-drift-reverse ${cloudBlend}`}
              decoding="async"
            />
            <img
              src="/Uul-5.png"
              alt=""
              className={`absolute left-[32%] top-[50%] z-1 w-[62%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center about-bridge-clouds-drift ${cloudBlend}`}
              decoding="async"
            />
            <img
              src="/Uul-5.png"
              alt=""
              className={`absolute left-[85%] top-[50%] z-1 w-[62%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center about-bridge-clouds-drift-reverse ${cloudBlend}`}
              decoding="async"
            />
            <img
              src="/Uul-5.png"
              alt=""
              className={`absolute left-[85%] top-[50%] z-1 w-[62%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center about-bridge-clouds-drift-reverse ${cloudBlend}`}
              decoding="async"
            />

            <img
              src="/Uul-4.png"
              alt=""
              className={`absolute left-[70%] top-[48%] z-1 w-[58%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center about-bridge-clouds-drift-reverse ${cloudBlend}`}
              decoding="async"
            />
            <img
              src="/Uul-4.png"
              alt=""
              className={`absolute left-[0%] top-[48%] z-1 w-[68%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center about-bridge-clouds-drift ${cloudBlend}`}
              decoding="async"
            />
            <img
              src="/Uul-4.png"
              alt=""
              className={`absolute left-[30%] top-[48%] z-1 w-[68%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center about-bridge-clouds-drift-reverse ${cloudBlend}`}
              decoding="async"
            />
            <img
              src="/Uul.png"
              alt=""
              className={`absolute left-[70%] top-[48%] z-1 w-[68%] max-w-none -translate-x-1/2 -translate-y-1/3 object-contain object-center about-bridge-clouds-drift-reverse ${cloudBlend}`}
              decoding="async"
            />
          </div>
        </>
      ) : null}

      {/* ── Part 2: About us + building (nav #about scroll target) ── */}
      <div
        id="about"
        className={
          variant === 'admin'
            ? 'relative z-[35] scroll-mt-24 overflow-visible bg-black px-0 pt-8 pb-16'
            : 'relative z-10 scroll-mt-24 overflow-visible bg-black pt-16'
        }
      >
        <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mx-auto w-full max-w-2xl px-6 md:px-12 lg:mx-0 lg:mr-0 lg:max-w-xl lg:justify-self-end lg:pr-10 xl:max-w-2xl">
            <Reveal instant={variant === 'admin'}>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 shrink-0 bg-brand" aria-hidden />
                <InlineField
                  variant={variant}
                  className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-300"
                  value={about.eyebrow}
                  onChange={(next) =>
                    setData((d) => ({ ...d, about: { ...d.about, eyebrow: next } }))
                  }
                />
              </div>
              <h2 className="mt-5 font-benzin text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
                <span className="block">
                  <InlineField
                    variant={variant}
                    className="block text-3xl font-bold md:text-4xl lg:text-5xl"
                    value={about.titleLine1}
                    onChange={(next) =>
                      setData((d) => ({
                        ...d,
                        about: { ...d.about, titleLine1: next },
                      }))
                    }
                  />
                </span>

                <span className="inline-flex flex-wrap items-baseline gap-1">
                  {variant === 'live' ? (
                    <>
                      {about.titleLine2Prefix}
                      <span className="text-brand">{about.titleHighlight}</span>
                    </>
                  ) : (
                    <>
                      <InlineField
                        variant={variant}
                        className="inline-block text-3xl font-bold md:text-4xl lg:text-5xl"
                        value={about.titleLine2Prefix}
                        onChange={(next) =>
                          setData((d) => ({
                            ...d,
                            about: { ...d.about, titleLine2Prefix: next },
                          }))
                        }
                      />
                      <InlineField
                        variant={variant}
                        className="inline-block text-3xl font-bold text-brand md:text-4xl lg:text-5xl"
                        value={about.titleHighlight}
                        onChange={(next) =>
                          setData((d) => ({
                            ...d,
                            about: { ...d.about, titleHighlight: next },
                          }))
                        }
                      />
                    </>
                  )}
                </span>
              </h2>

              <InlineField
                variant={variant}
                as="textarea"
                rows={6}
                className="mt-8 leading-relaxed text-neutral-400"
                value={about.paragraphs[0] ?? ''}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    about: {
                      ...d.about,
                      paragraphs: [next, d.about.paragraphs[1] ?? ''],
                    },
                  }))
                }
              />
              <InlineField
                variant={variant}
                as="textarea"
                rows={6}
                className="mt-4 leading-relaxed text-neutral-400"
                value={about.paragraphs[1] ?? ''}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    about: {
                      ...d.about,
                      paragraphs: [d.about.paragraphs[0] ?? '', next],
                    },
                  }))
                }
              />
              <div className="mt-10 flex flex-wrap items-center gap-3">
                {variant === 'live' ? (
                  <button
                    type="button"
                    className="rounded-full bg-brand px-8 py-2 font-medium text-white transition hover:bg-brand/80"
                    onClick={() => scrollToSection('contact')}
                  >
                    {about.ctaLabel}
                  </button>
                ) : (
                  <InlineField
                    variant={variant}
                    className="rounded-full bg-brand px-6 py-2 text-sm font-medium text-white"
                    value={about.ctaLabel}
                    onChange={(next) =>
                      setData((d) => ({
                        ...d,
                        about: { ...d.about, ctaLabel: next },
                      }))
                    }
                  />
                )}
              </div>
            </Reveal>
          </div>

          <Reveal
            delay="2"
            instant={variant === 'admin'}
            className="relative isolate min-h-[220px] lg:min-h-[320px]"
          >
            <div className="relative flex justify-end overflow-visible">
              <img
                src={ABOUT_BUILDING_IMAGE_SRC}
                alt=""
                className="h-full w-full max-h-[min(70vh,520px)] object-cover object-bottom-right md:max-h-[560px] lg:max-h-none lg:min-h-[380px]"
                decoding="async"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
