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
  preRef: RefObject<HTMLPreElement | null>,
  runtime: AsciiCubeRuntime,
) {
  const controlsRef = useRef<AsciiCubeControls | null>(null)
  const runtimeRef = useRef(runtime)

  useEffect(() => {
    runtimeRef.current = runtime
  }, [runtime])

  useEffect(() => {
    const container = containerRef.current
    const pre = preRef.current
    if (!container || !pre) return

    const profile = getAsciiCubeProfile(runtime.qualityTier)
    let grid: AsciiSize = { cols: 72, rows: 28 }
    let cube: AsciiCubeParams = getAsciiCubeParams(grid, profile)
    let raf = 0
    let isRunning = false
    let lastTs = 0
    const startedAt = performance.now()
    const targetFrameMs = 1000 / profile.targetFps

    const drawAt = (seconds: number) => {
      const rot: Rot = {
        a: seconds * 0.9,
        b: seconds * 1.1,
        c: seconds * 0.7,
      }

      pre.textContent = renderCubeAscii({
        cube,
        rot,
        size: grid,
      })
    }

    const resize = () => {
      const rect = container.getBoundingClientRect()
      grid = computeAsciiGridSize(rect.width, Math.max(160, rect.height), profile)
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
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

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
    }
  }, [containerRef, preRef, runtime.qualityTier])

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
