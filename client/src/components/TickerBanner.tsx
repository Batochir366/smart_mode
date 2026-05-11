import { InlineField } from '@/components/admin/InlineField'
import { useSiteContent } from '@/site/SiteContentContext'

/** Each phrase followed by a separator, matching original ticker layout. */
export function TickerBanner() {
  const { data, variant, setData } = useSiteContent()
  const ticker = data.ticker
  const separator = ticker.separator || '✦'
  const items = ticker.items.length > 0 ? ticker.items : ['']
  const tokens = items.flatMap((label) => [label, separator])
  const doubled = [...tokens, ...tokens]

  return (
    <div className="border-y border-white/10 bg-neutral-900 py-3">
      {variant === 'admin' ? (
        <div className="mx-auto mb-3 w-full max-w-6xl px-6">
          <div className="rounded-lg border border-white/10 bg-black/40 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Тикер засвар</p>
            <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Тусгаарлагч</p>
            <div className="grid gap-2 md:grid-cols-2">
              <InlineField
                variant={variant}
                className="text-xs text-white"
                value={ticker.separator}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    ticker: { ...d.ticker, separator: next },
                  }))
                }
              />
            </div>
            <p className="mb-2 mt-4 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Мөрүүд</p>
            <div className="grid gap-2 md:grid-cols-2">
              {ticker.items.map((item, idx) => (
                <div key={`ticker-item-${idx}`} className="flex items-center gap-2">
                  <InlineField
                    variant={variant}
                    className="text-xs text-white"
                    value={item}
                    onChange={(next) =>
                      setData((d) => ({
                        ...d,
                        ticker: {
                          ...d.ticker,
                          items: d.ticker.items.map((v, i) => (i === idx ? next : v)),
                        },
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-200 hover:bg-red-500/20 disabled:opacity-40"
                    disabled={ticker.items.length <= 1}
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        ticker: {
                          ...d.ticker,
                          items: d.ticker.items.length > 1 ? d.ticker.items.filter((_, i) => i !== idx) : d.ticker.items,
                        },
                      }))
                    }
                  >
                    Устгах
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
              onClick={() =>
                setData((d) => ({
                  ...d,
                  ticker: {
                    ...d.ticker,
                    items: [...d.ticker.items, 'Шинэ тикер мөр'],
                  },
                }))
              }
            >
              + Мөр нэмэх
            </button>
          </div>
        </div>
      ) : null}
      <div className="relative overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap px-6 py-1 text-sm font-medium tracking-wide text-neutral-400 md:gap-14">
          {doubled.map((token, idx) =>
            token === separator ? (
              <span key={`tick-${token}-${idx}`} className="text-brand">
                {separator}
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
