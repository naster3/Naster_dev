import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  applyResolvedTheme,
  getStoredThemePreference,
  getSystemResolvedTheme,
  resolveTheme,
  THEME_PREFERENCE_STORAGE_KEY,
} from './theme'

describe('theme helpers', () => {
  afterEach(() => {
    window.localStorage.removeItem(THEME_PREFERENCE_STORAGE_KEY)
    vi.restoreAllMocks()
  })

  it('falls back to system when stored preference is invalid', () => {
    window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, 'unknown')

    expect(getStoredThemePreference()).toBe('system')
  })

  it('falls back to system when localStorage access fails', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    expect(getStoredThemePreference()).toBe('system')
  })

  it('resolves the system theme from matchMedia and applies it to a custom root', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches: true })),
    })

    expect(getSystemResolvedTheme()).toBe('dark')
    expect(resolveTheme('system', 'dark')).toBe('dark')
    expect(resolveTheme('light', 'dark')).toBe('light')

    const root = document.createElement('div')
    applyResolvedTheme('dark', root)

    expect(root.dataset.theme).toBe('dark')
  })
})
