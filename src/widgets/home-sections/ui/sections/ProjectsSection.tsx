import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { portfolioLinks, useI18n } from '@/shared'
import { cn } from '@/shared/lib'
import { homeContentByLocale, motionViewport, sectionReveal, stagger } from '../../model'
import { primaryBtnClass, secondaryBtnClass } from '../styles'

type ProjectFilter = 'all' | 'backend' | 'frontend'

const backendSignals = [
  'backend',
  'api',
  'data',
  'sql',
  'python',
  'flask',
  'fastapi',
  'sqlalchemy',
  'postgres',
  'jwt',
  'etl',
  'dw',
]

const frontendSignals = [
  'frontend',
  'react',
  'tailwind',
  'typescript',
  'chrome extension',
  'ui',
  'vite',
  'css',
  'web',
]

const responsiveCoverImages: Record<
  string,
  {
    height: number
    sizes: string
    srcSet: string
    width: number
  }
> = {
  '/FocusTube_Blocker_portfolio_cover_iconsDecor.png': {
    height: 900,
    sizes: '(min-width: 768px) 493px, 92vw',
    srcSet:
      '/FocusTube_Blocker_portfolio_cover_iconsDecor-640.webp 640w, /FocusTube_Blocker_portfolio_cover_iconsDecor-960.webp 960w',
    width: 1600,
  },
}

function normalizeFilterText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function resolveProjectTrack(project: {
  stack: string[]
  tag: string
}): Exclude<ProjectFilter, 'all'> {
  const tag = normalizeFilterText(project.tag)
  const stackText = normalizeFilterText(project.stack.join(' '))
  const sourceText = `${tag} ${stackText}`

  const frontendTagSignals = ['frontend', 'productividad', 'productivity', 'ui', 'extension']
  const backendTagSignals = ['backend', 'data', 'api']

  if (frontendTagSignals.some((signal) => tag.includes(signal))) return 'frontend'
  if (backendTagSignals.some((signal) => tag.includes(signal))) return 'backend'

  const backendScore = backendSignals.reduce(
    (score, signal) => score + (sourceText.includes(signal) ? 1 : 0),
    0,
  )
  const frontendScore = frontendSignals.reduce(
    (score, signal) => score + (sourceText.includes(signal) ? 1 : 0),
    0,
  )

  if (backendScore === frontendScore) {
    const hasFrontendCore = ['react', 'typescript', 'tailwind', 'ui'].some((signal) =>
      stackText.includes(signal),
    )
    return hasFrontendCore ? 'frontend' : 'backend'
  }

  return backendScore > frontendScore ? 'backend' : 'frontend'
}

