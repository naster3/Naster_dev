import { motion } from 'framer-motion'
import { BadgeCheck, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'
import { portfolioLinks, useI18n } from '@/shared'
import { homeContentByLocale, motionViewport, sectionReveal, stagger } from '../../model'
import { secondaryBtnClass } from '../styles'

export function AboutSection() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]

  return (
    <motion.section
      id="sobre-mi"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={motionViewport.early}
      className="space-y-8"
    >
      <motion.header variants={sectionReveal} className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full border border-(--border-soft) bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-(--text-soft)">
          <Sparkles size={14} />
          {content.about.eyebrow}
        </p>
        <h2 className="text-4xl text-(--text-main) md:text-5xl">{content.about.title}</h2>
        <p className="max-w-4xl text-(--text-soft)">{content.about.subtitle}</p>
      </motion.header>

      <motion.div variants={sectionReveal} className="grid gap-8 md:grid-cols-12">
        <div className="space-y-3 text-(--text-soft) md:col-span-6">
          {content.about.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="md:col-span-6">
          <div className="flex flex-wrap gap-2">
            {content.about.credentials.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full border border-(--border-soft) bg-white/85 px-4 py-2 text-sm text-(--text-main)"
              >
                <BadgeCheck size={14} className="text-(--brand-ink)" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={sectionReveal} className="grid gap-6 md:grid-cols-12">
        {content.about.blocks.map((block) => (
          <article
            key={block.title}
            className="rounded-2xl border border-(--border-soft) bg-white/80 p-6 md:col-span-6"
          >
            <h3 className="text-lg font-semibold text-(--text-main)">{block.title}</h3>
            <ul className="mt-3 space-y-2 text-(--text-soft)">
              {block.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-1 text-(--brand-ink)" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </motion.div>

      <motion.div variants={sectionReveal} className="flex flex-wrap gap-3">
        <a
          href={portfolioLinks.linkedin}
          target="_blank"
          rel="noreferrer"
          className={secondaryBtnClass}
        >
          {content.about.ctaLinkedIn} <ExternalLink size={16} />
        </a>
      </motion.div>
    </motion.section>
  )
}
