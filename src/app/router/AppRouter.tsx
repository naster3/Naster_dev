import { Route, Routes } from 'react-router-dom'
import { AboutPage, ContactPage, HomePage, NotFoundPage, ProjectsPage, ValuesPage } from '@/pages'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/proyectos" element={<ProjectsPage />} />
      <Route path="/sobre-mi" element={<AboutPage />} />
      <Route path="/valores" element={<ValuesPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
