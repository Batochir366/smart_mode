import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { readAdminToken } from '@/admin/authStorage'

export function RequireAuth() {
  const loc = useLocation()
  if (!readAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />
  }
  return <Outlet />
}
