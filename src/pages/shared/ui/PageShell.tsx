import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { HomeFooter } from '@/widgets/home-sections'

type PageShellProps = {
  children: ReactNode
  description: string
  showFooter?: boolean
  title: string
}

export function PageShell({ children, description, showFooter = true, title }: PageShellProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}

      {showFooter ? <HomeFooter /> : null}
    </>
  )
}
