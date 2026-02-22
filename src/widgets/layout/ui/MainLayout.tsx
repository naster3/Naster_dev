import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { portfolioLinks, useI18n } from '@/shared'
import { cn } from '@/shared/lib'
import { NavItem } from '@/shared/ui/navigation'
import { sectionLinks } from '../model'

type MainLayoutProps = {
  children: ReactNode
}

const headerReveal = {
  hidden: { opacity: 0, y: -14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const navReveal = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delayChildren: 0.03, staggerChildren: 0.035, duration: 0.22 },
  },
}

const navItemReveal = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.17 } },
}

const rightActionsReveal = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { delay: 0.05, duration: 0.2 } },
}

const mobileMenuReveal = {
  closed: { opacity: 0, y: -8, scaleY: 0.96 },
  open: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { messages } = useI18n()
  const isHomeRoute = location.pathname === '/'

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-144 w-xl rounded-full bg-[radial-gradient(circle,var(--brand-mist),transparent_68%)]" />
        <div className="absolute bottom-[-12%] right-[-12%] h-136 w-136 rounded-full bg-[radial-gradient(circle,var(--accent-mist),transparent_70%)]" />
      </div>

      <motion.header
        variants={headerReveal}
        initial="hidden"
        animate="show"
        className="group/header sticky top-0 z-50 border-b border-(--border-soft) bg-(--bg-glass) backdrop-blur-xl transition-[background-color,box-shadow] duration-300 hover:bg-white/95 hover:shadow-[0_12px_30px_-24px_rgb(25_36_47/0.65)]"
      >
        <div className="mx-auto flex h-18 w-full max-w-300 items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-(--text-main) transition-colors duration-200 hover:text-(--brand-ink)"
          >
            <motion.span
              whileHover={{ scale: 1.06, rotate: -8 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 340, damping: 24 }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border-soft) bg-white p-1"
            >
              <img
                src="/rocket_icon_pack/rocket_32x32.png"
                alt="Naster Dev logo"
                loading="eager"
                decoding="async"
                className="h-6 w-6 object-contain"
              />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04, duration: 0.2 }}
              className="text-sm font-semibold uppercase tracking-[0.18em]"
            >
              Naster Dev
            </motion.span>
          </Link>

          <motion.nav
            variants={navReveal}
            initial="hidden"
            animate="show"
            className="hidden items-center gap-1 rounded-full border border-(--border-soft) bg-white/70 p-1 transition-[border-color,box-shadow] duration-200 group-hover/header:border-(--brand-mist) group-hover/header:shadow-[0_10px_28px_-24px_rgb(25_36_47/0.72)] md:flex"
          >
            {sectionLinks.map((item) => (
              <motion.div key={item.to} variants={navItemReveal} whileHover={{ y: -1 }}>
                <NavItem to={item.to} onClick={() => setIsMobileMenuOpen(false)}>
                  {messages.nav[item.labelKey]}
                </NavItem>
              </motion.div>
            ))}
          </motion.nav>

          <motion.div
            variants={rightActionsReveal}
            initial="hidden"
            animate="show"
            className="hidden items-center gap-3 md:flex"
          >
            <motion.a
              href={portfolioLinks.github}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -1 }}
              className="text-sm font-semibold text-(--text-soft) underline-offset-4 transition-colors hover:text-(--text-main) hover:underline"
            >
              {messages.layout.github}
            </motion.a>
          </motion.div>

          <div className="flex items-center gap-2 md:hidden">
            <motion.button
              type="button"
              aria-label={
                isMobileMenuOpen ? messages.layout.closeMenuAria : messages.layout.openMenuAria
              }
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.92 }}
              className="rounded-full border border-(--border-soft) bg-white p-2 text-(--text-main) transition-[background-color,border-color] hover:border-(--brand-mist) hover:bg-(--brand-mist)"
            >
              <motion.span
                animate={{ rotate: isMobileMenuOpen ? 90 : 0, scale: isMobileMenuOpen ? 1.06 : 1 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen ? (
            <motion.div
              variants={mobileMenuReveal}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.14 }}
              className="origin-top border-t border-(--border-soft) bg-white px-4 py-3 md:hidden"
            >
              <motion.nav
                variants={navReveal}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-1"
              >
                {sectionLinks.map((item) => (
                  <motion.div key={item.to} variants={navItemReveal} whileHover={{ x: 2 }}>
                    <NavItem to={item.to} onClick={() => setIsMobileMenuOpen(false)}>
                      {messages.nav[item.labelKey]}
                    </NavItem>
                  </motion.div>
                ))}
              </motion.nav>
              <motion.a
                href={portfolioLinks.github}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03, duration: 0.14 }}
                className="mt-3 inline-block text-sm font-semibold text-(--text-soft) underline-offset-4 transition-colors hover:text-(--text-main) hover:underline"
              >
                {messages.layout.github}
              </motion.a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <div
        className={cn(
          'mx-auto flex w-full max-w-300 flex-1 flex-col px-4 md:px-6 [&>main]:flex-1',
          isHomeRoute ? 'pb-10 pt-0 md:pb-16 md:pt-0' : 'py-10 md:py-16',
        )}
      >
        {children}
      </div>
    </div>
  )
}
