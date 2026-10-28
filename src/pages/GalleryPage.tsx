import { useSearchParams } from 'react-router-dom'
import { PhotoGrid } from '../components/catalogue/PhotoGrid'
import { Container } from '../components/ui/Container'
import { CtaBand } from '../components/ui/CtaBand'
import { PageHeader } from '../components/ui/PageHeader'
import { galleryCategoryLabels, siteGallery } from '../data/gallery'
import type { GalleryCategory } from '../types/product'
import { cn } from '../utils/cn'

type Filter = 'all' | GalleryCategory

export function GalleryPage() {
  const [params, setParams] = useSearchParams()
  const categories = (Object.keys(galleryCategoryLabels) as GalleryCategory[]).filter((category) => siteGallery.some((item) => item.category === category))
  const requested = params.get('show')
  const filter: Filter = categories.find((category) => category === requested) ?? 'all'
  const items = filter === 'all' ? siteGallery : siteGallery.filter((item) => item.category === filter)

  const choose = (next: Filter) => setParams(next === 'all' ? {} : { show: next }, { replace: true, preventScrollReset: true })

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Chairs, clinics and equipment."
        description="Aura dental chairs, recent clinic installations, the equipment we supply and our product brochures."
        crumbs={[{ label: 'Gallery' }]}
      />

      <section aria-label="Photos" className="bg-white py-14 sm:py-20">
        <Container>
          <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
            {(['all', ...categories] as Filter[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => choose(key)}
                className={cn(
                  'rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors',
                  filter === key ? 'border-ink bg-ink text-white' : 'border-line-strong bg-white text-muted hover:border-ink hover:text-ink',
                )}
              >
                {key === 'all' ? 'All' : galleryCategoryLabels[key]}
                <span className="ml-1.5 font-normal opacity-70">
                  {key === 'all' ? siteGallery.length : siteGallery.filter((item) => item.category === key).length}
                </span>
              </button>
            ))}
          </div>
          <PhotoGrid key={filter} items={items} featureFirst={filter === 'all'} className="mt-10" />
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
