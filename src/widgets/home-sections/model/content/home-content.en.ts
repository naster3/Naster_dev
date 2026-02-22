import { Database, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import type { HomeContent, QuickEvidenceItem } from './types'

const quickEvidence: QuickEvidenceItem[] = [
  {
    icon: ShieldCheck,
    text: 'Backend: Python, Flask, SQLAlchemy, JWT',
  },
  {
    icon: Database,
    text: 'Data: SQL, ETL/ELT, Postgres, dimensional modeling',
  },
  {
    icon: Sparkles,
    text: 'Frontend: React, TypeScript, Tailwind, Framer Motion',
  },
  {
    icon: Layers3,
    text: 'Infra and tooling: Docker, Git/GitHub, CI/CD, Vitest',
  },
]

export const homeContentEn: HomeContent = {
  about: {
    blocks: [
      {
        title: 'Communication and collaboration',
        bullets: [
          'I explain complex topics in clear language for business and mixed teams.',
          'I work effectively in remote setups with clear agreements and fast feedback.',
          'I collaborate with product and design to prioritize impact over noise.',
        ],
      },
      {
        title: 'Execution and ownership',
        bullets: [
          'I take end-to-end ownership of deliverables with accountability.',
          'I keep quality high through structure, documentation and clear decisions.',
          'I adapt quickly to change while keeping goals and priorities clear.',
        ],
      },
    ],
    credentials: [
      'Clear communication',
      'Teamwork',
      'Critical thinking',
      'Ownership mindset',
      'Adaptability',
    ],
    ctaCv: 'View Resume',
    ctaLinkedIn: 'LinkedIn',
    eyebrow: 'Soft skills',
    story: [
      'I come from the Dominican Republic and enjoy turning complex ideas into useful systems.',
      'I focus on software that is easy to maintain and ready to scale.',
      'I bring clarity by translating business problems into simple technical decisions.',
      'I work with quality, clear communication and iterative delivery.',
    ],
    subtitle:
      'Beyond technical execution, I bring clear communication, effective collaboration and outcome-driven delivery for remote and cross-functional teams.',
    title: 'About me',
  },
  contact: {
    antiSpam: "I don't share your data. I only use it to reply to you.",
    ctaCv: 'View Resume',
    ctaLinkedIn: 'LinkedIn',
    form: {
      email: 'Email',
      message: 'Message',
      name: 'Name',
      projectType: 'Project type',
      sending: 'Sending...',
      submit: 'Send',
    },
    options: {
      api: 'API',
      data: 'Data',
      other: 'Other',
      web: 'Web',
    },
    status: {
      error: 'The message could not be sent. Please try again in a few minutes.',
      missingEndpoint: 'VITE_CONTACT_FORM_ENDPOINT is missing in your environment.',
      required: 'Complete name, email and message before sending.',
      sending: 'Sending message...',
      success: 'Message sent successfully. I will reply soon.',
    },
    subtitleCards: {
      calendly: 'Calendly',
      directEmail: 'Direct email',
      networks: 'Networks',
      scheduleCall: 'Schedule a call',
    },
    title: 'Contact',
  },
  footer: {
    evidence: [
      'GitHub: public repos, recent commits and clear READMEs',
      'Demos: Vercel, Netlify or VPS',
      'Docs: diagrams, endpoints and technical decisions',
      'Automation: scripts and utilities to reduce manual work',
    ],
    links: {
      cv: 'Resume',
      docs: 'Docs',
      github: 'GitHub',
    },
    title: 'Evidence',
  },
  hero: {
    avatarLabel: 'Avatar',
    avatarValue: 'Placeholder',
    availability: 'Available remote - GMT-4',
    ctaCv: 'View Resume',
    ctaGithub: 'GitHub',
    eyebrow: 'Backend / Full-stack',
    highlight: 'I help remote teams ship software: APIs, data and UI.',
    subtitle:
      'I specialize in systems, APIs and data pipelines. I am looking for backend or full-stack roles in product-driven teams.',
    typewriterName: 'Manuel Adolfo Deño de los Santos',
    title: 'Software Engineer (Python/React)',
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
      title: 'Deliveries',
      description: 'Weekly iterations with demos and direct feedback.',
    },
    {
      key: 'schedule',
      title: 'Working hours',
      description: 'Mon-Fri, 9:00 AM - 6:00 PM (GMT-4).',
    },
    {
      key: 'focus',
      title: 'I work on',
      description: 'APIs, integrations, automation and dashboards.',
    },
  ],
  projects: [
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
      metric: 'Placeholder: from ~X min/day down to ~Y min/day for Z weeks.',
      links: {
        demo: 'https://github.com/naster3/FocusTube',
        repo: 'https://github.com/naster3/FocusTube',
      },
    },
    {
      tag: 'Backend',
      title: 'JWT Authentication API',
      problem: 'A secure backend was required with controlled access and expiring tokens.',
      role: 'Implemented layered architecture, authentication flow and protected resources.',
      solution:
        'JWT login, authorization middleware, token expiration handling and domain-based endpoints.',
      stack: ['Python', 'Flask/FastAPI', 'JWT', 'SQLAlchemy', 'Postgres', 'Docker'],
      result: 'Consistent security and maintainable code with clear separation of concerns.',
      metric: 'Placeholder: auth errors reduced by X% and integration time by Y hours.',
    },
    {
      tag: 'Data',
      title: 'Data system / DW',
      problem: 'Scattered data was slowing down trustworthy reporting and KPI tracking.',
      role: 'Built dimensional models and an ETL pipeline with quality controls.',
      solution: 'Staging -> DW -> marts pipeline with incrementals, validation and star schema.',
      stack: ['SQL Server/Postgres', 'Dimensional modeling', 'ETL', 'Power BI/Excel'],
      result: 'Single source of truth with better traceability for analytics.',
      metric: 'Placeholder: reporting time dropped from X to Y and queries improved by X%.',
    },
  ],
  projectsSection: {
    ctaContact: 'Contact',
    ctaCv: 'View Resume',
    ctaDocs: 'Docs',
    ctaRepos: 'View repos',
    fieldLabels: {
      context: 'Context:',
      metric: 'Metric:',
      result: 'Result:',
      role: 'Your role:',
      solution: 'Solution:',
    },
    linkLabels: {
      demo: 'Demo',
      docs: 'Docs',
      repo: 'Repo',
    },
    mediaLabel: 'Case Study',
    subtitle: 'Mini case studies: context, solution, stack and outcome.',
    title: 'Featured projects',
  },
  quickEvidence,
  quickEvidenceSection: {
    subtitle: 'These are my hard skills and technical stacks.',
    title: 'Hard skills',
  },
  values: {
    cards: [
      {
        key: 'operational-quality',
        principle: 'Operational quality',
        practice: 'I define clear contracts, key tests and error handling before scaling.',
        signal: 'Fewer production incidents and more predictable releases.',
      },
      {
        key: 'simplicity-with-purpose',
        principle: 'Simplicity with purpose',
        practice: 'I choose the simplest solution that still meets the product goal.',
        signal: 'Faster onboarding and lower long-term maintenance cost.',
      },
      {
        key: 'measure-to-decide',
        principle: 'Measure to decide',
        practice: 'I use technical and business metrics to iterate with evidence.',
        signal: 'Quicker decisions and better aligned priorities.',
      },
    ],
    subtitle: 'Three execution principles I use to build useful, maintainable software.',
    title: 'Work values',
  },
}
