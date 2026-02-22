import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MainLayout } from './MainLayout'

describe('MainLayout', () => {
  const renderLayout = () =>
    render(
      <MemoryRouter initialEntries={['/']}>
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
})
