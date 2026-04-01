import type { MatrixQualityTier } from './matrix-cube'

/**
 * Representa un vector 3D básico.
 * Se usa para puntos, normales y resultados de rotación.
 */
export type Vec3 = { x: number; y: number; z: number }

/**
 * Ángulos de rotación del cubo.
 * a = rotación en X
 * b = rotación en Y
 * c = rotación en Z
 */
export type Rot = { a: number; b: number; c: number }

/**
 * Tamaño del “lienzo” ASCII en cantidad de columnas y filas.
 * Ojo: aquí NO se habla de píxeles reales, sino de celdas de texto.
 */
export type AsciiSize = { cols: number; rows: number }

/**
 * Perfil de calidad/configuración del render ASCII.
 *
 * Este objeto agrupa todos los parámetros que cambian según el tier
 * de calidad (low, medium, high). La idea es centralizar:
 * - tamaño del carácter asumido
 * - tamaño mínimo y máximo del cubo
 * - distancia de cámara
 * - resolución mínima/máxima del grid ASCII
 * - densidad de muestreo de las caras
 * - multiplicador de escala
 * - FPS objetivo
 */
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

/**
 * Parámetros ya aterrizados para un render concreto.
 *
 * A diferencia del profile (que es “plantilla”), este tipo representa
 * los valores efectivos con los que se dibuja el cubo en un frame dado.
 */
export type AsciiCubeParams = {
  aspect: number
  cubeHalf: number
  dist: number
  sampleDivisor: number
  scale: number
}

/**
 * Gradiente de luminancia.
 * De izquierda a derecha: caracteres “más vacíos” a “más sólidos”.
 *
 * Se usa para simular sombreado según la intensidad de la luz.
 */
const LUMA = ' .:-=+*#%@'

/**
 * Símbolos especiales por cara.
 *
 * Cuando una cara recibe mucha luz, el código reemplaza el carácter
 * del gradiente por un símbolo distintivo, para que las caras tengan
 * una identidad visual más marcada.
 */
const FACE_SYMBOLS = ['$', '%', '&', '=', '+', '~'] as const

/**
 * Limita un valor a un rango [min, max].
 *
 * Esto se usa mucho para:
 * - evitar índices inválidos
 * - controlar intensidad de luz
 * - restringir tamaños de grid y del cubo
 */
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

/**
 * Rota un vector alrededor del eje X.
 *
 * Fórmula clásica de rotación 3D:
 * y' = y*cos(a) - z*sin(a)
 * z' = y*sin(a) + z*cos(a)
 */
function rotateX(v: Vec3, a: number): Vec3 {
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  return { x: v.x, y: v.y * ca - v.z * sa, z: v.y * sa + v.z * ca }
}

/**
 * Rota un vector alrededor del eje Y.
 *
 * x' = x*cos(b) + z*sin(b)
 * z' = -x*sin(b) + z*cos(b)
 */
function rotateY(v: Vec3, b: number): Vec3 {
  const cb = Math.cos(b)
  const sb = Math.sin(b)
  return { x: v.x * cb + v.z * sb, y: v.y, z: -v.x * sb + v.z * cb }
}

/**
 * Rota un vector alrededor del eje Z.
 *
 * x' = x*cos(c) - y*sin(c)
 * y' = x*sin(c) + y*cos(c)
 */
function rotateZ(v: Vec3, c: number): Vec3 {
  const cc = Math.cos(c)
  const sc = Math.sin(c)
  return { x: v.x * cc - v.y * sc, y: v.x * sc + v.y * cc, z: v.z }
}

/**
 * Aplica las tres rotaciones en orden:
 *   X -> Y -> Z
 *
 * El orden importa muchísimo en 3D.
 * Cambiarlo cambia el resultado visual final.
 */
function rotate(v: Vec3, r: Rot): Vec3 {
  return rotateZ(rotateY(rotateX(v, r.a), r.b), r.c)
}

/**
 * Producto punto entre dos vectores.
 *
 * Aquí se usa sobre todo para iluminación:
 * - si la normal apunta hacia la luz, el resultado sube
 * - si apunta en contra, baja
 */
function dot(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

/**
 * Normaliza un vector para que su longitud sea 1.
 *
 * Esto es importante porque el dot product para iluminación funciona
 * mejor cuando ambos vectores están normalizados.
 *
 * El “|| 1” evita división por cero en caso de longitud 0.
 */
function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1
  return { x: v.x / len, y: v.y / len, z: v.z / len }
}

