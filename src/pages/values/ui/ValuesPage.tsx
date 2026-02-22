import { useI18n } from '@/shared'
import { QuickEvidenceSection } from '@/widgets/home-sections'
import { PageShell } from '@/pages/shared'

export function ValuesPage() {
  const { messages } = useI18n()

  return (
    <PageShell title={messages.pages.values.title} description={messages.pages.values.description}>
      <main className="space-y-24 md:space-y-32">
        <QuickEvidenceSection />
      </main>
    </PageShell>
  )
}
