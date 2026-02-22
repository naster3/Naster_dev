import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/shared/lib'

type NavItemProps = {
  children: ReactNode
  to: string
  onClick?: () => void
}

export function NavItem({ children, to, onClick }: NavItemProps) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'inline-flex rounded-full px-3 py-2 text-sm font-medium transition',
        isActive
          ? 'bg-(--brand-ink) text-white'
          : 'text-(--text-soft) hover:bg-white/70 hover:text-(--text-main)',
      )}
    >
      {children}
    </Link>
  )
}
