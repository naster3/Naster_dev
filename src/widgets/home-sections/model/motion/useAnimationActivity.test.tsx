import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useAnimationActivity } from './useAnimationActivity'

class ControlledIntersectionObserver implements IntersectionObserver {
  static callback: IntersectionObserverCallback | null = null
  static emit(isIntersecting: boolean) {
    const entry = { isIntersecting } as IntersectionObserverEntry
    ControlledIntersectionObserver.callback?.([entry], {} as IntersectionObserver)
  }

  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds = [0]

  constructor(callback: IntersectionObserverCallback) {
    ControlledIntersectionObserver.callback = callback
  }

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve() {}
}

type MatchMediaMockController = {
  setMatches: (next: boolean) => void
}

function installMatchMediaMock(initialValue: boolean): MatchMediaMockController {
  let matches = initialValue
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const matchMedia = () =>
    ({
      get matches() {
        return matches
      },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
        listeners.add(listener as (event: MediaQueryListEvent) => void)
      },
      removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
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
    value: matchMedia,
  })

  return {
    setMatches: (next) => {
      matches = next
      const event = {
        matches: next,
        media: '(prefers-reduced-motion: reduce)',
      } as MediaQueryListEvent
      listeners.forEach((listener) => listener(event))
    },
  }
}

function ActivityProbe() {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const activity = useAnimationActivity(targetRef, { threshold: 0.1 })

  return (
    <section>
      <div ref={targetRef} data-testid="target" />
      <p data-testid="activity">
        active:{String(activity.isActive)}|inView:{String(activity.isInView)}|visible:
        {String(activity.isPageVisible)}|reduced:{String(activity.reducedMotion)}
      </p>
    </section>
  )
}

const originalIntersectionObserver = globalThis.IntersectionObserver
const originalVisibility = Object.getOwnPropertyDescriptor(document, 'visibilityState')

describe('useAnimationActivity', () => {
  beforeEach(() => {
    globalThis.IntersectionObserver =
      ControlledIntersectionObserver as unknown as typeof IntersectionObserver
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    })
  })

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver
    if (originalVisibility) {
      Object.defineProperty(document, 'visibilityState', originalVisibility)
    }
  })

  it('se activa cuando el elemento entra en viewport y la pagina es visible', () => {
    installMatchMediaMock(false)
    render(<ActivityProbe />)

    act(() => {
      ControlledIntersectionObserver.emit(true)
    })

    expect(screen.getByTestId('activity')).toHaveTextContent(
      'active:true|inView:true|visible:true|reduced:false',
    )
  })

  it('se desactiva cuando la pestana pasa a hidden', () => {
    installMatchMediaMock(false)
    render(<ActivityProbe />)

    act(() => {
      ControlledIntersectionObserver.emit(true)
    })

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    })

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(screen.getByTestId('activity')).toHaveTextContent(
      'active:false|inView:true|visible:false|reduced:false',
    )
  })

  it('respeta reduced motion aunque el elemento este en viewport', () => {
    const matchMedia = installMatchMediaMock(true)
    render(<ActivityProbe />)

    act(() => {
      ControlledIntersectionObserver.emit(true)
    })

    expect(screen.getByTestId('activity')).toHaveTextContent(
      'active:false|inView:true|visible:true|reduced:true',
    )

    act(() => {
      matchMedia.setMatches(false)
    })

    expect(screen.getByTestId('activity')).toHaveTextContent(
      'active:true|inView:true|visible:true|reduced:false',
    )
  })
})
