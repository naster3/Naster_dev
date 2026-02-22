export type Locale = 'en' | 'es'

export type SectionLinkKey = 'about' | 'contact' | 'home' | 'projects' | 'values'

type PageMeta = {
  description: string
  title: string
}

export type I18nMessages = {
  layout: {
    closeMenuAria: string
    cv: string
    github: string
    openMenuAria: string
  }
  nav: Record<SectionLinkKey, string>
  pages: {
    about: PageMeta
    contact: PageMeta
    home: PageMeta
    projects: PageMeta
    values: PageMeta
  }
}

export const i18nMessages: Record<Locale, I18nMessages> = {
  es: {
    layout: {
      closeMenuAria: 'Cerrar menu',
      cv: 'Ver CV',
      github: 'GitHub',
      openMenuAria: 'Abrir menu',
    },
    nav: {
      about: 'Sobre mi',
      contact: 'Contacto',
      home: 'Home',
      projects: 'Proyectos',
      values: 'Valores',
    },
    pages: {
      about: {
        description: 'Perfil profesional: enfoque, experiencia y forma de trabajo.',
        title: 'Sobre mi | Naster Dev',
      },
      contact: {
        description: 'Canales de contacto para proyectos web, APIs y data.',
        title: 'Contacto | Naster Dev',
      },
      home: {
        description: 'Portafolio personal: backend, APIs, data pipelines y frontend con React.',
        title: 'Naster Dev | Ingeniero de software Full stack',
      },
      projects: {
        description: 'Case studies de proyectos: problema, solucion, stack y resultados.',
        title: 'Proyectos | Naster Dev',
      },
      values: {
        description: 'Principios de trabajo: calidad, simplicidad y enfoque en resultados.',
        title: 'Valores | Naster Dev',
      },
    },
  },
  en: {
    layout: {
      closeMenuAria: 'Close menu',
      cv: 'View Resume',
      github: 'GitHub',
      openMenuAria: 'Open menu',
    },
    nav: {
      about: 'About',
      contact: 'Contact',
      home: 'Home',
      projects: 'Projects',
      values: 'Values',
    },
    pages: {
      about: {
        description: 'Professional profile: focus, experience and way of working.',
        title: 'About | Naster Dev',
      },
      contact: {
        description: 'Contact channels for web, API and data projects.',
        title: 'Contact | Naster Dev',
      },
      home: {
        description: 'Personal portfolio: backend, APIs, data pipelines and React frontend.',
        title: 'Naster Dev | Software Engineer Full Stack',
      },
      projects: {
        description: 'Project case studies: problem, solution, stack and outcomes.',
        title: 'Projects | Naster Dev',
      },
      values: {
        description: 'Working principles: quality, simplicity and focus on outcomes.',
        title: 'Values | Naster Dev',
      },
    },
  },
}
