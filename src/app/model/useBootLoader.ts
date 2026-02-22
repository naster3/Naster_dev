import { useEffect, useReducer } from 'react'

// Duraciones del loader (ms): subida inicial + transición de salida.
const MIN_VISIBLE_MS = 950
const TRANSITION_PHASE_MS = 720
const READY_FALLBACK_MS = 5000
const HIDE_DELAY_MS = 60
const TICK_INTERVAL_MS = 40
const LOADER_SESSION_KEY = 'naster.boot-loader.seen.v1'

function shouldSkipLoader(): boolean {
  if (typeof window === 'undefined') return false

  // Respeta accesibilidad: si el usuario prefiere menos movimiento, omite el loader.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true
  }

  try {
    // Solo mostrar una vez por sesion para no penalizar navegacion repetida.
    return window.sessionStorage.getItem(LOADER_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markLoaderAsSeen() {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(LOADER_SESSION_KEY, '1')
  } catch {
    // no-op: sessionStorage can fail in privacy mode; loader still works
  }
}

type BootLoaderState = {
  isLoading: boolean
  progress: number
  transitionProgress: number
}

type LoaderMachineState =
  | { tag: 'skipped' }
  | { tag: 'warming'; startedAt: number; progress: number }
  | { tag: 'waitingMinVisible'; startedAt: number; readyAt: number; progress: number }
  | {
      tag: 'transitioningOut'
      startedAt: number
      readyAt: number
      progress: number
      transitionProgress: number
    }
  | { tag: 'done' }

type LoaderMachineEvent =
  | { type: 'READY'; at: number }
  | { type: 'TICK'; now: number }
  | { type: 'HIDE' }

function nowMs(): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now()
  }

  return Date.now()
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function roundOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

function easeProgress(previous: number, target: number, ratio: number, minDelta: number): number {
  const delta = Math.max(minDelta, (target - previous) * ratio)
  return roundOneDecimal(Math.min(target, previous + delta))
}

function getTransitionProgress(now: number, startedAt: number, readyAt: number): number {
  const transitionBase = Math.max(readyAt, startedAt + MIN_VISIBLE_MS)
  const transitionRaw = (now - transitionBase) / TRANSITION_PHASE_MS
  return clampUnit(transitionRaw)
}

function transitionProgressToPercent(transitionProgress: number): number {
  return roundOneDecimal(94 + transitionProgress * 6)
}

function createInitialMachineState(): LoaderMachineState {
  if (shouldSkipLoader()) {
    return { tag: 'skipped' }
  }

  return { tag: 'warming', startedAt: nowMs(), progress: 0 }
}

function transitionLoaderState(
  state: LoaderMachineState,
  event: LoaderMachineEvent,
): LoaderMachineState {
  switch (state.tag) {
    case 'skipped':
    case 'done':
      return state

    case 'warming':
      if (event.type === 'READY') {
        return {
          tag: 'waitingMinVisible',
          startedAt: state.startedAt,
          readyAt: event.at,
          progress: state.progress,
        }
      }

      if (event.type === 'TICK') {
        const nextProgress = easeProgress(state.progress, 94, 0.06, 0.25)
        if (nextProgress === state.progress) return state
        return { ...state, progress: nextProgress }
      }

      return state

    case 'waitingMinVisible': {
      if (event.type !== 'TICK') {
        return state
      }

      if (event.now - state.startedAt < MIN_VISIBLE_MS) {
        const nextProgress = easeProgress(state.progress, 97, 0.08, 0.2)
        if (nextProgress === state.progress) return state
        return { ...state, progress: nextProgress }
      }

      const nextTransitionProgress = getTransitionProgress(
        event.now,
        state.startedAt,
        state.readyAt,
      )
      return {
        tag: 'transitioningOut',
        startedAt: state.startedAt,
        readyAt: state.readyAt,
        transitionProgress: nextTransitionProgress,
        progress: transitionProgressToPercent(nextTransitionProgress),
      }
    }

    case 'transitioningOut': {
      if (event.type === 'HIDE') {
        return { tag: 'done' }
      }

      if (event.type !== 'TICK') {
        return state
      }

      const nextTransitionProgress = getTransitionProgress(
        event.now,
        state.startedAt,
        state.readyAt,
      )
      const nextProgress = transitionProgressToPercent(nextTransitionProgress)
      if (nextTransitionProgress === state.transitionProgress && nextProgress === state.progress) {
        return state
      }

      return {
        ...state,
        transitionProgress: nextTransitionProgress,
        progress: nextProgress,
      }
    }
  }
}

function mapMachineToBootState(state: LoaderMachineState): BootLoaderState {
  switch (state.tag) {
    case 'skipped':
    case 'done':
      return { isLoading: false, progress: 100, transitionProgress: 1 }

    case 'warming':
    case 'waitingMinVisible':
      return { isLoading: true, progress: state.progress, transitionProgress: 0 }

    case 'transitioningOut':
      return {
        isLoading: true,
        progress: state.progress,
        transitionProgress: state.transitionProgress,
      }
  }
}

export function useBootLoader(): BootLoaderState {
  const [machineState, dispatch] = useReducer(
    transitionLoaderState,
    undefined,
    createInitialMachineState,
  )
  const bootState = mapMachineToBootState(machineState)

  useEffect(() => {
    if (!bootState.isLoading) return

    const interval = window.setInterval(() => {
      dispatch({ type: 'TICK', now: nowMs() })
    }, TICK_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [bootState.isLoading])

  useEffect(() => {
    if (!bootState.isLoading) return

    let didDispatchReady = false
    let pageLoaded = document.readyState === 'complete'
    let fontsLoaded = !('fonts' in document)

    const dispatchReady = (at: number) => {
      if (didDispatchReady) return
      didDispatchReady = true
      dispatch({ type: 'READY', at })
    }

    const markReadyIfDone = () => {
      if (pageLoaded && fontsLoaded) {
        dispatchReady(nowMs())
      }
    }

    const onLoad = () => {
      pageLoaded = true
      markReadyIfDone()
    }

    if (!pageLoaded) {
      window.addEventListener('load', onLoad, { once: true })
    } else {
      markReadyIfDone()
    }

    if (!fontsLoaded) {
      document.fonts.ready
        .then(() => {
          fontsLoaded = true
          markReadyIfDone()
        })
        .catch(() => {
          fontsLoaded = true
          markReadyIfDone()
        })
    }

    const forceReadyTimeout = window.setTimeout(() => {
      dispatchReady(nowMs())
    }, READY_FALLBACK_MS)

    return () => {
      window.clearTimeout(forceReadyTimeout)
      window.removeEventListener('load', onLoad)
    }
  }, [bootState.isLoading])

  useEffect(() => {
    if (machineState.tag !== 'transitioningOut' || machineState.transitionProgress < 1) return

    const hideTimeout = window.setTimeout(() => {
      markLoaderAsSeen()
      dispatch({ type: 'HIDE' })
    }, HIDE_DELAY_MS)

    return () => {
      window.clearTimeout(hideTimeout)
    }
  }, [machineState])

  return bootState
}
