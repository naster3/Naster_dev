import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import { portfolioLinks, useI18n } from '@/shared'
import { cn } from '@/shared/lib'
import { homeContentByLocale, motionViewport, sectionReveal, stagger } from '../../model'
import { primaryBtnClass, secondaryBtnClass } from '../styles'

export function ProjectsSection() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]

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
        </div>
        <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
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
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={motionViewport.list}
        className="space-y-8"
      >
        {content.projects.map((project) => {
          const demoUrl = project.links?.demo ?? portfolioLinks.github
          const repoUrl = project.links?.repo ?? portfolioLinks.github
          const docsUrl = project.links?.docs ?? portfolioLinks.docs
          const demoLabel = project.demoLabel ?? content.projectsSection.linkLabels.demo
          const showRepoButton = repoUrl !== demoUrl || !project.demoLabel

          return (
            <motion.article
              key={project.title}
              variants={sectionReveal}
              className="rounded-[1.45rem] border border-(--border-soft) bg-white/80 p-6 shadow-[0_10px_36px_-26px_rgb(25_36_47/0.8)]"
            >
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold text-(--text-main)">{project.title}</h3>
                <span className="rounded-full bg-(--brand-mist) px-3 py-1 text-xs font-semibold text-(--text-main)">
                  {project.tag}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-12">
                <div className="space-y-4 md:col-span-5">
                  <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-(--border-soft) bg-[linear-gradient(130deg,#fdfefe_15%,#e9f4fb_60%,#fbefe9_100%)]">
                    {project.coverImage ? (
                      <>
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
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
