import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '@/shared'
import {
  motionViewport,
  sectionReveal,
  useAnimationActivity,
  type MatrixQualityTier,
  useAsciiCubeOverlay,
  useMatrixCubeCanvas,
} from '../../model'

export function MatrixCubeSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const asciiCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const { locale } = useI18n()

  const activity = useAnimationActivity(sectionRef, { threshold: motionViewport.standard.amount })
  const qualityTier: MatrixQualityTier = 'high'

  useMatrixCubeCanvas(canvasRef, {
    isActive: activity.isActive,
    qualityTier,
    reducedMotion: activity.reducedMotion,
  })
  useAsciiCubeOverlay(containerRef, asciiCanvasRef, {
    isActive: activity.isActive,
    qualityTier,
    reducedMotion: activity.reducedMotion,
  })

  const caption =
    locale === 'es'
      ? 'Lluvia matrix con cubo ASCII 3D, adaptado por rendimiento del dispositivo'
      : 'Matrix rain with 3D ASCII cube, adapted to device performance'

  return (
    <motion.section
      ref={sectionRef}
      id="signal-field"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={motionViewport.standard}
      className="space-y-3"
    >
      <div
        ref={containerRef}
        className="relative h-[70svh] min-h-120 w-full overflow-hidden"
        style={{ backgroundImage: 'var(--matrix-field-bg)' }}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          aria-label={
            locale === 'es' ? 'Animacion de campo matricial 3D' : '3D matrix field animation'
          }
        />
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden px-3 py-2">
          <canvas ref={asciiCanvasRef} className="h-full w-full" aria-hidden="true" />
        </div>
      </div>
      <p className="text-[12px] font-medium text-(--text-soft)">{caption}</p>
    </motion.section>
  )
}
