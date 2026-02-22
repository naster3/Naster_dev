import type { MatrixQualityTier } from './matrix-cube'

export type Vec3 = { x: number; y: number; z: number }
export type Rot = { a: number; b: number; c: number }
export type AsciiSize = { cols: number; rows: number }

export type AsciiCubeProfile = {
  charHeight: number
  charWidth: number
  cubeHalfMax: number
  cubeHalfMin: number
  dist: number
  maxCols: number
  maxRows: number
  minCols: number
  minRows: number
  sampleDivisor: number
  scaleMultiplier: number
  targetFps: number
}

export type AsciiCubeParams = {
  aspect: number
  cubeHalf: number
  dist: number
  sampleDivisor: number
  scale: number
}

const LUMA = ' .:-=+*#%@'
const FACE_SYMBOLS = ['$', '%', '&', '=', '+', '~'] as const

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function rotateX(v: Vec3, a: number): Vec3 {
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  return { x: v.x, y: v.y * ca - v.z * sa, z: v.y * sa + v.z * ca }
}

function rotateY(v: Vec3, b: number): Vec3 {
  const cb = Math.cos(b)
  const sb = Math.sin(b)
  return { x: v.x * cb + v.z * sb, y: v.y, z: -v.x * sb + v.z * cb }
}

function rotateZ(v: Vec3, c: number): Vec3 {
  const cc = Math.cos(c)
  const sc = Math.sin(c)
  return { x: v.x * cc - v.y * sc, y: v.x * sc + v.y * cc, z: v.z }
}

function rotate(v: Vec3, r: Rot): Vec3 {
  return rotateZ(rotateY(rotateX(v, r.a), r.b), r.c)
}

function dot(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1
  return { x: v.x / len, y: v.y / len, z: v.z / len }
}

function faceShadedChar(intensity: number, faceIndex: number): string {
  const idx = Math.round(intensity * (LUMA.length - 1))
  const clamped = clamp(idx, 0, LUMA.length - 1)
  if (clamped >= LUMA.length - 2) {
    return FACE_SYMBOLS[clamp(faceIndex, 0, FACE_SYMBOLS.length - 1)] as string
  }
  return LUMA[clamped] ?? ' '
}

function makeBuffer(size: AsciiSize) {
  const n = size.cols * size.rows
  return {
    chars: new Array<string>(n).fill(' '),
    zbuf: new Array<number>(n).fill(-Infinity),
  }
}

function idxOf(x: number, y: number, cols: number) {
  return y * cols + x
}

export function getAsciiCubeProfile(qualityTier: MatrixQualityTier): AsciiCubeProfile {
  if (qualityTier === 'low') {
    return {
      charHeight: 18,
      charWidth: 9,
      cubeHalfMax: 15,
      cubeHalfMin: 7,
      dist: 22,
      maxCols: 120,
      maxRows: 48,
      minCols: 40,
      minRows: 16,
      sampleDivisor: 12,
      scaleMultiplier: 1.56,
      targetFps: 18,
    }
  }

  if (qualityTier === 'medium') {
    return {
      charHeight: 18,
      charWidth: 9,
      cubeHalfMax: 16,
      cubeHalfMin: 7,
      dist: 22,
      maxCols: 132,
      maxRows: 52,
      minCols: 40,
      minRows: 16,
      sampleDivisor: 14,
      scaleMultiplier: 1.72,
      targetFps: 20,
    }
  }

  return {
    charHeight: 18,
    charWidth: 9,
    cubeHalfMax: 18,
    cubeHalfMin: 8,
    dist: 23,
    maxCols: 144,
    maxRows: 56,
    minCols: 40,
    minRows: 16,
    sampleDivisor: 16,
    scaleMultiplier: 1.68,
    targetFps: 24,
  }
}

export function computeAsciiGridSize(
  width: number,
  height: number,
  profile: AsciiCubeProfile,
): AsciiSize {
  const cols = clamp(Math.floor(width / profile.charWidth), profile.minCols, profile.maxCols)
  const rows = clamp(Math.floor(height / profile.charHeight), profile.minRows, profile.maxRows)
  return { cols, rows }
}

