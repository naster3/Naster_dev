import { createContext, useContext } from 'react'
import { i18nMessages, type I18nMessages, type Locale } from './messages'

export type I18nContextValue = {
  locale: Locale
  messages: I18nMessages
}

export const DEFAULT_LOCALE: Locale = 'es'

function resolveLocale(languages: readonly string[]): Locale {
  for (const lang of languages) {
    const normalized = lang.toLowerCase()
    if (normalized.startsWith('es')) {
      return 'es'
    }

    if (normalized.startsWith('en')) {
      return 'en'
    }
  }

  return DEFAULT_LOCALE
}

export function getBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE
  }

  const langs = navigator.languages?.length
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : []

  return resolveLocale(langs)
}

const defaultLocale = getBrowserLocale()

export const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  messages: i18nMessages[defaultLocale],
})

export function useI18n() {
  return useContext(I18nContext)
}
