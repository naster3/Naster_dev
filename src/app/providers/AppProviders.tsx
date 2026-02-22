import type { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { HashRouter } from 'react-router-dom'
import { I18nProvider } from '@/shared/i18n'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <HelmetProvider>
      <I18nProvider>
        <HashRouter>{children}</HashRouter>
      </I18nProvider>
    </HelmetProvider>
  )
}
