export type ThemePreference = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

export const THEME_PREFERENCE_STORAGE_KEY = 'naster-theme-preference'

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'dark' || value === 'light' || value === 'system'
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'

  try {
    const value = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY)
    return isThemePreference(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

export function getSystemResolvedTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme = getSystemResolvedTheme(),
): ResolvedTheme {
  return preference === 'system' ? systemTheme : preference
}

export function applyResolvedTheme(
  theme: ResolvedTheme,
  root: HTMLElement = document.documentElement,
) {
  root.dataset.theme = theme
}
