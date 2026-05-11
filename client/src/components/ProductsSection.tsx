import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { Reveal } from '@/components/Reveal'
import { InlineField } from '@/components/admin/InlineField'
import { uploadSiteAsset } from '@/lib/uploadSiteAsset'
import { useSiteContent } from '@/site/SiteContentContext'

import type { ProductCard } from '@shared/siteContent'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Matches `scroll-mt-24` / nav clearance used elsewhere. */
const PIN_TOP_OFFSET_PX = 160

const RAIL_START_INSET =
  'ps-6 md:ps-12 lg:ps-[max(4rem,calc((100vw-1536px)/2))]'

const PRODUCT_CARD_FRAME =
  'rounded-3xl bg-neutral-800 p-2.5'
const PRODUCT_CARD_INNER = 'relative w-full shrink-0 overflow-hidden rounded-2xl'

const CARD_OVERLAY_BASE =
  'absolute inset-x-0 bottom-0 top-[70%] flex max-h-full flex-col justify-start gap-4 overflow-y-auto overscroll-contain p-5 pb-6 sm:top-[70%] sm:p-6 sm:pb-7'
const CARD_TITLE_CLASS =
  'font-benzin text-2xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] md:text-3xl'

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

function ImageCardControlled({
  card,
  variant,
  onPatch,
  showRemove,
  onRemove,
}: {
  card: ProductCard
  variant: import('@/site/SiteContentContext').SiteContentVariant
  onPatch: (patch: Partial<ProductCard>) => void
  showRemove?: boolean
  onRemove?: () => void
}) {
  const [busy, setBusy] = useState(false)
  /** Admin sits in CSS grid — fill cell; live uses horizontal rail widths. */
  const previewH =
    variant === 'admin'
      ? 'aspect-[4/5] min-h-[220px]'
      : 'h-[min(82vh,540px)] md:h-[580px]'

  return (
    <article
      className={
        variant === 'admin'
          ? `flex min-w-0 w-full flex-col ${PRODUCT_CARD_FRAME}`
          : `flex shrink-0 flex-col ${PRODUCT_CARD_FRAME} w-[min(92vw,430px)]`
      }
    >
      <div className={`${PRODUCT_CARD_INNER} ${previewH}`}>
        <img
          src={card.imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />

        <div className={`${CARD_OVERLAY_BASE} [&_input,&_textarea]:pointer-events-auto`}>
          <InlineField
            variant={variant}
            className={CARD_TITLE_CLASS}
            value={card.name}
            onChange={(next) => onPatch({ name: next })}
          />
          <div className="min-h-0 shrink">
            <InlineField
              variant={variant}
              as="textarea"
              rows={variant === 'admin' ? 3 : 4}
              className="max-h-[min(22vh,180px)] text-[15px] font-medium leading-snug tracking-tight text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] [field-sizing:content] md:text-base"
              value={card.quote}
              onChange={(next) => onPatch({ quote: next })}
            />
          </div>
        </div>
      </div>

      {variant === 'admin' ? (
        <div className="relative z-[2] mt-3 shrink-0 space-y-2 rounded-lg border border-white/10 bg-neutral-950/95 p-3">
          <InlineField
            variant={variant}
            className="font-mono text-[11px] text-white"
            value={card.imageSrc}
            onChange={(next) => onPatch({ imageSrc: next })}
          />
          <div className='flex items-center gap-2'>
            <label className="inline-block cursor-pointer rounded-md border border-brand/35 bg-brand/10 px-2 py-1 text-[11px] text-brand">
              {busy ? '…' : 'Оруулах'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setBusy(true)
                  void uploadSiteAsset(file)
                    .then((url) => onPatch({ imageSrc: url }))
                    .finally(() => {
                      setBusy(false)
                      e.target.value = ''
                    })
                }}
              />

            </label>
            {showRemove && onRemove ? (
              <button
                type="button"
                className=" w-full rounded-md border border-red-500/30 bg-red-500/10 py-1 text-[11px] font-medium text-red-200 hover:bg-red-500/15"
                onClick={onRemove}
              >
                Карт устгах
              </button>
            ) : null}
          </div>

        </div>
      ) : null}
    </article>
  )
}

