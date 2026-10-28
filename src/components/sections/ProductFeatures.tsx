import type { ProductExperience } from '../../types/product'
import { ProductImage } from '../product/ProductImage'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function ProductFeatures({ experience }: { experience: ProductExperience }) {
  const enabled = new Set(experience.components.filter((c) => c.enabled).map((c) => c.id))
  // Only show features whose components are all present on this product.
  const features = experience.features.filter((feature) => feature.components.every((id) => enabled.has(id)))

  return (
    <section id="features" aria-labelledby="features-title" className="bg-mist py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title="Engineered for the modern dental practice"
          titleClassName="uppercase text-[1.75rem]! leading-[1.12]! tracking-[0.005em]! sm:text-[2.3rem]! lg:text-[2.6rem]!"
          description="What the Aura-500 brings to your patients, your hands and your surgery."
        />

        <div className="mt-14 grid gap-x-6 gap-y-14 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.id} as="article" delay={(index % 3) * 0.08} className="group">
              <div className="relative aspect-[4/3] overflow-hidden border border-line bg-white">
                <div className="h-full w-full transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.045]">
                  <ProductImage
                    image={feature.image}
                    fit={feature.image.onWhite ? 'contain' : 'cover'}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <span className="absolute right-3 top-3 rounded-sm bg-white/85 px-1.5 text-[11px] font-bold tabular-nums text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="eyebrow mt-6 text-accent">{feature.category}</p>
              <h3 className="mt-2.5 text-xl font-semibold tracking-[-0.015em] text-ink">{feature.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{feature.description}</p>
              <p className="mt-5 flex items-start gap-3 border-t border-line pt-4 text-sm leading-snug text-ink">
                <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent transition-[width] duration-500 ease-premium group-hover:w-6" />
                <span>
                  <span className="sr-only">Benefit: </span>
                  {feature.benefit}
                </span>
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
