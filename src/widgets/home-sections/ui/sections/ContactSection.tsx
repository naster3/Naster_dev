import { motion } from 'framer-motion'
import { CalendarClock, ExternalLink, Github, Mail } from 'lucide-react'
import { portfolioLinks, useI18n } from '@/shared'
import { cn } from '@/shared/lib'
import { homeContentByLocale, motionViewport, sectionReveal, useContactForm } from '../../model'
import { primaryBtnClass } from '../styles'

export function ContactSection() {
  const { locale } = useI18n()
  const content = homeContentByLocale[locale]
  const { fieldErrors, handleFieldInput, handleSubmit, isSubmitting, status } = useContactForm(
    content.contact,
    locale,
  )

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
          onInput={handleFieldInput}
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          className="space-y-4 rounded-2xl border border-(--border-soft) bg-(--surface-1) p-6 md:col-span-7"
        >
          <input
            type="text"
            name="company"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-(--text-main)">
              {content.contact.form.name}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isSubmitting}
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
              className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-3 py-2 text-(--text-main) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-mist)"
            />
            {fieldErrors.name ? (
              <p id="contact-name-error" className="text-xs text-(--status-error)" role="alert">
                {fieldErrors.name}
              </p>
            ) : null}
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
              disabled={isSubmitting}
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
              className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-3 py-2 text-(--text-main) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-mist)"
            />
            {fieldErrors.email ? (
              <p id="contact-email-error" className="text-xs text-(--status-error)" role="alert">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <label htmlFor="projectType" className="text-sm font-medium text-(--text-main)">
              {content.contact.form.projectType}
            </label>
            <select
              id="projectType"
              name="projectType"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-3 py-2 text-(--text-main) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-mist)"
            >
              <option value="web">{content.contact.options.web}</option>
              <option value="api">{content.contact.options.api}</option>
              <option value="data">{content.contact.options.data}</option>
              <option value="other">{content.contact.options.other}</option>
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
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
              className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-3 py-2 text-(--text-main) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-mist)"
            />
            {fieldErrors.message ? (
              <p id="contact-message-error" className="text-xs text-(--status-error)" role="alert">
                {fieldErrors.message}
              </p>
            ) : null}
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
                  ? 'text-(--status-error)'
                  : status.type === 'success'
                    ? 'text-(--status-success)'
                    : 'text-(--text-soft)',
              )}
              role={status.type === 'error' ? 'alert' : 'status'}
              aria-live={status.type === 'error' ? 'assertive' : 'polite'}
              aria-atomic="true"
            >
              {status.message}
            </p>
          ) : null}
        </form>

        <aside className="space-y-3 md:col-span-5">
          <article className="rounded-2xl border border-(--border-soft) bg-(--surface-1) p-5">
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
          <article className="rounded-2xl border border-(--border-soft) bg-(--surface-1) p-5">
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
          <article className="rounded-2xl border border-(--border-soft) bg-(--surface-1) p-5">
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