function ImageCardLive({ card }: { card: ProductCard }) {
  return (
    <article
      className={`relative flex h-[min(82vh,540px)] w-[min(92vw,430px)] shrink-0 flex-col md:h-[580px] ${PRODUCT_CARD_FRAME}`}
    >
      <div className={`${PRODUCT_CARD_INNER} min-h-0 flex-1`}>
        <img
          src={card.imageSrc}
          alt={card.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onLoad={() => ScrollTrigger.refresh()}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />
        <div className={`${CARD_OVERLAY_BASE} pointer-events-none`}>
          <h3 className={CARD_TITLE_CLASS}>{card.name}</h3>
          {card.quote.trim() ? (
            <p className="text-[15px] font-medium leading-snug tracking-tight text-white/92 drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] md:text-base">
              {card.quote}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function ProductsSection() {
  const rootRef = useRef<HTMLElement>(null)
  const pinWrapRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { data, variant, setData } = useSiteContent()
  const products = data.products
  const cards = products.cards

  const cardKey = useMemo(() => cards.map((c) => c.id).join('|'), [cards])

  useGSAP(
    () => {
      if (prefersReducedMotion || variant === 'admin') return

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
    { dependencies: [prefersReducedMotion, cardKey], revertOnUpdate: true },
  )

  const nativeHorizontalScroll = prefersReducedMotion

  const railFallback = useMemo(() => {
    if (!nativeHorizontalScroll) {
      return ['flex min-w-max gap-5 pb-6 pt-1 will-change-transform', RAIL_START_INSET].filter(Boolean).join(' ')
    }
    return ['flex gap-5 overflow-x-auto overflow-y-hidden pb-6 pt-1 snap-x snap-mandatory scrollbar-hide', RAIL_START_INSET].join(
      ' ',
    )
  }, [nativeHorizontalScroll])

  const patchCard = (index: number, next: ProductCard) => {
    setData((d) => {
      const list = [...d.products.cards]
      list[index] = next
      return { ...d, products: { ...d.products, cards: list } }
    })
  }

  return (
    <section ref={rootRef} id="products" className="scroll-mt-24 my-16 w-full min-w-0 bg-black">
      <div className="relative mt-10 w-full min-w-0">
        <div className="mx-auto max-w-screen-2xl pb-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <Reveal className='flex flex-col'>
              <InlineField
                variant={variant}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-brand "
                value={products.eyebrow}
                onChange={(next) =>
                  setData((d) => ({ ...d, products: { ...d.products, eyebrow: next } }))
                }
              />
              <InlineField
                variant={variant}
                className="mt-3 max-w-xl  text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.5rem] font-benzin"
                value={products.title}
                onChange={(next) =>
                  setData((d) => ({ ...d, products: { ...d.products, title: next } }))
                }
              />
            </Reveal>

            {variant === 'admin' ? (
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  type="button"
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      products: {
                        ...d.products,
                        cards: [
                          ...d.products.cards,
                          {
                            kind: 'image',
                            id: `prod-${Date.now()}`,
                            name: 'Нэр',
                            roleLine: 'Албан тушаал',
                            quote: 'Иш татах.',
                            imageSrc:
                              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=900&fit=crop&q=80',
                            imageAlt: 'Зураг',
                          } satisfies ProductCard,
                        ],
                      },
                    }))
                  }
                >
                  + Карт нэмэх
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {variant === 'admin' ? (
          <div className="mx-auto max-w-screen-2xl pb-16 pt-4">
            <div
              role="region"
              aria-label="Featured products"
              className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8"
            >
              {cards.map((card, i) => (
                <ImageCardControlled
                  key={card.id}
                  card={card}
                  variant={variant}
                  onPatch={(patch) => patchCard(i, { ...card, ...patch })}
                  showRemove={cards.length > 1}
                  onRemove={() =>
                    setData((d) => ({
                      ...d,
                      products: {
                        ...d.products,
                        cards: d.products.cards.filter((c) => c.id !== card.id),
                      },
                    }))
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <div ref={pinWrapRef}>
            <div
              ref={viewportRef}
              role="region"
              aria-label="Featured products — scroll with page to move horizontally"
              className={
                nativeHorizontalScroll ? 'w-full overflow-x-auto overflow-y-hidden scrollbar-hide' : 'w-full overflow-hidden'
              }
            >
              <div ref={trackRef} className={railFallback}>
                {cards.map((card) => (
                  <ImageCardLive key={card.id} card={card} />
                ))}
                <div aria-hidden className="h-24 w-8 shrink-0 md:w-12" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
