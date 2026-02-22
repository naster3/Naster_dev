import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { I18nProvider } from './I18nProvider'
import { useI18n } from './context'

function LocaleProbe() {
  const { locale, messages } = useI18n()

  return (
    <p>
      {locale}::{messages.layout.cv}
    </p>
  )
}

describe('I18nProvider', () => {
  afterEach(() => {
    Object.defineProperty(globalThis.navigator, 'language', {
      configurable: true,
      value: 'es-DO',
    })
    Object.defineProperty(globalThis.navigator, 'languages', {
      configurable: true,
      value: ['es-DO', 'es', 'en-US'],
    })
  })

  it('usa ingles cuando el navegador esta en en-US', () => {
    Object.defineProperty(globalThis.navigator, 'language', {
      configurable: true,
      value: 'en-US',
    })
    Object.defineProperty(globalThis.navigator, 'languages', {
      configurable: true,
      value: ['en-US', 'en'],
    })

    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    )

    expect(screen.getByText('en::View Resume')).toBeInTheDocument()
  })

  it('hace fallback a espanol para idiomas no soportados', () => {
    Object.defineProperty(globalThis.navigator, 'language', {
      configurable: true,
      value: 'fr-FR',
    })
    Object.defineProperty(globalThis.navigator, 'languages', {
      configurable: true,
      value: ['fr-FR', 'fr'],
    })

    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    )

    expect(screen.getByText('es::Ver CV')).toBeInTheDocument()
  })
})
