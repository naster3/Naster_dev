import type { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from '@/shared/i18n'
import { ThemeProvider } from './ThemeProvider'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <I18nProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