export function getAsciiCubeParams(size: AsciiSize, profile: AsciiCubeProfile): AsciiCubeParams {
  const minDim = Math.min(size.cols, size.rows)
  return {
    aspect: 2,
    cubeHalf: clamp(minDim / 4.2, profile.cubeHalfMin, profile.cubeHalfMax),
    dist: profile.dist,
    sampleDivisor: profile.sampleDivisor,
    scale: minDim * profile.scaleMultiplier,
  }
}

export function renderCubeAscii(params: {
  cube: AsciiCubeParams
  rot: Rot
  size: AsciiSize
}): string {
  const { cube, rot, size } = params
  const { cols, rows } = size
  const buf = makeBuffer(size)
  const light = normalize({ x: 0.35, y: -0.25, z: 1 })
  const step = cube.cubeHalf / Math.max(8, cube.sampleDivisor)

  const project = (p: Vec3) => {
    const pr = rotate(p, rot)
    const z = pr.z + cube.dist
    if (z <= 0.01) return null
    const invZ = 1 / z
    const sx = Math.floor(cols / 2 + pr.x * invZ * cube.scale)
    const sy = Math.floor(rows / 2 + (pr.y * invZ * cube.scale) / cube.aspect)
    if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) return null
    return { invZ, sx, sy }
  }

  const put = (sx: number, sy: number, invZ: number, ch: string) => {
    const i = idxOf(sx, sy, cols)
    if (invZ > (buf.zbuf[i] ?? -Infinity)) {
      buf.zbuf[i] = invZ
      buf.chars[i] = ch
    }
  }

  const h = cube.cubeHalf
  const faces: Array<{ id: number; normal: Vec3; p: (u: number, v: number) => Vec3 }> = [
    { id: 0, normal: { x: 1, y: 0, z: 0 }, p: (u, v) => ({ x: h, y: u, z: v }) },
    { id: 1, normal: { x: -1, y: 0, z: 0 }, p: (u, v) => ({ x: -h, y: u, z: v }) },
    { id: 2, normal: { x: 0, y: 1, z: 0 }, p: (u, v) => ({ x: u, y: h, z: v }) },
    { id: 3, normal: { x: 0, y: -1, z: 0 }, p: (u, v) => ({ x: u, y: -h, z: v }) },
    { id: 4, normal: { x: 0, y: 0, z: 1 }, p: (u, v) => ({ x: u, y: v, z: h }) },
    { id: 5, normal: { x: 0, y: 0, z: -1 }, p: (u, v) => ({ x: u, y: v, z: -h }) },
  ]

  const uMin = -h
  const uMax = h

  for (const face of faces) {
    const nRot = normalize(rotate(face.normal, rot))
    if (nRot.z <= 0.02) continue

    for (let u = uMin; u <= uMax; u += step) {
      for (let v = uMin; v <= uMax; v += step) {
        const proj = project(face.p(u, v))
        if (!proj) continue
        const intensity = clamp((dot(nRot, light) + 1) / 2, 0, 1)
        const depthBoost = clamp((proj.invZ - 1 / (cube.dist + h * 2)) * 6, 0, 0.25)
        put(
          proj.sx,
          proj.sy,
          proj.invZ,
          faceShadedChar(clamp(intensity + depthBoost, 0, 1), face.id),
        )
      }
    }
  }

  const vertices: Vec3[] = [
    { x: -h, y: -h, z: -h },
    { x: h, y: -h, z: -h },
    { x: h, y: h, z: -h },
    { x: -h, y: h, z: -h },
    { x: -h, y: -h, z: h },
    { x: h, y: -h, z: h },
    { x: h, y: h, z: h },
    { x: -h, y: h, z: h },
  ]
  const edges: Array<[number, number]> = [
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

  const drawEdge = (a: Vec3, b: Vec3) => {
    const segments = 28
    for (let k = 0; k <= segments; k += 1) {
      const t = k / segments
      const proj = project({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        z: a.z + (b.z - a.z) * t,
      })
      if (!proj) continue
      put(proj.sx, proj.sy, proj.invZ + 1e-6, '@')
    }
  }

  for (const [from, to] of edges) {
    const a = vertices[from]
    const b = vertices[to]
    if (!a || !b) continue
    drawEdge(a, b)
  }

  let out = ''
  for (let y = 0; y < rows; y += 1) {
    const start = y * cols
    out += buf.chars.slice(start, start + cols).join('') + '\n'
  }
  return out
}
