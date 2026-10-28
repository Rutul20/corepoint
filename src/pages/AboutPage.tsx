import { Armchair, Layers, LayoutGrid, Wrench, type LucideIcon } from 'lucide-react'
import { PhotoGrid } from '../components/catalogue/PhotoGrid'
import { Container } from '../components/ui/Container'
import { CtaBand } from '../components/ui/CtaBand'
import { PageHeader } from '../components/ui/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { siteConfig } from '../config/site'
import { companyIntro, companyPoints, type CompanyPoint } from '../data/company'
import { installationPhotos } from '../data/images'

const icons: Record<CompanyPoint['id'], LucideIcon> = {
  aura: Armchair,
  range: Layers,
  planning: LayoutGrid,
  service: Wrench,
}

export function AboutPage() {
  const { registration, contact } = siteConfig
  const facts = [
    { label: 'Founded', value: String(registration.founded) },
    { label: 'Office', value: 'Ashram Road, Ahmedabad' },
    { label: 'Warehouse', value: 'Bareja, Gujarat' },
    { label: 'Business', value: `${registration.legalStatus}; sales, wholesale and service` },
    ...(registration.gstin ? [{ label: 'GSTIN', value: registration.gstin }] : []),
  ]

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={siteConfig.name}
        description={`${siteConfig.tagline}: dental chairs, dental equipment, clinic set-up and service from Ahmedabad.`}
        crumbs={[{ label: 'About us' }]}
      />

      <section aria-labelledby="story-title" className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading id="story-title" eyebrow="Who we are" title="A one stop dental solution." />
            <Reveal className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted">
              {companyIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          </div>
          <Reveal className="lg:col-span-5" delay={0.08}>
            <dl className="divide-y divide-line border-y border-line">
              {facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-6 py-4">
                  <dt className="text-sm text-muted">{fact.label}</dt>
                  <dd className="text-right text-sm font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {(contact.googleProfile || contact.indiamartProfile) && (
              <p className="mt-5 text-sm text-muted">
                Find us on{' '}
                {contact.googleProfile && (
                  <a className="font-semibold text-ink underline underline-offset-4" href={contact.googleProfile} target="_blank" rel="noopener noreferrer">
                    Google
                  </a>
                )}
                {contact.googleProfile && contact.indiamartProfile && ' and '}
                {contact.indiamartProfile && (
                  <a className="font-semibold text-ink underline underline-offset-4" href={contact.indiamartProfile} target="_blank" rel="noopener noreferrer">
                    IndiaMART
                  </a>
                )}
                .
              </p>
            )}
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="what-title" className="bg-mist py-16 sm:py-24">
        <Container>
          <SectionHeading id="what-title" eyebrow="What we do" title="From the first plan to the next service." />
          <ul className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {companyPoints.map((point, index) => {
              const Icon = icons[point.id]
              return (
                <Reveal key={point.id} as="li" delay={index * 0.06} className="bg-white p-7 sm:p-8">
                  <Icon className="h-6 w-6 text-tech-ink" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em]">{point.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{point.body}</p>
                </Reveal>
              )
            })}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="installs-title" className="bg-white py-16 sm:py-24">
        <Container>
          <SectionHeading id="installs-title" eyebrow="Recent installations" title="Chairs we have supplied." />
          <PhotoGrid items={installationPhotos} featureFirst className="mt-10" />
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
