type AnalyticsValue = boolean | number | string

export type PortfolioEventPayload = Record<string, AnalyticsValue | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void
  }
}

export function trackPortfolioEvent(eventName: string, payload: PortfolioEventPayload = {}) {
  if (typeof window === 'undefined') return

  const normalizedPayload = Object.entries(payload).reduce<Record<string, AnalyticsValue>>(
    (acc, [key, value]) => {
      if (value === undefined) return acc
      acc[key] = value
      return acc
    },
    {},
  )

  const eventRecord = {
    event: 'portfolio_event',
    eventName,
    ...normalizedPayload,
    timestamp: Date.now(),
  }

  window.dataLayer?.push(eventRecord)
  window.dispatchEvent(
    new CustomEvent('portfolio:analytics', {
      detail: eventRecord,
    }),
  )
  window.plausible?.(eventName, { props: normalizedPayload })
}
