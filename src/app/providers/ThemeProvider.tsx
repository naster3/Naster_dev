import { useEffect, type ReactNode } from 'react'
import {
  applyResolvedTheme,
  getStoredThemePreference,
  resolveTheme,
  THEME_PREFERENCE_STORAGE_KEY,
} from '@/app/model'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const applyCurrentPreference = () => {
      const systemTheme = media.matches ? 'dark' : 'light'
      const preference = getStoredThemePreference()
      applyResolvedTheme(resolveTheme(preference, systemTheme))
    }

    const onMediaChange = () => {
      if (getStoredThemePreference() === 'system') {
        applyCurrentPreference()
      }
    }

    const onStorageChange = (event: StorageEvent) => {
      if (!event.key || event.key === THEME_PREFERENCE_STORAGE_KEY) {
        applyCurrentPreference()
      }
    }

    applyCurrentPreference()
    media.addEventListener('change', onMediaChange)
    window.addEventListener('storage', onStorageChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
      window.removeEventListener('storage', onStorageChange)
    }
  }, [])

  return children
}
