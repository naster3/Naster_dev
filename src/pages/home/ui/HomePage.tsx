import { Helmet } from 'react-helmet-async'
import { useI18n } from '@/shared'
import {
  AboutSection,
  ContactSection,
  HeroSection,
  HomeFooter,
  MatrixCubeSection,
  ProjectsSection,
  QuickEvidenceSection,
} from '@/widgets/home-sections'

export function HomePage() {
  const { messages } = useI18n()

  return (
    <>
      <Helmet>
        <title>{messages.pages.home.title}</title>
        <meta name="description" content={messages.pages.home.description} />
      </Helmet>

      <main className="space-y-24 md:space-y-32">
        <MatrixCubeSection />
        <div className="pt-8 md:pt-14">
          <HeroSection />
        </div>
        <AboutSection />
        <QuickEvidenceSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <HomeFooter />
    </>
  )
}
