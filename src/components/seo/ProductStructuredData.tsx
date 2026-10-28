import { fileUrl, pageUrl, siteConfig } from '../../config/site'
import type { Product } from '../../types/product'

/**
 * Emits schema.org Product JSON-LD, but only for products marked
 * `verified: true`, so search engines never receive placeholder data.
 * No price is included because prices are given on request.
 */
export function ProductStructuredData({ product }: { product: Product }) {
  if (!product.verified) return null

  const images = product.variants.flatMap((variant) => variant.gallery.map((image) => image.src)).filter((src): src is string => Boolean(src))
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name} Dental Chair`,
    description: product.description,
    category: product.category,
    brand: { '@type': 'Brand', name: product.ownLabel ? siteConfig.name : product.brand },
    image: [...new Set(images)].map(fileUrl),
    url: pageUrl(`/dental-chairs/${product.slug}`),
  }

  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}
