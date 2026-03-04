import { motion } from 'framer-motion'
import { BookOpenText, CalendarClock, Clock3, FileText, Github, Mail, Rocket } from 'lucide-react'
import { portfolioLinks, useI18n } from '@/shared'
import { homeContentByLocale, motionViewport, sectionReveal } from '../../model'

export function HomeFooter() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]
  const currentYear = new Date().getFullYear()
  const actionsLabel = locale === 'es' ? 'Acciones rapidas' : 'Quick actions'
  const portfolioTitle = 'Naster Dev'
  const summaryLabel =
    locale === 'es'
      ? 'Enlaces directos y disponibilidad clara para colaborar.'
      : 'Direct links and clear availability for collaboration.'
  const timezoneLabel = locale === 'es' ? 'Zona horaria base' : 'Base timezone'
  const actionClass =
    'group inline-flex items-center justify-between gap-2 rounded-xl border border-(--border-soft) bg-(--surface-2) px-3 py-2 text-sm font-semibold text-(--text-main) transition-colors hover:border-(--brand-ink) hover:bg-(--secondary-hover-bg) hover:text-(--brand-ink)'
  const footerActions = [
    {
      href: portfolioLinks.cv,
      icon: FileText,
      key: 'cv',
      label: content.footer.links.cv,
      external: true,
    },
    {
      href: portfolioLinks.github,
      icon: Github,
      key: 'github',
      label: content.footer.links.github,
      external: true,
    },
    {
      href: portfolioLinks.docs,
      icon: BookOpenText,
      key: 'docs',
      label: content.footer.links.docs,
      external: true,
    },
    {
      href: portfolioLinks.calendly,
      icon: CalendarClock,
      key: 'calendly',
      label: 'Calendly',
      external: true,
    },
    {
      href: portfolioLinks.email,
      icon: Mail,
      key: 'email',
      label: locale === 'es' ? 'Email' : 'Email',
      external: false,
    },
  ] as const
  const evidenceChips = content.footer.evidence.slice(0, 3)

  return (
    <motion.footer
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={motionViewport.standard}
      className="mt-24"
    >
      <div className="relative overflow-hidden rounded-[1.8rem] border border-(--border-soft) bg-(--surface-1) p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -left-16 top-[-30%] h-40 w-40 rounded-full bg-[radial-gradient(circle,var(--brand-mist),transparent_68%)]" />
          <div className="absolute -right-18 bottom-[-35%] h-48 w-48 rounded-full bg-[radial-gradient(circle,var(--accent-mist),transparent_72%)]" />
        </div>

        <div className="relative z-10 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-(--border-soft) bg-(--surface-2) px-3 py-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-soft) bg-(--surface-solid) text-(--brand-ink)">
                <Rocket size={16} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-(--text-main)">{portfolioTitle}</span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-(--text-soft)">
              {summaryLabel}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {evidenceChips.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-(--border-soft) bg-(--surface-2) px-3 py-1 text-xs text-(--text-soft)"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="md:col-span-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-(--border-soft) bg-(--surface-2) px-3 py-1 text-xs font-medium text-(--text-soft)">
              <Clock3 size={12} />
              {actionsLabel}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {footerActions.map((action) => {
                const Icon = action.icon
                return (
                  <a
                    key={action.key}
                    href={action.href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noreferrer' : undefined}
                    className={actionClass}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon size={14} />
                      {action.label}
                    </span>
                  </a>
                )
              })}
            </div>
            <div className="mt-3 rounded-xl border border-(--border-soft) bg-(--surface-2) px-3 py-2 text-xs text-(--text-soft)">
              <span className="font-medium text-(--text-main)">{timezoneLabel}:</span> GMT-4
              <span className="mx-2 text-(--border-soft)">|</span>
              {content.hero.availability}
            </div>
          </aside>
        </div>

        <div className="relative z-10 mt-8 border-t border-(--border-soft) pt-4 text-xs text-(--text-soft)">
          <p>(c) {currentYear} Naster Dev</p>
        </div>
      </div>
    </motion.footer>
  )
}
