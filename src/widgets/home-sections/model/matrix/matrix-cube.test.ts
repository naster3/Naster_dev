import { afterEach, describe, expect, it } from 'vitest'
import {
  detectMatrixQualityTier,
  getMatrixCubeConfig,
  parseCssColorToRgb,
  project,
} from './matrix-cube'

const originalDeviceMemory = Object.getOwnPropertyDescriptor(navigator, 'deviceMemory')
const originalHardwareConcurrency = Object.getOwnPropertyDescriptor(
  navigator,
  'hardwareConcurrency',
)

function setNavigatorProp(name: 'deviceMemory' | 'hardwareConcurrency', value: number) {
  Object.defineProperty(navigator, name, {
    configurable: true,
    value,
  })
}

function restoreNavigatorProp(
  name: 'deviceMemory' | 'hardwareConcurrency',
  descriptor?: PropertyDescriptor,
) {
  if (descriptor) {
    Object.defineProperty(navigator, name, descriptor)
    return
  }

  delete (navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number })[name]
}

describe('matrix-cube config', () => {
  afterEach(() => {
    restoreNavigatorProp('deviceMemory', originalDeviceMemory)
    restoreNavigatorProp('hardwareConcurrency', originalHardwareConcurrency)
  })

  it('detecta tier low en dispositivos limitados', () => {
    setNavigatorProp('deviceMemory', 4)
    setNavigatorProp('hardwareConcurrency', 8)

    expect(detectMatrixQualityTier()).toBe('low')
  })

  it('detecta tier medium en dispositivos intermedios', () => {
    setNavigatorProp('deviceMemory', 8)
    setNavigatorProp('hardwareConcurrency', 8)

    expect(detectMatrixQualityTier()).toBe('medium')
  })

  it('detecta tier high en dispositivos potentes', () => {
    setNavigatorProp('deviceMemory', 16)
    setNavigatorProp('hardwareConcurrency', 12)

    expect(detectMatrixQualityTier()).toBe('high')
  })

  it('siempre devuelve una configuracion visible para todos los tiers', () => {
    for (const tier of ['high', 'medium', 'low'] as const) {
      const config = getMatrixCubeConfig(tier)
      expect(config.showFaceRain || config.showWireframe).toBe(true)
      expect(config.maxDpr).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('matrix-cube helpers', () => {
  it('parsea colores hex y rgb correctamente', () => {
    expect(parseCssColorToRgb('#0f8', { r: 0, g: 0, b: 0 })).toEqual({ r: 0, g: 255, b: 136 })
    expect(parseCssColorToRgb('rgb(12, 34, 56)', { r: 0, g: 0, b: 0 })).toEqual({
      r: 12,
      g: 34,
      b: 56,
    })
  })

  it('proyecta puntos 3D hacia el centro esperado', () => {
    const centerX = 100
    const centerY = 120
    const projected = project([25, -10, 0], centerX, centerY, 500)

    expect(projected.x).toBeGreaterThan(centerX)
    expect(projected.y).toBeLessThan(centerY)
    expect(projected.scale).toBeCloseTo(1, 3)
  })
})
