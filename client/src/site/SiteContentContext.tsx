import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  normalizeBilingualFromApi,
  type BilingualSiteContent,
  type SiteContentData,
  type SiteLocale,
} from '@shared/siteContent'

import { apiFetch } from '@/lib/api'

const LIVE_LOCAL_STORAGE_KEY = 'smart_mode_lang'

export type SiteContentVariant = 'live' | 'admin'

type ApiSiteContentBody = {
  version: number
  updatedAt: string
  data: BilingualSiteContent
}

export type SiteContentContextValue = {
  variant: SiteContentVariant
  /** Active locale slice (`data`); admin uses `adminEditingLocale`, live uses `liveLocale`. */
  adminEditingLocale: SiteLocale
  liveLocale: SiteLocale
  setLiveLocale: (next: SiteLocale) => void
  /** Full Mongo payload (both languages). Use for save + dirty checks in admin. */
  bilingual: BilingualSiteContent
  data: SiteContentData
  setData: (
    updater: SiteContentData | ((prev: SiteContentData) => SiteContentData),
  ) => void
  version: number
  updatedAt: string
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined)

function readStoredLiveLocale(): SiteLocale {
  if (typeof window === 'undefined') return 'en'
  try {
    const v = localStorage.getItem(LIVE_LOCAL_STORAGE_KEY)
    return v === 'mn' ? 'mn' : 'en'
  } catch {
    return 'en'
  }
}

async function fetchSite(): Promise<{
  version: number
  updatedAt: string
  data: BilingualSiteContent
}> {
  const body = (await apiFetch('/api/site-content')) as ApiSiteContentBody
  return { version: body.version, updatedAt: body.updatedAt, data: body.data }
}

export function SiteContentProvider({
  variant,
  adminEditingLocale = 'en',
  children,
}: {
  variant: SiteContentVariant
  adminEditingLocale?: SiteLocale
  children: ReactNode
}) {
  const [bilingual, setBilingual] = useState<BilingualSiteContent>(() =>
    normalizeBilingualFromApi(undefined),
  )
  const [liveLocale, setLiveLocaleState] = useState<SiteLocale>(() =>
    variant === 'live' ? readStoredLiveLocale() : 'en',
  )
  const [version, setVersion] = useState(1)
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const setLiveLocale = useCallback((next: SiteLocale) => {
    setLiveLocaleState(next)
    try {
      localStorage.setItem(LIVE_LOCAL_STORAGE_KEY, next)
    } catch {
      /* noop */
    }
    document.documentElement.lang = next === 'mn' ? 'mn' : 'en'
  }, [])

  useEffect(() => {
    if (variant === 'live') {
      document.documentElement.lang = liveLocale === 'mn' ? 'mn' : 'en'
    }
  }, [variant, liveLocale])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await fetchSite()
      setBilingual(normalizeBilingualFromApi(next.data))
      setVersion(next.version)
      setUpdatedAt(next.updatedAt)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load content')
      setBilingual(normalizeBilingualFromApi(undefined))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void refetch()
    })
  }, [refetch])

  const activeSliceKey: SiteLocale = variant === 'admin' ? adminEditingLocale : liveLocale

  const data = bilingual[activeSliceKey]

  const setData = useCallback(
    (updater: SiteContentData | ((prev: SiteContentData) => SiteContentData)) => {
      const key = variant === 'admin' ? adminEditingLocale : liveLocale
      setBilingual((prev) => {
        const cur = prev[key]
        const nextSlice = typeof updater === 'function' ? updater(cur) : updater
        if (nextSlice === cur) return prev
        return { ...prev, [key]: nextSlice }
      })
    },
    [variant, adminEditingLocale, liveLocale],
  )

  const value = useMemo<SiteContentContextValue>(
    () => ({
      variant,
      adminEditingLocale,
      liveLocale,
      setLiveLocale,
      bilingual,
      data,
      setData,
      version,
      updatedAt,
      loading,
      error,
      refetch,
    }),
    [
      variant,
      adminEditingLocale,
      liveLocale,
      setLiveLocale,
      bilingual,
      data,
      setData,
      version,
      updatedAt,
      loading,
      error,
      refetch,
    ],
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
