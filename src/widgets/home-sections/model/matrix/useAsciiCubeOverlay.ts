import { useEffect, useRef, type RefObject } from 'react'
import type { MatrixQualityTier } from './matrix-cube'
import {
  computeAsciiGridSize,
  getAsciiCubeParams,
  getAsciiCubeProfile,
  renderCubeAscii,
  type AsciiCubeParams,
  type AsciiSize,
  type Rot,
} from './matrix-ascii-cube'

type AsciiCubeRuntime = {
  isActive: boolean
  qualityTier: MatrixQualityTier
  reducedMotion: boolean
}

type AsciiCubeControls = {
  renderStatic: () => void
  start: () => void
  stop: () => void
}

export function useAsciiCubeOverlay(
  containerRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  runtime: AsciiCubeRuntime,
) {
  const controlsRef = useRef<AsciiCubeControls | null>(null)
  const runtimeRef = useRef(runtime)

  useEffect(() => {
    runtimeRef.current = runtime
  }, [runtime])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const profile = getAsciiCubeProfile(runtime.qualityTier)
    let grid: AsciiSize = { cols: 72, rows: 28 }
    let cube: AsciiCubeParams = getAsciiCubeParams(grid, profile)
    let raf = 0
    let isRunning = false
    let lastTs = 0
    let width = 0
    let height = 0
    let dpr = 1
    let lineHeight = 14
    let textColor = '#0c6b8f'
    const startedAt = performance.now()
    const targetFrameMs = 1000 / profile.targetFps

    const refreshPalette = () => {
      const styles = getComputedStyle(document.documentElement)
      textColor = styles.getPropertyValue('--brand-ink').trim() || '#0c6b8f'
    }

    const drawAsciiFrame = (ascii: string) => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = textColor
      ctx.textBaseline = 'top'
      ctx.imageSmoothingEnabled = false
      ctx.font =
        `${Math.max(11, Math.round(profile.charHeight * 0.8))}px ui-monospace, SFMono-Regular, Menlo, ` +
        "Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"

      const normalizedAscii = ascii.endsWith('\n') ? ascii.slice(0, -1) : ascii
      const lines = normalizedAscii.split('\n')
      const maxLineWidth = lines.reduce((maxWidth, line) => {
        return Math.max(maxWidth, ctx.measureText(line).width)
      }, 0)
      const blockHeight = lines.length * lineHeight
      const yStart = Math.max(0, Math.floor((height - blockHeight) / 2))
      const xStart = Math.max(0, Math.floor((width - maxLineWidth) / 2))

      for (let row = 0; row < lines.length; row += 1) {
        const line = lines[row]
        if (!line) continue
        ctx.fillText(line, xStart, yStart + row * lineHeight)
      }
    }

    const drawAt = (seconds: number) => {
      const rot: Rot = {
        a: seconds * 0.9,
        b: seconds * 1.1,
        c: seconds * 0.7,
      }

      drawAsciiFrame(renderCubeAscii({ cube, rot, size: grid }))
    }

    const resize = (nextWidth?: number, nextHeight?: number) => {
      width = Math.max(1, nextWidth ?? container.clientWidth)
      height = Math.max(1, nextHeight ?? container.clientHeight)
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
      lineHeight = Math.max(11, Math.round(profile.charHeight * 0.84))

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      grid = computeAsciiGridSize(width, Math.max(160, height), profile)
      cube = getAsciiCubeParams(grid, profile)
      drawAt(0)
    }

    const step = (timestamp: number) => {
      if (!isRunning) return
      if (lastTs === 0 || timestamp - lastTs >= targetFrameMs) {
        lastTs = timestamp
        drawAt((timestamp - startedAt) / 1000)
      }
      raf = window.requestAnimationFrame(step)
    }

    const start = () => {
      if (isRunning) return
      isRunning = true
      lastTs = 0
      raf = window.requestAnimationFrame(step)
    }

    const stop = () => {
      isRunning = false
      lastTs = 0
      if (raf) window.cancelAnimationFrame(raf)
      raf = 0
    }

    const renderStatic = () => {
      stop()
      drawAt(0)
    }

    resize()
    refreshPalette()
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        resize(entry.contentRect.width, entry.contentRect.height)
        return
      }

      resize()
    })
    resizeObserver.observe(container)
    const themeObserver = new MutationObserver(() => {
      refreshPalette()
      if (!isRunning) drawAt(0)
    })
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['class', 'data-theme', 'style'],
      attributes: true,
    })
    const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const onColorSchemeChange = () => {
      refreshPalette()
      if (!isRunning) drawAt(0)
    }
    colorSchemeMedia.addEventListener('change', onColorSchemeChange)

    controlsRef.current = { renderStatic, start, stop }

    if (runtimeRef.current.reducedMotion) {
      renderStatic()
    } else if (runtimeRef.current.isActive) {
      start()
    } else {
      renderStatic()
    }

    return () => {
      controlsRef.current = null
      stop()
      resizeObserver.disconnect()
      themeObserver.disconnect()
      colorSchemeMedia.removeEventListener('change', onColorSchemeChange)
    }
  }, [canvasRef, containerRef, runtime.qualityTier])

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

    controls.renderStatic()
  }, [runtime.isActive, runtime.reducedMotion])
}
