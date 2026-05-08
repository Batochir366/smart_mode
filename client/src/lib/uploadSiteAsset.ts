import { readAdminToken } from '@/admin/authStorage'
import { getApiBaseUrl } from '@/lib/api'

export async function uploadSiteAsset(file: File): Promise<string> {
  const token = readAdminToken()
  if (!token) throw new Error('Not signed in')
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${getApiBaseUrl()}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  if (!res.ok) throw new Error('Upload failed')
  const body = (await res.json()) as { url: string }
  return body.url
}
