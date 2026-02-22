import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRouter } from './AppRouter'

describe('AppRouter', () => {
  const ASYNC_ROUTE_TIMEOUT = 9000

  const renderWithRouter = (initialEntry: string) => {
    return render(
      <HelmetProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <AppRouter />
        </MemoryRouter>
      </HelmetProvider>,
    )
  }

  it('renderiza la pagina de proyectos en /proyectos', async () => {
    renderWithRouter('/proyectos')

    expect(
      await screen.findByRole(
        'heading',
        { name: /Proyectos destacados/i },
        { timeout: ASYNC_ROUTE_TIMEOUT },
      ),
    ).toBeInTheDocument()
  }, 10000)

  it('renderiza la pagina de contacto en /contacto', async () => {
    renderWithRouter('/contacto')

    expect(
      await screen.findByRole('heading', { name: /Contacto/i }, { timeout: ASYNC_ROUTE_TIMEOUT }),
    ).toBeInTheDocument()
  }, 10000)

  it('renderiza la pagina sobre mi en /sobre-mi', async () => {
    renderWithRouter('/sobre-mi')

    expect(
      await screen.findByRole(
        'heading',
        { name: /Sobre m[ií]/i },
        { timeout: ASYNC_ROUTE_TIMEOUT },
      ),
    ).toBeInTheDocument()
  }, 10000)

  it('renderiza la pagina de valores en /valores', async () => {
    renderWithRouter('/valores')

    expect(
      await screen.findByRole(
        'heading',
        { name: /Habilidades duras/i },
        { timeout: ASYNC_ROUTE_TIMEOUT },
      ),
    ).toBeInTheDocument()
  }, 10000)

  it('redirecciona rutas desconocidas a home', async () => {
    renderWithRouter('/no-existe')

    expect(
      await screen.findByRole('heading', { name: /Ingeniero de software/i }, { timeout: 12000 }),
    ).toBeInTheDocument()
  }, 15000)
})
