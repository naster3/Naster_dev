import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { trackPortfolioEvent } = vi.hoisted(() => ({
  trackPortfolioEvent: vi.fn(),
}))

vi.mock('@/shared', async () => {
  const actual = await vi.importActual<typeof import('@/shared')>('@/shared')
  return {
    ...actual,
    trackPortfolioEvent,
  }
})

import { MainLayout } from './MainLayout'

describe('MainLayout', () => {
  beforeEach(() => {
    trackPortfolioEvent.mockClear()
  })

  const renderLayout = (route = '/') =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <MainLayout>
          <div>Contenido</div>
        </MainLayout>
      </MemoryRouter>,
    )

  it('abre y cierra el menu movil desde el boton', async () => {
    const user = userEvent.setup()
    renderLayout()

    const openButton = screen.getByRole('button', { name: /Abrir menu/i })
    await user.click(openButton)

    expect(screen.getByRole('button', { name: /Cerrar menu/i })).toBeInTheDocument()
  })

  it('cierra el menu movil al seleccionar un link de navegacion', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.click(screen.getByRole('button', { name: /Abrir menu/i }))

    const contactLinks = screen.getAllByRole('link', { name: /Contacto/i })
    expect(contactLinks).toHaveLength(2)

    await user.click(contactLinks[1])

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Abrir menu/i })).toBeInTheDocument()
    })
  })

  it('trackea clicks en el logo y en el link de GitHub del header', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.click(screen.getByRole('link', { name: /Naster Dev logo/i }))
    await user.click(screen.getAllByRole('link', { name: /GitHub/i })[0])

    expect(trackPortfolioEvent).toHaveBeenCalledWith('header_logo_click', { target: 'home' })
    expect(trackPortfolioEvent).toHaveBeenCalledWith('cta_click', {
      source: 'header',
      target: 'github',
    })
  })

  it('usa espaciado de pagina interna cuando la ruta no es home', () => {
    renderLayout('/proyectos')

    expect(screen.getByText('Contenido').parentElement).toHaveClass('py-10')
  })
})
