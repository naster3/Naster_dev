import type { LucideIcon } from 'lucide-react'

export type QuickEvidenceItem = {
  icon: LucideIcon
  text: string
}

export type ProjectItem = {
  demoLabel?: string
  tag: string
  title: string
  problem: string
  role: string
  solution: string
  stack: string[]
  result: string
  metric: string
  coverImage?: string
  links?: {
    demo?: string
    repo?: string
    docs?: string
  }
}

export type AboutBlock = {
  title: string
  bullets: string[]
}

export type HeroSkillItem = {
  key: 'backend' | 'data' | 'front' | 'infra'
  label: string
}

export type HeroWorkItem = {
  description: string
  key: 'deliveries' | 'focus' | 'schedule'
  title: string
}

export type WorkValueCard = {
  key: string
  principle: string
  practice: string
  signal: string
}

export type HomeContent = {
  about: {
    blocks: AboutBlock[]
    credentials: string[]
    ctaCv: string
    ctaLinkedIn: string
    eyebrow: string
    story: string[]
    subtitle: string
    title: string
  }
  contact: {
    antiSpam: string
    ctaCv: string
    ctaLinkedIn: string
    form: {
      email: string
      message: string
      name: string
      projectType: string
      sending: string
      submit: string
    }
    options: {
      api: string
      data: string
      other: string
      web: string
    }
    status: {
      error: string
      missingEndpoint: string
      required: string
      sending: string
      success: string
    }
    subtitleCards: {
      calendly: string
      directEmail: string
      networks: string
      scheduleCall: string
    }
    title: string
  }
  footer: {
    evidence: string[]
    links: {
      cv: string
      docs: string
      github: string
    }
    title: string
  }
  hero: {
    avatarLabel: string
    avatarValue: string
    availability: string
    ctaCv: string
    ctaGithub: string
    eyebrow: string
    highlight: string
    subtitle: string
    typewriterName: string
    title: string
  }
  heroSkills: HeroSkillItem[]
  heroWorkSummary: HeroWorkItem[]
  projects: ProjectItem[]
  projectsSection: {
    ctaContact: string
    ctaCv: string
    ctaDocs: string
    ctaRepos: string
    fieldLabels: {
      context: string
      metric: string
      result: string
      role: string
      solution: string
    }
    linkLabels: {
      demo: string
      docs: string
      repo: string
    }
    mediaLabel: string
    subtitle: string
    title: string
  }
  quickEvidence: QuickEvidenceItem[]
  quickEvidenceSection: {
    subtitle: string
    title: string
  }
  values: {
    cards: WorkValueCard[]
    subtitle: string
    title: string
  }
}
