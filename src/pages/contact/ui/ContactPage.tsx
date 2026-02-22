import { useI18n } from '@/shared'
import { ContactSection } from '@/widgets/home-sections'
import { PageShell } from '@/pages/shared'

export function ContactPage() {
  const { messages } = useI18n()

  return (
    <PageShell
      title={messages.pages.contact.title}
      description={messages.pages.contact.description}
    >
      <main className="space-y-24 md:space-y-32">
        <ContactSection />
      </main>
    </PageShell>
  )
}
