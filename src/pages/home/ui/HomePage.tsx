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
  ScrollIndicator,
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

      <ScrollIndicator
        targetId="sobre-mi"
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 backdrop-blur-[2px]"
      />

      <HomeFooter />
    </>
  )
}
