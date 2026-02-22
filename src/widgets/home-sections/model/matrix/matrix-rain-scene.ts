import { hash01, pointInPolygon, rgba, type Pt, type Rgb } from './matrix-cube'
import type { CubeFaceInfo } from './matrix-cube-scene'

export type MatrixRainState = {
  columns: number
  drops: number[]
  speeds: number[]
}

export function createMatrixRainState(width: number, fontSize: number): MatrixRainState {
  const columns = Math.max(1, Math.floor(width / fontSize))
  const drops = new Array(columns).fill(0).map(() => Math.random() * 60)
  const speeds = new Array(columns).fill(0).map(() => 0.8 + Math.random() * 1.8)
  return { columns, drops, speeds }
}

function drawSoftMaskedFaceRain(params: {
  accentRgb: Rgb
  brandRgb: Rgb
  charset: string
  depthNorm: number
  dpr: number
  faceCtx: CanvasRenderingContext2D
  faceIndex: number
  faceRainColSpacing: number
  faceRainMaskBlurMax: number
  faceRainMaskBlurMin: number
  faceRainRowSpacing: number
  faceRainTailMax: number
  faceRainTailMin: number
  facing: number
  height: number
  light: number
  maskCtx: CanvasRenderingContext2D
  poly: Pt[]
  textMainRgb: Rgb
  t: number
  width: number
  fontSize: number
  ctx: CanvasRenderingContext2D
}) {
  const {
    accentRgb,
    brandRgb,
    charset,
    ctx,
    depthNorm,
    dpr,
    faceCtx,
    faceIndex,
    faceRainColSpacing,
    faceRainMaskBlurMax,
    faceRainMaskBlurMin,
    faceRainRowSpacing,
    faceRainTailMax,
    faceRainTailMin,
    facing,
    fontSize,
    height,
    light,
    maskCtx,
    poly,
    textMainRgb,
    t,
    width,
  } = params

  if (poly.length !== 4) return

  const [p0, p1, p2, p3] = poly
  const bilinear = (u: number, v: number): Pt => {
    const uu = Math.max(0, Math.min(1, u))
    const vv = Math.max(0, Math.min(1, v))
    const oneMinusU = 1 - uu
    const oneMinusV = 1 - vv
    return {
      x:
        oneMinusU * oneMinusV * p0.x +
        uu * oneMinusV * p1.x +
        uu * vv * p2.x +
        oneMinusU * vv * p3.x,
      y:
        oneMinusU * oneMinusV * p0.y +
        uu * oneMinusV * p1.y +
        uu * vv * p2.y +
        oneMinusU * vv * p3.y,
    }
  }

  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const point of poly) {
    if (point.x < minX) minX = point.x
    if (point.x > maxX) maxX = point.x
    if (point.y < minY) minY = point.y
    if (point.y > maxY) maxY = point.y
  }

  const spanW = Math.max(1, maxX - minX)
  const spanH = Math.max(1, maxY - minY)
  if (spanW < fontSize * 2 || spanH < fontSize * 2) return

  faceCtx.clearRect(0, 0, width, height)
  maskCtx.clearRect(0, 0, width, height)

  const faceEnergy = Math.max(0, Math.min(1, 0.28 + facing * 0.72))
  const bright = (0.5 + 0.5 * depthNorm) * (0.62 + 0.38 * light) * (0.62 + faceEnergy * 0.38)
  const baseAlpha = (0.38 + 0.62 * depthNorm) * (0.6 + 0.4 * light) * (0.62 + faceEnergy * 0.38)

  faceCtx.font =
    `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ` +
    "'Liberation Mono', 'Courier New', monospace"
  faceCtx.textBaseline = 'middle'

  const cols = Math.max(2, Math.floor(spanW / (fontSize * faceRainColSpacing)))
  const rows = Math.max(8, Math.floor(spanH / (fontSize * faceRainRowSpacing)))
  const faceSpeed = 0.95 + (faceIndex % 3) * 0.33
  const tailRange = Math.max(0, faceRainTailMax - faceRainTailMin)

  for (let col = 0; col < cols; col += 1) {
    const u = cols === 1 ? 0.5 : col / (cols - 1)
    const colRnd = hash01(col, faceIndex, rows, ((t * 22) | 0) + 91)
    const velocity = faceSpeed * (0.82 + colRnd * 0.58)
    const drift = (t * velocity * rows + col * 0.63 + faceIndex * 1.7) % (rows + 24)
    const tailLen = faceRainTailMin + ((faceIndex * 3 + col) % (tailRange + 1))

    for (let tail = 0; tail < tailLen; tail += 1) {
      const row = drift - tail
      const v = row / rows
      if (v < -0.28 || v > 1.22) continue

      const rnd = hash01(col, tail, faceIndex, (t * 30) | 0)
      const ch = charset[Math.floor(rnd * charset.length)] ?? '0'
      const alpha = Math.max(0, baseAlpha * (1 - tail / tailLen))
      const isHead = tail === 0
      const pos = bilinear(u, v)
      const px = Math.round(pos.x * dpr) / dpr
      const py = Math.round(pos.y * dpr) / dpr
      const headColor = faceIndex % 2 === 0 ? brandRgb : accentRgb

      faceCtx.fillStyle = isHead
        ? rgba(headColor, Math.min(1, 0.9 * bright + 0.1))
        : rgba(textMainRgb, Number(Math.min(1, alpha).toFixed(3)))
      faceCtx.fillText(ch, px, py)
    }
  }

  const feather = Math.max(
    faceRainMaskBlurMin,
    Math.min(faceRainMaskBlurMax, fontSize * (0.11 + (1 - facing) * 0.05)),
  )

  maskCtx.save()
  maskCtx.filter = `blur(${feather}px)`
  maskCtx.fillStyle = 'rgba(255,255,255,1)'
  maskCtx.beginPath()
  maskCtx.moveTo(poly[0]?.x ?? 0, poly[0]?.y ?? 0)
  for (let index = 1; index < poly.length; index += 1) {
    maskCtx.lineTo(poly[index]?.x ?? 0, poly[index]?.y ?? 0)
  }
  maskCtx.closePath()
  maskCtx.fill()
  maskCtx.filter = 'none'
  maskCtx.restore()

  faceCtx.save()
  faceCtx.globalCompositeOperation = 'destination-in'
  faceCtx.drawImage(maskCtx.canvas, 0, 0, width, height)
  faceCtx.restore()

  ctx.drawImage(faceCtx.canvas, 0, 0, width, height)
}

