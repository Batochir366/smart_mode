import { useEffect, useState } from 'react'
import { scrollToSection } from '@/lib/scroll'

type SiteLanguage = 'mn' | 'en'

function readGoogleTranslateLang(): SiteLanguage {
  const raw = document.cookie
    .split('; ')
    .find((item) => item.startsWith('googtrans='))
    ?.split('=')[1]
  if (!raw) return 'en'
  return raw.endsWith('/en') ? 'en' : 'mn'
}

export function SiteNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<SiteLanguage>('en')

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'advantages', label: 'Why Us' },
    { id: 'contact', label: 'Contact' },
  ]

  const closeMenu = () => setIsMenuOpen(false)

  const navigateToSection = (id: string) => {
    if (!scrollToSection(id)) return
    window.history.pushState(null, '', `#${id}`)
    closeMenu()
  }

  useEffect(() => {
    setLanguage(readGoogleTranslateLang())
  }, [])

  const applyLanguage = (next: SiteLanguage) => {
    const cookieValue = `/en/${next}`
    document.cookie = `googtrans=${cookieValue};path=/`
    document.cookie = `googtrans=${cookieValue};path=/;domain=${window.location.hostname}`
    setLanguage(next)

    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
    if (!combo) {
      window.location.reload()
      return
    }
    combo.value = next
    combo.dispatchEvent(new Event('change'))
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
          {navItems.map((item) => (
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
              onClick={() => applyLanguage('en')}
              className={`rounded-full px-3 py-1 transition ${
                language === 'en' ? 'bg-brand text-page-dark' : 'text-neutral-300 hover:text-white'
              }`}
              aria-pressed={language === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => applyLanguage('mn')}
              className={`rounded-full px-3 py-1 transition ${
                language === 'mn' ? 'bg-brand text-page-dark' : 'text-neutral-300 hover:text-white'
              }`}
              aria-pressed={language === 'mn'}
            >
              MNG
            </button>
          </div>
          <div
            id="google_translate_element"
            className="google-translate-shell"
            aria-label="Language selector"
          />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-page-dark shadow-sm transition hover:bg-emerald-500"
            onClick={() => navigateToSection('contact')}
          >
            Get in Touch
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
            {navItems.map((item) => (
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
            Get in Touch
          </button>
        </div>
      )}
    </nav>
  )
}
