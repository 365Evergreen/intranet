import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { defaultPrincipal, fetchAuthProfile } from '../services/intranetApi'
import type { ClientPrincipal } from '../types/models'

type AuthContextValue = {
  principal: ClientPrincipal | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue>({
  principal: null,
  isAuthenticated: false,
  isLoading: true,
})

export function AuthProvider({ children }: PropsWithChildren) {
  const [principal, setPrincipal] = useState<ClientPrincipal | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        const profile = await fetchAuthProfile()
        if (!isMounted) {
          return
        }

        setPrincipal(profile ?? defaultPrincipal)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      principal,
      isAuthenticated: Boolean(principal),
      isLoading,
    }),
    [principal, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
