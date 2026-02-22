import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { THEME_PREFERENCE_STORAGE_KEY } from '@/app/model'
import { ThemeProvider } from './ThemeProvider'

type MatchMediaController = {
  setDark: (next: boolean) => void
}

function installMatchMediaMock(initialDark: boolean): MatchMediaController {
  let isDark = initialDark
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const createMediaQueryList = (query: string) =>
    ({
      media: query,
      get matches() {
        return isDark
      },
      onchange: null,
      addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
        if (type !== 'change') return
        if (typeof listener === 'function')
          listeners.add(listener as (event: MediaQueryListEvent) => void)
      },
      removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
        if (type !== 'change') return
        if (typeof listener === 'function')
          listeners.delete(listener as (event: MediaQueryListEvent) => void)
      },
      addListener: (listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener)
      },
      removeListener: (listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener)
      },
      dispatchEvent: () => true,
    }) as MediaQueryList

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => createMediaQueryList(query)),
    writable: true,
  })

  return {
    setDark(next) {
      isDark = next
      const event = {
        matches: isDark,
        media: '(prefers-color-scheme: dark)',
      } as MediaQueryListEvent
      listeners.forEach((listener) => listener(event))
    },
  }
}

describe('ThemeProvider', () => {
  afterEach(() => {
    window.localStorage.removeItem(THEME_PREFERENCE_STORAGE_KEY)
    delete document.documentElement.dataset.theme
  })

  it('usa tema dark cuando el sistema esta en dark y no hay preferencia guardada', () => {
    installMatchMediaMock(true)

    render(
      <ThemeProvider>
        <div>theme probe</div>
      </ThemeProvider>,
    )

    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('prioriza preferencia light guardada aunque el sistema este en dark', () => {
    installMatchMediaMock(true)
    window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, 'light')

    render(
      <ThemeProvider>
        <div>theme probe</div>
      </ThemeProvider>,
    )

    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('actualiza tema cuando cambia el sistema y la preferencia es system', () => {
    const media = installMatchMediaMock(false)
    window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, 'system')

    render(
      <ThemeProvider>
        <div>theme probe</div>
      </ThemeProvider>,
    )

    expect(document.documentElement.dataset.theme).toBe('light')

    media.setDark(true)

    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
