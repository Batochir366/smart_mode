import { useRef } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, Observer, SplitText)

const SERVICES_NAV_TOP_PX = 50
const SERVICES_LOCK_ENTER = 1
const SERVICES_LOCK_LEAVE = 0.8

const GRADIENT_OVERLAY =
  'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.1) 100%)'

const SLIDES = [
  { heading: 'Smart Medical Devices', seed: 'smartmode-services-1' },
  { heading: 'Portable Diagnostic Equipment', seed: 'smartmode-services-2' },
  { heading: 'Technology-Driven Healthcare Solutions', seed: 'smartmode-services-3' },
] as const

export function ServicesSection() {
  const rootRef = useRef<HTMLDivElement>(null)

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
        sections.forEach((s, i) => {
          gsap.set(s, { autoAlpha: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' })
        })
        return
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
          defaults: { duration: 0.8, ease: 'power1.inOut' },
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
              duration: 0.8,
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

      gotoSection(0, 1)

      return () => {
        gsap.ticker.remove(syncSlideLock)
        ScrollSmoother.get()?.paused(false)
        observer.kill()
        splitHeadings.forEach((st) => st.revert())
      }
    },
    { scope: rootRef },
  )

  return (
    <div className="w-full bg-black">
      <div
        id="services"
        ref={rootRef}
        className="relative box-border w-full scroll-mt-24 text-neutral-100 [&_*]:box-border"
        aria-label="Services"
      >
        <div className="relative min-h-dvh min-h-[100vh]">
          <div className="sticky top-0 h-dvh max-w-full min-h-svh min-h-[100vh] w-full overflow-hidden">
            <header className="pointer-events-none absolute left-0 right-0 top-24 z-[3] flex h-[7em] w-full items-center justify-between px-[5%] text-[clamp(0.66rem,2vw,1rem)] uppercase tracking-[0.5em]">
              <div>Services</div>
              <div>
                <a
                  className="pointer-events-auto text-inherit no-underline hover:text-brand"
                  href="https://codepen.io/BrianCross/pen/PoWapLP"
                  target="_blank"
                  rel="noreferrer"
                >
                  Inspiration
                </a>
              </div>
            </header>

            <div className="relative h-full w-full">
              {SLIDES.map((slide, i) => (
                <section key={slide.seed} className="invisible absolute left-0 top-0 h-full w-full">
                  <div className="outer h-full w-full overflow-y-hidden">
                    <div className="inner h-full w-full overflow-y-hidden">
                      <div
                        className="services-bg absolute inset-0 flex size-full items-center justify-center bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `${GRADIENT_OVERLAY}, url(https://picsum.photos/seed/${slide.seed}/1920/1080)`,
                          ...(i === SLIDES.length - 1 ? { backgroundPosition: '50% 45%' } : {}),
                        }}
                      >
                        <h2 className="section-heading [&_*]:will-change-transform -mr-[0.5em] w-[90vw] max-w-[1200px] text-center text-[clamp(1rem,6vw,10rem)] font-semibold leading-[1.2] normal-case">
                          {slide.heading}
                        </h2>
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
