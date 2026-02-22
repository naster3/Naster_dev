import { motion } from 'framer-motion'
import { Clock3 } from 'lucide-react'
import { portfolioLinks, useI18n } from '@/shared'
import { homeContentByLocale, motionViewport, sectionReveal } from '../../model'

export function HomeFooter() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={motionViewport.standard}
      className="mt-24 border-t border-(--border-soft) pt-10"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--text-soft)">
        {content.footer.title}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {content.footer.evidence.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-1 rounded-full border border-(--border-soft) bg-white/90 px-3 py-1 text-xs text-(--text-main)"
          >
            <Clock3 size={12} className="text-(--accent-ink)" />
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-(--text-soft)">
        (c) {currentYear} Naster Dev -{' '}
        <a
          href={portfolioLinks.cv}
          target="_blank"
          rel="noreferrer"
          className="hover:text-(--text-main)"
        >
          {content.footer.links.cv}
        </a>{' '}
        -{' '}
        <a
          href={portfolioLinks.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-(--text-main)"
        >
          {content.footer.links.github}
        </a>{' '}
        -{' '}
        <a
          href={portfolioLinks.docs}
          target="_blank"
          rel="noreferrer"
          className="hover:text-(--text-main)"
        >
          {content.footer.links.docs}
        </a>
      </p>
    </motion.footer>
  )
}
