import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { buttonClasses } from '../../utils/buttonClasses'
import { cn } from '../../utils/cn'
import { ProductImage } from '../product/ProductImage'

interface ChairCardProps {
  chair: Product
  /** Larger card with more facts, for the flagship. */
  featured?: boolean
  className?: string
}

export function ChairCard({ chair, featured = false, className }: ChairCardProps) {
  const variant = chair.variants[0]
  const href = `/dental-chairs/${chair.slug}`
  const facts = [chair.facts.light, chair.facts.programs, chair.facts.delivery].filter(Boolean).slice(0, featured ? 3 : 2)

  return (
    <article className={cn('group flex h-full flex-col overflow-hidden border border-line bg-white', className)}>
      <Link to={href} tabIndex={-1} aria-hidden="true" className={cn('block overflow-hidden bg-mist', featured ? 'aspect-[3/2]' : 'aspect-[4/3]')}>
        <div className="h-full w-full transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]">
          <ProductImage
            image={variant.image}
            fit={variant.image.onWhite ? 'contain' : 'cover'}
            blend
            sizes={featured ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {chair.series && (
            <span className="eyebrow rounded-sm bg-accent/10 px-2 py-1 text-[10px] text-accent-deep">{chair.series} series</span>
          )}
          {chair.variants.length > 1 && (
            <span className="eyebrow rounded-sm bg-mist px-2 py-1 text-[10px] text-muted">{chair.variants.length} versions</span>
          )}
          {!chair.ownLabel && <span className="eyebrow rounded-sm bg-mist px-2 py-1 text-[10px] text-muted">{chair.brand}</span>}
        </div>
        <h3 className={cn('mt-3 font-semibold tracking-[-0.02em] text-ink', featured ? 'text-3xl' : 'text-xl')}>
          <Link to={href} className="hover:text-accent">
            {chair.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-ink-soft">{chair.tagline}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{chair.summary}</p>
        {facts.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-[13px] text-ink-soft">
            {facts.map((fact) => (
              <li key={fact} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tech" />
                {fact}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <Link to={href} className={buttonClasses('primary', 'sm')}>
            View details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
