import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds = [0]

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve() {}
}

class MockResizeObserver implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

if (!('IntersectionObserver' in globalThis)) {
  globalThis.IntersectionObserver = MockIntersectionObserver
}

if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = MockResizeObserver
}

Object.defineProperty(globalThis.navigator, 'language', {
  configurable: true,
  value: 'es-DO',
})

Object.defineProperty(globalThis.navigator, 'languages', {
  configurable: true,
  value: ['es-DO', 'es', 'en-US'],
})
