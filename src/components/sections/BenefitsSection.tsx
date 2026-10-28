import { Armchair, Crosshair, Hand, Move3d, SlidersHorizontal, Workflow, type LucideIcon } from 'lucide-react'
import type { BenefitIcon, ProductExperience, ProductImageAsset } from '../../types/product'
import { ProductImage } from '../product/ProductImage'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const icons: Record<BenefitIcon, LucideIcon> = {
  workflow: Workflow,
  positioning: Armchair,
  'working-positions': Move3d,
  instruments: Crosshair,
  controls: SlidersHorizontal,
  appearance: Hand,
}

export function BenefitsSection({ experience, image }: { experience: ProductExperience; image: ProductImageAsset }) {
  return (
    <section id="benefits" aria-labelledby="benefits-title" className="overflow-hidden bg-night py-20 text-white sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
          <SectionHeading
            id="benefits-title"
            tone="dark"
            eyebrow="For dental professionals"
            title="Built around the way you work."
            description="The key benefits of the Aura-500 for the clinician and the assistant."
          />
          <Reveal className="mt-10 hidden aspect-[4/3] overflow-hidden lg:block" delay={0.1}>
            <ProductImage image={image} sizes="40vw" />
          </Reveal>
        </div>

        <ul className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7">
          {experience.benefits.map((benefit, index) => {
            const Icon = icons[benefit.icon]
            return (
              <Reveal key={benefit.id} as="li" delay={0.05 * (index % 2)} className="grid grid-cols-[auto_1fr] gap-5 py-8 sm:gap-8 sm:py-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-tech">
                  <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-bold tabular-nums text-white/55">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.015em] sm:text-2xl">{benefit.title}</h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">{benefit.description}</p>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
