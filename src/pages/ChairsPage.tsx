import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChairCard } from '../components/catalogue/ChairCard'
import { ColourChart } from '../components/catalogue/ColourChart'
import { Container } from '../components/ui/Container'
import { CtaBand } from '../components/ui/CtaBand'
import { PageHeader } from '../components/ui/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { auraChairs } from '../data/chairs'
import { auraColours } from '../data/colours'
import { buttonClasses } from '../utils/buttonClasses'

export function ChairsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dental chairs"
        title="The Aura dental chairs."
        description="Four dental chairs under the Corepoint Healthcare name, from the Aura-200 to the flagship Aura-500. Prices on request."
        crumbs={[{ label: 'Dental chairs' }]}
        actions={
          <Link to="/compare" className={buttonClasses('secondary', 'md')}>
            Compare chairs <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      <section aria-labelledby="aura-series-title" className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="aura-series-title"
            eyebrow="Aura series"
            title="Choose your Aura."
            description="Memory foam upholstery, an LED operating light, a movable spittoon bowl and a doctor's stool on every model."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {auraChairs.map((chair, index) => (
              <Reveal key={chair.id} delay={index * 0.06}>
                <ChairCard chair={chair} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="colours-title" className="border-y border-line bg-mist py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="colours-title" eyebrow="Upholstery" title="14 colours to match your clinic." />
          </div>
          <Reveal className="lg:col-span-8">
            <ColourChart colours={auraColours} />
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
