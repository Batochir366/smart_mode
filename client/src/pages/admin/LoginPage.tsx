import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { writeAdminToken } from '@/admin/authStorage'
import { getApiBaseUrl } from '@/lib/api'

export default function LoginPage() {
  const nav = useNavigate()
  const loc = useLocation() as { state?: { from?: string } }
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Invalid password')
        return
      }
      const body = (await res.json()) as { token?: string }
      if (!body.token) {
        setError('Bad response')
        return
      }
      writeAdminToken(body.token)
      const target = loc.state?.from?.startsWith('/admin') ? loc.state.from : '/admin/edit'
      nav(target, { replace: true })
    } catch {
      setError('Could not reach server')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-neutral-100">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-950/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <h1 className="font-benzin text-2xl font-bold text-white">Admin</h1>
        <p className="mt-2 text-sm text-neutral-400">Sign in to manage site content and messages.</p>
        <form className="mt-8 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <div>
            <label htmlFor="admin-password" className="text-sm font-medium text-white">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={pending || !password}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-neutral-500">
          <Link className="text-brand hover:underline" to="/">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  )
}
