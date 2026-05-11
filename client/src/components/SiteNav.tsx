import { useState } from 'react'

import { scrollToSection } from '@/lib/scroll'
import { useSiteContent } from '@/site/SiteContentContext'

const NAV_ITEMS = [
  { id: 'about' as const, label: 'About' },
  { id: 'services' as const, label: 'Services' },
  { id: 'products' as const, label: 'Products' },
  { id: 'advantages' as const, label: 'Why Us' },
  { id: 'contact' as const, label: 'Contact' },
] as const

const CTA_LABEL = 'Get in Touch'

export function SiteNav() {
  const { liveLocale, setLiveLocale } = useSiteContent()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  const navigateToSection = (id: string) => {
    if (!scrollToSection(id)) return
    window.history.pushState(null, '', `#${id}`)
    closeMenu()
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-10 md:py-4">
        <button
          type="button"
          onClick={() => navigateToSection('heroContent')}
          className="cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
          aria-label="Go to top"
        >
          <img src="/Logo.png" alt="Smart Mode" className="h-5 w-auto" />
        </button>

        <ul className="font-manrope hidden flex-1 items-center justify-center gap-6 px-4 text-sm text-neutral-400 md:flex lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                className="transition-colors hover:text-brand"
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigateToSection(item.id)
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-neutral-900/80 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setLiveLocale('en')}
              className={`rounded-full px-3 py-1 transition ${liveLocale === 'en' ? 'bg-brand text-page-dark' : 'text-neutral-300 hover:text-white'
                }`}
              aria-pressed={liveLocale === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLiveLocale('mn')}
              className={`rounded-full px-3 py-1 transition ${liveLocale === 'mn' ? 'bg-brand text-page-dark' : 'text-neutral-300 hover:text-white'
                }`}
              aria-pressed={liveLocale === 'mn'}
            >
              MNG
            </button>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-page-dark shadow-sm transition hover:bg-emerald-500"
            onClick={() => navigateToSection('contact')}
          >
            {CTA_LABEL}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-neutral-200 transition hover:bg-white/10"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="text-lg leading-none">{isMenuOpen ? 'x' : '☰'}</span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 md:hidden">
          <ul className="font-benzin grid gap-2 text-sm text-neutral-300">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  className="block rounded-md px-3 py-2 transition-colors hover:bg-white/5 hover:text-brand"
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigateToSection(item.id)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-3 w-full rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-page-dark shadow-sm transition hover:bg-emerald-500"
            onClick={() => navigateToSection('contact')}
          >
            {CTA_LABEL}
          </button>
        </div>
      )}
    </nav>
  )
}
