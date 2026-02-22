import { motion } from 'framer-motion'
import { BadgeCheck, CalendarClock, Clock3, Wrench } from 'lucide-react'
import { useI18n } from '@/shared'
import { cn } from '@/shared/lib'
import {
  homeContentByLocale,
  motionViewport,
  sectionReveal,
  skillsByLocale,
  stagger,
} from '../../model'

const workIconMap = {
  deliveries: CalendarClock,
  focus: BadgeCheck,
  schedule: Clock3,
}

const cardGridClassByKey = {
  backend: 'md:col-span-6',
  data: 'md:col-span-6',
  front: 'md:col-span-6 lg:col-span-4',
  infra: 'md:col-span-6 lg:col-span-4',
} as const

const valueCardReveal = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function QuickEvidenceSection() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]
  const skills = skillsByLocale[locale]
  const valueLabels =
    locale === 'es'
      ? { practice: 'Aplicación', signal: 'Señal observable' }
      : { practice: 'How this looks', signal: 'Observable signal' }

  return (
    <motion.section
      id="habilidades"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={motionViewport.early}
      className="space-y-6"
    >
      <header className="space-y-2">
        <h2 className="text-4xl text-(--text-main) md:text-5xl">
          {content.quickEvidenceSection.title}
        </h2>
        <p className="max-w-3xl text-(--text-soft)">{content.quickEvidenceSection.subtitle}</p>
      </header>

      <motion.div
        variants={stagger}
        className="grid gap-4 md:grid-cols-12"
        initial="hidden"
        whileInView="show"
        viewport={motionViewport.standard}
      >
        {skills.cards.map((card) => {
          const Icon = card.icon
          return (
            <motion.article
              key={card.key}
              variants={sectionReveal}
              className={cn(
                'relative overflow-hidden rounded-3xl border border-(--border-soft) bg-white/88 p-6',
                cardGridClassByKey[card.key],
              )}
            >
              <div
                className={cn(
                  'absolute inset-x-0 top-0 h-1',
                  card.accent === 'brand' ? 'bg-(--brand-mist)' : 'bg-(--accent-mist)',
                )}
              />
              <div className="space-y-4">
                <span
                  className={cn(
                    'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-(--border-soft)',
                    card.accent === 'brand' ? 'bg-(--brand-mist)' : 'bg-(--accent-mist)',
                  )}
                >
                  <Icon
                    size={20}
                    className={
                      card.accent === 'brand' ? 'text-(--brand-ink)' : 'text-(--accent-ink)'
                    }
                  />
                </span>
                <div className="space-y-1">
                  <h3 className="text-[1.2rem] font-semibold text-(--text-main)">{card.title}</h3>
                  <p className="text-sm font-medium text-(--text-main)">{card.stackLine}</p>
                </div>
                <ul className="space-y-1.5 text-sm text-(--text-soft)">
                  {card.bullets.map((bullet) => (
                    <li key={`${card.key}-${bullet}`} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-(--brand-ink)" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          )
        })}

        <motion.article
          variants={sectionReveal}
          className="rounded-3xl border border-(--border-soft) bg-white/84 p-6 md:col-span-12 lg:col-span-4"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--border-soft) bg-(--brand-mist)">
              <Wrench size={18} className="text-(--brand-ink)" />
            </span>
            <h3 className="text-[1.05rem] font-semibold text-(--text-main)">
              {skills.toolbox.title}
            </h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.toolbox.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-(--border-soft) bg-white px-3 py-1 text-xs font-medium text-(--text-main)"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.article>
      </motion.div>

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={motionViewport.standard}
        className="space-y-4 rounded-3xl border border-(--border-soft) bg-[linear-gradient(145deg,#ffffff_30%,#f7fbff_100%)] p-5"
      >
        <header>
          <h3 className="text-lg font-semibold text-(--text-main)">{skills.work.title}</h3>
          <p className="text-sm text-(--text-soft)">{skills.work.subtitle}</p>
        </header>
        <motion.div variants={stagger} className="grid gap-3 md:grid-cols-3">
          {content.heroWorkSummary.map((item) => {
            const Icon = workIconMap[item.key]

            return (
              <motion.article
                key={item.title}
                variants={sectionReveal}
                className="rounded-2xl border border-(--border-soft) bg-white/88 p-4"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-(--brand-ink)" />
                  <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-(--text-main)">
                    {item.title}
                  </h4>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-(--text-soft)">
                  {item.description}
                </p>
              </motion.article>
            )
          })}
        </motion.div>
      </motion.div>

      <motion.div
        id="valores"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={motionViewport.standard}
        className="space-y-4"
      >
        <header className="space-y-1">
          <h3 className="text-2xl font-semibold text-(--text-main) md:text-3xl">
            {content.values.title}
          </h3>
          <p className="max-w-3xl text-sm text-(--text-soft)">{content.values.subtitle}</p>
        </header>

        <motion.div variants={stagger} className="grid gap-4 md:grid-cols-3">
          {content.values.cards.map((value, index) => (
            <motion.article
              key={value.key}
              variants={valueCardReveal}
              className="space-y-4 rounded-2xl border border-(--border-soft) bg-white/90 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-(--brand-mist) px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-(--brand-ink)">
                  V0{index + 1}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.08em] text-(--text-soft)">
                  {content.values.title}
                </span>
              </div>

              <h4 className="text-xl leading-tight text-balance text-(--text-main) md:text-2xl">
                {value.principle}
              </h4>

              <div className="space-y-2 text-sm text-(--text-soft)">
                <p>
                  <span className="font-semibold text-(--text-main)">{valueLabels.practice}: </span>
                  {value.practice}
                </p>
                <p>
                  <span className="font-semibold text-(--text-main)">{valueLabels.signal}: </span>
                  {value.signal}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
