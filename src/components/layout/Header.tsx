import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { siteConfig, telHref } from '../../config/site'
import { enquiryHref } from '../../data/enquiry'
import { useDialog } from '../../hooks/useDialog'
import { useScrolled } from '../../hooks/useScrolled'
import { buttonClasses } from '../../utils/buttonClasses'
import { cn } from '../../utils/cn'
import { Container } from '../ui/Container'
import { Logo } from './Logo'
import { navItems } from './navigation'

export function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useDialog(menuRef, menuOpen, closeMenu)

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMenuOpen(false)
  }
  useEffect(() => {
    if (!menuOpen) return
    const close = () => window.innerWidth >= 1024 && setMenuOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [menuOpen])

  const solid = scrolled || menuOpen || !onHome
  const officePhone = siteConfig.contact.phones[0]

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[border-color] duration-500 ease-premium',
        solid ? 'border-line' : 'border-transparent',
      )}
    >
      {/* Frosted background on its own layer: a backdrop-filter on <header> itself would trap the
          fixed-position mobile menu inside the header's 64 px instead of the full screen. */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 -z-10 transition-[background-color] duration-500 ease-premium',
          solid ? 'bg-white/90 backdrop-blur-xl' : 'bg-transparent',
        )}
      />
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'relative rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors duration-300',
                      isActive ? 'text-ink' : 'text-muted hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-premium',
                          isActive ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref(officePhone.display)}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold text-ink hover:bg-ink/5 xl:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {officePhone.display}
          </a>
          {/* On phones this lives in the menu instead, so the menu button always fits. */}
          <Link to={enquiryHref('demo', 'aura-500')} className={buttonClasses('primary', 'sm', 'max-sm:hidden')}>
            Request a Demo
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-line bg-white lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Container className="flex min-h-full flex-col py-6">
              <nav aria-label="Mobile">
                <ul className="divide-y divide-line">
                  {[...navItems, { to: '/compare', label: 'Compare chairs' }].map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={'end' in item ? item.end : false}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          cn('flex items-center justify-between py-4 text-xl font-semibold tracking-[-0.02em]', isActive ? 'text-accent' : 'text-ink')
                        }
                      >
                        {item.label}
                        <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-8 grid gap-3">
                <Link to={enquiryHref('demo', 'aura-500')} onClick={closeMenu} className={buttonClasses('primary', 'lg', 'w-full')}>
                  Request a Demo
                </Link>
                <a href={telHref(officePhone.display)} className={buttonClasses('secondary', 'lg', 'w-full')}>
                  <Phone className="h-4 w-4" aria-hidden="true" /> Call {officePhone.display}
                </a>
              </div>
            </Container>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
