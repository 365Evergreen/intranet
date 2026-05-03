import {
  Avatar,
  Button,
  Divider,
  Text,
} from '@fluentui/react-components'
import { useQueryClient } from '@tanstack/react-query'
import { Navigation24Regular } from '@fluentui/react-icons'
import { Outlet } from 'react-router-dom'
import { ThemeToggleButton } from '../components/PageHeader'
import { SidebarNav } from '../components/SidebarNav'
import { useAuth } from '../hooks/useAuth'
import { usePreferences } from '../hooks/usePreferences'
import { useEffect, useState } from 'react'
import {
  fetchDashboard,
  fetchFiles,
  fetchNews,
  fetchSearch,
} from '../services/intranetApi'

export function ShellLayout() {
  const { principal } = useAuth()
  const { preferences, updatePreferences } = usePreferences()
  const [isNavOpen, setIsNavOpen] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!principal) {
      return
    }

    void queryClient.prefetchQuery({
      queryKey: ['dashboard'],
      queryFn: fetchDashboard,
      staleTime: 5 * 60 * 1000,
    })
    void queryClient.prefetchQuery({
      queryKey: ['news'],
      queryFn: fetchNews,
      staleTime: 5 * 60 * 1000,
    })
    void queryClient.prefetchQuery({
      queryKey: ['files'],
      queryFn: fetchFiles,
      staleTime: 60 * 1000,
    })
    void queryClient.prefetchQuery({
      queryKey: ['search', ''],
      queryFn: () => fetchSearch(''),
      staleTime: 60 * 1000,
    })
  }, [principal, queryClient])

  return (
    <div className="shell">
      <SidebarNav open={isNavOpen} onToggle={() => setIsNavOpen((value) => !value)} />
      <div className="shell__main">
        <header className="shell__header">
          <div className="shell__header-group">
            <Button
              appearance="subtle"
              icon={<Navigation24Regular />}
              onClick={() => setIsNavOpen((value) => !value)}
              aria-label="Toggle navigation"
            />
            <div>
              <Text weight="semibold">Evergreen intranet</Text>
              <Text>Azure Static Web Apps reference build</Text>
            </div>
          </div>
          <div className="shell__header-group">
            <ThemeToggleButton
              isDark={preferences.theme === 'dark'}
              onClick={() =>
                updatePreferences({
                  theme: preferences.theme === 'dark' ? 'light' : 'dark',
                })
              }
            />
            <Divider vertical />
            <Avatar name={principal?.userDetails ?? 'Local user'} color="brand" />
          </div>
        </header>
        <main className="shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
