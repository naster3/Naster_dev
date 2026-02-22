import { describe, expect, it } from 'vitest'
import {
  computeAsciiGridSize,
  getAsciiCubeParams,
  getAsciiCubeProfile,
  renderCubeAscii,
  type AsciiSize,
  type Rot,
} from './matrix-ascii-cube'

describe('matrix-ascii-cube', () => {
  it('computes a bounded grid size', () => {
    const profile = getAsciiCubeProfile('high')
    const grid = computeAsciiGridSize(1400, 720, profile)
    expect(grid.cols).toBeGreaterThanOrEqual(profile.minCols)
    expect(grid.cols).toBeLessThanOrEqual(profile.maxCols)
    expect(grid.rows).toBeGreaterThanOrEqual(profile.minRows)
    expect(grid.rows).toBeLessThanOrEqual(profile.maxRows)
  })

  it('renders expected number of lines', () => {
    const profile = getAsciiCubeProfile('medium')
    const size: AsciiSize = { cols: 60, rows: 24 }
    const cube = getAsciiCubeParams(size, profile)
    const rot: Rot = { a: 0.2, b: 0.4, c: 0.1 }
    const output = renderCubeAscii({ cube, rot, size })
    expect(output.split('\n').length).toBe(size.rows + 1)
  })

  it('includes edges and face symbols when visible', () => {
    const profile = getAsciiCubeProfile('high')
    const size: AsciiSize = { cols: 96, rows: 38 }
    const cube = getAsciiCubeParams(size, profile)
    const rot: Rot = { a: 1.0, b: 0.7, c: 0.2 }
    const output = renderCubeAscii({ cube, rot, size })

    expect(output.includes('@')).toBe(true)
    expect(['$', '%', '&', '=', '+', '~'].some((symbol) => output.includes(symbol))).toBe(true)
  })
})
