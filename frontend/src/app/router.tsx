import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'
import { MinimalLayout } from '../layouts/MinimalLayout'
import { ShellLayout } from '../layouts/ShellLayout'

const DashboardPage = lazy(() => import('../features/dashboard'))
const NewsPage = lazy(() => import('../features/news'))
const FilesPage = lazy(() => import('../features/files'))
const PeoplePage = lazy(() => import('../features/people'))
const TasksPage = lazy(() => import('../features/tasks'))
const SearchPage = lazy(() => import('../features/search'))
const ChatPage = lazy(() => import('../features/chat'))
const AdminPage = lazy(() => import('../features/admin'))
const WelcomePage = lazy(() => import('../pages/WelcomePage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="centered-state">Loading…</div>}>
        <Routes>
          <Route element={<MinimalLayout />}>
            <Route path="/welcome" element={<WelcomePage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route element={<ShellLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/files" element={<FilesPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
