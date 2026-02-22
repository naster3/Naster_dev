import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactSection } from './ContactSection'

const originalFetch = globalThis.fetch

describe('ContactSection', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('muestra error si no hay endpoint configurado', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', '')
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const user = userEvent.setup()
    render(<ContactSection />)

    await user.type(screen.getByLabelText(/Nombre/i), 'Manuel')
    await user.type(screen.getByLabelText(/Email/i), 'manuel@email.com')
    await user.type(screen.getByLabelText(/Mensaje/i), 'Hola, quiero colaborar.')
    await user.click(screen.getByRole('button', { name: /Enviar/i }))

    expect(
      await screen.findByText(/Falta configurar VITE_CONTACT_FORM_ENDPOINT/i),
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('envia el formulario y muestra mensaje de exito', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://example.com/contact')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const user = userEvent.setup()
    render(<ContactSection />)

    await user.type(screen.getByLabelText(/Nombre/i), 'Manuel')
    await user.type(screen.getByLabelText(/Email/i), 'manuel@email.com')
    await user.selectOptions(screen.getByLabelText(/Tipo de proyecto/i), 'API')
    await user.type(screen.getByLabelText(/Mensaje/i), 'Necesito una API con autenticacion.')
    await user.click(screen.getByRole('button', { name: /Enviar/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://example.com/contact')
    expect(request.method).toBe('POST')
    expect(request.headers).toEqual(
      expect.objectContaining({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    )
    expect(JSON.parse(String(request.body))).toEqual({
      email: 'manuel@email.com',
      message: 'Necesito una API con autenticacion.',
      name: 'Manuel',
      projectType: 'API',
      source: 'portfolio-web',
    })

    expect(await screen.findByText(/Mensaje enviado correctamente/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('')
    expect(screen.getByLabelText(/Email/i)).toHaveValue('')
    expect(screen.getByLabelText(/Mensaje/i)).toHaveValue('')
  })

  it('muestra estado de carga mientras envia el formulario', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://example.com/contact')

    let resolveFetch: ((value: { ok: boolean }) => void) | undefined
    const pendingFetch = new Promise<{ ok: boolean }>((resolve) => {
      resolveFetch = resolve
    })
    const fetchMock = vi.fn().mockReturnValue(pendingFetch)
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const user = userEvent.setup()
    render(<ContactSection />)

    await user.type(screen.getByLabelText(/Nombre/i), 'Manuel')
    await user.type(screen.getByLabelText(/Email/i), 'manuel@email.com')
    await user.type(screen.getByLabelText(/Mensaje/i), 'Probando estado de carga.')
    await user.click(screen.getByRole('button', { name: /Enviar/i }))

    expect(screen.getByRole('button', { name: /Enviando/i })).toBeDisabled()
    expect(screen.getByText(/Enviando mensaje/i)).toBeInTheDocument()

    resolveFetch?.({ ok: true })

    expect(await screen.findByText(/Mensaje enviado correctamente/i)).toBeInTheDocument()
  })

  it('muestra error cuando el endpoint responde con fallo', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://example.com/contact')
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const user = userEvent.setup()
    render(<ContactSection />)

    await user.type(screen.getByLabelText(/Nombre/i), 'Manuel')
    await user.type(screen.getByLabelText(/Email/i), 'manuel@email.com')
    await user.type(screen.getByLabelText(/Mensaje/i), 'Test error.')
    await user.click(screen.getByRole('button', { name: /Enviar/i }))

    expect(await screen.findByText(/No se pudo enviar el mensaje/i)).toBeInTheDocument()
  })
})
