import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (typeof window === 'undefined') return

    let rafId = 0

    const updateOpacity = () => {
      rafId = 0

      const fadeTarget = document.getElementById(fadeTargetId)
      if (!fadeTarget) {
        setOpacity(1)
        return
      }

      const { bottom } = fadeTarget.getBoundingClientRect()
      const fadeDistance = Math.max(window.innerHeight * 0.85, 1)
      const nextOpacity = Math.min(1, Math.max(0, bottom / fadeDistance))

      setOpacity((prev) => {
        if (Math.abs(prev - nextOpacity) < 0.02) return prev
        return nextOpacity
      })
    }

    const onViewportChange = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateOpacity)
    }

    updateOpacity()
    window.addEventListener('scroll', onViewportChange, { passive: true })
    window.addEventListener('resize', onViewportChange)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onViewportChange)
      window.removeEventListener('resize', onViewportChange)
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
