import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { SiteContentData } from '@shared/siteContent'
import { DEFAULT_SITE_CONTENT } from '@shared/siteContent'

import { apiFetch } from '@/lib/api'

export type SiteContentVariant = 'live' | 'admin'

type ApiSiteContentBody = {
  version: number
  updatedAt: string
  data: SiteContentData
}

export type SiteContentContextValue = {
  variant: SiteContentVariant
  data: SiteContentData
  setData: (updater: SiteContentData | ((prev: SiteContentData) => SiteContentData)) => void
  version: number
  updatedAt: string
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined)

async function fetchSite(): Promise<{ version: number; updatedAt: string; data: SiteContentData }> {
  const body = await apiFetch('/api/site-content') as ApiSiteContentBody
  return { version: body.version, updatedAt: body.updatedAt, data: body.data }
}

export function SiteContentProvider({
  variant,
  children,
}: {
  variant: SiteContentVariant
  children: ReactNode
}) {
  const [data, setData] = useState<SiteContentData>(DEFAULT_SITE_CONTENT)
  const [version, setVersion] = useState(1)
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await fetchSite()
      setData(next.data)
      setVersion(next.version)
      setUpdatedAt(next.updatedAt)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load content')
      setData(DEFAULT_SITE_CONTENT)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void refetch()
    })
  }, [refetch])

  const value = useMemo<SiteContentContextValue>(
    () => ({
      variant,
      data,
      setData,
      version,
      updatedAt,
      loading,
      error,
      refetch,
    }),
    [variant, data, version, updatedAt, loading, error, refetch],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

/** Data hook for marketing + admin editor (must live with the provider module). */
// eslint-disable-next-line react-refresh/only-export-components
export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider')
  return ctx
}
