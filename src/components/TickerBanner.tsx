const ITEMS = [
  'Smart Medical Devices',
  'Portable Diagnostics',
  'AI-Powered Healthcare',
  'Build Smarter, Grow Faster',
  "Mongolia's Healthcare Leader",
] as const

/** Each phrase followed by a separator, matching original ticker layout. */
const TOKENS = ITEMS.flatMap((label) => [label, '✦'])

export function TickerBanner() {
  const doubled = [...TOKENS, ...TOKENS]

  return (
    <div className="border-y border-white/10 bg-neutral-900 py-3">
      <div className="relative overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap px-6 py-1 text-sm font-medium tracking-wide text-neutral-400 md:gap-14">
          {doubled.map((token, idx) =>
            token === '✦' ? (
              <span key={`tick-${token}-${idx}`} className="text-brand">
                ✦
              </span>
            ) : (
              <span key={`tick-${token}-${idx}`}>{token}</span>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
