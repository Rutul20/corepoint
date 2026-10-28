import type { GalleryCategory, GalleryItem, ProductImageAsset } from '../types/product.ts'
import { aura500, auraChairs } from './chairs.ts'
import { equipment } from './equipment.ts'
import { installationPhotos } from './images.ts'
import { services } from './services.ts'

export const galleryCategoryLabels: Record<GalleryCategory, string> = {
  'aura-500': 'Aura-500',
  'aura-range': 'Aura range',
  clinic: 'Installations',
  equipment: 'Equipment',
  service: 'Service',
  brochures: 'Brochures',
}

const toItems = (images: ProductImageAsset[], category: GalleryCategory, href?: string): GalleryItem[] =>
  images.filter((image) => image.src).map((image) => ({ ...image, caption: image.caption ?? image.alt, category, href }))

const all: GalleryItem[] = [
  ...aura500.variants.flatMap((variant) => toItems(variant.gallery, 'aura-500', `/dental-chairs/${aura500.slug}`)),
  ...toItems(installationPhotos, 'clinic'),
  ...auraChairs
    .filter((chair) => chair !== aura500)
    .flatMap((chair) => chair.variants.flatMap((variant) => toItems(variant.gallery, 'aura-range', `/dental-chairs/${chair.slug}`))),
  ...toItems(
    equipment.map((item) => item.image),
    'equipment',
    '/equipment',
  ),
  ...toItems(
    services.flatMap((service) => (service.image && !installationPhotos.includes(service.image) ? [service.image] : [])),
    'service',
    '/services',
  ),
  ...auraChairs.flatMap((chair) => chair.variants.flatMap((variant) => toItems(variant.brochure, 'brochures', `/dental-chairs/${chair.slug}`))),
]

/** Every photo on the site, once each, for the Gallery page. */
export const siteGallery: GalleryItem[] = all.filter((item, index) => all.findIndex((other) => other.src === item.src) === index)
