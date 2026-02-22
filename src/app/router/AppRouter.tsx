import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const HomePage = lazy(() =>
  import('@/pages/home').then((module) => ({
    default: module.HomePage,
  })),
)
const ProjectsPage = lazy(() =>
  import('@/pages/projects').then((module) => ({
    default: module.ProjectsPage,
  })),
)
const AboutPage = lazy(() =>
  import('@/pages/about').then((module) => ({
    default: module.AboutPage,
  })),
)
const ValuesPage = lazy(() =>
  import('@/pages/values').then((module) => ({
    default: module.ValuesPage,
  })),
)
const ContactPage = lazy(() =>
  import('@/pages/contact').then((module) => ({
    default: module.ContactPage,
  })),
)

export function AppRouter() {
  return (
    <Suspense fallback={<div aria-label="route-loading" className="sr-only" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/proyectos" element={<ProjectsPage />} />
        <Route path="/sobre-mi" element={<AboutPage />} />
        <Route path="/valores" element={<ValuesPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
