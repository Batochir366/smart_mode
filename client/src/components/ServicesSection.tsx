import { useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

import { InlineField } from '@/components/admin/InlineField'
import { uploadSiteAsset } from '@/lib/uploadSiteAsset'
import { useSiteContent } from '@/site/SiteContentContext'

gsap.registerPlugin(useGSAP, Observer, SplitText)

const SERVICES_NAV_TOP_PX = 50
const SERVICES_LOCK_ENTER = 1
const SERVICES_LOCK_LEAVE = 0.8

const GRADIENT_OVERLAY =
  'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.1) 100%)'

function ServicesSlideEditorList() {
  const { data, setData } = useSiteContent()
  const svc = data.services
  const slides = svc.slides
  const [uploadBusySlide, setUploadBusySlide] = useState<number | null>(null)

  const previewStyle = (slide: (typeof slides)[number]): CSSProperties => ({
    backgroundImage: `${GRADIENT_OVERLAY}, url(${slide.imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  })

  return (
    <div
      id="services"
      className="scroll-mt-24 border-t border-white/10 bg-black px-6 py-14 text-neutral-100 md:px-12 lg:px-16"
      aria-label="Үйлчилгээ — засвар"
    >
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-10 flex max-w-screen-2xl flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <InlineField
              variant="admin"
              className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-100"
              value={svc.headerLeft}
              onChange={(next) =>
                setData((d) => ({
                  ...d,
                  services: { ...d.services, headerLeft: next },
                }))
              }
            />
            <div className="flex flex-wrap items-center gap-3">
              <InlineField
                variant="admin"
                className="text-xs uppercase tracking-[0.2em] text-neutral-300"
                value={svc.headerLinkLabel}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    services: { ...d.services, headerLinkLabel: next },
                  }))
                }
              />
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/15"
            onClick={() =>
              setData((d) => ({
                ...d,
                services: {
                  ...d.services,
                  slides: [
                    ...d.services.slides,
                    {
                      id: `svc-${Date.now()}`,
                      heading: 'Шинэ слайд',
                      headerDesc: 'Толгойн тайлбар оруулна уу',
                      productDesc: 'Бүтээгдэхүүний тайлбар оруулна уу',
                      imageUrl: 'https://picsum.photos/seed/services-new/1920/1080',
                    },
                  ],
                },
              }))
            }
          >
            + Слайд нэмэх
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8">
          {slides.map((slide, i) => (
            <article
              key={slide.id}
              className="flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/90 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div
                className="relative aspect-[16/10] min-h-[180px] w-full shrink-0 bg-neutral-900"
                style={{
                  ...previewStyle(slide),
                  backgroundPosition:
                    slide.backgroundPosition ?? (i === slides.length - 1 ? '50% 45%' : 'center'),
                }}
              />

              <div className="max-h-[min(50vh,420px)] min-h-0 shrink-0 space-y-3 overflow-y-auto border-t border-white/10 p-5">
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-brand">
                    Слайд {i + 1}
                  </span>

                </div>

                <InlineField
                  variant="admin"
                  className="text-lg font-semibold leading-snug text-white"
                  value={slide.heading}
                  onChange={(next) =>
                    setData((d) => {
                      const nextSlides = [...d.services.slides]
                      if (!nextSlides[i]) return d
                      nextSlides[i] = { ...nextSlides[i], heading: next }
                      return { ...d, services: { ...d.services, slides: nextSlides } }
                    })
                  }
                />

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                    Бүтээгдэхүүний тайлбар
                  </p>
                  <InlineField
                    variant="admin"
                    className="mt-1 text-sm text-neutral-200"
                    value={slide.productDesc ?? ''}
                    onChange={(next) =>
                      setData((d) => {
                        const nextSlides = [...d.services.slides]
                        if (!nextSlides[i]) return d
                        nextSlides[i] = { ...nextSlides[i], productDesc: next }
                        return { ...d, services: { ...d.services, slides: nextSlides } }
                      })
                    }
                  />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">Зургийн холбоос</p>
                  <InlineField
                    variant="admin"
                    className="mt-1 font-mono text-xs text-white"
                    value={slide.imageUrl}
                    onChange={(next) =>
                      setData((d) => {
                        const nextSlides = [...d.services.slides]
                        if (!nextSlides[i]) return d
                        nextSlides[i] = { ...nextSlides[i], imageUrl: next }
                        return { ...d, services: { ...d.services, slides: nextSlides } }
                      })
                    }
                  />
                </div>

                <div className="flex gap-2 w-full">
                  <label className="cursor-pointer rounded-md border border-brand/35 bg-brand/10 px-3 py-1 text-xs text-brand hover:bg-brand/20">
                    {uploadBusySlide === i ? 'Оруулж байна…' : 'Оруулах'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadBusySlide === i}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploadBusySlide(i)
                        void uploadSiteAsset(file)
                          .then((url) =>
                            setData((d) => {
                              const nextSlides = [...d.services.slides]
                              if (!nextSlides[i]) return d
                              nextSlides[i] = { ...nextSlides[i], imageUrl: url }
                              return { ...d, services: { ...d.services, slides: nextSlides } }
                            }),
                          )
                          .finally(() => {
                            setUploadBusySlide(null)
                            e.target.value = ''
                          })
                      }}
                    />
                  </label>
                  {slides.length > 1 ? (
                    <button
                      type="button"
                      className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-200 hover:bg-red-500/20 w-full"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          services: {
                            ...d.services,
                            slides: d.services.slides.filter((s) => s.id !== slide.id),
                          },
                        }))
                      }
                    >
                      Устгах
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function ServicesShowcaseLive() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { data, setData } = useSiteContent()
  const svc = data.services
  const slides = svc.slides

  const gsapRefreshKey = useMemo(
    () =>
      slides
        .map(
          (s) =>
            `${s.id}:${s.heading}:${s.headerDesc ?? ''}:${s.productDesc ?? ''}:${s.imageUrl}:${s.backgroundPosition ?? ''}`,
        )
        .join('|'),
    [slides],
  )

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const sections = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('section'))
      if (!sections.length) return

      if (prefersReduced) {
        let idx = 0
        const show = (next: number) => {
          sections.forEach((s, j) => {
            gsap.set(s, {
              autoAlpha: j === next ? 1 : 0,
              visibility: j === next ? 'visible' : 'hidden',
            })
          })
          idx = next
        }

        show(0)

        const lastSlide = sections.length - 1
        const observer = Observer.create({
          target: root,
          type: 'wheel,touch,pointer',
          wheelSpeed: -1,
          onDown: (self) => {
            if (idx > 0) show(idx - 1)
            else scrollPageBackward(self)
          },
          onUp: (self) => {
            if (idx < lastSlide) show(idx + 1)
            else scrollPageForward(self)
          },
          tolerance: 10,
          preventDefault: true,
        })
        observer.disable()

        function wheelDistance(self: Observer): number {
          const e = self.event as WheelEvent | undefined
          if (!e || typeof e.deltaY !== 'number') return 140
          let d = Math.abs(e.deltaY)
          if (e.deltaMode === 1) d *= 15
          if (e.deltaMode === 2) d *= typeof window !== 'undefined' ? window.innerHeight : 600
          return Math.min(Math.max(d, 48), 800)
        }

        function scrollPageForward(self: Observer) {
          const smoother = ScrollSmoother.get()
          const dy = wheelDistance(self)
          if (smoother) smoother.scrollTo(smoother.scrollTop() + dy, true)
          else window.scrollBy({ top: dy, left: 0, behavior: 'smooth' })
        }

        function scrollPageBackward(self: Observer) {
          const smoother = ScrollSmoother.get()
          const dy = wheelDistance(self)
          if (smoother) smoother.scrollTo(smoother.scrollTop() - dy, true)
          else window.scrollBy({ top: -dy, left: 0, behavior: 'smooth' })
        }

        function coverRatioInViewport(el: HTMLElement): number {
          const r = el.getBoundingClientRect()
          const topBound = SERVICES_NAV_TOP_PX
          const bottomBound = typeof window !== 'undefined' ? window.innerHeight : 0
          const visibleTop = Math.max(r.top, topBound)
          const visibleBottom = Math.min(r.bottom, bottomBound)
          const visible = Math.max(0, visibleBottom - visibleTop)
          const slot = Math.max(1, bottomBound - topBound)
          return visible / slot
        }

        let slideLock = false
        function syncSlideLock() {
          const node = rootRef.current
          if (!node) return
          const r = node.getBoundingClientRect()
          const vh = window.innerHeight
          const ratio = coverRatioInViewport(node)
          const smoother = ScrollSmoother.get()

          const farAbove = r.bottom < 0
          const farBelow = r.top > vh
          if (farAbove || farBelow) {
            if (slideLock) {
              slideLock = false
              smoother?.paused(false)
              observer.disable()
            }
            return
          }

          if (!slideLock && ratio >= SERVICES_LOCK_ENTER) {
            slideLock = true
            smoother?.paused(true)
            observer.enable()
          } else if (slideLock && ratio <= SERVICES_LOCK_LEAVE) {
            slideLock = false
            smoother?.paused(false)
            observer.disable()
          }
        }

        gsap.ticker.add(syncSlideLock)

        return () => {
          gsap.ticker.remove(syncSlideLock)
          ScrollSmoother.get()?.paused(false)
          observer.kill()
        }
      }

      const images = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.services-bg'))
      const headings = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.section-heading'))
      const outerWrappers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.outer'))
      const innerWrappers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.inner'))

      const splitHeadings = headings.map(
        (heading) =>
          new SplitText(heading, { type: 'chars,words,lines', linesClass: 'overflow-hidden' }),
      )

      let currentIndex = -1
      let animating = false
      const lastSlide = sections.length - 1

      gsap.set(outerWrappers, { yPercent: 100 })
      gsap.set(innerWrappers, { yPercent: -100 })

      function wheelDistance(self: Observer): number {
        const e = self.event as WheelEvent | undefined
        if (!e || typeof e.deltaY !== 'number') return 140
        let d = Math.abs(e.deltaY)
        if (e.deltaMode === 1) d *= 15
        if (e.deltaMode === 2) d *= typeof window !== 'undefined' ? window.innerHeight : 600
        return Math.min(Math.max(d, 48), 800)
      }

      function scrollPageForward(self: Observer) {
        const smoother = ScrollSmoother.get()
        const dy = wheelDistance(self)
        if (smoother) {
          const next = smoother.scrollTop() + dy
          smoother.scrollTo(next, true)
        } else window.scrollBy({ top: dy, left: 0, behavior: 'smooth' })
      }

      function scrollPageBackward(self: Observer) {
        const smoother = ScrollSmoother.get()
        const dy = wheelDistance(self)
        if (smoother) {
          const next = smoother.scrollTop() - dy
          smoother.scrollTo(next, true)
        } else window.scrollBy({ top: -dy, left: 0, behavior: 'smooth' })
      }

      function gotoSection(index: number, direction: number) {
        if (index < 0 || index > lastSlide) return
        animating = true
        const fromTop = direction === -1
        const dFactor = fromTop ? -1 : 1
        const tl = gsap.timeline({
          defaults: { duration: 0.4, ease: 'power1.inOut' },
          onComplete: () => {
            animating = false
          },
        })
        if (currentIndex >= 0) {
          gsap.set(sections[currentIndex], { zIndex: 0 })
          tl.to(images[currentIndex], { yPercent: -15 * dFactor }).set(sections[currentIndex], {
            autoAlpha: 0,
          })
        }
        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 })
        tl.fromTo(
          [outerWrappers[index], innerWrappers[index]],
          {
            yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor),
          },
          {
            yPercent: 0,
          },
          0,
        )
          .fromTo(
            images[index],
            { yPercent: 15 * dFactor },
            { yPercent: 0 },
            0,
          )
          .fromTo(
            splitHeadings[index].chars,
            {
              autoAlpha: 0,
              yPercent: 150 * dFactor,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.5,
              ease: 'power2',
              stagger: {
                each: 0.02,
                from: 'random',
              },
            },
            0.1,
          )

        currentIndex = index
      }

      const observer = Observer.create({
        target: root,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        onDown: (self) => {
          if (animating) return
          if (currentIndex > 0) gotoSection(currentIndex - 1, -1)
          else scrollPageBackward(self)
        },
        onUp: (self) => {
          if (animating) return
          if (currentIndex < lastSlide) gotoSection(currentIndex + 1, 1)
          else scrollPageForward(self)
        },
        tolerance: 10,
        preventDefault: true,
      })

      observer.disable()

      function coverRatioInViewport(el: HTMLElement): number {
        const r = el.getBoundingClientRect()
        const topBound = SERVICES_NAV_TOP_PX
        const bottomBound = typeof window !== 'undefined' ? window.innerHeight : 0
        const visibleTop = Math.max(r.top, topBound)
        const visibleBottom = Math.min(r.bottom, bottomBound)
        const visible = Math.max(0, visibleBottom - visibleTop)
        const slot = Math.max(1, bottomBound - topBound)
        return visible / slot
      }

      let slideLock = false

      function syncSlideLock() {
        const node = rootRef.current
        if (!node) return
        const ratio = coverRatioInViewport(node)
        const smoother = ScrollSmoother.get()
        const r = node.getBoundingClientRect()
        const vh = window.innerHeight

        const farAbove = r.bottom < 0
        const farBelow = r.top > vh
        if (farAbove || farBelow) {
          if (slideLock) {
            slideLock = false
            smoother?.paused(false)
            observer.disable()
          }
          return
        }

        if (!slideLock && ratio >= SERVICES_LOCK_ENTER) {
          slideLock = true
          smoother?.paused(true)
          observer.enable()
        } else if (slideLock && ratio <= SERVICES_LOCK_LEAVE) {
          slideLock = false
          smoother?.paused(false)
          observer.disable()
        }
      }

      gsap.ticker.add(syncSlideLock)

      gotoSection(0, 1)

      return () => {
        gsap.ticker.remove(syncSlideLock)
        ScrollSmoother.get()?.paused(false)
        observer.kill()
        splitHeadings.forEach((st) => st.revert())
      }
    },
    { scope: rootRef, dependencies: [gsapRefreshKey], revertOnUpdate: true },
  )

  return (
    <div className="w-full bg-black">
      <div
        key={gsapRefreshKey}
        id="services"
        ref={rootRef}
        className="relative box-border w-full scroll-mt-24 text-neutral-100 [&_*]:box-border"
        aria-label="Services"
      >
        <div className="relative min-h-dvh min-h-[100vh]">
          <div className="sticky top-0 h-dvh max-w-full min-h-svh min-h-[100vh] w-full overflow-hidden">
            <header className="pointer-events-none absolute left-0 right-0 top-20 z-[3] md:top-34">
              <div className="pointer-events-auto mx-auto w-[90vw] max-w-[1500px]">
                <div className="max-w-[560px]">
                  <InlineField
                    variant="live"
                    className="text-sm md:text-lg font-medium normal-case tracking-normal text-neutral-100/85"
                    value={svc.headerLeft}
                    onChange={(next) =>
                      setData((d) => ({
                        ...d,
                        services: { ...d.services, headerLeft: next },
                      }))
                    }
                  />
                  <p className="mt-2 text-2xl md:text-4xl font-semibold leading-[1.06] normal-case tracking-tight text-neutral-100">
                    {svc.headerLinkLabel}
                  </p>
                </div>
              </div>
            </header>

            <div className="relative h-full w-full">
              {slides.map((slide, i) => (
                <section key={slide.id} className="invisible absolute left-0 top-10 h-full w-full">
                  <div className="outer h-full w-full overflow-y-hidden">
                    <div className="inner h-full w-full overflow-y-hidden">
                      <div
                        className="services-bg absolute inset-0 flex size-full items-end justify-center bg-cover bg-center bg-no-repeat pb-30 md:pb-40"
                        style={{
                          backgroundImage: `${GRADIENT_OVERLAY}, url(${slide.imageUrl})`,
                          ...(slide.backgroundPosition
                            ? { backgroundPosition: slide.backgroundPosition }
                            : i === slides.length - 1
                              ? { backgroundPosition: '50% 45%' }
                              : {}),
                        }}
                      >
                        <div className="mx-auto flex w-[90vw] max-w-[1500px] flex-col gap-6 text-left md:gap-8">
                          <div className="max-w-[300px] md:max-w-[850px]">
                            <h2 className="section-heading [&_*]:will-change-transform text-3xl md:text-8xl font-semibold leading-[1.03] normal-case">
                              {slide.heading}
                            </h2>
                          </div>
                          <InlineField
                            variant="live"
                            className="max-w-[620px] text-sm md:text-lg leading-relaxed text-neutral-200/90"
                            value={slide.productDesc ?? ''}
                            onChange={(next) =>
                              setData((d) => {
                                const nextSlides = [...d.services.slides]
                                if (!nextSlides[i]) return d
                                nextSlides[i] = { ...nextSlides[i], productDesc: next }
                                return { ...d, services: { ...d.services, slides: nextSlides } }
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ServicesSection() {
  const { variant } = useSiteContent()

  if (variant === 'admin') {
    return <ServicesSlideEditorList />
  }

  return <ServicesShowcaseLive />
}
