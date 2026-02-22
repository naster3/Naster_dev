import type { Locale } from '@/shared/i18n'
import { homeContentEn } from './home-content.en'
import { homeContentEs } from './home-content.es'
import type { HomeContent } from './types'

export * from './types'

export const homeContentByLocale: Record<Locale, HomeContent> = {
  es: homeContentEs,
  en: homeContentEn,
}
