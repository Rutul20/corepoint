import { Camera } from 'lucide-react'
import { useId } from 'react'
import type { ProductImageAsset } from '../../types/product'
import { asset, assetSrcSet } from '../../utils/asset'
import { cn } from '../../utils/cn'

interface ProductImageProps {
  image: ProductImageAsset
  className?: string
  sizes?: string
  /** Load immediately instead of lazily (for above-the-fold images). */
  priority?: boolean
  fit?: 'cover' | 'contain'
  /**
   * Blend photos shot on white into a light background (mix-blend-multiply),
   * so product cut-outs sit naturally on grey or tinted panels.
   */
  blend?: boolean
}

/** A product photo, or a labelled "photo to follow" placeholder when `src` is missing. */
export function ProductImage({ image, className, sizes, priority = false, fit = 'cover', blend = false }: ProductImageProps) {
  if (!image.src) {
    return <PhotoPlaceholder label={image.placeholderLabel ?? image.alt} alt={image.alt} className={className} />
  }
  return (
    <img
      src={asset(image.src)}
      srcSet={assetSrcSet(image.srcSet)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={cn('h-full w-full', fit === 'contain' ? 'object-contain' : 'object-cover', blend && image.onWhite && 'mix-blend-multiply', className)}
    />
  )
}

export function PhotoPlaceholder({ label, alt, className }: { label: string; alt: string; className?: string }) {
  const patternId = `grid-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <div
      role="img"
      aria-label={`${alt}. Photo to follow.`}
      className={cn('relative flex h-full w-full items-center justify-center overflow-hidden bg-mist', className)}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-line-strong/70">
        <defs>
          <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
        <Camera aria-hidden="true" className="h-5 w-5 text-muted" strokeWidth={1.5} />
        <p className="eyebrow text-ink-soft">{label}</p>
        <p className="text-xs text-muted">Photo to follow</p>
      </div>
    </div>
  )
}
