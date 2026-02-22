import type { LucideIcon } from 'lucide-react'
import { Database, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import type { Locale } from '@/shared/i18n'

export type SkillCardKey = 'backend' | 'data' | 'front' | 'infra'

export type SkillCard = {
  accent: 'accent' | 'brand'
  bullets: [string, string]
  icon: LucideIcon
  key: SkillCardKey
  stackLine: string
  title: string
}

export type SkillsContent = {
  toolbox: {
    items: string[]
    title: string
  }
  work: {
    subtitle: string
    title: string
  }
  cards: SkillCard[]
}

export const skillsByLocale: Record<Locale, SkillsContent> = {
  es: {
    cards: [
      {
        accent: 'brand',
        bullets: [
          'Diseño APIs REST con validación y capas limpias.',
          'Trabajo con SQL Server/PostgreSQL y pruebas con pytest.',
        ],
        icon: ShieldCheck,
        key: 'backend',
        stackLine: 'Python, Django/Flask, SQLAlchemy, Django ORM, pytest',
        title: 'Backend',
      },
      {
        accent: 'brand',
        bullets: [
          'Diseño y optimizo capas de datos para servicios backend.',
          'Trabajo con SQL Server y PostgreSQL para esquemas de servicios estables.',
        ],
        icon: Database,
        key: 'data',
        stackLine: 'Base de datos: SQL Server, PostgreSQL, SQL, Migraciones',
        title: 'Base de datos',
      },
      {
        accent: 'accent',
        bullets: [
          'Desarrollo interfaces claras, accesibles y reutilizables.',
          'Integro UI con APIs reales y feedback de producto.',
        ],
        icon: Sparkles,
        key: 'front',
        stackLine: 'React, TypeScript, Tailwind, Framer Motion',
        title: 'Front',
      },
      {
        accent: 'accent',
        bullets: [
          'Empaqueto servicios y estandarizo entornos.',
          'Automatizo checks de calidad y despliegues.',
        ],
        icon: Layers3,
        key: 'infra',
        stackLine: 'Docker, Git/GitHub, CI/CD, observabilidad básica',
        title: 'Infra',
      },
    ],
    toolbox: {
      items: [
        'Git',
        'GitHub Actions',
        'CI/CD',
        'Pytest',
        'Postman',
        'OpenAPI/Swagger',
        'ESLint',
        'Prettier',
        'Docker',
        'Docker Compose',
      ],
      title: 'Toolbox',
    },
    work: {
      subtitle: 'Entregas claras, comunicación directa y foco en impacto.',
      title: 'Cómo trabajo',
    },
  },
  en: {
    cards: [
      {
        accent: 'brand',
        bullets: [
          'I design REST APIs with auth, validation and clean layering.',
          'I write tests and handle failures for stable operation.',
        ],
        icon: ShieldCheck,
        key: 'backend',
        stackLine: 'Python, Flask/FastAPI, SQLAlchemy, JWT',
        title: 'Backend',
      },
      {
        accent: 'brand',
        bullets: [
          'I design and optimize data layers for backend services.',
          'I work with SQL Server and PostgreSQL for stable REST APIs.',
        ],
        icon: Database,
        key: 'data',
        stackLine: 'Backend + Databases: SQL Server, PostgreSQL, SQL, ORMs',
        title: 'Backend (Databases)',
      },
      {
        accent: 'accent',
        bullets: [
          'I build clear, accessible and reusable interfaces.',
          'I connect UI to real APIs with product feedback loops.',
        ],
        icon: Sparkles,
        key: 'front',
        stackLine: 'React, TypeScript, Tailwind, Framer Motion',
        title: 'Front',
      },
      {
        accent: 'accent',
        bullets: [
          'I package services and standardize environments.',
          'I automate quality checks and deployments.',
        ],
        icon: Layers3,
        key: 'infra',
        stackLine: 'Docker, Git/GitHub, CI/CD, basic observability',
        title: 'Infra',
      },
    ],
    toolbox: {
      items: [
        'Git',
        'GitHub Actions',
        'CI/CD',
        'Pytest',
        'Postman',
        'OpenAPI/Swagger',
        'ESLint',
        'Prettier',
        'Docker',
        'Docker Compose',
        'SQL Server',
        'PostgreSQL',
      ],
      title: 'Toolbox',
    },
    work: {
      subtitle: 'Clear delivery, direct communication and impact focus.',
      title: 'How I work',
    },
  },
}
