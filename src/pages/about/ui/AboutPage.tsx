import { useI18n } from '@/shared'
import { AboutSection } from '@/widgets/home-sections'
import { PageShell } from '@/pages/shared'

export function AboutPage() {
  const { messages } = useI18n()

  return (
    <PageShell title={messages.pages.about.title} description={messages.pages.about.description}>
      <main className="space-y-24 md:space-y-32">
        <AboutSection />
      </main>
    </PageShell>
  )
}