/**
 * Convierte una intensidad de luz en un carácter ASCII.
 *
 * Lógica:
 * 1. Convierte intensidad [0..1] a índice en LUMA.
 * 2. Hace clamp por seguridad.
 * 3. Si la cara está muy iluminada, usa un símbolo distintivo por cara.
 * 4. Si no, usa el carácter del gradiente.
 *
 * Esto le da más personalidad al cubo, en vez de puro sombreado genérico.
 */
function faceShadedChar(intensity: number, faceIndex: number): string {
  const idx = Math.round(intensity * (LUMA.length - 1))
  const clamped = clamp(idx, 0, LUMA.length - 1)
  if (clamped >= LUMA.length - 2) {
    return FACE_SYMBOLS[clamp(faceIndex, 0, FACE_SYMBOLS.length - 1)] as string
  }
  return LUMA[clamped] ?? ' '
}

/**
 * Crea los buffers base del render.
 *
 * chars: contiene el carácter final que se imprimirá en cada celda.
 * zbuf:  z-buffer sencillo para saber qué punto está “más cerca”
 *        de la cámara en cada posición.
 *
 * Nota:
 * usar -Infinity en zbuf hace que el primer punto siempre gane.
 */
function makeBuffer(size: AsciiSize) {
  const n = size.cols * size.rows
  return {
    chars: new Array<string>(n).fill(' '),
    zbuf: new Array<number>(n).fill(-Infinity),
  }
}

/**
 * Convierte coordenadas 2D (x, y) a índice lineal del buffer.
 *
 * Fórmula típica de matrices almacenadas en 1D:
 * índice = fila * columnas + columna
 */
function idxOf(x: number, y: number, cols: number) {
  return y * cols + x
}

/**
 * Devuelve un perfil según el nivel de calidad.
 *
 * Observación:
 * - low: menos columnas, menos filas, menos FPS, menos muestras
 * - medium: equilibrio
 * - high: más detalle, más FPS, más tamaño de grid
 *
 * Esto está bastante bien porque concentra las decisiones de rendimiento
 * en un solo lugar.
 */
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

/**
 * Calcula cuántas columnas y filas ASCII caben en un área dada.
 *
 * width / charWidth  => cuántas columnas caben
 * height / charHeight => cuántas filas caben
 *
 * Después se hace clamp para no salir de los límites mínimos y máximos
 * definidos por el perfil.
 */
export function computeAsciiGridSize(
  width: number,
  height: number,
  profile: AsciiCubeProfile,
): AsciiSize {
  const cols = clamp(Math.floor(width / profile.charWidth), profile.minCols, profile.maxCols)
  const rows = clamp(Math.floor(height / profile.charHeight), profile.minRows, profile.maxRows)
  return { cols, rows }
}

/**
 * Deriva los parámetros efectivos del cubo a partir del tamaño del grid.
 *
 * minDim:
 *   Usa la dimensión más pequeña para que el cubo quepa tanto vertical
 *   como horizontalmente sin desbordarse demasiado.
 *
 * aspect:
 *   Se fija a 2 para compensar la proporción de los caracteres de texto,
 *   que normalmente son más altos que anchos o viceversa según la fuente.
 *
 * cubeHalf:
 *   “Radio” del cubo desde el centro hasta una cara.
 *
 * scale:
 *   Factor de proyección a pantalla ASCII.
 */
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

/**
 * Renderiza un cubo 3D en texto ASCII.
 *
 * Flujo general:
 * 1. Crear buffers.
 * 2. Definir luz y densidad de muestreo.
 * 3. Proyectar puntos 3D a 2D.
 * 4. Dibujar caras visibles con sombreado.
 * 5. Dibujar aristas por encima.
 * 6. Convertir buffer a string final con saltos de línea.
 */
