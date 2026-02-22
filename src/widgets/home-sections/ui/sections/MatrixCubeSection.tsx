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
  const asciiRef = useRef<HTMLPreElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const { locale } = useI18n()

  const activity = useAnimationActivity(sectionRef, { threshold: motionViewport.standard.amount })
  const qualityTier: MatrixQualityTier = 'high'

  useMatrixCubeCanvas(canvasRef, {
    isActive: activity.isActive,
    qualityTier,
    reducedMotion: activity.reducedMotion,
    renderCube: false,
  })
  useAsciiCubeOverlay(containerRef, asciiRef, {
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
        className="relative h-[70svh] min-h-120 w-full overflow-hidden bg-[radial-gradient(circle_at_24%_20%,var(--brand-mist)_0%,transparent_40%),linear-gradient(180deg,var(--bg-glass)_0%,var(--bg-main)_100%)]"
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          aria-label={
            locale === 'es' ? 'Animacion de campo matricial 3D' : '3D matrix field animation'
          }
        />
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden px-3 py-2">
          <pre
            ref={asciiRef}
            className="m-0 h-full w-full select-none overflow-hidden text-center text-[14px] leading-[1.02] whitespace-pre text-(--brand-ink) md:text-[16px]"
            aria-hidden="true"
            style={{
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            }}
          />
        </div>
      </div>
      <p className="text-[12px] font-medium text-(--text-soft)">{caption}</p>
    </motion.section>
  )
}
