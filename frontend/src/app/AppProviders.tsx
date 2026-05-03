import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { AuthProvider } from '../contexts/AuthContext'
import { NavigationProvider } from '../contexts/NavigationContext'
import { PreferencesProvider } from '../contexts/PreferencesContext'
import { usePreferences } from '../hooks/usePreferences'

const queryClient = new QueryClient()

function ThemeProviderBridge({ children }: PropsWithChildren) {
  const { preferences } = usePreferences()
  const theme =
    preferences.theme === 'dark' ? webDarkTheme : webLightTheme

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme
  }, [preferences.theme])

  return <FluentProvider theme={theme}>{children}</FluentProvider>
}

function Providers({ children }: PropsWithChildren) {
  return (
    <PreferencesProvider>
      <ThemeProviderBridge>
        <AuthProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </AuthProvider>
      </ThemeProviderBridge>
    </PreferencesProvider>
  )
}

export function AppProviders({ children }: PropsWithChildren) {
  const [client] = useState(() => queryClient)

  return (
    <QueryClientProvider client={client}>
      <Providers>{children}</Providers>
    </QueryClientProvider>
  )
}
