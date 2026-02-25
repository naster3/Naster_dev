import { useEffect, useRef, type RefObject } from 'react'
import {
  getMatrixCubeConfig,
  parseCssColorToRgb,
  rgba,
  type Pt,
  type MatrixQualityTier,
} from './matrix-cube'
import { createMatrixRainState, drawMatrixRainColumns } from './matrix-rain-scene'

type MatrixCanvasRuntime = {
  isActive: boolean
  qualityTier: MatrixQualityTier
  reducedMotion: boolean
}

type MatrixCanvasControls = {
  renderStatic: () => void
  start: () => void
  stop: () => void
}

export function useMatrixCubeCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  runtime: MatrixCanvasRuntime,
) {
  const controlsRef = useRef<MatrixCanvasControls | null>(null)
  // Mantiene el runtime mas reciente sin escribir refs durante el render.
  const runtimeRef = useRef(runtime)

  useEffect(() => {
    runtimeRef.current = runtime
  }, [runtime])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { charset, fontSize, maxDpr, targetFps, trailAlpha } = getMatrixCubeConfig(
      runtime.qualityTier,
    )
    let palette = (() => {
      const rootStyles = getComputedStyle(document.documentElement)
      const backgroundCss = rootStyles.getPropertyValue('--bg-main').trim() || '#fffdf7'
      const trailMultiplierCss = Number(
        rootStyles.getPropertyValue('--matrix-trail-alpha-multiplier').trim(),
      )

      return {
        accentRgb: parseCssColorToRgb(rootStyles.getPropertyValue('--accent-ink'), {
          r: 191,
          g: 90,
          b: 42,
        }),
        backgroundCss,
        backgroundRgb: parseCssColorToRgb(backgroundCss, { r: 255, g: 253, b: 247 }),
        brandRgb: parseCssColorToRgb(rootStyles.getPropertyValue('--brand-ink'), {
          r: 12,
          g: 107,
          b: 143,
        }),
        textMainRgb: parseCssColorToRgb(rootStyles.getPropertyValue('--text-main'), {
          r: 25,
          g: 36,
          b: 47,
        }),
        trailMultiplier:
          Number.isFinite(trailMultiplierCss) && trailMultiplierCss > 0 ? trailMultiplierCss : 1,
      }
    })()

    const refreshPalette = () => {
      const rootStyles = getComputedStyle(document.documentElement)
      const backgroundCss = rootStyles.getPropertyValue('--bg-main').trim() || '#fffdf7'
      const trailMultiplierCss = Number(
        rootStyles.getPropertyValue('--matrix-trail-alpha-multiplier').trim(),
      )

      palette = {
        accentRgb: parseCssColorToRgb(rootStyles.getPropertyValue('--accent-ink'), {
          r: 191,
          g: 90,
          b: 42,
        }),
        backgroundCss,
        backgroundRgb: parseCssColorToRgb(backgroundCss, { r: 255, g: 253, b: 247 }),
        brandRgb: parseCssColorToRgb(rootStyles.getPropertyValue('--brand-ink'), {
          r: 12,
          g: 107,
          b: 143,
        }),
        textMainRgb: parseCssColorToRgb(rootStyles.getPropertyValue('--text-main'), {
          r: 25,
          g: 36,
          b: 47,
        }),
        trailMultiplier:
          Number.isFinite(trailMultiplierCss) && trailMultiplierCss > 0 ? trailMultiplierCss : 1,
      }
    }

    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, maxDpr))
    let width = 0
    let height = 0
    let columns = 0
    let drops: number[] = []
    let speeds: number[] = []
    let raf = 0
    let isLoopRunning = false
    let lastFrameTs = 0
    let time = 0
    const targetFrameMs = 1000 / targetFps
    const cubeFacePolys: Pt[][] = []
    const cubeFrontFaceIndices = new Set<number>()

    const initRain = () => {
      const rain = createMatrixRainState(width, fontSize)
      columns = rain.columns
      drops = rain.drops
      speeds = rain.speeds
    }

    const resize = (nextWidth?: number, nextHeight?: number) => {
      // Limita el DPR para evitar costos altos de pintado en pantallas densas.
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, maxDpr))
      width = Math.max(1, nextWidth ?? (canvas.clientWidth || 900))
      height = Math.max(1, nextHeight ?? (canvas.clientHeight || 520))

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false

      initRain()
      ctx.fillStyle = palette.backgroundCss
      ctx.fillRect(0, 0, width, height)
    }

    const draw = (deltaRatio = 1) => {
      time += 0.015 * deltaRatio

      // Limpia con alpha bajo para conservar estela sin reinicio visual brusco.
      const effectiveTrailAlpha = Math.max(
        0.06,
        Math.min(0.92, trailAlpha * palette.trailMultiplier),
      )
      ctx.fillStyle = rgba(palette.backgroundRgb, effectiveTrailAlpha)
      ctx.fillRect(0, 0, width, height)

      drawMatrixRainColumns({
        accentRgb: palette.accentRgb,
        brandRgb: palette.brandRgb,
        charset,
        columns,
        ctx,
        deltaRatio,
        drops,
        facePolys: cubeFacePolys,
        fontSize,
        frontFaceIndices: cubeFrontFaceIndices,
        height,
        showFaceRain: false,
        speeds,
        textMainRgb: palette.textMainRgb,
        time,
      })
    }

    const step = (timestamp: number) => {
      if (!isLoopRunning) return

      // Limita cuadros a targetFps manteniendo movimiento basado en tiempo.
      const elapsed = lastFrameTs ? timestamp - lastFrameTs : targetFrameMs
      if (elapsed >= targetFrameMs) {
        const deltaRatio = Math.min(2, Math.max(0.6, elapsed / (1000 / 60)))
        draw(deltaRatio)
        lastFrameTs = timestamp
      }

      raf = window.requestAnimationFrame(step)
    }

    const start = () => {
      if (isLoopRunning) return
      isLoopRunning = true
      lastFrameTs = 0
      raf = window.requestAnimationFrame(step)
    }

    const stop = () => {
      isLoopRunning = false
      lastFrameTs = 0
      if (raf) {
        window.cancelAnimationFrame(raf)
      }
      raf = 0
    }

    const renderStatic = () => {
      stop()
      draw(1)
    }

    resize()
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        resize(entry.contentRect.width, entry.contentRect.height)
        return
      }

      resize()
    })
    resizeObserver.observe(canvas)
    const themeObserver = new MutationObserver(() => {
      refreshPalette()
      if (!isLoopRunning) draw(1)
    })
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['class', 'data-theme', 'style'],
      attributes: true,
    })
    const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const onColorSchemeChange = () => {
      refreshPalette()
      if (!isLoopRunning) draw(1)
    }
    colorSchemeMedia.addEventListener('change', onColorSchemeChange)

    // Expone controles imperativos para cambios de actividad y reduced-motion.
    controlsRef.current = { renderStatic, start, stop }

    if (runtimeRef.current.reducedMotion) {
      renderStatic()
    } else if (runtimeRef.current.isActive) {
      start()
    } else {
      draw(1)
    }

    return () => {
      controlsRef.current = null
      stop()
      resizeObserver.disconnect()
      themeObserver.disconnect()
      colorSchemeMedia.removeEventListener('change', onColorSchemeChange)
    }
  }, [canvasRef, runtime.qualityTier])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    if (runtime.reducedMotion) {
      controls.renderStatic()
      return
    }

    if (runtime.isActive) {
      controls.start()
      return
    }

    controls.stop()
  }, [runtime.isActive, runtime.reducedMotion])
}
