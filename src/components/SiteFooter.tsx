import { QRCodeSVG } from 'qrcode.react'


export function SiteFooter() {
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
                  Smart
                </div>
                <div className="font-benzin text-base font-bold tracking-tight text-brand sm:text-xl md:text-2xl lg:text-3xl">
                  MODE
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-1 min-w-0">
              <div className="font-benzin font-bold leading-[1.05] text-white text-[clamp(1.05rem,3.6vw,2.75rem)]">
                Build
                <br />
                <span className="text-brand">Smarter</span>
                <br />
                Grow Faster.
              </div>
            </div>

            <div className="relative z-10 hidden shrink-0 items-center gap-1.5 sm:flex md:gap-2">
              <div className="rounded-md bg-white p-1 md:p-1.5">
                <QRCodeSVG
                  value="https://www.smartmode.mn"
                  size={72}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  className="block size-[56px] sm:size-[64px] md:size-[80px] lg:size-[96px]"
                />
              </div>
              <div className="text-[8px] uppercase tracking-[0.2em] text-white/70 [writing-mode:vertical-rl] md:text-[9px]">
                www.smartmode.mn
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-white/70 sm:mt-10 sm:gap-x-16 sm:text-sm">
          <span>
            <span className="text-white/50">+976</span>{' '}
            <strong className="font-semibold text-white">77116644</strong>
          </span>
          <span>
            <span className="text-white/50">www.</span>
            <strong className="font-semibold text-white">smartmode.mn</strong>
          </span>
          <span>
            <span className="text-white/50">info@</span>
            <strong className="font-semibold text-white">smartmode.mn</strong>
          </span>
        </div>

        <p className="mt-10 text-[11px] tracking-wide text-white/30 sm:text-xs">
          © {new Date().getFullYear()} Smart Mode LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
