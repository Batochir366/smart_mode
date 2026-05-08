import { useCallback, useEffect, useState } from 'react'

import { readAdminToken } from '@/admin/authStorage'
import { getApiBaseUrl } from '@/lib/api'

type Row = {
  id: string
  name: string
  company?: string
  email: string
  message: string
  createdAt?: string
}

export default function ContactsPage() {
  const [items, setItems] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    const token = readAdminToken()
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/contact-messages?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load messages')
      const body = (await res.json()) as { items: Row[] }
      setItems(body.items ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return
    const token = readAdminToken()
    if (!token) return
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/contact-messages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        if (res.status === 404) throw new Error('Message was already removed.')
        throw new Error('Could not delete message.')
      }
      setItems((prev) => prev.filter((m) => m.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-benzin text-2xl font-bold text-white">Contact messages</h1>
      <p className="mt-2 text-sm text-neutral-400">Submissions from the public contact form.</p>

      {loading ? <p className="mt-8 text-sm text-neutral-500">Loading…</p> : null}
      {error ? <p className="mt-8 text-sm text-red-400">{error}</p> : null}

      {!loading && !error && items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No messages yet.</p>
      ) : null}

      <ul className="mt-8 space-y-4">
        {items.map((m) => (
          <li
            key={m.id}
            className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-400">
                <strong className="font-semibold text-white">{m.name}</strong>
                <span>{m.email}</span>
                {m.company ? <span>· {m.company}</span> : null}
                {m.createdAt ? (
                  <span className="text-xs text-neutral-500">{new Date(m.createdAt).toLocaleString()}</span>
                ) : null}
              </div>
              <button
                type="button"
                disabled={deletingId === m.id}
                className="shrink-0 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => void handleDelete(m.id)}
              >
                {deletingId === m.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-200">{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
