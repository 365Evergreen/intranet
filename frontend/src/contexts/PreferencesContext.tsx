import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  defaultPreferences,
  fetchPreferences,
  updatePreferences as savePreferences,
} from '../services/intranetApi'
import type { UserPreferences } from '../types/models'

type PreferencesContextValue = {
  preferences: UserPreferences
  updatePreferences: (patch: Partial<UserPreferences>) => Promise<void>
}

export const PreferencesContext = createContext<PreferencesContextValue>({
  preferences: defaultPreferences,
  updatePreferences: async () => undefined,
})

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(defaultPreferences)

  useEffect(() => {
    let isMounted = true

    async function loadPreferences() {
      const storedPreferences = await fetchPreferences()
      if (isMounted) {
        setPreferences(storedPreferences)
      }
    }

    void loadPreferences()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      updatePreferences: async (patch) => {
        const nextPreferences: UserPreferences = {
          ...preferences,
          ...patch,
        }

        setPreferences(nextPreferences)
        await savePreferences(nextPreferences)
      },
    }),
    [preferences],
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}
