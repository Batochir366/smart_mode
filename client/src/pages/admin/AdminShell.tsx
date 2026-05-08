import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { clearAdminToken } from '@/admin/authStorage'
import { scrollToSection } from '@/lib/scroll'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`

const EDIT_SECTION_LINKS = [
  { id: 'heroContent', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'mission', label: 'Mission' },
  { id: 'services', label: 'Services' },
  { id: 'products', label: 'Products' },
  { id: 'contact', label: 'Contact' },
] as const

export default function AdminShell() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const isWebEdit = /\/admin\/edit\/?$/.test(pathname)
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(false)

  const goToSection = (id: string) => {
    if (!scrollToSection(id)) return
    window.history.pushState(null, '', `#${id}`)
    setMobileSectionsOpen(false)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 py-3 sm:gap-2 sm:px-6 md:px-10">
          <div className="flex w-full flex-wrap items-center gap-3 md:flex-nowrap md:gap-6">
            <div className="flex shrink-0 items-center gap-2">
              <img src="/Logo.png" alt="Smart Mode" className="h-5 w-auto" />
            </div>

            <nav className="order-3 flex w-full flex-none items-center gap-2 md:order-none md:flex-1 md:flex-wrap lg:w-auto">
              <NavLink to="/admin/edit" className={linkClass}>
                Web edit
              </NavLink>
              <NavLink to="/admin/contacts" className={linkClass}>
                Contacts
              </NavLink>

            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-white/15 px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/5"
                onClick={() => nav('/')}
              >
                View site
              </button>
              <button
                type="button"
                className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
                onClick={() => {
                  clearAdminToken()
                  nav('/admin/login', { replace: true })
                }}
              >
                Log out
              </button>
            </div>
          </div>

          {isWebEdit && mobileSectionsOpen ? (
            <ul className="grid gap-1 border-t border-white/10 pt-3 pb-1 font-manrope text-sm text-neutral-300 md:hidden">
              {EDIT_SECTION_LINKS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="block w-full rounded-md px-3 py-2 text-left hover:bg-white/5 hover:text-brand"
                    onClick={() => goToSection(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>
      <Outlet />
    </div>
  )
}
