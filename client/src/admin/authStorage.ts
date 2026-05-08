const KEY = 'smart_mode_admin_token'

export function readAdminToken(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function writeAdminToken(token: string): void {
  localStorage.setItem(KEY, token)
}

export function clearAdminToken(): void {
  localStorage.removeItem(KEY)
}
