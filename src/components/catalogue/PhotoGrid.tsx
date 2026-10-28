import { Expand } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ProductImageAsset } from '../../types/product'
import { cn } from '../../utils/cn'
import { GalleryLightbox } from '../product/GalleryLightbox'
import { ProductImage } from '../product/ProductImage'
import { Reveal } from '../ui/Reveal'

interface PhotoGridProps {
  items: ProductImageAsset[]
  /** Make the first photo span two columns and rows. */
  featureFirst?: boolean
  className?: string
}

/** Responsive photo grid; each tile opens the full-screen viewer. */
export function PhotoGrid({ items, featureFirst = false, className }: PhotoGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const close = useCallback(() => setOpenIndex(null), [])

  return (
    <>
      <ul className={cn('grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4', className)}>
        {items.map((item, index) => {
          const featured = featureFirst && index === 0
          return (
            <Reveal key={`${item.id}-${index}`} as="li" delay={Math.min(index, 6) * 0.04} y={16} className={cn(featured && 'col-span-2 row-span-2')}>
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open ${item.caption ?? item.alt} in the image viewer`}
                className="group relative block h-full w-full overflow-hidden border border-line bg-white text-left"
              >
                <div className={cn('w-full overflow-hidden', featured ? 'aspect-square h-full' : 'aspect-square')}>
                  <div className="h-full w-full transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.05]">
                    <ProductImage image={item} fit={item.onWhite ? 'contain' : 'cover'} sizes={featured ? '50vw' : '25vw'} />
                  </div>
                </div>
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/55 to-transparent px-3 pb-2.5 pt-8 text-[12px] font-semibold text-white sm:text-[13px]">
                  <span className="line-clamp-1">{item.caption ?? item.alt}</span>
                  <Expand className="h-3.5 w-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </span>
              </button>
            </Reveal>
          )
        })}
      </ul>
      <GalleryLightbox items={items} index={openIndex} onClose={close} onIndexChange={setOpenIndex} />
    </>
  )
}
