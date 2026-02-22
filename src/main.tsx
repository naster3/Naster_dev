import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App, AppProviders } from '@/app/index'
import '@/app/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
