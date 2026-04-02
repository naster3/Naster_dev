import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SeoHead } from './SeoHead'

describe('SeoHead', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    document.head.innerHTML = ''
  })

  it('uses configured site url, absolute image urls and noindex when requested', async () => {
    vi.stubEnv('VITE_SITE_URL', 'https://naster.dev/')

    render(
      <HelmetProvider>
        <SeoHead
          title="About | Naster Dev"
          description="Professional profile"
          locale="en"
          path="/about"
          imagePath="https://cdn.example.com/cover.png"
          noIndex
          type="article"
        />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.title).toBe('About | Naster Dev')
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        'https://naster.dev/about',
      )
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
        'noindex,nofollow',
      )
      expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
        'article',
      )
      expect(
        document.head.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      ).toBe('https://cdn.example.com/cover.png')
    })
  })

  it('falls back to window origin and default image path', async () => {
    render(
      <HelmetProvider>
        <SeoHead
          title="Inicio | Naster Dev"
          description="Portafolio personal"
          locale="es"
          path="/"
        />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        `${window.location.origin}/`,
      )
      expect(
        document.head.querySelector('meta[property="og:locale"]')?.getAttribute('content'),
      ).toBe('es_DO')
      expect(
        document.head
          .querySelector('meta[property="og:locale:alternate"]')
          ?.getAttribute('content'),
      ).toBe('en_US')
      expect(
        document.head.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      ).toBe(`${window.location.origin}/profile-photo.png`)
    })
  })
})
