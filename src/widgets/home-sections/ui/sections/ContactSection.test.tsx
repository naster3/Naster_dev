import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

    expect(await screen.findByText(/Formulario temporalmente no disponible/i)).toBeInTheDocument()
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
    await user.selectOptions(screen.getByLabelText(/Tipo de proyecto/i), 'api')
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
      projectType: 'api',
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

  it('muestra errores por campo y limpia el error al corregir', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://example.com/contact')
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const user = userEvent.setup()
    render(<ContactSection />)

    await user.type(screen.getByLabelText(/Nombre/i), '   ')
    await user.type(screen.getByLabelText(/Email/i), 'manuel@email.com')
    await user.type(screen.getByLabelText(/Mensaje/i), '   ')
    await user.click(screen.getByRole('button', { name: /Enviar/i }))

    expect(await screen.findByText(/Completa el campo Nombre/i)).toBeInTheDocument()
    expect(await screen.findByText(/Completa el campo Mensaje/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText(/Nombre/i), 'Manuel')

    await waitFor(() => {
      expect(screen.queryByText(/Completa el campo Nombre/i)).not.toBeInTheDocument()
    })
  })

  it('resetea estado visual al editar despues de un error', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', '')
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const user = userEvent.setup()
    render(<ContactSection />)

    await user.type(screen.getByLabelText(/Nombre/i), 'Manuel')
    await user.type(screen.getByLabelText(/Email/i), 'manuel@email.com')
    await user.type(screen.getByLabelText(/Mensaje/i), 'Hola, quiero colaborar.')
    await user.click(screen.getByRole('button', { name: /Enviar/i }))

    expect(await screen.findByText(/Formulario temporalmente no disponible/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Mensaje/i), ' Gracias.')

    await waitFor(() => {
      expect(screen.queryByText(/Formulario temporalmente no disponible/i)).not.toBeInTheDocument()
    })
  })

  it('bloquea endpoints fuera de la allowlist', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://evil.example.com/contact')
    vi.stubEnv('VITE_CONTACT_ALLOWED_HOSTS', 'formspree.io')
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const user = userEvent.setup()
    render(<ContactSection />)

    await user.type(screen.getByLabelText(/Nombre/i), 'Manuel')
    await user.type(screen.getByLabelText(/Email/i), 'manuel@email.com')
    await user.type(screen.getByLabelText(/Mensaje/i), 'Hola, quiero colaborar.')
    await user.click(screen.getByRole('button', { name: /Enviar/i }))

    expect(await screen.findByText(/Formulario temporalmente no disponible/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('acepta el honeypot como exito falso y evita la llamada de red', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://example.com/contact')
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch

    render(<ContactSection />)

    fireEvent.input(screen.getByLabelText(/Nombre/i), { target: { value: 'Manuel' } })
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'manuel@email.com' } })
    fireEvent.input(screen.getByLabelText(/Mensaje/i), {
      target: { value: 'Necesito una API con autenticacion.' },
    })
    const honeypot = document.querySelector('input[name="company"]') as HTMLInputElement
    fireEvent.input(honeypot, { target: { value: 'bot-company' } })
    fireEvent.submit(honeypot.form as HTMLFormElement)

    expect(await screen.findByText(/Mensaje enviado correctamente/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('valida email invalido y limites de longitud', async () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://example.com/contact')
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch

    render(<ContactSection />)

    const nameInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/Mensaje/i) as HTMLTextAreaElement
    const form = screen.getByRole('form', { name: /Formulario de contacto/i })

    fireEvent.input(nameInput, { target: { value: 'M'.repeat(121) } })
    fireEvent.input(emailInput, { target: { value: 'correo-invalido' } })
    fireEvent.input(messageInput, { target: { value: 'x'.repeat(4001) } })

    expect(nameInput.value).toHaveLength(121)
    expect(emailInput.value).toBe('correo-invalido')
    expect(messageInput.value).toHaveLength(4001)

    fireEvent.submit(form)

    expect(await screen.findByText(/El nombre es demasiado largo/i)).toBeInTheDocument()
    expect(await screen.findByText(/Escribe un email válido/i)).toBeInTheDocument()
    expect(await screen.findByText(/El mensaje es demasiado largo/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
