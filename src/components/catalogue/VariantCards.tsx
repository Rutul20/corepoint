import { ArrowUp, Check } from 'lucide-react'
import type { Product } from '../../types/product'
import { cn } from '../../utils/cn'
import { ProductImage } from '../product/ProductImage'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

interface VariantCardsProps {
  product: Product
  activeId: string
  /** Called with the chosen version; the page shows that version's photos and specification. */
  onSelect: (id: string) => void
}

/** "One flagship, two ways to work": one card per version of a chair. */
export function VariantCards({ product, activeId, onSelect }: VariantCardsProps) {
  return (
    <section id="versions" aria-labelledby="versions-title" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="versions-title"
          eyebrow={product.name}
          title="One flagship, two ways to work."
          description="Choose the delivery unit that suits your surgery: a mobile trolley that moves where you need it, or a compact over-arm unit with an assistant arm."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {product.variants.map((variant, index) => {
            const active = variant.id === activeId
            return (
              <Reveal key={variant.id} delay={index * 0.08}>
                <button
                  type="button"
                  onClick={() => onSelect(variant.id)}
                  aria-pressed={active}
                  className={cn(
                    'group flex h-full w-full flex-col overflow-hidden border bg-white text-left transition-colors',
                    active ? 'border-ink' : 'border-line hover:border-ink',
                  )}
                >
                  <div className="aspect-[3/2] w-full overflow-hidden bg-mist">
                    <div className="h-full w-full transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]">
                      <ProductImage image={variant.image} fit="contain" blend sizes="(min-width: 768px) 50vw, 100vw" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <p className="eyebrow text-accent">{variant.label}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                      {product.name} {variant.name}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{variant.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                      {active ? (
                        <>
                          <Check className="h-4 w-4 text-tech-ink" aria-hidden="true" /> Showing the {variant.name}
                        </>
                      ) : (
                        <>
                          View the {variant.name} <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
                        </>
                      )}
                    </span>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
