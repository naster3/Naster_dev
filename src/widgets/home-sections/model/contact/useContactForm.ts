import { useEffect, useReducer, useRef, type FormEvent } from 'react'
import type { Locale } from '@/shared/i18n'
import { trackPortfolioEvent } from '@/shared/lib'
import type { HomeContent } from '../content'

type FormStatus = {
  message: string
  type: 'error' | 'idle' | 'sending' | 'success'
}

type ContactFormData = {
  company: string
  email: string
  message: string
  name: string
  projectType: string
}

type ContactField = 'email' | 'message' | 'name'
type ContactFieldErrors = Partial<Record<ContactField, string>>

type ContactFormState = {
  fieldErrors: ContactFieldErrors
  form: ContactFormData | null
  message: string
  tag: 'error' | 'idle' | 'sending' | 'success' | 'validating'
}

type ContactFormEvent =
  | { type: 'SUBMIT'; form: ContactFormData }
  | { type: 'VALIDATION_PASSED'; message: string }
  | { type: 'VALIDATION_FAILED'; message: string; fieldErrors?: ContactFieldErrors }
  | { type: 'SEND_SUCCESS'; message: string }
  | { type: 'SEND_FAILED'; message: string }
  | { type: 'CLEAR_FIELD_ERROR'; field: ContactField }
  | { type: 'RESET' }

type ContactContent = HomeContent['contact']

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const contactFields: readonly ContactField[] = ['name', 'email', 'message']
const MAX_NAME_LENGTH = 120
const MAX_MESSAGE_LENGTH = 4000
const MIN_HUMAN_SUBMIT_MS = import.meta.env.MODE === 'test' ? 0 : 900

function isContactField(value: string): value is ContactField {
  return contactFields.some((field) => field === value)
}

function buildRequiredFieldMessage(label: string, locale: Locale) {
  return locale === 'es' ? `Completa el campo ${label}.` : `Please complete ${label}.`
}

function buildInvalidEmailMessage(locale: Locale) {
  return locale === 'es' ? 'Escribe un email válido.' : 'Enter a valid email address.'
}

function buildLengthExceededMessage(locale: Locale) {
  return locale === 'es'
    ? 'El mensaje es demasiado largo. Reduce el contenido e intenta de nuevo.'
    : 'The message is too long. Please shorten it and try again.'
}

function buildNameTooLongMessage(locale: Locale) {
  return locale === 'es' ? 'El nombre es demasiado largo.' : 'The name is too long.'
}

function isEndpointAllowed(endpoint: string) {
  try {
    const parsed = new URL(endpoint)
    const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    if (parsed.protocol !== 'https:' && !isLocalhost) return false

    const allowedHostsRaw = import.meta.env.VITE_CONTACT_ALLOWED_HOSTS?.trim()
    if (!allowedHostsRaw) return true

    const allowedHosts = allowedHostsRaw
      .split(',')
      .map((host: string) => host.trim().toLowerCase())
      .filter(Boolean)

    const currentHost = parsed.hostname.toLowerCase()
    return allowedHosts.some(
      (host: string) => currentHost === host || currentHost.endsWith(`.${host}`),
    )
  } catch {
    return false
  }
}

function validateContactPayload(
  payload: ContactFormData,
  content: ContactContent,
  locale: Locale,
): ContactFieldErrors {
  const errors: ContactFieldErrors = {}

  if (!payload.name) {
    errors.name = buildRequiredFieldMessage(content.form.name, locale)
  } else if (payload.name.length > MAX_NAME_LENGTH) {
    errors.name = buildNameTooLongMessage(locale)
  }

  if (!payload.email) {
    errors.email = buildRequiredFieldMessage(content.form.email, locale)
  } else if (!emailPattern.test(payload.email)) {
    errors.email = buildInvalidEmailMessage(locale)
  }

  if (!payload.message) {
    errors.message = buildRequiredFieldMessage(content.form.message, locale)
  } else if (payload.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = buildLengthExceededMessage(locale)
  }

  return errors
}

async function sendContactPayload(
  endpoint: string,
  payload: ContactFormData,
  retries = 1,
  timeoutMs = 12000,
) {
  const maxAttempts = retries + 1

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: payload.email,
          message: payload.message,
          name: payload.name,
          projectType: payload.projectType,
          source: 'portfolio-web',
        }),
        signal: controller.signal,
      })

      if (response.ok) return
      if (attempt === maxAttempts) {
        throw new Error('Contact submit failed')
      }
    } catch {
      if (attempt === maxAttempts) {
        throw new Error('Contact submit failed')
      }
    } finally {
      window.clearTimeout(timeoutId)
    }
  }
}

