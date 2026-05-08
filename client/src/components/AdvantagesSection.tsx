import type { LucideIcon } from 'lucide-react'
import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  Database,
  FileText,
  Link2,
  Mail,
  ShieldCheck,
  Sparkles,
  Tag,
  Workflow,
} from 'lucide-react'
import { InlineField } from '@/components/admin/InlineField'
import { useSiteContent } from '@/site/SiteContentContext'

type BubbleCfg = {
  icon: LucideIcon
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  left: string
  top: string
  delay: string
}

const bubbleSets: readonly BubbleCfg[][] = [
  [
    { icon: FileText, size: 'xl', left: '18%', top: '14%', delay: '0s' },
    { icon: Mail, size: '2xl', left: '58%', top: '10%', delay: '0.7s' },
    { icon: CalendarDays, size: 'lg', left: '12%', top: '58%', delay: '1.2s' },
    { icon: Tag, size: 'sm', left: '68%', top: '58%', delay: '1.8s' },
    { icon: FileText, size: 'lg', left: '40%', top: '76%', delay: '2.4s' },
  ],
  [
    { icon: Bot, size: 'md', left: '22%', top: '18%', delay: '0.4s' },
    { icon: Workflow, size: 'md', left: '16%', top: '42%', delay: '1.1s' },
    { icon: Database, size: '2xl', left: '53%', top: '48%', delay: '0.9s' },
    { icon: Link2, size: 'lg', left: '64%', top: '20%', delay: '1.6s' },
  ],
  [
    { icon: ArrowUpRight, size: 'md', left: '16%', top: '24%', delay: '0.3s' },
    { icon: Sparkles, size: '2xl', left: '54%', top: '16%', delay: '1.2s' },
    { icon: ShieldCheck, size: 'lg', left: '26%', top: '62%', delay: '1.8s' },
  ],
  [
    { icon: Workflow, size: 'md', left: '16%', top: '18%', delay: '0.2s' },
    { icon: Database, size: '2xl', left: '54%', top: '14%', delay: '0.8s' },
    { icon: Bot, size: 'md', left: '22%', top: '58%', delay: '1.5s' },
    { icon: Sparkles, size: 'lg', left: '66%', top: '58%', delay: '2.1s' },
  ],
]

const bubbleSizeClass: Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', string> = {
  sm: 'h-14 w-14',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
  xl: 'h-24 w-24',
  '2xl': 'h-28 w-28',
}

const bubbleIconClass: Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
  '2xl': 'h-8 w-8',
}

function IconBubble({
  Icon,
  size,
  left,
  top,
  delay,
}: {
  Icon: LucideIcon
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  left: string
  top: string
  delay: string
}) {
  return (
    <span
      className={`absolute inline-flex items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-white/35 to-white/5 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm ${bubbleSizeClass[size]} animate-[pulse_3.6s_ease-in-out_infinite]`}
      style={{ left, top, animationDelay: delay }}
    >
      <Icon className={bubbleIconClass[size]} strokeWidth={2.2} />
    </span>
  )
}

export function AdvantagesSection() {
  const { data, variant, setData } = useSiteContent()
  const adv = data.advantages
  const cards = adv.cards

  return (
    <section
      id="advantages"
      className="scroll-mt-24 bg-black px-6 py-20 text-neutral-100 md:px-12 lg:px-16"
      aria-label="Process"
    >
      <div className="mx-auto max-w-screen-2xl">
        <InlineField
          variant={variant}
          className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand/80"
          value={adv.eyebrow}
          onChange={(next) => setData((d) => ({ ...d, advantages: { ...d.advantages, eyebrow: next } }))}
        />
        <InlineField
          variant={variant}
          className="mt-3 text-4xl font-semibold font-benzin tracking-tight text-white md:text-5xl"
          value={adv.title}
          onChange={(next) => setData((d) => ({ ...d, advantages: { ...d.advantages, title: next } }))}
        />

        {variant === 'admin' ? (
          <div className="mt-4">
            <button
              type="button"
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
              onClick={() =>
                setData((d) => ({
                  ...d,
                  advantages: {
                    ...d.advantages,
                    cards: [
                      ...d.advantages.cards,
                      {
                        id: `adv-${Date.now()}`,
                        step: String(d.advantages.cards.length + 1).padStart(2, '0'),
                        title: 'New card',
                        description: 'Edit this advantage description.',
                      },
                    ],
                  },
                }))
              }
            >
              Add card
            </button>
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <article
              key={card.id}
              className="group relative min-h-[620px] overflow-hidden rounded-3xl border border-white/12 bg-[#0f1013] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-brand/25 blur-3xl transition-opacity duration-300 group-hover:opacity-90" />
              <div className="relative z-10 flex h-full flex-col">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-neutral-950">
                  <InlineField
                    variant={variant}
                    className="text-sm font-bold text-neutral-950"
                    value={card.step}
                    onChange={(next) =>
                      setData((d) => {
                        const nextCards = [...d.advantages.cards]
                        if (!nextCards[i]) return d
                        nextCards[i] = { ...nextCards[i], step: next.slice(0, 2) }
                        return { ...d, advantages: { ...d.advantages, cards: nextCards } }
                      })
                    }
                  />
                </span>
                <InlineField
                  variant={variant}
                  className="mt-6 text-2xl font-semibold tracking-tight text-white"
                  value={card.title}
                  onChange={(next) =>
                    setData((d) => {
                      const nextCards = [...d.advantages.cards]
                      if (!nextCards[i]) return d
                      nextCards[i] = { ...nextCards[i], title: next }
                      return { ...d, advantages: { ...d.advantages, cards: nextCards } }
                    })
                  }
                />
                <InlineField
                  variant={variant}
                  as="textarea"
                  rows={4}
                  className="mt-3 max-w-[28ch] text-sm leading-relaxed text-neutral-300"
                  value={card.description}
                  onChange={(next) =>
                    setData((d) => {
                      const nextCards = [...d.advantages.cards]
                      if (!nextCards[i]) return d
                      nextCards[i] = { ...nextCards[i], description: next }
                      return { ...d, advantages: { ...d.advantages, cards: nextCards } }
                    })
                  }
                />

                <div className="relative mt-auto h-92 overflow-hidden rounded-2xl">
                  {(bubbleSets[i] ?? bubbleSets[i % bubbleSets.length]).map((bubble, index) => (
                    <IconBubble
                      key={`${card.id}-bubble-${index}`}
                      Icon={bubble.icon}
                      size={bubble.size}
                      left={bubble.left}
                      top={bubble.top}
                      delay={bubble.delay}
                    />
                  ))}
                </div>
                {variant === 'admin' && cards.length > 1 ? (
                  <button
                    type="button"
                    className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-200 hover:bg-red-500/20"
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        advantages: {
                          ...d.advantages,
                          cards: d.advantages.cards.filter((c) => c.id !== card.id),
                        },
                      }))
                    }
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
