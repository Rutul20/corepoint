export interface NavItem {
  to: string
  label: string
  /** Match only the exact path (for Home). */
  end?: boolean
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/dental-chairs', label: 'Dental Chairs' },
  { to: '/equipment', label: 'Equipment' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]
