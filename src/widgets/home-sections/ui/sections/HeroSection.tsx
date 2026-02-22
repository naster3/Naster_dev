import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { portfolioLinks, useI18n } from '@/shared'
import { homeContentByLocale, motionViewport, sectionReveal, stagger } from '../../model'
import { primaryBtnClass } from '../styles'

const titleStagger = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.08, staggerChildren: 0.055 },
  },
}

const titleWord = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const subtitleFadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delay: 0.2, duration: 0.32, ease: 'easeOut' as const },
  },
}

export function HeroSection() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]
  const titleWords = content.hero.title.split(' ')
  const [typedName, setTypedName] = useState('')

  useEffect(() => {
    const fullName = content.hero.typewriterName.trim()
    const resetFrame = window.requestAnimationFrame(() => {
      setTypedName('')
    })

    if (!fullName) {
      return () => {
        window.cancelAnimationFrame(resetFrame)
      }
    }

    let phase: 'deleting' | 'holding' | 'typing' = 'typing'
    let currentIndex = 0
    let timeoutId: number | undefined
    let isCancelled = false

    const START_DELAY_MS = 120
    const TYPING_DELAY_MS = 52
    const HOLD_DELAY_MS = 760
    const DELETING_DELAY_MS = 30
    const RESTART_DELAY_MS = 170

    const tick = () => {
      if (isCancelled) return

      if (phase === 'typing') {
        currentIndex = Math.min(fullName.length, currentIndex + 1)
        setTypedName(fullName.slice(0, currentIndex))

        if (currentIndex === fullName.length) {
          phase = 'holding'
          timeoutId = window.setTimeout(tick, HOLD_DELAY_MS)
          return
        }

        timeoutId = window.setTimeout(tick, TYPING_DELAY_MS)
        return
      }

      if (phase === 'holding') {
        phase = 'deleting'
      }

      currentIndex = Math.max(0, currentIndex - 1)
      setTypedName(fullName.slice(0, currentIndex))

      if (currentIndex === 0) {
        phase = 'typing'
        timeoutId = window.setTimeout(tick, RESTART_DELAY_MS)
        return
      }

      timeoutId = window.setTimeout(tick, DELETING_DELAY_MS)
    }

    timeoutId = window.setTimeout(tick, START_DELAY_MS)

    return () => {
      isCancelled = true
      window.cancelAnimationFrame(resetFrame)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [content.hero.typewriterName])

  return (
    <motion.section
      id="home"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={motionViewport.standard}
      className="space-y-10"
    >
      <div className="grid items-center gap-12 md:min-h-[62vh] md:grid-cols-12">
        <motion.div variants={sectionReveal} className="md:col-span-7">
          <motion.h1
            variants={titleStagger}
            aria-label={content.hero.title}
            className="mt-5 max-w-4xl text-[2.4rem] leading-[0.98] text-(--text-main) md:text-[4.35rem]"
          >
            {titleWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                variants={titleWord}
                whileHover={{ y: -1, scale: 1.02 }}
                className="inline-block will-change-transform"
              >
                {word}
                {index < titleWords.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            variants={subtitleFadeIn}
            className="mt-4 max-w-2xl text-lg leading-relaxed text-(--text-soft)"
          >
            {content.hero.subtitle}
          </motion.p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={portfolioLinks.cv}
              target="_blank"
              rel="noreferrer"
              className={primaryBtnClass}
            >
              {content.hero.ctaCv} <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.div>

        <motion.div variants={sectionReveal} className="space-y-5 md:col-span-5">
          <div className="relative mx-auto flex aspect-square w-full max-w-90 items-center justify-center overflow-hidden rounded-[2.2rem] border border-(--border-soft) bg-[linear-gradient(155deg,#ffffff_10%,#f6fbff_48%,#f3f8fc_100%)]">
            <img
              src="/image.png"
              alt={content.hero.avatarLabel}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgb(255_255_255_/_0.28),transparent_45%)]" />
          </div>
          <div className="rounded-2xl border border-(--border-soft) bg-white/80 p-4">
            <p className="text-sm font-semibold text-(--text-main)">
              {typedName}
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                className="ml-1 inline-block text-(--brand-ink)"
              >
                |
              </motion.span>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
