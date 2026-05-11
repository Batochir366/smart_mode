import { useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { SiteContentProvider } from '@/site/SiteContentContext'

/** Picks EN vs MN document slice for the visual editor from the URL (`/admin/edit` vs `/admin/edit/mn`). */
export function AdminSiteContentProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const adminEditingLocale = /\/admin\/edit\/mn\/?$/.test(pathname) ? 'mn' : 'en'
  return (
    <SiteContentProvider variant="admin" adminEditingLocale={adminEditingLocale}>
      {children}
    </SiteContentProvider>
  )
}