export function drawFaceRain(params: {
  accentRgb: Rgb
  brandRgb: Rgb
  charset: string
  dpr: number
  faceCtx: CanvasRenderingContext2D
  faceInfo: CubeFaceInfo[]
  facePolys: Pt[][]
  faceRainColSpacing: number
  faceRainFrontFacesOnly: boolean
  faceRainMaskBlurMax: number
  faceRainMaskBlurMin: number
  faceRainRowSpacing: number
  faceRainTailMax: number
  faceRainTailMin: number
  fontSize: number
  frontFaceIndices: Set<number>
  height: number
  maskCtx: CanvasRenderingContext2D
  textMainRgb: Rgb
  time: number
  width: number
  zNorm: (z: number) => number
  ctx: CanvasRenderingContext2D
}) {
  const {
    accentRgb,
    brandRgb,
    charset,
    ctx,
    dpr,
    faceCtx,
    faceInfo,
    facePolys,
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
  } = params

  for (const face of faceInfo) {
    if (face.facing < 0.14) continue
    if (faceRainFrontFacesOnly && !frontFaceIndices.has(face.index)) continue
    const poly = facePolys[face.index]
    if (!poly) continue

    drawSoftMaskedFaceRain({
      accentRgb,
      brandRgb,
      charset,
      ctx,
      depthNorm: zNorm(face.z),
      dpr,
      faceCtx,
      faceIndex: face.index,
      faceRainColSpacing,
      faceRainMaskBlurMax,
      faceRainMaskBlurMin,
      faceRainRowSpacing,
      faceRainTailMax,
      faceRainTailMin,
      facing: face.facing,
      fontSize,
      height,
      light: face.light,
      maskCtx,
      poly,
      textMainRgb,
      t: time,
      width,
    })
  }
}

export function drawMatrixRainColumns(params: {
  accentRgb: Rgb
  brandRgb: Rgb
  charset: string
  columns: number
  ctx: CanvasRenderingContext2D
  deltaRatio: number
  drops: number[]
  facePolys: Pt[][]
  fontSize: number
  frontFaceIndices: Set<number>
  height: number
  showFaceRain: boolean
  speeds: number[]
  textMainRgb: Rgb
  time: number
}) {
  const {
    accentRgb,
    brandRgb,
    charset,
    columns,
    ctx,
    deltaRatio,
    drops,
    facePolys,
    fontSize,
    frontFaceIndices,
    height,
    showFaceRain,
    speeds,
    textMainRgb,
    time,
  } = params

  ctx.font =
    `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ` +
    "'Liberation Mono', 'Courier New', monospace"
  ctx.textBaseline = 'top'

  for (let index = 0; index < columns; index += 1) {
    const x = index * fontSize
    const y = drops[index] * fontSize
    const ch = charset[Math.floor(Math.random() * charset.length)] ?? '0'
    const testX = x + fontSize * 0.35
    const testY = y + fontSize * 0.35

    let insideFrontFace = false
    if (showFaceRain) {
      for (const faceIndex of frontFaceIndices) {
        const polygon = facePolys[faceIndex]
        if (!polygon) continue
        if (pointInPolygon(testX, testY, polygon)) {
          insideFrontFace = true
          break
        }
      }
    }

    ctx.fillStyle = insideFrontFace ? rgba(brandRgb, 0.92) : rgba(textMainRgb, 0.5)

    if (((time * 60 + index) | 0) % 13 === 0) {
      ctx.fillStyle = insideFrontFace
        ? rgba(accentRgb, 0.98)
        : showFaceRain
          ? rgba(accentRgb, 0.84)
          : rgba(brandRgb, 0.68)
    }

    ctx.fillText(ch, x, y)

    drops[index] += (speeds[index] ?? 1) * deltaRatio
    if (y > height && Math.random() > 0.975) {
      drops[index] = -Math.random() * 30
      speeds[index] = 0.8 + Math.random() * 1.8
    }
  }
}
