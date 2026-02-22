import { useEffect, useState, type RefObject } from 'react'

type UseAnimationActivityOptions = {
  rootMargin?: string
  threshold?: number
}

type AnimationActivityState = {
  isActive: boolean
  isInView: boolean
  isPageVisible: boolean
  reducedMotion: boolean
}

function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getPageVisibility(): boolean {
  if (typeof document === 'undefined') return true
  return document.visibilityState === 'visible'
}

function getIntersectionObserverFallback(): boolean {
  if (typeof window === 'undefined') return false
  return typeof IntersectionObserver === 'undefined'
}

export function useAnimationActivity(
  targetRef: RefObject<Element | null>,
  options: UseAnimationActivityOptions = {},
): AnimationActivityState {
  const { rootMargin = '0px', threshold = 0.2 } = options
  const [isInView, setIsInView] = useState(getIntersectionObserverFallback)
  const [isPageVisible, setIsPageVisible] = useState(getPageVisibility)
  const [reducedMotion, setReducedMotion] = useState(getReducedMotionPreference)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(Boolean(entry?.isIntersecting))
      },
      { root: null, rootMargin, threshold },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, targetRef, threshold])

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return
    }

    const onVisibilityChange = () => {
      setIsPageVisible(getPageVisibility())
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onReducedMotionChange = () => {
      setReducedMotion(mediaQuery.matches)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    mediaQuery.addEventListener('change', onReducedMotionChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      mediaQuery.removeEventListener('change', onReducedMotionChange)
    }
  }, [])

  return {
    isActive: isInView && isPageVisible && !reducedMotion,
    isInView,
    isPageVisible,
    reducedMotion,
  }
}
