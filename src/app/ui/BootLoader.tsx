import { motion } from 'framer-motion'

type BootLoaderProps = {
  progress: number
  transitionProgress: number
}

const depthLayers = [1, 2, 3, 4, 5]

export function BootLoader({ progress, transitionProgress }: BootLoaderProps) {
  const countText = `${Math.round(progress)}%`
  const eased = transitionProgress * transitionProgress * (3 - 2 * transitionProgress)

  return (
    <motion.div
      role="status"
      aria-label="Loading"
      aria-live="polite"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-120 grid place-items-center overflow-hidden bg-[color:var(--bg-main)]"
    >
      <div className="grid h-full w-full place-items-center [perspective:1300px]">
        <motion.div
          initial={{ opacity: 0, scale: 1.38, y: 26, z: 320, filter: 'blur(12px)' }}
          animate={{
            opacity: 1 - eased,
            scale: 1 - 0.95 * eased,
            x: -320 * eased,
            y: -80 * eased,
            z: -980 * eased,
            rotateX: 28 * eased,
            rotateY: -10 * eased,
            filter: `blur(${4 * eased}px)`,
          }}
          transition={{ duration: 0.08, ease: 'linear' }}
          className="relative [transform-style:preserve-3d]"
        >
          {depthLayers.map((layer) => (
            <p
              key={layer}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-semibold tabular-nums text-(--text-soft) md:text-6xl"
              style={{
                opacity: (0.16 - layer * 0.024) * (1 - eased),
                transform: `translate(-50%, -50%) translateZ(${-layer * 180}px) scale(${1 - layer * 0.1})`,
                filter: `blur(${layer * 0.26}px)`,
              }}
            >
              {countText}
            </p>
          ))}

          <motion.p
            animate={
              transitionProgress < 0.01
                ? { scale: [1, 1.06, 1], y: [0, -6, 0] }
                : { scale: 1, y: 0 }
            }
            transition={
              transitionProgress < 0.01
                ? { duration: 1.15, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                : { duration: 0.1, ease: 'linear' }
            }
            className="relative text-5xl font-semibold tabular-nums text-(--text-main) will-change-transform md:text-6xl"
          >
            {countText}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}
