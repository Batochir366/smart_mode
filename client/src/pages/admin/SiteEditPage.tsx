import { useCallback, useEffect, useMemo, useState } from 'react'

import { CustomCursor } from '@/components/CustomCursor'
import { ScrollSmootherRoot } from '@/components/ScrollSmootherRoot'
import { MarketingScrollContent } from '@/pages/MarketingScrollContent'
import { readAdminToken } from '@/admin/authStorage'
import { getApiBaseUrl } from '@/lib/api'
import { useSiteContent } from '@/site/SiteContentContext'

export default function SiteEditPage() {
  const ctx = useSiteContent()
  const [baselineJson, setBaselineJson] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const currentJson = useMemo(() => JSON.stringify(ctx.data), [ctx.data])
  useEffect(() => {
    if (ctx.loading) return
    queueMicrotask(() => {
      setBaselineJson((prev) => (prev == null ? currentJson : prev))
    })
  }, [ctx.loading, currentJson])

  const dirty = baselineJson !== null && currentJson !== baselineJson

  const onSave = useCallback(async () => {
    setSaveError(null)
    const token = readAdminToken()
    if (!token) return
    setSaving(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/site-content`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: ctx.data }),
      })
      const bodyUnknown: unknown = await res.json().catch(() => undefined)
      if (!res.ok) {
        let msg = 'Save failed'
        if (typeof bodyUnknown === 'object' && bodyUnknown !== null && 'error' in bodyUnknown) {
          const e = (bodyUnknown as { error?: unknown }).error
          if (typeof e === 'string') msg = e
        }
        throw new Error(msg)
      }
      await ctx.refetch()
      const normalized = bodyUnknown as { data?: unknown } | undefined
      const nextJson = JSON.stringify(
        normalized?.data ?? ctx.data,
      )
      setBaselineJson(nextJson)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [ctx])

  return (
    <div className="relative pb-28">
      <div className="pointer-events-none fixed inset-x-0 top-14 z-[60] flex justify-center px-4 sm:top-[4.45rem]">
        <div className="pointer-events-auto flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-black/85 px-4 py-3 text-xs text-neutral-200 shadow-xl backdrop-blur-md sm:text-sm">
          <span className="rounded-full bg-white/10 px-2 py-1 font-medium text-neutral-400">
            {dirty ? 'Unsaved edits' : 'Up to date'}
          </span>
          {saveError ? <span className="font-medium text-red-400">{saveError}</span> : null}
          <button
            type="button"
            disabled={!dirty || saving || ctx.loading}
            onClick={() => void onSave()}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm transition hover:bg-white/5 disabled:opacity-40"
            onClick={() => {
              setBaselineJson(null)
              void ctx.refetch()
              setSaveError(null)
            }}
          >
            Discard
          </button>
          <span className="text-neutral-500">Version {ctx.version}</span>
        </div>
      </div>

      <div className="min-h-screen bg-black font-sans text-neutral-100 antialiased">
        <CustomCursor />
        <ScrollSmootherRoot>
          <MarketingScrollContent />
        </ScrollSmootherRoot>
      </div>
    </div>
  )
}
