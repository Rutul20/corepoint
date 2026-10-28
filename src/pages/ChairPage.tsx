import { useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, FileText, Phone } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChairCard } from '../components/catalogue/ChairCard'
import { ColourChart } from '../components/catalogue/ColourChart'
import { MediaGallery } from '../components/catalogue/MediaGallery'
import { PhotoGrid } from '../components/catalogue/PhotoGrid'
import { SpecTable } from '../components/catalogue/SpecTable'
import { VariantCards } from '../components/catalogue/VariantCards'
import { GalleryLightbox } from '../components/product/GalleryLightbox'
import { BenefitsSection } from '../components/sections/BenefitsSection'
import { ProductFeatures } from '../components/sections/ProductFeatures'
import { ProductStructuredData } from '../components/seo/ProductStructuredData'
import { Container } from '../components/ui/Container'
import { CtaBand } from '../components/ui/CtaBand'
import { Breadcrumbs } from '../components/ui/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { siteConfig, telHref } from '../config/site'
import { auraChairs, getChairBySlug } from '../data/chairs'
import { auraColours } from '../data/colours'
import { enquiryHref } from '../data/enquiry'
import type { Product, ProductVariant } from '../types/product'
import { buttonClasses } from '../utils/buttonClasses'
import { cn } from '../utils/cn'
import { NotFoundPage } from './NotFoundPage'

export function ChairPage() {
  const { slug = '' } = useParams()
  const chair = getChairBySlug(slug)
  if (!chair) return <NotFoundPage />
  return <ChairDetail key={chair.id} chair={chair} />
}

