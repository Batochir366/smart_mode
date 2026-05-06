import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import { Reveal } from '@/components/Reveal'

/** Full-width deck slides — imagery includes titles and typography. */
const BRAND_SLIDES = [
  {
    src: '/Tug.png',
    alt: 'Our main brands: MOTI PHYSIO posture analysis, KONTED and BOMEDIX portable ultrasound',
  },
  {
    src: '/Tug-2.png',
    alt: 'Our main brands: CURACO Carebidet, EVE MUSE facial analysis, and SIDAS medical insoles',
  },
  {
    src: '/Uul-3.png',
    alt: 'REALEMS brand: low-frequency exercise and massage devices',
  },
  {
    src: '/Uul-5.png',
    alt: 'R2 brand: app-based eKegel wellness device',
  },
] as const

/** Override ScrollStackItem defaults — zero padding so images are full bleed. */
const stackItemShell =
  'flex !h-auto flex-col overflow-hidden rounded-[inherit] !p-0 ring-0'

export function BrandsSection() {
  return (
    <section className="brands mb-64 bg-neutral-950 px-6 py-24 md:px-12 lg:px-16" id="brands">
      <Reveal className="mx-auto flex max-w-screen-2xl flex-col gap-10 lg:px-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Portfolio</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Our Main <span className="text-brand">Brands</span>
          </h2>
        </div>
        <p className="max-w-sm text-[15px] font-light leading-relaxed text-neutral-400 md:text-base">
          Ten specialized brands, one unified vision — delivering smarter healthcare technology.
        </p>
      </Reveal>

      <div id="scroll-stack-root" className="relative">
        <ScrollStack
          className=""
          itemDistance={50}
          itemScale={0.03}
          itemStackDistance={30}
          stackPosition="2%"
          scaleEndPosition="1%"
          baseScale={0.95}
          scaleDuration={0.5}
          rotationAmount={0}
          blurAmount={5}
          useWindowScroll
          onStackComplete={() => { }}
        >
          {BRAND_SLIDES.map((slide, index) => (
            <ScrollStackItem
              key={slide.src}
              itemClassName={`${stackItemShell} mt-16 shadow-xl shadow-black/40 ring-1 ring-white/10 `}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="pointer-events-none block h-auto w-full select-none bg-neutral-950"
                decoding="async"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  )
}
