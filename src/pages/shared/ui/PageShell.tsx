import type { ReactNode } from 'react'
import type { Locale } from '@/shared/i18n'
import { SeoHead } from '@/shared'
import { HomeFooter } from '@/widgets/home-sections'

type PageShellProps = {
  children: ReactNode
  description: string
  locale: Locale
  noIndex?: boolean
  path: string
  showFooter?: boolean
  title: string
}

export function PageShell({
  children,
  description,
  locale,
  noIndex = false,
  path,
  showFooter = true,
  title,
}: PageShellProps) {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        locale={locale}
        path={path}
        noIndex={noIndex}
      />
      {children}

      {showFooter ? <HomeFooter /> : null}
    </>
  )
}