export function ProjectsSection() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all')
  const filterOptions =
    locale === 'es'
      ? [
          { key: 'all' as const, label: 'Todos' },
          { key: 'backend' as const, label: 'Backend' },
          { key: 'frontend' as const, label: 'Frontend' },
        ]
      : [
          { key: 'all' as const, label: 'All' },
          { key: 'backend' as const, label: 'Backend' },
          { key: 'frontend' as const, label: 'Frontend' },
        ]
  const emptyFilterLabel =
    locale === 'es'
      ? 'No hay proyectos en esta categoría todavía.'
      : 'No projects in this category yet.'

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return content.projects
    return content.projects.filter((project) => resolveProjectTrack(project) === activeFilter)
  }, [activeFilter, content.projects])

  return (
    <section id="proyectos" className="space-y-10">
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={motionViewport.standard}
        className="grid gap-4 md:grid-cols-12"
      >
        <div className="md:col-span-8">
          <h2 className="text-4xl text-(--text-main) md:text-5xl">
            {content.projectsSection.title}
          </h2>
          <p className="mt-3 max-w-2xl text-(--text-soft)">{content.projectsSection.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = option.key === activeFilter
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(option.key)}
                  className={cn(
                    secondaryBtnClass,
                    'px-4 py-2 text-xs',
                    isActive ? 'border-(--brand-ink) bg-(--brand-mist) text-(--brand-ink)' : '',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:col-span-4 md:justify-end">
          <a
            href={portfolioLinks.github}
            target="_blank"
            rel="noreferrer"
            className={secondaryBtnClass}
          >
            {content.projectsSection.ctaRepos} <Github size={16} />
          </a>
          <a
            href={portfolioLinks.docs}
            target="_blank"
            rel="noreferrer"
            className={secondaryBtnClass}
          >
            {content.projectsSection.ctaDocs} <ExternalLink size={16} />
          </a>
        </div>
      </motion.div>

      <motion.div
        key={`${locale}-${activeFilter}`}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {filteredProjects.map((project) => {
          const demoUrl = project.links?.demo ?? portfolioLinks.github
          const repoUrl = project.links?.repo ?? portfolioLinks.github
          const docsUrl = project.links?.docs ?? portfolioLinks.docs
          const demoLabel = project.demoLabel ?? content.projectsSection.linkLabels.demo
          const showRepoButton = repoUrl !== demoUrl || !project.demoLabel
          const responsiveCover = project.coverImage
            ? responsiveCoverImages[project.coverImage]
            : undefined

          return (
            <motion.article
              key={project.title}
              variants={sectionReveal}
              className="rounded-[1.45rem] border border-(--border-soft) bg-(--surface-1) p-6 shadow-[0_10px_36px_-26px_rgb(25_36_47/0.8)]"
            >
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold text-(--text-main)">{project.title}</h3>
                <span className="rounded-full bg-(--brand-mist) px-3 py-1 text-xs font-semibold text-(--text-main)">
                  {project.tag}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-12">
                <div className="space-y-4 md:col-span-5">
                  <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-(--border-soft) bg-[linear-gradient(130deg,var(--surface-solid)_15%,var(--surface-1)_60%,var(--surface-2)_100%)]">
                    {project.coverImage ? (
                      <>
                        {responsiveCover ? (
                          <picture className="h-full w-full">
                            <source
                              type="image/webp"
                              srcSet={responsiveCover.srcSet}
                              sizes={responsiveCover.sizes}
                            />
                            <img
                              src={project.coverImage}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              width={responsiveCover.width}
                              height={responsiveCover.height}
                              sizes={responsiveCover.sizes}
                              className="h-full w-full object-cover"
                            />
                          </picture>
                        ) : (
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgb(25_36_47/0.22)_100%)]" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--brand-mist),transparent_42%)]" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(secondaryBtnClass, 'px-4 py-2 text-xs')}
                    >
                      {demoLabel}
                    </a>
                    {showRepoButton ? (
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(secondaryBtnClass, 'px-4 py-2 text-xs')}
                      >
                        {content.projectsSection.linkLabels.repo}
                      </a>
                    ) : null}
                    <a
                      href={docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(secondaryBtnClass, 'px-4 py-2 text-xs')}
                    >
                      {content.projectsSection.linkLabels.docs}
                    </a>
                  </div>
                </div>

                <div className="space-y-3 text-(--text-soft) md:col-span-7">
                  <p>
                    <strong className="text-(--text-main)">
                      {content.projectsSection.fieldLabels.context}
                    </strong>{' '}
                    {project.problem}
                  </p>
                  <p>
                    <strong className="text-(--text-main)">
                      {content.projectsSection.fieldLabels.role}
                    </strong>{' '}
                    {project.role}
                  </p>
                  <p>
                    <strong className="text-(--text-main)">
                      {content.projectsSection.fieldLabels.solution}
                    </strong>{' '}
                    {project.solution}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.stack.map((tech) => (
                      <span
                        key={`${project.title}-${tech}`}
                        className="rounded-full border border-(--border-soft) px-3 py-1 text-xs text-(--text-main)"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p>
                    <strong className="text-(--text-main)">
                      {content.projectsSection.fieldLabels.result}
                    </strong>{' '}
                    {project.result}
                  </p>
                  <p>
                    <strong className="text-(--text-main)">
                      {content.projectsSection.fieldLabels.metric}
                    </strong>{' '}
                    {project.metric}
                  </p>
                </div>
              </div>
            </motion.article>
          )
        })}

        {filteredProjects.length === 0 ? (
          <motion.p
            variants={sectionReveal}
            className="rounded-2xl border border-(--border-soft) bg-(--surface-1) p-5 text-center text-sm text-(--text-soft)"
          >
            {emptyFilterLabel}
          </motion.p>
        ) : null}
      </motion.div>

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={motionViewport.deep}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <a href={portfolioLinks.cv} target="_blank" rel="noreferrer" className={primaryBtnClass}>
          {content.projectsSection.ctaCv} <ArrowUpRight size={16} />
        </a>
        <Link to="/contacto" className={secondaryBtnClass}>
          {content.projectsSection.ctaContact}
        </Link>
      </motion.div>
    </section>
  )
}
