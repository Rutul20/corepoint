import type { Product, ProductExperience } from '../../types/product'
import { ProductExplorer } from '../product/ProductExplorer'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** "Every component, up close": the interactive product explorer for the flagship chair. */
export function ExplorerSection({ product, experience }: { product: Product; experience: ProductExperience }) {
  return (
    <section id="explore" aria-labelledby="explore-title" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="explore-title"
          eyebrow={`Explore the ${product.name}`}
          title="Every component, up close."
          description={`Select a numbered point to see what each part of the ${product.name} does, or switch to the 3D prototype to rotate a model of the unit.`}
        />
        <Reveal className="mt-12 sm:mt-14" y={32}>
          <ProductExplorer product={product} experience={experience} />
        </Reveal>
      </Container>
    </section>
  )
}
