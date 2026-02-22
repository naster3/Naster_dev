import type { Variants } from 'framer-motion'

export const motionTokens = {
  easeOut: [0.22, 1, 0.36, 1] as const,
  section: {
    duration: 0.34,
    hiddenScale: 0.992,
    hiddenY: 16,
  },
  stagger: {
    delayChildren: 0.03,
    staggerChildren: 0.045,
  },
} as const

export const motionViewport = {
  early: { once: true, amount: 0.15 },
  standard: { once: true, amount: 0.2 },
  deep: { once: true, amount: 0.25 },
  list: { once: true, amount: 0.08 },
} as const

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: motionTokens.section.hiddenY, scale: motionTokens.section.hiddenScale },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: motionTokens.section.duration, ease: motionTokens.easeOut },
  },
}

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: motionTokens.stagger.delayChildren,
      staggerChildren: motionTokens.stagger.staggerChildren,
    },
  },
}
