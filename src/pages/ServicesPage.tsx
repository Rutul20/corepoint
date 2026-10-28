import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductImage } from '../components/product/ProductImage'
import { Container } from '../components/ui/Container'
import { CtaBand } from '../components/ui/CtaBand'
import { PageHeader } from '../components/ui/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { enquiryHref } from '../data/enquiry'
import { services } from '../data/services'
import { buttonClasses } from '../utils/buttonClasses'
import { cn } from '../utils/cn'

export function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Planning, supply and service."
        description="One stop dental solution: we help you plan the clinic, supply the equipment and keep your dental chair working."
        crumbs={[{ label: 'Services' }]}
      />

      <section aria-label="Our services" className="bg-white py-16 sm:py-24">
        <Container className="space-y-20 sm:space-y-28">
          {services.map((service, index) => (
            <article key={service.id} id={service.id} className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
              <Reveal className={cn('aspect-[4/3] overflow-hidden border border-line lg:col-span-6', index % 2 === 1 && 'lg:order-last')}>
                {service.image && <ProductImage image={service.image} fit="cover" sizes="(min-width: 1024px) 50vw, 100vw" />}
              </Reveal>
              <Reveal className="lg:col-span-6" delay={0.06}>
                <p className="text-[11px] font-bold tabular-nums text-tech-ink">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{service.name}</h2>
                <p className="mt-5 text-[17px] leading-relaxed text-muted">{service.summary}</p>
                <ul className="mt-6 space-y-3 border-t border-line pt-6">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[15px] text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-tech-ink" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link to={enquiryHref(service.enquiryType, service.id)} className={buttonClasses('primary', 'md', 'mt-8')}>
                  Enquire about this service <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Reveal>
            </article>
          ))}
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
