import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Container } from './Container'
import { Reveal } from './Reveal'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-line-strong" aria-hidden="true" />}
            {item.to ? (
              <Link to={item.to} className="hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface PageHeaderProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  crumbs: Crumb[]
  actions?: ReactNode
  className?: string
}

/** Title band at the top of inner pages. */
export function PageHeader({ eyebrow, title, description, crumbs, actions, className }: PageHeaderProps) {
  return (
    <section className={cn('studio-backdrop border-b border-line pb-14 pt-28 sm:pb-16 lg:pt-36', className)}>
      <Container>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, ...crumbs]} />
        <Reveal className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow flex items-center gap-3 text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              {eyebrow}
            </p>
            <h1 className="mt-5 text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.035em] text-balance sm:text-5xl lg:text-[3.6rem]">{title}</h1>
            {description && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted text-pretty">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
        </Reveal>
      </Container>
    </section>
  )
}
