import type { SectionLinkKey } from '@/shared/i18n'

export const sectionLinks = [
  { to: '/', labelKey: 'home' },
  { to: '/proyectos', labelKey: 'projects' },
  { to: '/sobre-mi', labelKey: 'about' },
  { to: '/valores', labelKey: 'values' },
  { to: '/contacto', labelKey: 'contact' },
] as const satisfies ReadonlyArray<{
  labelKey: SectionLinkKey
  to: string
}>
