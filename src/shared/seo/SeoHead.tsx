import { Helmet } from 'react-helmet-async'
import type { Locale } from '@/shared/i18n'

type SeoHeadProps = {
  description: string
  imagePath?: string
  locale: Locale
  noIndex?: boolean
  path: string
  title: string
  type?: 'article' | 'website'
}

const DEFAULT_IMAGE_PATH = '/foto%20de%20perfil.png'
const DEFAULT_SITE_NAME = 'Naster Dev'

function getSiteOrigin() {
  const configured = import.meta.env.VITE_SITE_URL?.trim()
  if (configured) {
    return configured.replace(/\/+$/, '')
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }

  return 'https://naster.dev'
}

function toAbsoluteUrl(origin: string, value: string) {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`
  return `${origin}${normalizedPath}`
}

export function SeoHead({
  description,
  imagePath = DEFAULT_IMAGE_PATH,
  locale,
  noIndex = false,
  path,
  title,
  type = 'website',
}: SeoHeadProps) {
  const origin = getSiteOrigin()
  const canonicalUrl = toAbsoluteUrl(origin, path)
  const imageUrl = toAbsoluteUrl(origin, imagePath)
  const localeTag = locale === 'es' ? 'es_DO' : 'en_US'
  const alternateLocaleTag = locale === 'es' ? 'en_US' : 'es_DO'
  const languageCode = locale === 'es' ? 'es' : 'en'

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: languageCode,
  }

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Manuel Adolfo Deno de los Santos',
    url: origin,
    jobTitle: 'Software Engineer',
    knowsAbout: ['Backend', 'APIs', 'Data pipelines', 'React', 'TypeScript', 'Python'],
  }

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}

      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={localeTag} />
      <meta property="og:locale:alternate" content={alternateLocaleTag} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(webPageJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
    </Helmet>
  )
}
