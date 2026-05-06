import { Reveal } from '@/components/Reveal'

const ADVANTAGES = [
  {
    icon: '🪶',
    title: 'Portable & Lightweight',
    body: 'Designed for mobility without sacrificing clinical-grade accuracy or reliability in any environment.',
  },
  {
    icon: '🔄',
    title: 'Alternative to Bulky Equipment',
    body: 'Replace room-sized machines with pocket-sized powerhouses. Same results, radically better form factor.',
  },
  {
    icon: '📍',
    title: 'Usable Anywhere, Anytime',
    body: 'From hospital wards to remote rural clinics — SmartMODE devices work wherever patients need care.',
  },
  {
    icon: '🤖',
    title: 'Built on Modern Technologies',
    body: 'AI, IoT, and cloud connectivity built-in. Devices that learn, adapt, and improve outcomes over time.',
  },
] as const

export function AdvantagesSection() {
  return (
    <section id="advantages" className="scroll-mt-24 bg-neutral-900 px-6 py-24 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Why SmartMODE</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Competitive <span className="text-brand">Advantages</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr,minmax(0,420px)] lg:gap-16 lg:items-center">
          <Reveal delay="1" className="space-y-8">
            {ADVANTAGES.map((adv) => (
              <article key={adv.title} className="flex gap-5">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-2xl shadow-sm ring-1 ring-white/10"
                  aria-hidden
                >
                  {adv.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{adv.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{adv.body}</p>
                </div>
              </article>
            ))}
          </Reveal>

          <Reveal delay="2">
            <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center rounded-full bg-gradient-to-br from-emerald-600/35 via-teal-900/40 to-cyan-900/35 p-[2px] shadow-inner">
              <div className="flex h-[88%] w-[88%] items-center justify-center rounded-full border border-emerald-500/25 bg-neutral-950/90 shadow-none backdrop-blur">
                <div className="text-center text-xl font-bold leading-snug tracking-widest text-brand md:text-2xl">
                  SMART
                  <br />
                  PORTABLE
                  <br />
                  PRECISE
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
