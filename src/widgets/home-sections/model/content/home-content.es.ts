import { Database, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { homeProjectsEs } from './home-projects.es'
import type { HomeContent, QuickEvidenceItem } from './types'

const quickEvidence: QuickEvidenceItem[] = [
  {
    icon: ShieldCheck,
    text: 'Backend: Python, Flask, SQLAlchemy, JWT',
  },
  {
    icon: Database,
    text: 'Data: SQL, ETL/ELT, Postgres, modelado dimensional',
  },
  {
    icon: Sparkles,
    text: 'Frontend: React, TypeScript, Tailwind, Framer Motion',
  },
  {
    icon: Layers3,
    text: 'Infra y tooling: Docker, Git/GitHub, CI/CD, Vitest',
  },
]

export const homeContentEs: HomeContent = {
  about: {
    blocks: [
      {
        title: 'Comunicación y colaboración',
        bullets: [
          'Explico ideas complejas en lenguaje claro para negocio y equipos mixtos.',
          'Trabajo bien en remoto: acuerdos claros, feedback rápido y seguimiento continuo.',
          'Colaboro con producto y diseño para priorizar impacto sobre ruido.',
        ],
      },
      {
        title: 'Ejecución y ownership',
        bullets: [
          'Me hago cargo de entregas de punta a punta con criterio y responsabilidad.',
          'Mantengo foco en calidad: orden, documentación y decisiones sostenibles.',
          'Me adapto rápido a cambios sin perder claridad en objetivos.',
        ],
      },
    ],
    credentials: [
      'Comunicación efectiva',
      'Trabajo en equipo',
      'Pensamiento crítico',
      'Responsabilidad',
      'Adaptabilidad',
    ],
    ctaCv: 'Ver CV',
    ctaLinkedIn: 'LinkedIn',
    eyebrow: 'Habilidades blandas',
    story: [
      'Vengo de RD y disfruto convertir ideas complejas en sistemas útiles.',
      'Me enfoco en software fácil de mantener y listo para crecer.',
      'Aporto claridad: traduzco problemas del negocio a decisiones técnicas simples.',
      'Trabajo con calidad, comunicación directa y entregas por iteraciones.',
    ],
    subtitle:
      'Más allá de lo técnico, aporto comunicación clara, colaboración efectiva y enfoque en resultados para equipos remotos y multidisciplinarios.',
    title: 'Sobre mí',
  },
  contact: {
    antiSpam: 'No comparto tu info. Solo la uso para responderte.',
    ctaCv: 'Ver CV',
    ctaLinkedIn: 'LinkedIn',
    form: {
      email: 'Email',
      message: 'Mensaje',
      name: 'Nombre',
      projectType: 'Tipo de proyecto',
      sending: 'Enviando...',
      submit: 'Enviar',
    },
    options: {
      api: 'API',
      data: 'Data',
      other: 'Otro',
      web: 'Web',
    },
    status: {
      error: 'No se pudo enviar el mensaje. Intenta de nuevo en unos minutos.',
      missingEndpoint: 'Formulario temporalmente no disponible. Escríbeme al email directo.',
      required: 'Completa nombre, email y mensaje antes de enviar.',
      sending: 'Enviando mensaje...',
      success: 'Mensaje enviado correctamente. Te responderé pronto.',
    },
    subtitleCards: {
      calendly: 'Calendly',
      directEmail: 'Email directo',
      networks: 'Redes',
      scheduleCall: 'Agendar llamada',
    },
    title: 'Contacto',
  },
  footer: {
    evidence: [
      'GitHub: repos públicos, commits recientes y READMEs claros',
      'Demos: Vercel, Netlify o VPS',
      'Docs: diagramas, endpoints y decisiones técnicas',
      'Automatización: scripts y utilidades que reducen trabajo manual',
    ],
    links: {
      cv: 'CV',
      docs: 'Docs',
      github: 'GitHub',
    },
    title: 'Evidencia',
  },
  hero: {
    avatarLabel: 'Avatar',
    avatarValue: 'Foto de perfil',
    availability: 'Disponible remoto - GMT-4',
    ctaCv: 'Ver CV',
    ctaGithub: 'GitHub',
    eyebrow: 'Backend / Full-stack',
    highlight: 'Impulso equipos remotos con software: APIs, data y UI.',
    subtitle:
      'Me especializo en sistemas, APIs y desarrollo web. Busco roles de backend o full-stack en equipos que valoran producto y calidad.',
    typewriterName: 'Manuel Adolfo Deño de los Santos',
    title: 'Ingeniero de software Full stack',
  },
  heroSkills: [
    { key: 'backend', label: 'Backend: Flask + SQLAlchemy' },
    { key: 'data', label: 'Data: SQL + ETL + Postgres' },
    { key: 'infra', label: 'Infra: Docker + CI/CD' },
    { key: 'front', label: 'Front: React + Tailwind' },
  ],
  heroWorkSummary: [
    {
      key: 'deliveries',
      title: 'Entregas',
      description: 'Iteraciones semanales con demo y feedback.',
    },
    {
      key: 'schedule',
      title: 'Horario',
      description: 'Lun-Vie, 9:00 AM - 6:00 PM (GMT-4).',
    },
    {
      key: 'focus',
      title: 'Trabajo en',
      description: 'APIs, integraciones, automatización y dashboards.',
    },
  ],
  projects: homeProjectsEs,
  projectsSection: {
    ctaContact: 'Contacto',
    ctaCv: 'Ver CV',
    ctaDocs: 'Docs',
    ctaRepos: 'Ver repos',
    fieldLabels: {
      context: 'Contexto:',
      metric: 'Métrica:',
      result: 'Resultado:',
      role: 'Tu rol:',
      solution: 'Solución:',
    },
    linkLabels: {
      demo: 'Demo',
      docs: 'Docs',
      repo: 'Repo',
    },
    mediaLabel: 'Case Study',
    subtitle: 'Mini case studies: contexto, solución, stack y resultado.',
    title: 'Proyectos destacados',
  },
  quickEvidence,
  quickEvidenceSection: {
    subtitle: 'Estas son mis habilidades duras y stacks técnicos de trabajo.',
    title: 'Habilidades duras',
  },
  values: {
    cards: [
      {
        key: 'calidad-operable',
        principle: 'Calidad operable',
        practice: 'Defino contratos claros, pruebas clave y manejo de errores antes de escalar.',
        signal: 'Menos incidencias en producción y despliegues más predecibles.',
      },
      {
        key: 'simplicidad-decision',
        principle: 'Simplicidad con criterio',
        practice: 'Elijo la solución más simple que cumple el objetivo del producto.',
        signal: 'Onboarding más rápido y menor costo de mantenimiento.',
      },
      {
        key: 'medicion-negocio',
        principle: 'Medir para decidir',
        practice: 'Trabajo con métricas técnicas y de negocio para iterar con evidencia.',
        signal: 'Decisiones más rápidas y prioridades mejor alineadas.',
      },
    ],
    subtitle: 'Tres principios de ejecución para construir software útil y mantenible.',
    title: 'Valores de trabajo',
  },
}
