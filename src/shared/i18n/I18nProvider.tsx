import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, getBrowserLocale, type I18nContextValue } from './context'
import { i18nMessages, type Locale } from './messages'

type I18nProviderProps = {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale] = useState<Locale>(() => getBrowserLocale())

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: i18nMessages[locale],
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
