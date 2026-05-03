import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { fetchNavigation, updateNavigation } from '../services/intranetApi'
import type { NavigationItem } from '../types/models'
import { useAuth } from '../hooks/useAuth'

type NavigationContextValue = {
  items: NavigationItem[]
  isLoading: boolean
  saveItems: (items: NavigationItem[]) => Promise<void>
}

export const NavigationContext = createContext<NavigationContextValue>({
  items: [],
  isLoading: true,
  saveItems: async () => undefined,
})

export function NavigationProvider({ children }: PropsWithChildren) {
  const { principal } = useAuth()
  const [items, setItems] = useState<NavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadNavigation() {
      try {
        const loadedItems = await fetchNavigation()
        if (isMounted) {
          const roles = new Set(principal?.userRoles ?? ['authenticated'])
          setItems(
            loadedItems.filter(
              (item) =>
                !item.roles?.length ||
                item.roles.some((role) => roles.has(role)),
            ),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadNavigation()

    return () => {
      isMounted = false
    }
  }, [principal])

  const value = useMemo<NavigationContextValue>(
    () => ({
      items,
      isLoading,
      saveItems: async (nextItems) => {
        await updateNavigation(nextItems)
        setItems(nextItems)
      },
    }),
    [items, isLoading],
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
