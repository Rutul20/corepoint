import { Expand } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ProductImageAsset } from '../../types/product'
import { cn } from '../../utils/cn'
import { GalleryLightbox } from '../product/GalleryLightbox'
import { ProductImage } from '../product/ProductImage'

/** Main product photo with thumbnails; the main photo opens the full-screen viewer. */
export function MediaGallery({ images, name }: { images: ProductImageAsset[]; name: string }) {
  const [active, setActive] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const close = useCallback(() => setOpenIndex(null), [])
  const current = images[active] ?? images[0]

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpenIndex(active)}
        aria-label={`Enlarge photo: ${current.alt}`}
        className="group relative block aspect-[4/3] w-full overflow-hidden border border-line bg-white"
      >
        <ProductImage image={current} fit={current.onWhite ? 'contain' : 'cover'} priority sizes="(min-width: 1024px) 58vw, 100vw" />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand className="h-3.5 w-3.5" aria-hidden="true" /> Enlarge
        </span>
      </button>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3" aria-label={`${name} photos`}>
          {images.map((image, index) => (
            <li key={`${image.id}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}: ${image.alt}`}
                aria-pressed={index === active}
                className={cn(
                  'block aspect-square w-full overflow-hidden border bg-white transition-colors',
                  index === active ? 'border-ink' : 'border-line hover:border-ink/40',
                )}
              >
                <ProductImage image={image} fit={image.onWhite ? 'contain' : 'cover'} sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <GalleryLightbox items={images} index={openIndex} onClose={close} onIndexChange={setOpenIndex} />
    </div>
  )
}
