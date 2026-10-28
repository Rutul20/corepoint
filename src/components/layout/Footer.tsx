import { Link } from 'react-router-dom'
import { siteConfig, telHref } from '../../config/site'
import { auraChairs } from '../../data/chairs'
import { Container } from '../ui/Container'
import { Logo } from './Logo'

const linkClass = 'text-sm text-muted transition-colors hover:text-ink'

export function Footer() {
  const { contact, registration, social } = siteConfig
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-mist">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo />
          <p className="eyebrow mt-6 text-accent">{siteConfig.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.descriptor}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {contact.googleProfile && (
              <li>
                <a className={linkClass} href={contact.googleProfile} target="_blank" rel="noopener noreferrer">
                  Google profile
                </a>
              </li>
            )}
            {contact.indiamartProfile && (
              <li>
                <a className={linkClass} href={contact.indiamartProfile} target="_blank" rel="noopener noreferrer">
                  IndiaMART
                </a>
              </li>
            )}
            {social.map((link) => (
              <li key={link.href}>
                <a className={linkClass} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Products" className="lg:col-span-2">
          <h2 className="eyebrow text-ink">Products</h2>
          <ul className="mt-5 space-y-3">
            {auraChairs.map((chair) => (
              <li key={chair.id}>
                <Link to={`/dental-chairs/${chair.slug}`} className={linkClass}>
                  {chair.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/dental-chairs" className={linkClass}>
                All dental chairs
              </Link>
            </li>
            <li>
              <Link to="/compare" className={linkClass}>
                Compare chairs
              </Link>
            </li>
            <li>
              <Link to="/equipment" className={linkClass}>
                Dental equipment
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className="eyebrow text-ink">Company</h2>
          <ul className="mt-5 space-y-3">
            {[
              ['/about', 'About us'],
              ['/services', 'Services'],
              ['/gallery', 'Gallery'],
              ['/contact', 'Contact'],
              ['/privacy', 'Privacy policy'],
              ['/terms', 'Terms and conditions'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-4">
          <h2 className="eyebrow text-ink">Contact</h2>
          <address className="mt-5 grid gap-6 text-sm not-italic text-muted sm:grid-cols-2">
            <div className="space-y-2">
              {contact.phones.map((phone) => (
                <p key={phone.display}>
                  <span className="block text-xs text-muted">{phone.person ? `${phone.label} · ${phone.person}` : phone.label}</span>
                  <a className="font-medium text-ink hover:text-accent" href={telHref(phone.display)}>
                    {phone.display}
                  </a>
                </p>
              ))}
              <p className="pt-1">
                <a className="break-all font-medium text-ink hover:text-accent" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </p>
            </div>
            <div className="space-y-4">
              {contact.addresses.map((address) => (
                <p key={address.label}>
                  <span className="block text-xs font-semibold text-ink">{address.label}</span>
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </address>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          {registration.gstin && <p>GSTIN {registration.gstin}</p>}
        </Container>
      </div>
    </footer>
  )
}
