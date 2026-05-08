/** API origin without trailing slash. */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
  return typeof raw === 'string' ? raw.replace(/\/$/, '') : 'http://localhost:4000'
}

export async function apiFetch(input: string, init: RequestInit & { skipJson?: boolean } = {}) {
  const url = `${getApiBaseUrl()}${input.startsWith('/') ? input : `/${input}`}`
  const { skipJson, ...rest } = init
  const res = await fetch(url, rest)
  if (!res.ok) {
    let msg = res.statusText
    try {
      const j = (await res.json()) as { error?: string }
      if (j?.error) msg = j.error
    } catch {
      /* noop */
    }
    throw new Error(msg || `Request failed (${res.status})`)
  }
  if (skipJson) return undefined
  const ct = res.headers.get('content-type')
  if (ct?.includes('application/json')) {
    return await res.json()
  }
  return undefined
}
