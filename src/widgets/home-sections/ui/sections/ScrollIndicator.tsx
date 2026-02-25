import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn, useI18n } from '@/shared'

type ScrollIndicatorProps = {
  targetId?: string
  className?: string
  fadeTargetId?: string
}

export function ScrollIndicator({
  targetId = 'sobre-mi',
  className,
  fadeTargetId = 'home',
}: ScrollIndicatorProps) {
  const { locale } = useI18n()
  const label = locale === 'es' ? 'Desliza para explorar' : 'Scroll to explore'
  const href = targetId.startsWith('#') ? targetId : `#${targetId}`
  const [opacity, setOpacity] = useState(1)
  const fadeEndRef = useRef(0)
  const fadeDistanceRef = useRef(1)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const fadeTarget = document.getElementById(fadeTargetId)
    if (!fadeTarget) {
      return
    }

    let rafId = 0
    let resizeObserver: ResizeObserver | null = null

    const updateFadeMetrics = () => {
      const rect = fadeTarget.getBoundingClientRect()
      fadeEndRef.current = rect.bottom + window.scrollY
      fadeDistanceRef.current = Math.max(window.innerHeight * 0.85, 1)
    }

    const updateOpacity = () => {
      rafId = 0
      const bottom = fadeEndRef.current - window.scrollY
      const nextOpacity = Math.min(1, Math.max(0, bottom / fadeDistanceRef.current))

      setOpacity((prev) => {
        if (Math.abs(prev - nextOpacity) < 0.02) return prev
        return nextOpacity
      })
    }

    const onViewportChange = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateOpacity)
    }

    const onResize = () => {
      updateFadeMetrics()
      onViewportChange()
    }

    updateFadeMetrics()
    updateOpacity()
    window.addEventListener('scroll', onViewportChange, { passive: true })
    window.addEventListener('resize', onResize)
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(fadeTarget)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onViewportChange)
      window.removeEventListener('resize', onResize)
      resizeObserver?.disconnect()
    }
  }, [fadeTargetId])

  return (
    <motion.a
      href={href}
      aria-label={label}
      className={cn(
        'mx-auto inline-flex h-16 w-12 flex-col items-center justify-center rounded-full border border-(--border-soft) bg-(--surface-2) text-(--text-soft)',
        className,
      )}
      style={{ opacity, pointerEvents: opacity < 0.08 ? 'none' : 'auto' }}
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
    >
      <div className="relative flex h-8 w-5 items-start justify-center rounded-full border border-(--border-soft) bg-(--surface-solid)">
        <motion.span
          className="mt-1 block h-1.5 w-1.5 rounded-full bg-(--brand-ink)"
          animate={{ y: [0, 8, 0], opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.1, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        />
      </div>
      <ChevronDown size={14} className="mt-1 text-(--brand-ink)" />
    </motion.a>
  )
}
