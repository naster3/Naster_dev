import { useEffect, useRef, type RefObject } from 'react'
import {
  getMatrixCubeConfig,
  parseCssColorToRgb,
  rgba,
  type MatrixQualityTier,
} from './matrix-cube'
import {
  buildCubeFaceInfo,
  createCubeVertices,
  drawCubeWireframe,
  drawFrontFaceOutlines,
  getCubeDepthNormalizer,
  getCubeState,
  getFrontFaceIndices,
  sortCubeFacesByDepth,
} from './matrix-cube-scene'
import { createMatrixRainState, drawFaceRain, drawMatrixRainColumns } from './matrix-rain-scene'

type MatrixCanvasRuntime = {
  isActive: boolean
  qualityTier: MatrixQualityTier
  reducedMotion: boolean
  renderCube?: boolean
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

    // Capas fuera de pantalla: aqui se compone el face-rain y luego se mezcla en el canvas principal.
    const faceLayer = document.createElement('canvas')
    const maskLayer = document.createElement('canvas')
    const faceCtx = faceLayer.getContext('2d')
    const maskCtx = maskLayer.getContext('2d')
    if (!faceCtx || !maskCtx) return

    const {
      charset,
      cubeSize,
      faceRainColSpacing,
      faceRainFrontFacesOnly,
      faceRainMaskBlurMax,
      faceRainMaskBlurMin,
      faceRainRowSpacing,
      faceRainTailMax,
      faceRainTailMin,
      fontSize,
      maxDpr,
      showFaceRain,
      showWireframe,
      targetFps,
      trailAlpha,
    } = getMatrixCubeConfig(runtime.qualityTier)

    const rootStyles = getComputedStyle(document.documentElement)
    const backgroundCss = rootStyles.getPropertyValue('--bg-main').trim() || '#fffdf7'
    const backgroundRgb = parseCssColorToRgb(backgroundCss, { r: 255, g: 253, b: 247 })
    const brandRgb = parseCssColorToRgb(rootStyles.getPropertyValue('--brand-ink'), {
      r: 12,
      g: 107,
      b: 143,
    })
    const textMainRgb = parseCssColorToRgb(rootStyles.getPropertyValue('--text-main'), {
      r: 25,
      g: 36,
      b: 47,
    })
    const accentRgb = parseCssColorToRgb(rootStyles.getPropertyValue('--accent-ink'), {
      r: 191,
      g: 90,
      b: 42,
    })

    const cubeVertices = createCubeVertices(cubeSize)

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

    const initRain = () => {
      const rain = createMatrixRainState(width, fontSize)
      columns = rain.columns
      drops = rain.drops
      speeds = rain.speeds
    }

    const resize = () => {
      // Limita el DPR para evitar costos altos de pintado en pantallas densas.
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, maxDpr))
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width || 900
      height = bounds.height || 520

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false

      faceLayer.width = canvas.width
      faceLayer.height = canvas.height
      maskLayer.width = canvas.width
      maskLayer.height = canvas.height
      faceCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      faceCtx.imageSmoothingEnabled = false
      maskCtx.imageSmoothingEnabled = false

      initRain()
      ctx.fillStyle = backgroundCss
      ctx.fillRect(0, 0, width, height)
    }

    const getCubeStateAt = (offset = 0) => getCubeState(cubeVertices, width, height, time, offset)

    const draw = (deltaRatio = 1) => {
      time += 0.015 * deltaRatio

      // Limpia con alpha bajo para conservar estela sin reinicio visual brusco.
      ctx.fillStyle = rgba(backgroundRgb, trailAlpha)
      ctx.fillRect(0, 0, width, height)

      const cube = getCubeStateAt()
      const faceInfo = buildCubeFaceInfo(cube.rotated)
      const zNorm = getCubeDepthNormalizer(faceInfo)
      sortCubeFacesByDepth(faceInfo)
      const frontFaceIndices = getFrontFaceIndices(faceInfo)
      const renderCube = runtimeRef.current.renderCube ?? true

      if (showFaceRain) {
        drawFaceRain({
          accentRgb,
          brandRgb,
          charset,
          ctx,
          dpr,
          faceCtx,
          faceInfo,
          facePolys: cube.facePolys,
          faceRainColSpacing,
          faceRainFrontFacesOnly,
          faceRainMaskBlurMax,
          faceRainMaskBlurMin,
          faceRainRowSpacing,
          faceRainTailMax,
          faceRainTailMin,
          fontSize,
          frontFaceIndices,
          height,
          maskCtx,
          textMainRgb,
          time,
          width,
          zNorm,
        })
      }

      if (renderCube && !showWireframe) {
        drawFrontFaceOutlines({
          brandRgb,
          ctx,
          facePolys: cube.facePolys,
          frontFaceIndices,
        })
      }

      drawMatrixRainColumns({
        accentRgb,
        brandRgb,
        charset,
        columns,
        ctx,
        deltaRatio,
        drops,
        facePolys: cube.facePolys,
        fontSize,
        frontFaceIndices,
        height,
        showFaceRain,
        speeds,
        textMainRgb,
        time,
      })

      if (renderCube && showWireframe) {
        drawCubeWireframe({
          brandRgb,
          ctx,
          getCubeStateAt,
          projected: cube.projected,
        })
      }
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
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

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
