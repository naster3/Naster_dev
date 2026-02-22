export type V3 = [number, number, number]

export type P2 = {
  scale: number
  x: number
  y: number
}

export type Pt = {
  x: number
  y: number
}

export type Rgb = {
  b: number
  g: number
  r: number
}

export type MatrixQualityTier = 'high' | 'low' | 'medium'

export type MatrixCubeConfig = {
  charset: string
  cubeSize: number
  faceRainColSpacing: number
  faceRainFrontFacesOnly: boolean
  faceRainMaskBlurMax: number
  faceRainMaskBlurMin: number
  faceRainRowSpacing: number
  faceRainTailMax: number
  faceRainTailMin: number
  fontSize: number
  maxDpr: number
  showFaceRain: boolean
  showWireframe: boolean
  targetFps: number
  trailAlpha: number
}

const matrixCubeBaseConfig: MatrixCubeConfig = {
  charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=-?/\\|[]{}<>',
  cubeSize: 135,
  faceRainColSpacing: 1.9,
  faceRainFrontFacesOnly: true,
  faceRainMaskBlurMax: 1.7,
  faceRainMaskBlurMin: 0.8,
  faceRainRowSpacing: 1.6,
  faceRainTailMax: 9,
  faceRainTailMin: 4,
  fontSize: 20,
  maxDpr: 2,
  showFaceRain: false,
  showWireframe: true,
  targetFps: 30,
  trailAlpha: 0.3,
}

const matrixCubeQualityPresets: Record<MatrixQualityTier, MatrixCubeConfig> = {
  high: {
    ...matrixCubeBaseConfig,
    showFaceRain: true,
    targetFps: 36,
    trailAlpha: 0.26,
  },
  medium: {
    ...matrixCubeBaseConfig,
    faceRainMaskBlurMax: 1.3,
    faceRainMaskBlurMin: 0.6,
    faceRainTailMax: 8,
    faceRainTailMin: 4,
    fontSize: 21,
    maxDpr: 1.5,
    targetFps: 24,
    trailAlpha: 0.34,
  },
  low: {
    ...matrixCubeBaseConfig,
    faceRainMaskBlurMax: 0.8,
    faceRainMaskBlurMin: 0.4,
    faceRainTailMax: 6,
    faceRainTailMin: 3,
    fontSize: 22,
    maxDpr: 1.2,
    // Keep cube legible on low-end devices with a lighter face-rain profile.
    showFaceRain: false,
    showWireframe: true,
    targetFps: 20,
    trailAlpha: 0.38,
  },
}

export const matrixCubeConfig = matrixCubeQualityPresets.high

export function getMatrixCubeConfig(qualityTier: MatrixQualityTier): MatrixCubeConfig {
  const config = matrixCubeQualityPresets[qualityTier]
  if (config.showFaceRain || config.showWireframe) {
    return config
  }

  return {
    ...config,
    showWireframe: true,
  }
}

export function detectMatrixQualityTier(): MatrixQualityTier {
  if (typeof navigator === 'undefined') return 'medium'

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency

  if (typeof memory === 'number' && memory <= 4) return 'low'
  if (typeof cores === 'number' && cores <= 4) return 'low'
  if (typeof memory === 'number' && memory <= 8) return 'medium'
  if (typeof cores === 'number' && cores <= 8) return 'medium'

  return 'high'
}

export const matrixCubeVertices: V3[] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
]

export const matrixCubeEdges: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

export const matrixCubeFaces: number[][] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [2, 3, 7, 6],
  [1, 2, 6, 5],
  [0, 3, 7, 4],
]

export function clamp(value: number, min = 0, max = 255): number {
  return Math.max(min, Math.min(max, value))
}

export function parseCssColorToRgb(input: string, fallback: Rgb): Rgb {
  const color = input.trim().toLowerCase()

  if (color.startsWith('#')) {
    const hex = color.slice(1)
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      }
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      }
    }
  }

  const rgbMatch = color.match(/rgba?\(([^)]+)\)/)
  if (rgbMatch) {
    const parts = rgbMatch[1]
      .split(/[,\s/]+/)
      .map((part) => part.trim())
      .filter(Boolean)
    const r = Number(parts[0])
    const g = Number(parts[1])
    const b = Number(parts[2])
    if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
      return { r: clamp(r), g: clamp(g), b: clamp(b) }
    }
  }

  return fallback
}

export function rgba(color: Rgb, alpha: number): string {
  return `rgba(${color.r},${color.g},${color.b},${alpha})`
}

export function rotX([x, y, z]: V3, angle: number): V3 {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [x, y * cos - z * sin, y * sin + z * cos]
}

export function rotY([x, y, z]: V3, angle: number): V3 {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [x * cos + z * sin, y, -x * sin + z * cos]
}

export function rotZ([x, y, z]: V3, angle: number): V3 {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [x * cos - y * sin, x * sin + y * cos, z]
}

export function project([x, y, z]: V3, centerX: number, centerY: number, distance = 520): P2 {
  const scale = distance / (distance + z)
  return { scale, x: centerX + x * scale, y: centerY + y * scale }
}

export function pointInPolygon(x: number, y: number, polygon: Pt[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i]?.x ?? 0
    const yi = polygon[i]?.y ?? 0
    const xj = polygon[j]?.x ?? 0
    const yj = polygon[j]?.y ?? 0
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

export function hash01(a: number, b: number, c: number, d: number): number {
  let value = (a * 374761393 + b * 668265263 + c * 2147483647 + d * 1274126177) | 0
  value = (value ^ (value >>> 13)) | 0
  value = (value * 1274126177) | 0
  value = (value ^ (value >>> 16)) | 0
  return ((value >>> 0) % 100000) / 100000
}

export function sub(a: V3, b: V3): V3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function cross(a: V3, b: V3): V3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

export function dot(a: V3, b: V3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function norm(a: V3): V3 {
  const length = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / length, a[1] / length, a[2] / length]
}
