import { EquipmentCard } from '../components/catalogue/EquipmentCard'
import { Container } from '../components/ui/Container'
import { CtaBand } from '../components/ui/CtaBand'
import { PageHeader } from '../components/ui/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { equipment, equipmentCategories } from '../data/equipment'

export function EquipmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dental equipment"
        title="Equip the whole surgery."
        description="Imaging, clinical instruments, sterilisation and clinic equipment alongside our Aura dental chairs. Prices on request."
        crumbs={[{ label: 'Equipment' }]}
      />

      <nav aria-label="Equipment categories" className="sticky top-16 z-30 border-b border-line bg-white/90 backdrop-blur-xl lg:top-[72px]">
        <Container className="flex gap-2 overflow-x-auto py-3">
          {equipmentCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="shrink-0 rounded-full border border-line-strong px-4 py-2 text-[13px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
            >
              {category.name}
            </a>
          ))}
        </Container>
      </nav>

      {equipmentCategories.map((category, index) => {
        const items = equipment.filter((item) => item.categoryId === category.id)
        return (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`${category.id}-title`}
            className={index % 2 === 0 ? 'scroll-mt-32 bg-white py-16 sm:py-20' : 'scroll-mt-32 bg-mist py-16 sm:py-20'}
          >
            <Container>
              <SectionHeading id={`${category.id}-title`} eyebrow={`${items.length} products`} title={category.name} description={category.description} />
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item, itemIndex) => (
                  <Reveal key={item.id} as="li" delay={(itemIndex % 4) * 0.05}>
                    <EquipmentCard item={item} />
                  </Reveal>
                ))}
              </ul>
            </Container>
          </section>
        )
      })}

      <CtaBand />
    </>
  )
}
