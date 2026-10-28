import type { ProductImageAsset } from '../types/product.ts'
import generated from './generated/productImages.json' with { type: 'json' }

interface GeneratedSize {
  src: string
  width: number
  height: number
  bytes: number
}

/** Pixel sizes of the photos in public/images/products/, keyed by photo name. */
const productImages: Record<string, { large?: GeneratedSize; small?: GeneratedSize }> = generated

/**
 * A product photo from public/images/products/ by its name (the key in
 * generated/productImages.json), with srcSet and pixel size filled in.
 * Unknown names fall back to a labelled placeholder.
 */
export function productPhoto(name: string, alt: string, extra: Partial<ProductImageAsset> = {}): ProductImageAsset {
  const entry = productImages[name]
  const large = entry?.large ?? entry?.small
  if (!entry || !large) return { id: name, alt, placeholderLabel: alt, ...extra }
  const sizes = [entry.small, entry.large].filter((size): size is GeneratedSize => size !== undefined)
  return {
    id: name,
    src: large.src,
    srcSet: sizes.map((size) => `${size.src} ${size.width}w`).join(', '),
    width: large.width,
    height: large.height,
    alt,
    onWhite: true,
    ...extra,
  }
}

/**
 * A photo made with scripts/optimise-image.mjs: `<base>-<width>.webp` files.
 * `sizes` lists [file width suffix, actual width, actual height], largest first.
 */
export function localPhoto(
  id: string,
  base: string,
  sizes: [suffix: number, width: number, height: number][],
  alt: string,
  extra: Partial<ProductImageAsset> = {},
): ProductImageAsset {
  const [largest] = sizes
  return {
    id,
    src: `${base}-${largest[0]}.webp`,
    srcSet: sizes.map(([suffix, width]) => `${base}-${suffix}.webp ${width}w`).join(', '),
    width: largest[1],
    height: largest[2],
    alt,
    ...extra,
  }
}

/** Recent clinic installations (photos supplied by Corepoint Healthcare). */
export const installationPhotos: ProductImageAsset[] = [
  localPhoto('installation-light-blue', '/images/installations/installation-light-blue', [[1600, 1600, 1200], [800, 800, 600]], 'Corepoint Healthcare dental chair with light blue upholstery and trolley delivery unit in a clinic', { caption: 'Light blue upholstery, trolley delivery unit' }),
  localPhoto('installation-beige', '/images/installations/installation-beige', [[1280, 1280, 960], [800, 800, 600]], 'Dental chair with beige upholstery, illuminated spittoon unit and trolley delivery unit', { caption: 'Beige upholstery, illuminated spittoon unit' }),
  localPhoto('installation-grey', '/images/installations/installation-grey', [[1600, 1600, 1200], [800, 800, 600]], 'Dental chair with grey upholstery, LED operating light and delivery tray in a clinic', { caption: 'Grey upholstery, LED operating light' }),
  localPhoto('installation-orange', '/images/installations/installation-orange', [[1200, 1115, 963], [800, 800, 691]], 'Newly installed dental chair with orange upholstery and matching doctor’s stool', { caption: 'Orange upholstery with matching stool' }),
]