function transitionContactFormState(
  state: ContactFormState,
  event: ContactFormEvent,
): ContactFormState {
  switch (event.type) {
    case 'SUBMIT':
      return {
        tag: 'validating',
        form: event.form,
        message: '',
        fieldErrors: {},
      }

    case 'VALIDATION_PASSED':
      if (state.tag !== 'validating') return state
      return {
        ...state,
        tag: 'sending',
        message: event.message,
      }

    case 'VALIDATION_FAILED':
      return {
        ...state,
        tag: 'error',
        message: event.message,
        fieldErrors: event.fieldErrors ?? state.fieldErrors,
      }

    case 'SEND_SUCCESS':
      return {
        tag: 'success',
        form: null,
        message: event.message,
        fieldErrors: {},
      }

    case 'SEND_FAILED':
      return {
        ...state,
        tag: 'error',
        message: event.message,
      }

    case 'CLEAR_FIELD_ERROR': {
      if (!state.fieldErrors[event.field]) return state
      const nextFieldErrors = { ...state.fieldErrors }
      delete nextFieldErrors[event.field]
      return {
        ...state,
        fieldErrors: nextFieldErrors,
      }
    }

    case 'RESET':
      if (state.tag === 'error' || state.tag === 'success') {
        return {
          ...state,
          tag: 'idle',
          message: '',
        }
      }
      return state
  }
}

function getStatusFromState(state: ContactFormState, sendingMessage: string): FormStatus {
  switch (state.tag) {
    case 'idle':
      return { type: 'idle', message: '' }
    case 'validating':
      return { type: 'sending', message: sendingMessage }
    case 'sending':
      return { type: 'sending', message: state.message || sendingMessage }
    case 'success':
      return { type: 'success', message: state.message }
    case 'error':
      return { type: 'error', message: state.message }
  }
}

const initialState: ContactFormState = {
  tag: 'idle',
  form: null,
  message: '',
  fieldErrors: {},
}

export function useContactForm(content: ContactContent, locale: Locale) {
  const [state, dispatch] = useReducer(transitionContactFormState, initialState)
  const sessionStartedAtRef = useRef(0)
  const status = getStatusFromState(state, content.status.sending)
  const isSubmitting = state.tag === 'validating' || state.tag === 'sending'
  const contactFormEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim()

  useEffect(() => {
    sessionStartedAtRef.current = Date.now()
  }, [])

  const handleFieldInput = (event: FormEvent<HTMLFormElement>) => {
    if (isSubmitting) return

    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
    if (!target?.name) return

    const fieldName = target.name
    if (isContactField(fieldName)) {
      dispatch({ type: 'CLEAR_FIELD_ERROR', field: fieldName })
    }

    if (state.tag === 'error' || state.tag === 'success') {
      dispatch({ type: 'RESET' })
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload: ContactFormData = {
      company: String(formData.get('company') ?? '').trim(),
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      projectType: String(formData.get('projectType') ?? 'web').trim(),
      message: String(formData.get('message') ?? '').trim(),
    }

    dispatch({ type: 'SUBMIT', form: payload })
    const validationErrors = validateContactPayload(payload, content, locale)

    if (Object.keys(validationErrors).length > 0) {
      dispatch({
        type: 'VALIDATION_FAILED',
        message: content.status.required,
        fieldErrors: validationErrors,
      })
      return
    }

    if (!contactFormEndpoint) {
      dispatch({
        type: 'VALIDATION_FAILED',
        message: content.status.missingEndpoint,
        fieldErrors: {},
      })
      trackPortfolioEvent('contact_submit', { locale, reason: 'missing_endpoint', status: 'error' })
      return
    }

    if (!isEndpointAllowed(contactFormEndpoint)) {
      dispatch({
        type: 'VALIDATION_FAILED',
        message: content.status.missingEndpoint,
        fieldErrors: {},
      })
      trackPortfolioEvent('contact_submit', { locale, reason: 'invalid_endpoint', status: 'error' })
      return
    }

    // Honeypot anti-spam: if bot fills this field, fake a successful response and skip network.
    if (payload.company) {
      dispatch({
        type: 'SEND_SUCCESS',
        message: content.status.success,
      })
      form.reset()
      sessionStartedAtRef.current = Date.now()
      trackPortfolioEvent('contact_submit', { locale, reason: 'honeypot', status: 'blocked' })
      return
    }

    if (Date.now() - sessionStartedAtRef.current < MIN_HUMAN_SUBMIT_MS) {
      dispatch({
        type: 'SEND_SUCCESS',
        message: content.status.success,
      })
      form.reset()
      sessionStartedAtRef.current = Date.now()
      trackPortfolioEvent('contact_submit', {
        locale,
        reason: 'submit_too_fast',
        status: 'blocked',
      })
      return
    }

    dispatch({
      type: 'VALIDATION_PASSED',
      message: content.status.sending,
    })

    try {
      await sendContactPayload(contactFormEndpoint, payload)
      dispatch({
        type: 'SEND_SUCCESS',
        message: content.status.success,
      })
      form.reset()
      sessionStartedAtRef.current = Date.now()
      trackPortfolioEvent('contact_submit', { locale, status: 'success' })
    } catch {
      dispatch({
        type: 'SEND_FAILED',
        message: content.status.error,
      })
      trackPortfolioEvent('contact_submit', {
        locale,
        status: 'error',
        reason: 'network_or_server',
      })
    }
  }

  return {
    fieldErrors: state.fieldErrors,
    handleFieldInput,
    handleSubmit,
    isSubmitting,
    status,
  }
}
