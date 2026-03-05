import type { ProjectItem } from './types'

export const homeProjectsEn: ProjectItem[] = [
  {
    tag: 'Productivity',
    title: 'FocusTube Blocker',
    demoLabel: 'Extension',
    coverImage: '/FocusTube_Blocker_portfolio_cover_iconsDecor.png',
    problem: 'YouTube becomes a major distraction during focused study or deep work sessions.',
    role: 'Designed and implemented blocking rules, overlay UI and focus timer behavior.',
    solution:
      'Browser extension that blocks distractions intelligently and enables focused sessions with low-friction UX.',
    stack: ['TypeScript', 'Chrome Extension', 'Local storage', 'Component-based UI'],
    result: 'Reduces wasted time with automatic blocking and a clear user flow.',
    metric:
      'Key metric: average focus-session length and number of automatic blocking events per day.',
    links: {
      demo: 'https://github.com/naster3/FocusTube',
      repo: 'https://github.com/naster3/FocusTube',
    },
  },
  {
    isHidden: true,
    tag: 'Backend',
    title: 'JWT Authentication API',
    coverImage: '/ecommer.png',
    problem: 'A secure backend was required with controlled access and expiring tokens.',
    role: 'Implemented layered architecture, authentication flow and protected resources.',
    solution:
      'JWT login, authorization middleware, token expiration handling and domain-based endpoints.',
    stack: ['Python', 'Flask/FastAPI', 'JWT', 'SQLAlchemy', 'Postgres', 'Docker'],
    result: 'Consistent security and maintainable code with clear separation of concerns.',
    metric:
      'Key metric: 401/403 error rate, client integration lead time, and protected-endpoint coverage.',
  },
  {
    tag: 'Frontend',
    title: 'Jensen Pharmaceutical (corporate website)',
    demoLabel: 'Website',
    coverImage: '/jensen.png',
    problem:
      'The website needed a clearer experience to present services, reinforce brand trust and speed up contact.',
    role: 'Frontend implementation, section structure, visual improvements and navigation optimization.',
    solution:
      'UI focused on content clarity, visual hierarchy and a direct flow towards contact forms.',
    stack: ['Frontend', 'React', 'TypeScript', 'Tailwind CSS', 'Responsive design'],
    result:
      'Simpler navigation, clearer brand messaging and a more consistent experience across mobile and desktop.',
    metric: 'Key metric: contact CTR, average session duration, and navigation depth per section.',
    links: {
      demo: 'https://jensenpharmaceutical.com/',
      repo: 'https://jensenpharmaceutical.com/',
      docs: 'https://jensenpharmaceutical.com/',
    },
  },
  {
    isHidden: true,
    tag: 'Data',
    title: 'Data system / DW',
    problem: 'Scattered data was slowing down trustworthy reporting and KPI tracking.',
    role: 'Built dimensional models and an ETL pipeline with quality controls.',
    solution: 'Staging -> DW -> marts pipeline with incrementals, validation and star schema.',
    stack: ['SQL Server/Postgres', 'Dimensional modeling', 'ETL', 'Power BI/Excel'],
    result: 'Single source of truth with better traceability for analytics.',
    metric:
      'Key metric: reporting refresh time, validation pass rate, and KPI consistency across marts.',
  },
]
