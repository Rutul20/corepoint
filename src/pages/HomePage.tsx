import { ArrowRight, Building2, Palette, Wrench, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChairCard } from '../components/catalogue/ChairCard'
import { PhotoGrid } from '../components/catalogue/PhotoGrid'
import { ProductImage } from '../components/product/ProductImage'
import { ExplorerSection } from '../components/sections/ExplorerSection'
import { HomeHero } from '../components/sections/HomeHero'
import { Container } from '../components/ui/Container'
import { CtaBand } from '../components/ui/CtaBand'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { siteConfig } from '../config/site'
import { aura500, auraChairs } from '../data/chairs'
import { auraColours } from '../data/colours'
import { companyIntro } from '../data/company'
import { equipment, equipmentCategories } from '../data/equipment'
import { installationPhotos } from '../data/images'
import { services } from '../data/services'
import { buttonClasses } from '../utils/buttonClasses'

const facts: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Building2, value: `Since ${siteConfig.registration.founded}`, label: 'Ashram Road, Ahmedabad' },
  { icon: Palette, value: `${auraColours.length} colours`, label: 'Aura upholstery chart' },
  { icon: Wrench, value: 'Sales and service', label: 'Chair repair, clinic set-up' },
]

export function HomePage() {
  const otherAura = auraChairs.filter((chair) => chair !== aura500)

  return (
    <>
      <HomeHero product={aura500} />

      <section aria-label="At a glance" className="border-y border-line bg-white">
        <Container className="grid divide-y divide-line sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-4 py-6 sm:px-6 sm:first:pl-0">
            <span className="eyebrow text-accent">{siteConfig.tagline}</span>
          </div>
          {facts.map((fact) => (
            <div key={fact.value} className="flex items-center gap-4 py-6 sm:px-6">
              <fact.icon className="h-5 w-5 shrink-0 text-tech-ink" strokeWidth={1.6} aria-hidden="true" />
              <div>
                <p className="text-[15px] font-semibold text-ink">{fact.value}</p>
                <p className="text-[13px] text-muted">{fact.label}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section aria-labelledby="aura-title" className="bg-mist py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="aura-title"
              eyebrow="Our own range"
              title="The Aura series."
              description="Four dental chairs under the Corepoint Healthcare name, from the feature-packed Aura-200 to the flagship Aura-500."
            />
            <Reveal className="flex flex-wrap gap-3">
              <Link to="/compare" className={buttonClasses('secondary', 'md')}>
                Compare models
              </Link>
              <Link to="/dental-chairs" className={buttonClasses('ghost', 'md')}>
                All dental chairs <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-3">
              <ChairCard chair={aura500} featured className="lg:grid lg:grid-cols-2" />
            </Reveal>
            {otherAura.map((chair, index) => (
              <Reveal key={chair.id} delay={index * 0.06}>
                <ChairCard chair={chair} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {aura500.experience && <ExplorerSection product={aura500} experience={aura500.experience} />}

      <section aria-labelledby="installations-title" className="bg-mist py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="installations-title"
              eyebrow="Recent installations"
              title="In the clinics we equip."
              description="Dental chairs supplied by Corepoint Healthcare, in the upholstery colours our clients chose."
            />
            <Reveal>
              <Link to="/gallery" className={buttonClasses('secondary', 'md')}>
                View the gallery
              </Link>
            </Reveal>
          </div>
          <PhotoGrid items={installationPhotos} featureFirst className="mt-12" />
        </Container>
      </section>

      <section aria-labelledby="equipment-title" className="bg-white py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="equipment-title"
              eyebrow="Dental equipment"
              title="Everything else your surgery needs."
              description="Imaging, instruments, sterilisation and clinic equipment from brands including Vatech, 3Shape, Woodpecker, NSK and Woson."
            />
            <Reveal>
              <Link to="/equipment" className={buttonClasses('secondary', 'md')}>
                Browse equipment
              </Link>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentCategories.map((category, index) => {
              const items = equipment.filter((item) => item.categoryId === category.id)
              const cover = items.find((item) => item.image.src)?.image
              return (
                <Reveal key={category.id} as="li" delay={index * 0.05}>
                  <Link to={`/equipment#${category.id}`} className="group flex h-full flex-col border border-line bg-white transition-colors hover:border-ink">
                    <div className="aspect-square overflow-hidden bg-white p-5">
                      {cover && <ProductImage image={cover} fit="contain" sizes="(min-width: 1024px) 20vw, 50vw" />}
                    </div>
                    <div className="border-t border-line p-4">
                      <h3 className="font-semibold text-ink">{category.name}</h3>
                      <p className="mt-1 text-[13px] text-muted">{items.length} products</p>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="services-title" className="bg-mist py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="services-title" eyebrow="Services" title="Beyond the sale." description="From planning a new clinic to keeping your chair running." />
            <Reveal className="mt-8">
              <Link to="/services" className={buttonClasses('secondary', 'md')}>
                Our services
              </Link>
            </Reveal>
          </div>
          <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:col-span-8">
            {services.map((service, index) => (
              <Reveal key={service.id} as="li" delay={index * 0.06} className="bg-white p-7">
                <p className="text-[11px] font-bold tabular-nums text-tech-ink">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em]">{service.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="about-title" className="bg-white py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading id="about-title" eyebrow="About us" title={siteConfig.name} titleClassName="font-serif uppercase tracking-[0.01em]!" />
            <Reveal className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted">
              {companyIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
            <Reveal className="mt-8">
              <Link to="/about" className={buttonClasses('primary', 'md')}>
                More about us <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <Reveal className="aspect-[4/3] overflow-hidden lg:col-span-6" delay={0.08}>
            <ProductImage image={installationPhotos[1]} sizes="(min-width: 1024px) 50vw, 100vw" />
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
