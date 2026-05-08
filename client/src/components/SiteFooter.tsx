import { QRCodeSVG } from 'qrcode.react'
import { InlineField } from '@/components/admin/InlineField'
import { useSiteContent } from '@/site/SiteContentContext'


export function SiteFooter() {
  const { data, variant, setData } = useSiteContent()
  const footer = data.footer
  return (
    <footer className="relative scroll-mt-24 overflow-hidden bg-black px-4 pb-12 pt-20 sm:px-6 md:px-10 md:pb-16 md:pt-28">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
        <div className="relative w-full rounded-[999px] p-[2px] sm:p-[3px]">
          <div
            className="absolute inset-0 rounded-[999px] bg-[linear-gradient(90deg,#2ecc71_0%,#1d6b40_38%,#0c3a22_62%,#082016_100%)] opacity-95"
            aria-hidden
          />

          <div className="relative flex items-center gap-3 overflow-hidden rounded-[999px] bg-black px-3 py-3 sm:gap-6 sm:px-6 sm:py-6 md:gap-10 md:px-10 md:py-10 lg:gap-14 lg:px-14 lg:py-14">
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-2/3 rounded-[999px] bg-[radial-gradient(ellipse_at_70%_50%,rgba(46,204,113,0.18),transparent_60%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-10 top-1/2 h-[140%] w-[55%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,204,113,0.10),transparent_65%)] blur-2xl"
              aria-hidden
            />

            <div className="relative z-10 flex aspect-square shrink-0 items-center justify-center rounded-full bg-black ring-1 ring-white/5 size-[clamp(80px,14vw,170px)]">
              <div className="text-center leading-none">
                <div className="text-base font-bold tracking-tight text-white sm:text-xl md:text-2xl lg:text-3xl">
                  <InlineField
                    variant={variant}
                    className="text-base font-bold tracking-tight text-white sm:text-xl md:text-2xl lg:text-3xl"
                    value={footer.logoTop}
                    onChange={(next) =>
                      setData((d) => ({
                        ...d,
                        footer: { ...d.footer, logoTop: next },
                      }))
                    }
                  />
                </div>
                <div className="font-benzin text-base font-bold tracking-tight text-brand sm:text-xl md:text-2xl lg:text-3xl">
                  <InlineField
                    variant={variant}
                    className="font-benzin text-base font-bold tracking-tight text-brand sm:text-xl md:text-2xl lg:text-3xl"
                    value={footer.logoBottom}
                    onChange={(next) =>
                      setData((d) => ({
                        ...d,
                        footer: { ...d.footer, logoBottom: next },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-1 min-w-0">
              <div className="font-benzin font-bold leading-[1.05] text-white text-[clamp(1.05rem,3.6vw,2.75rem)]">
                <InlineField
                  variant={variant}
                  className="font-benzin font-bold leading-[1.05] text-white text-[clamp(1.05rem,3.6vw,2.75rem)]"
                  value={footer.taglineLine1}
                  onChange={(next) =>
                    setData((d) => ({
                      ...d,
                      footer: { ...d.footer, taglineLine1: next },
                    }))
                  }
                />
                <br />
                <InlineField
                  variant={variant}
                  className="font-benzin font-bold leading-[1.05] text-brand text-[clamp(1.05rem,3.6vw,2.75rem)]"
                  value={footer.taglineHighlight}
                  onChange={(next) =>
                    setData((d) => ({
                      ...d,
                      footer: { ...d.footer, taglineHighlight: next },
                    }))
                  }
                />
                <br />
                <InlineField
                  variant={variant}
                  className="font-benzin font-bold leading-[1.05] text-white text-[clamp(1.05rem,3.6vw,2.75rem)]"
                  value={footer.taglineLine2}
                  onChange={(next) =>
                    setData((d) => ({
                      ...d,
                      footer: { ...d.footer, taglineLine2: next },
                    }))
                  }
                />
              </div>
            </div>

            <div className="relative z-10 hidden shrink-0 items-center gap-1.5 sm:flex md:gap-2">
              <div className="rounded-md bg-white p-1 md:p-1.5">
                <QRCodeSVG
                  value={footer.qrUrl}
                  size={72}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  className="block size-[56px] sm:size-[64px] md:size-[80px] lg:size-[96px]"
                />
              </div>
              <div className="text-[8px] uppercase tracking-[0.2em] text-white/70 [writing-mode:vertical-rl] md:text-[9px]">
                <InlineField
                  variant={variant}
                  className="text-[8px] uppercase tracking-[0.2em] text-white/70 [writing-mode:vertical-rl] md:text-[9px]"
                  value={footer.qrLabel}
                  onChange={(next) =>
                    setData((d) => ({
                      ...d,
                      footer: { ...d.footer, qrLabel: next },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-white/70 sm:mt-10 sm:gap-x-16 sm:text-sm">
          <span>
            <span className="text-white/50">
              <InlineField
                variant={variant}
                className="text-white/50"
                value={footer.phonePrefix}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    footer: { ...d.footer, phonePrefix: next },
                  }))
                }
              />
            </span>{' '}
            <strong className="font-semibold text-white">
              <InlineField
                variant={variant}
                className="font-semibold text-white"
                value={footer.phoneValue}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    footer: { ...d.footer, phoneValue: next },
                  }))
                }
              />
            </strong>
          </span>
          <span>
            <span className="text-white/50">
              <InlineField
                variant={variant}
                className="text-white/50"
                value={footer.webPrefix}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    footer: { ...d.footer, webPrefix: next },
                  }))
                }
              />
            </span>
            <strong className="font-semibold text-white">
              <InlineField
                variant={variant}
                className="font-semibold text-white"
                value={footer.webValue}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    footer: { ...d.footer, webValue: next },
                  }))
                }
              />
            </strong>
          </span>
          <span>
            <span className="text-white/50">
              <InlineField
                variant={variant}
                className="text-white/50"
                value={footer.emailPrefix}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    footer: { ...d.footer, emailPrefix: next },
                  }))
                }
              />
            </span>
            <strong className="font-semibold text-white">
              <InlineField
                variant={variant}
                className="font-semibold text-white"
                value={footer.emailValue}
                onChange={(next) =>
                  setData((d) => ({
                    ...d,
                    footer: { ...d.footer, emailValue: next },
                  }))
                }
              />
            </strong>
          </span>
        </div>

        <p className="mt-10 text-[11px] tracking-wide text-white/30 sm:text-xs">
          © {new Date().getFullYear()}{' '}
          <InlineField
            variant={variant}
            className="text-[11px] tracking-wide text-white/30 sm:text-xs"
            value={footer.copyrightText}
            onChange={(next) =>
              setData((d) => ({
                ...d,
                footer: { ...d.footer, copyrightText: next },
              }))
            }
          />
        </p>
      </div>
    </footer>
  )
}
