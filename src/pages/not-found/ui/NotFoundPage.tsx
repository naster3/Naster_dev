import { Link } from 'react-router-dom'
import { useI18n } from '@/shared'
import { PageShell } from '@/pages/shared'

export function NotFoundPage() {
  const { locale, messages } = useI18n()
  const heading = locale === 'es' ? 'Página no encontrada' : 'Page not found'
  const title = locale === 'es' ? '404' : '404'
  const message =
    locale === 'es'
      ? 'La página que buscas no existe o fue movida.'
      : 'The page you are looking for does not exist or was moved.'
  const cta = locale === 'es' ? 'Volver al inicio' : 'Back to home'

  return (
    <PageShell
      title={messages.pages.notFound.title}
      description={messages.pages.notFound.description}
      locale={locale}
      path="/404"
      noIndex
    >
      <main className="grid min-h-[55vh] place-items-center">
        <section className="w-full max-w-xl rounded-3xl border border-(--border-soft) bg-(--surface-1) p-8 text-center shadow-[0_14px_36px_-24px_rgb(25_36_47/0.75)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--text-soft)">
            {title}
          </p>
          <h1 className="mt-3 text-3xl text-(--text-main) md:text-4xl">{heading}</h1>
          <p className="mt-4 text-(--text-soft)">{message}</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full border border-transparent bg-(--brand-ink) px-5 py-2.5 text-sm font-semibold text-(--on-brand) transition-colors hover:bg-(--brand-ink-strong)"
          >
            {cta}
          </Link>
        </section>
      </main>
    </PageShell>
  )
}
