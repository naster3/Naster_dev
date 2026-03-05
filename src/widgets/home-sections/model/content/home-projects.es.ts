import type { ProjectItem } from './types'

export const homeProjectsEs: ProjectItem[] = [
  {
    tag: 'Productividad',
    title: 'FocusTube Blocker',
    demoLabel: 'Extensión',
    coverImage: '/FocusTube_Blocker_portfolio_cover_iconsDecor.png',
    problem:
      'YouTube se vuelve una fuente de distracción durante sesiones de estudio o trabajo profundo.',
    role: 'Diseño e implementación de reglas de bloqueo, overlay UI y timer de enfoque.',
    solution:
      'Extensión que bloquea distracciones de forma inteligente y activa sesiones enfocadas con baja fricción.',
    stack: ['TypeScript', 'Chrome Extension', 'Storage local', 'UI por componentes'],
    result: 'Reduce tiempo perdido por bloqueo automático y flujo de uso claro.',
    metric:
      'Métrica clave: duración promedio de sesiones de enfoque y bloqueos automáticos activados por día.',
    links: {
      demo: 'https://github.com/naster3/FocusTube',
      repo: 'https://github.com/naster3/FocusTube',
    },
  },
  {
    isHidden: true,
    tag: 'Backend',
    title: 'API con autenticación JWT',
    coverImage: '/ecommer.png',
    problem: 'Backend seguro con acceso controlado y tokens con expiración.',
    role: 'Arquitectura por capas, autenticación y protección de recursos sensibles.',
    solution: 'Login JWT, middleware de autorización, expiración de token y endpoints por dominio.',
    stack: ['Python', 'Flask/FastAPI', 'JWT', 'SQLAlchemy', 'Postgres', 'Docker'],
    result: 'Seguridad consistente y código mantenible con separación de responsabilidades.',
    metric:
      'Métrica clave: tasa de errores 401/403, tiempo de integración de clientes y cobertura de endpoints protegidos.',
  },
  {
    tag: 'Frontend',
    title: 'Jensen Pharmaceutical (sitio web corporativo)',
    demoLabel: 'Sitio web',
    coverImage: '/jensen.png',
    problem:
      'El sitio necesitaba una experiencia más clara para presentar servicios, confianza de marca y contacto rápido.',
    role: 'Implementación frontend, estructura de secciones, mejoras visuales y optimización de navegación.',
    solution:
      'Interfaz enfocada en claridad de contenido, jerarquía visual y flujo directo hacia formularios de contacto.',
    stack: ['Frontend', 'React', 'TypeScript', 'Tailwind CSS', 'Diseño responsive'],
    result:
      'Navegación más simple, mensaje de marca más claro y experiencia más consistente en móvil y desktop.',
    metric:
      'Métrica clave: CTR hacia contacto, tiempo promedio por sesión y profundidad de navegación por sección.',
    links: {
      demo: 'https://jensenpharmaceutical.com/',
      repo: 'https://jensenpharmaceutical.com/',
      docs: 'https://jensenpharmaceutical.com/',
    },
  },
  {
    isHidden: true,
    tag: 'Data',
    title: 'Sistema de datos / DW',
    problem: 'Datos dispersos que frenaban reportes confiables y seguimiento de KPIs.',
    role: 'Modelado dimensional y pipeline ETL con controles de calidad.',
    solution: 'Pipeline staging -> DW -> marts con incrementales, validaciones y modelo estrella.',
    stack: ['SQL Server/Postgres', 'Modelado dimensional', 'ETL', 'Power BI/Excel'],
    result: 'Fuente de verdad única y mayor trazabilidad para analítica.',
    metric:
      'Métrica clave: tiempo de actualización de reportes, tasa de validaciones superadas y consistencia de KPIs.',
  },
]