export function renderCubeAscii(params: {
  cube: AsciiCubeParams
  rot: Rot
  size: AsciiSize
}): string {
  const { cube, rot, size } = params
  const { cols, rows } = size

  // Buffers del frame actual.
  const buf = makeBuffer(size)

  /**
   * Dirección de la luz.
   * Se normaliza porque la iluminación usa dot product.
   *
   * Aquí la luz viene ligeramente desde la derecha, un poco desde arriba
   * y desde “delante” de la cámara.
   */
  const light = normalize({ x: 0.35, y: -0.25, z: -1 })

  /**
   * Tamaño del paso de muestreo sobre las caras.
   *
   * Mientras más pequeño el step:
   * - más puntos por cara
   * - más detalle
   * - más costo computacional
   *
   * El Math.max(8, cube.sampleDivisor) evita divisores demasiado pequeños.
   */
  const step = cube.cubeHalf / Math.max(8, cube.sampleDivisor)

  /**
   * Proyecta un punto 3D al grid ASCII 2D.
   *
   * Pasos:
   * 1. rota el punto
   * 2. lo desplaza alejándolo/acerándolo con cube.dist
   * 3. hace proyección perspectiva usando 1/z
   * 4. lo centra en la pantalla
   * 5. valida que caiga dentro del grid
   *
   * Devuelve:
   * - invZ: profundidad invertida (útil para el z-buffer)
   * - sx/sy: coordenadas proyectadas en pantalla
   */
  const project = (p: Vec3) => {
    const pr = rotate(p, rot)
    const z = pr.z + cube.dist

    // Si el punto queda demasiado cerca o detrás de la cámara, se descarta.
    if (z <= 0.01) return null

    const invZ = 1 / z

    // Proyección con perspectiva.
    const sx = Math.floor(cols / 2 + pr.x * invZ * cube.scale)
    const sy = Math.floor(rows / 2 + (pr.y * invZ * cube.scale) / cube.aspect)

    // Clipping al viewport ASCII.
    if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) return null

    return { invZ, sx, sy }
  }

  /**
   * Escribe un carácter en pantalla si está más cerca que lo ya dibujado.
   *
   * z-buffer clásico:
   * - si el nuevo punto tiene mayor invZ, está más cerca
   * - entonces reemplaza lo anterior
   */
  const put = (sx: number, sy: number, invZ: number, ch: string) => {
    const i = idxOf(sx, sy, cols)
    if (invZ > (buf.zbuf[i] ?? -Infinity)) {
      buf.zbuf[i] = invZ
      buf.chars[i] = ch
    }
  }

  const h = cube.cubeHalf

  /**
   * Definición procedural de las 6 caras del cubo.
   *
   * Cada cara tiene:
   * - id: para escoger símbolo distintivo
   * - normal: vector perpendicular a la cara
   * - p(u, v): función que genera un punto sobre la superficie
   *
   * Esto evita almacenar miles de puntos; se generan sobre la marcha.
   */
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

  /**
   * Render de caras.
   *
   * Por cada cara:
   * 1. se rota la normal
   * 2. se hace un backface culling básico
   * 3. se recorren puntos de la superficie con una malla regular
   * 4. se proyectan
   * 5. se calcula la luz
   * 6. se pinta el carácter correspondiente
   */
  for (const face of faces) {
    const nRot = normalize(rotate(face.normal, rot))

    /**
     * Backface culling:
     * si la normal no apunta hacia la cámara lo suficiente, se omite.
     *
     * Como la cámara “mira” en cierto sentido del eje Z, esta condición
     * descarta caras traseras o casi paralelas.
     */
    if (nRot.z >= -0.02) continue

    for (let u = uMin; u <= uMax; u += step) {
      for (let v = uMin; v <= uMax; v += step) {
        const proj = project(face.p(u, v))
        if (!proj) continue

        /**
         * Intensidad base de luz:
         * dot(normal, light) da un rango aproximado [-1, 1].
         * Luego se mapea a [0, 1].
         */
        const intensity = clamp((dot(nRot, light) + 1) / 2, 0, 1)

        /**
         * depthBoost:
         * pequeño empuje visual para resaltar puntos más cercanos.
         *
         * No es iluminación físicamente correcta, pero da un toque más
         * “vivo” al ASCII. Es una mejora perceptual, no matemática pura.
         */
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

  /**
   * Definición de vértices del cubo.
   *
   * Se usan luego para dibujar las aristas por separado.
   */
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

  /**
   * Lista de aristas como pares de índices a vertices[].
   */
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

  /**
   * Dibuja una arista interpolando puntos entre dos vértices.
   *
   * segments controla la suavidad:
   * - más segmentos => línea más continua
   * - más costo => más proyecciones
   *
   * Se suma 1e-6 al invZ para que la arista gane ligeramente sobre la cara
   * y quede visible por encima del sombreado.
   */
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

  // Dibuja todas las aristas del cubo.
  for (const [from, to] of edges) {
    const a = vertices[from]
    const b = vertices[to]
    if (!a || !b) continue
    drawEdge(a, b)
  }

  /**
   * Convierte el buffer lineal a un string multilinea.
   *
   * Cada fila del grid se une con join('')
   * y luego se agrega un salto de línea.
   */
  let out = ''
  for (let y = 0; y < rows; y += 1) {
    const start = y * cols
    out += buf.chars.slice(start, start + cols).join('') + '\n'
  }
  return out
}
