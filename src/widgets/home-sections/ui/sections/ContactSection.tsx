import { motion } from 'framer-motion'
import { CalendarClock, ExternalLink, Github, Mail } from 'lucide-react'
import { portfolioLinks, useI18n } from '@/shared'
import { cn } from '@/shared/lib'
import { homeContentByLocale, motionViewport, sectionReveal, useContactForm } from '../../model'
import { primaryBtnClass } from '../styles'

export function ContactSection() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]
  const { handleSubmit, isSubmitting, status } = useContactForm(content.contact)

  return (
    <motion.section
      id="contacto"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={motionViewport.standard}
      className="space-y-6"
    >
      <h2 className="text-4xl text-(--text-main) md:text-5xl">{content.contact.title}</h2>
      <div className="grid gap-8 md:grid-cols-12">
        <form
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          className="space-y-4 rounded-2xl border border-(--border-soft) bg-white/85 p-6 md:col-span-7"
        >
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-(--text-main)">
              {content.contact.form.name}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-xl border border-(--border-soft) bg-white px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-(--text-main)">
              {content.contact.form.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-(--border-soft) bg-white px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="projectType" className="text-sm font-medium text-(--text-main)">
              {content.contact.form.projectType}
            </label>
            <select
              id="projectType"
              name="projectType"
              className="w-full rounded-xl border border-(--border-soft) bg-white px-3 py-2"
            >
              <option>{content.contact.options.web}</option>
              <option>{content.contact.options.api}</option>
              <option>{content.contact.options.data}</option>
              <option>{content.contact.options.other}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="message" className="text-sm font-medium text-(--text-main)">
              {content.contact.form.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full rounded-xl border border-(--border-soft) bg-white px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(primaryBtnClass, isSubmitting && 'cursor-not-allowed opacity-70')}
          >
            {isSubmitting ? content.contact.form.sending : content.contact.form.submit}
          </button>
          {status.type !== 'idle' ? (
            <p
              className={cn(
                'text-sm',
                status.type === 'error'
                  ? 'text-red-600'
                  : status.type === 'success'
                    ? 'text-green-700'
                    : 'text-(--text-soft)',
              )}
              role="status"
            >
              {status.message}
            </p>
          ) : null}
        </form>

        <aside className="space-y-3 md:col-span-5">
          <article className="rounded-2xl border border-(--border-soft) bg-white/85 p-5">
            <h3 className="font-semibold text-(--text-main)">
              {content.contact.subtitleCards.directEmail}
            </h3>
            <a
              href={portfolioLinks.email}
              className="mt-2 inline-flex items-center gap-2 text-(--text-soft)"
            >
              <Mail size={16} />
              {portfolioLinks.contactEmail}
            </a>
          </article>
          <article className="rounded-2xl border border-(--border-soft) bg-white/85 p-5">
            <h3 className="font-semibold text-(--text-main)">
              {content.contact.subtitleCards.scheduleCall}
            </h3>
            <a
              href={portfolioLinks.calendly}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-(--text-soft)"
            >
              <CalendarClock size={16} />
              {content.contact.subtitleCards.calendly}
            </a>
          </article>
          <article className="rounded-2xl border border-(--border-soft) bg-white/85 p-5">
            <h3 className="font-semibold text-(--text-main)">
              {content.contact.subtitleCards.networks}
            </h3>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={portfolioLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-(--text-soft)"
              >
                <ExternalLink size={16} />
                LinkedIn
              </a>
              <a
                href={portfolioLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-(--text-soft)"
              >
                <Github size={16} />
                GitHub
              </a>
            </div>
          </article>
          <p className="text-xs text-(--text-soft)">{content.contact.antiSpam}</p>
        </aside>
      </div>
    </motion.section>
  )
}