function ChairDetail({ chair }: { chair: Product }) {
  const [params, setParams] = useSearchParams()
  const prefersReducedMotion = useReducedMotion()
  const variant = chair.variants.find((v) => v.id === params.get('variant')) ?? chair.variants[0]
  const [brochureIndex, setBrochureIndex] = useState<number | null>(null)
  const closeBrochure = useCallback(() => setBrochureIndex(null), [])
  const isAura = chair.series === 'Aura'
  const hasVariants = chair.variants.length > 1
  const fullName = hasVariants ? `${chair.name} ${variant.name}` : chair.name

  const selectVariant = (id: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.set('variant', id)
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  const related = auraChairs.filter((other) => other.id !== chair.id).slice(0, 3)

  return (
    <>
      <section className="studio-backdrop border-b border-line pb-14 pt-24 sm:pb-16 lg:pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Dental chairs', to: '/dental-chairs' }, { label: chair.name }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              <MediaGallery key={variant.id} images={variant.gallery.length > 0 ? variant.gallery : [variant.image]} name={fullName} />
            </Reveal>

            <Reveal className="lg:col-span-5" delay={0.06}>
              <div className="flex flex-wrap items-center gap-2">
                {chair.series && <span className="eyebrow rounded-sm bg-accent/10 px-2 py-1 text-[10px] text-accent-deep">{chair.series} series</span>}
                <span className="eyebrow rounded-sm bg-white px-2 py-1 text-[10px] text-muted">{chair.ownLabel ? siteConfig.name : chair.brand}</span>
              </div>
              <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl">{chair.name}</h1>
              <p className="mt-2 text-lg font-medium text-ink-soft">{chair.tagline}</p>
              <p className="mt-5 text-[16px] leading-relaxed text-muted">{chair.description}</p>

              {hasVariants && <VariantPicker variants={chair.variants} activeId={variant.id} onSelect={selectVariant} className="mt-7" />}
              {hasVariants && <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{variant.description}</p>}

              {variant.badges && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {variant.badges.map((badge) => (
                    <li key={badge} className="rounded-full border border-line-strong bg-white px-3 py-1 text-[12px] font-semibold text-ink">
                      {badge}
                    </li>
                  ))}
                </ul>
              )}

              {variant.highlights.length > 0 && (
                <ul className="mt-7 space-y-2.5 border-t border-line pt-6">
                  {variant.highlights.slice(0, 6).map((point) => (
                    <li key={point} className="flex gap-3 text-[15px] leading-snug text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-tech-ink" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              <a href="#specifications" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-tech-ink hover:underline">
                Full specification <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={enquiryHref('quotation', chair.id)} className={buttonClasses('accent', 'lg')}>
                  Request a quote
                </Link>
                {variant.brochure.length > 0 && (
                  <button type="button" onClick={() => setBrochureIndex(0)} className={buttonClasses('secondary', 'lg')}>
                    <FileText className="h-4 w-4" aria-hidden="true" /> View brochure
                  </button>
                )}
              </div>
              <p className="mt-5 flex items-center gap-2 text-[13px] text-muted">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                Prices on request. Call{' '}
                <a href={telHref(siteConfig.contact.phones[0].display)} className="font-semibold text-ink hover:text-accent">
                  {siteConfig.contact.phones[0].display}
                </a>
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {hasVariants && (
        <VariantCards
          product={chair}
          activeId={variant.id}
          onSelect={(id) => {
            selectVariant(id)
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
          }}
        />
      )}

      {chair.experience && (
        <>
          <ProductFeatures experience={chair.experience} />
          <BenefitsSection experience={chair.experience} image={chair.variants[0].gallery[3] ?? chair.variants[0].image} />
        </>
      )}

      <section id="specifications" aria-labelledby="specifications-title" className="bg-white py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="specifications-title"
              eyebrow="Specifications"
              title={`${fullName} specification.`}
              description={
                chair.ownLabel
                  ? 'From the Corepoint Healthcare brochure. Dimensions, power and warranty are confirmed with your quotation.'
                  : 'As listed so far. Contact us for the full specification and current configuration.'
              }
            />
            {hasVariants && <VariantPicker variants={chair.variants} activeId={variant.id} onSelect={selectVariant} />}
          </div>
          <div className="mt-12">
            <SpecTable groups={variant.specifications} productId={chair.id} />
          </div>
          {variant.highlights.length > 6 && (
            <Reveal className="mt-14 border border-line bg-mist p-6 sm:p-8">
              <h3 className="eyebrow text-ink">All brochure features</h3>
              <ul className="mt-5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
                {variant.highlights.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-snug text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-tech-ink" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </Container>
      </section>

      {isAura && (
        <section aria-labelledby="colours-title" className="border-y border-line bg-mist py-16 sm:py-20">
          <Container className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading id="colours-title" eyebrow="Upholstery" title="Memory foam in 14 colours." />
            </div>
            <Reveal className="lg:col-span-8">
              <ColourChart colours={auraColours} />
            </Reveal>
          </Container>
        </section>
      )}

      {variant.brochure.length > 0 && (
        <section aria-labelledby="brochure-title" className="bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading id="brochure-title" eyebrow="Brochure" title={`${fullName} brochure.`} description="Select a page to read it full screen." />
            <PhotoGrid items={variant.brochure} className="mt-10 lg:grid-cols-3" />
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-mist py-16 sm:py-20">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading id="related-title" eyebrow="Aura series" title="Other Aura chairs to consider." />
              <Link to="/compare" className={buttonClasses('secondary', 'md')}>
                Compare chairs
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => (
                <ChairCard key={other.id} chair={other} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand productId={chair.id} />
      <GalleryLightbox items={variant.brochure} index={brochureIndex} onClose={closeBrochure} onIndexChange={setBrochureIndex} />
      <ProductStructuredData product={chair} />
    </>
  )
}

interface VariantPickerProps {
  variants: ProductVariant[]
  activeId: string
  onSelect: (id: string) => void
  className?: string
}

function VariantPicker({ variants, activeId, onSelect, className }: VariantPickerProps) {
  return (
    <div role="group" aria-label="Version" className={cn('inline-flex rounded-full border border-line-strong bg-white p-1', className)}>
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          aria-pressed={variant.id === activeId}
          onClick={() => onSelect(variant.id)}
          className={cn(
            'rounded-full px-4 py-2 text-[13px] font-semibold transition-colors',
            variant.id === activeId ? 'bg-ink text-white' : 'text-muted hover:text-ink',
          )}
        >
          {variant.name}
        </button>
      ))}
    </div>
  )
}
