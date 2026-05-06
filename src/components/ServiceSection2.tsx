import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Reveal } from '@/components/Reveal'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const SLIDES = [
  {
    src: '/Tug.png',
    alt: 'Moti Physio, Konted, Bomedix',
    num: '01',
    names: 'MOTI PHYSIO \u00a0·\u00a0 KONTED \u00a0·\u00a0 BOMEDIX',
    desc: 'AI Posture Analysis \u00a0·\u00a0 Portable Ultrasound \u00a0·\u00a0 Portable Ultrasound',
  },
  {
    src: '/Tug-2.png',
    alt: 'Curaco, Eve Muse, Sidas',
    num: '02',
    names: 'CURACO \u00a0·\u00a0 EVE MUSE \u00a0·\u00a0 SIDAS',
    desc: 'Carebidet \u00a0·\u00a0 Facial Analysis System \u00a0·\u00a0 Medical Insoles',
  },
  {
    src: '/Uul-3.png',
    alt: 'RealEMS',
    num: '03',
    names: 'REALEMS',
    desc: 'Low-Frequency Exercise & Massage Devices',
  },
  {
    src: '/Uul-5.png',
    alt: 'R2',
    num: '04',
    names: 'R2',
    desc: 'App based eKegel',
  },
  {
    src: '/Uul-4.png',
    alt: 'Aderm',
    num: '05',
    names: 'ADERM',
    desc: 'No needle delivery with Solenoid Technic',
  },
  {
    src: '/Uul-2.png',
    alt: 'Motioncare',
    num: '06',
    names: 'MOTIONCARE',
    desc: 'Pilates Equipment',
  },
] as const

function refreshStackTrigger() {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

export function ServiceSection2() {
  const scrollStackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [dotsVisible, setDotsVisible] = useState(false)
  const [portalReady, setPortalReady] = useState(false)

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useGSAP(() => {
    const el = scrollStackRef.current
    if (!el) return

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => setDotsVisible(true),
      onLeave: () => setDotsVisible(false),
      onEnterBack: () => setDotsVisible(true),
      onLeaveBack: () => setDotsVisible(false),
      onUpdate: (self) => {
        const n = SLIDES.length
        const idx = Math.min(n - 1, Math.max(0, Math.floor(self.progress * n)))
        setActive(idx)
      },
    })

    return () => st.kill()
  }, [])

  const dots =
    portalReady &&
    createPortal(
      <div
        className={`fixed right-7 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2.5 transition-opacity duration-300 pointer-events-none ${dotsVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden
      >
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full bg-neutral-600 transition-[background,transform] duration-300 ${i === active ? 'scale-150 bg-brand' : ''}`}
          />
        ))}
      </div>,
      document.body,
    )

  return (
    <section className="bg-[#060606] py-24 md:py-32" id="service-section-2" aria-labelledby="service-section-2-heading">
      {dots}

      <Reveal className="mx-auto mb-14 flex max-w-screen-2xl flex-col gap-8 px-6 md:mb-14 md:flex-row md:items-end md:justify-between md:px-[60px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Portfolio</p>
          <h2 id="service-section-2-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Our Main <span className="text-brand">Brands</span>
          </h2>
        </div>
        <p className="max-w-[320px] text-[15px] font-light leading-relaxed text-neutral-500">
          Ten specialized brands, one unified vision — delivering smarter healthcare technology.
        </p>
      </Reveal>

      <div
        ref={scrollStackRef}
        className="relative h-[calc(6*100dvh)] scroll-mt-24"
        id="serviceSection2ScrollStack"
      >
        <div className="sticky top-0 h-dvh overflow-hidden">
          <div className="relative h-full w-full">
            {SLIDES.map((slide, i) => (
              <article
                key={slide.src}
                data-index={i}
                aria-hidden={active !== i}
                className={`absolute inset-0 flex flex-col overflow-hidden transition-[opacity,transform] duration-[50ms] ease-linear will-change-[transform,opacity] ${
                  active === i
                    ? 'z-10 cursor-default opacity-100 [transform:translateY(0)_scale(1)]'
                    : 'pointer-events-none z-0 opacity-0 [transform:translateY(60px)_scale(0.92)]'
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  decoding="async"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  onLoad={refreshStackTrigger}
                  className="min-h-0 w-full flex-1 object-cover object-[center_top] select-none bg-[#060606]"
                />
                <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-t border-neutral-800 bg-[#050505] px-6 py-5 md:px-[60px]">
                  <span className="font-display text-[13px] font-bold tracking-[0.125em] text-brand">{slide.num}</span>
                  <span className="font-display text-[15px] font-bold tracking-wide text-white">{slide.names}</span>
                  <span className="min-w-[12rem] basis-full text-[13px] font-light leading-snug text-[#555] sm:basis-auto sm:min-w-0">{slide.desc}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
