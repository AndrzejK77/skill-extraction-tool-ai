import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminExtractionsPage from './pages/admin/AdminExtractionsPage'
import AdminSystemPage from './pages/admin/AdminSystemPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout — user-facing pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        {/* Admin layout — management pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="extractions" element={<AdminExtractionsPage />} />
          <Route path="system" element={<AdminSystemPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
