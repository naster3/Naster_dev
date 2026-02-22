import {
  cross,
  dot,
  matrixCubeEdges,
  matrixCubeFaces,
  matrixCubeVertices,
  norm,
  project,
  rgba,
  rotX,
  rotY,
  rotZ,
  sub,
  type P2,
  type Pt,
  type Rgb,
  type V3,
} from './matrix-cube'

const camera: V3 = [0, 0, -520]
const lightDir = norm([0.35, -0.55, -1])

export type CubeState = {
  facePolys: Pt[][]
  projected: P2[]
  rotated: V3[]
}

export type CubeFaceInfo = {
  facing: number
  index: number
  light: number
  z: number
}

export type CubeStateGetter = (offset?: number) => CubeState

export function createCubeVertices(cubeSize: number): V3[] {
  return matrixCubeVertices.map(([x, y, z]) => [x * cubeSize, y * cubeSize, z * cubeSize])
}

export function getCubeState(
  cubeVertices: V3[],
  width: number,
  height: number,
  time: number,
  offset = 0,
): CubeState {
  const phase = time - offset
  const centerX = width / 2
  const centerY = height / 2

  const rotated = cubeVertices.map((vertex) => {
    let point = vertex as V3
    point = rotX(point, phase * 1.1)
    point = rotY(point, phase * 1.35)
    point = rotZ(point, phase * 0.5)
    return point
  })

  const projected = rotated.map((point) => project(point, centerX, centerY))
  const facePolys = matrixCubeFaces.map((face) =>
    face.map((index) => ({ x: projected[index]?.x ?? centerX, y: projected[index]?.y ?? centerY })),
  )

  return { facePolys, projected, rotated }
}

export function buildCubeFaceInfo(rotated: V3[]): CubeFaceInfo[] {
  return matrixCubeFaces.map((face, index) => {
    const a = rotated[face[0]] as V3
    const b = rotated[face[1]] as V3
    const c = rotated[face[2]] as V3

    const ab = sub(b, a)
    const ac = sub(c, a)
    let normal = cross(ab, ac)

    const center: V3 = [
      ((rotated[face[0]]?.[0] ?? 0) +
        (rotated[face[1]]?.[0] ?? 0) +
        (rotated[face[2]]?.[0] ?? 0) +
        (rotated[face[3]]?.[0] ?? 0)) /
        4,
      ((rotated[face[0]]?.[1] ?? 0) +
        (rotated[face[1]]?.[1] ?? 0) +
        (rotated[face[2]]?.[1] ?? 0) +
        (rotated[face[3]]?.[1] ?? 0)) /
        4,
      ((rotated[face[0]]?.[2] ?? 0) +
        (rotated[face[1]]?.[2] ?? 0) +
        (rotated[face[2]]?.[2] ?? 0) +
        (rotated[face[3]]?.[2] ?? 0)) /
        4,
    ]

    const toCam = sub(camera, center)
    if (dot(normal, toCam) < 0) {
      normal = [-normal[0], -normal[1], -normal[2]]
    }

    const normalUnit = norm(normal)
    const facing = dot(normalUnit, norm(toCam))
    const z = center[2]
    const light = Math.max(0, dot(normalUnit, norm([-lightDir[0], -lightDir[1], -lightDir[2]])))

    return { facing, index, light, z }
  })
}

export function getCubeDepthNormalizer(faceInfo: CubeFaceInfo[]): (z: number) => number {
  const zValues = faceInfo.map((face) => face.z)
  const zMin = Math.min(...zValues)
  const zMax = Math.max(...zValues)
  return (z: number) => (zMax === zMin ? 0.5 : (z - zMin) / (zMax - zMin))
}

export function sortCubeFacesByDepth(faceInfo: CubeFaceInfo[]) {
  faceInfo.sort((left, right) => left.z - right.z)
}

export function getFrontFaceIndices(faceInfo: CubeFaceInfo[]): Set<number> {
  return new Set(faceInfo.slice(0, 2).map((face) => face.index))
}

export function drawFrontFaceOutlines(params: {
  brandRgb: Rgb
  ctx: CanvasRenderingContext2D
  facePolys: Pt[][]
  frontFaceIndices: Set<number>
}) {
  const { brandRgb, ctx, facePolys, frontFaceIndices } = params

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.shadowBlur = 14
  ctx.shadowColor = rgba(brandRgb, 0.48)
  ctx.lineWidth = 1.4
  ctx.strokeStyle = rgba(brandRgb, 0.42)

  for (const faceIndex of frontFaceIndices) {
    const poly = facePolys[faceIndex]
    if (!poly || poly.length === 0) continue
    ctx.beginPath()
    ctx.moveTo(poly[0]?.x ?? 0, poly[0]?.y ?? 0)
    for (let index = 1; index < poly.length; index += 1) {
      ctx.lineTo(poly[index]?.x ?? 0, poly[index]?.y ?? 0)
    }
    ctx.closePath()
    ctx.stroke()
  }

  ctx.restore()
}

export function drawCubeWireframe(params: {
  brandRgb: Rgb
  ctx: CanvasRenderingContext2D
  getCubeStateAt: CubeStateGetter
  projected: P2[]
}) {
  const { brandRgb, ctx, getCubeStateAt, projected } = params

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const trailSteps = 14

  for (let step = trailSteps; step >= 1; step -= 1) {
    const fade = step / trailSteps
    const trail = getCubeStateAt(step * 0.028)
    ctx.shadowBlur = 10 + fade * 8
    ctx.shadowColor = rgba(brandRgb, Number((0.12 + fade * 0.14).toFixed(3)))
    ctx.lineWidth = 0.9 + fade * 0.8
    ctx.strokeStyle = rgba(brandRgb, Number((0.04 + fade * 0.09).toFixed(3)))
    ctx.beginPath()
    matrixCubeEdges.forEach(([from, to]) => {
      const fromPoint = trail.projected[from]
      const toPoint = trail.projected[to]
      if (!fromPoint || !toPoint) return
      ctx.moveTo(fromPoint.x, fromPoint.y)
      ctx.lineTo(toPoint.x, toPoint.y)
    })
    ctx.stroke()
  }

  ctx.shadowBlur = 18
  ctx.shadowColor = rgba(brandRgb, 0.7)
  ctx.lineWidth = 2
  ctx.strokeStyle = rgba(brandRgb, 0.9)
  ctx.beginPath()
  matrixCubeEdges.forEach(([from, to]) => {
    const fromPoint = projected[from]
    const toPoint = projected[to]
    if (!fromPoint || !toPoint) return
    ctx.moveTo(fromPoint.x, fromPoint.y)
    ctx.lineTo(toPoint.x, toPoint.y)
  })
  ctx.stroke()
  ctx.restore()
}
