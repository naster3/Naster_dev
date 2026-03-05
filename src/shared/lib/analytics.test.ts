import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackPortfolioEvent } from './analytics'

describe('trackPortfolioEvent', () => {
  afterEach(() => {
    window.dataLayer = undefined
    window.plausible = undefined
    vi.restoreAllMocks()
  })

  it('pushes payload to dataLayer and dispatches a browser event', () => {
    const dataLayer: Array<Record<string, unknown>> = []
    window.dataLayer = dataLayer
    const listener = vi.fn()
    window.addEventListener('portfolio:analytics', listener as EventListener)

    trackPortfolioEvent('cta_click', { source: 'footer', position: 1 })

    expect(dataLayer).toHaveLength(1)
    expect(dataLayer[0]).toEqual(
      expect.objectContaining({
        event: 'portfolio_event',
        eventName: 'cta_click',
        source: 'footer',
        position: 1,
      }),
    )
    expect(listener).toHaveBeenCalledTimes(1)

    window.removeEventListener('portfolio:analytics', listener as EventListener)
  })

  it('sends event to plausible when available', () => {
    const plausible = vi.fn()
    window.plausible = plausible

    trackPortfolioEvent('contact_submit', { status: 'success' })

    expect(plausible).toHaveBeenCalledWith('contact_submit', {
      props: { status: 'success' },
    })
  })
})
