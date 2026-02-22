import { useReducer, type FormEvent } from 'react'
import type { HomeContent } from '../content'

type FormStatus = {
  message: string
  type: 'error' | 'idle' | 'sending' | 'success'
}

type ContactFormData = {
  email: string
  message: string
  name: string
  projectType: string
}

type ContactFormState =
  | { tag: 'idle' }
  | { tag: 'validating'; form: ContactFormData }
  | { tag: 'sending'; form: ContactFormData; message: string }
  | { tag: 'success'; message: string }
  | { tag: 'error'; message: string }

type ContactFormEvent =
  | { type: 'SUBMIT'; form: ContactFormData }
  | { type: 'VALIDATION_PASSED'; message: string }
  | { type: 'VALIDATION_FAILED'; message: string }
  | { type: 'SEND_SUCCESS'; message: string }
  | { type: 'SEND_FAILED'; message: string }
  | { type: 'RESET' }

type ContactContent = HomeContent['contact']

function transitionContactFormState(
  state: ContactFormState,
  event: ContactFormEvent,
): ContactFormState {
  switch (state.tag) {
    case 'idle':
    case 'success':
    case 'error':
      if (event.type === 'SUBMIT') {
        return { tag: 'validating', form: event.form }
      }

      if (event.type === 'RESET') {
        return { tag: 'idle' }
      }

      return state

    case 'validating':
      if (event.type === 'VALIDATION_PASSED') {
        return { tag: 'sending', form: state.form, message: event.message }
      }

      if (event.type === 'VALIDATION_FAILED') {
        return { tag: 'error', message: event.message }
      }

      return state

    case 'sending':
      if (event.type === 'SEND_SUCCESS') {
        return { tag: 'success', message: event.message }
      }

      if (event.type === 'SEND_FAILED') {
        return { tag: 'error', message: event.message }
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
      return { type: 'sending', message: state.message }
    case 'success':
      return { type: 'success', message: state.message }
    case 'error':
      return { type: 'error', message: state.message }
  }
}

export function useContactForm(content: ContactContent) {
  const [state, dispatch] = useReducer(transitionContactFormState, {
    tag: 'idle',
  } satisfies ContactFormState)
  const status = getStatusFromState(state, content.status.sending)
  const isSubmitting = state.tag === 'validating' || state.tag === 'sending'
  const contactFormEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload: ContactFormData = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      projectType: String(formData.get('projectType') ?? 'Web').trim(),
      message: String(formData.get('message') ?? '').trim(),
    }

    dispatch({ type: 'SUBMIT', form: payload })

    if (!payload.name || !payload.email || !payload.message) {
      dispatch({
        type: 'VALIDATION_FAILED',
        message: content.status.required,
      })
      return
    }

    if (!contactFormEndpoint) {
      dispatch({
        type: 'VALIDATION_FAILED',
        message: content.status.missingEndpoint,
      })
      return
    }

    dispatch({
      type: 'VALIDATION_PASSED',
      message: content.status.sending,
    })

    try {
      const response = await fetch(contactFormEndpoint, {
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
      })

      if (!response.ok) {
        throw new Error('Contact submit failed')
      }

      dispatch({
        type: 'SEND_SUCCESS',
        message: content.status.success,
      })
      form.reset()
    } catch {
      dispatch({
        type: 'SEND_FAILED',
        message: content.status.error,
      })
    }
  }

  return {
    handleSubmit,
    isSubmitting,
    status,
  }
}
