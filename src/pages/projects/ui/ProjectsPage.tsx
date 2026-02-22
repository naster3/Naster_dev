import { useI18n } from '@/shared'
import { ProjectsSection } from '@/widgets/home-sections'
import { PageShell } from '@/pages/shared'

export function ProjectsPage() {
  const { messages } = useI18n()

  return (
    <PageShell
      title={messages.pages.projects.title}
      description={messages.pages.projects.description}
    >
      <main className="space-y-24 md:space-y-32">
        <ProjectsSection />
      </main>
    </PageShell>
  )
}
