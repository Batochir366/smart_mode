import { Navigate, Route, Routes } from 'react-router-dom'

import { RequireAuth } from '@/admin/RequireAuth'
import { AdminSiteContentProvider } from '@/pages/admin/AdminSiteContentProvider'
import { SiteContentProvider } from '@/site/SiteContentContext'
import AdminShell from '@/pages/admin/AdminShell'
import ContactsPage from '@/pages/admin/ContactsPage'
import LoginPage from '@/pages/admin/LoginPage'
import SiteEditPage from '@/pages/admin/SiteEditPage'
import { MarketingPage } from '@/pages/MarketingPage'

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route
          path="/admin"
          element={
            <AdminSiteContentProvider>
              <AdminShell />
            </AdminSiteContentProvider>
          }
        >
          <Route index element={<Navigate to="edit" replace />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="edit" element={<SiteEditPage />} />
          <Route path="edit/mn" element={<SiteEditPage />} />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <SiteContentProvider variant="live">
            <MarketingPage />
          </SiteContentProvider>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
