import type { EnquiryTypeId } from '../types/product.ts'
import { chairs } from './chairs.ts'
import { equipment } from './equipment.ts'
import { services } from './services.ts'

export interface EnquiryTypeOption {
  id: EnquiryTypeId
  label: string
}

export const enquiryTypes: EnquiryTypeOption[] = [
  { id: 'quotation', label: 'Price and quotation' },
  { id: 'demo', label: 'Product demonstration' },
  { id: 'product-information', label: 'Product information' },
  { id: 'brochure', label: 'Brochure request' },
  { id: 'support', label: 'Service and repair' },
  { id: 'dealer', label: 'Dealer or distribution enquiry' },
  { id: 'other', label: 'Something else' },
]

export interface EnquiryProductGroup {
  label: string
  options: { id: string; label: string }[]
}

export const NOT_SURE_PRODUCT = 'not-sure'

/** Everything a visitor can ask about, grouped for the enquiry form's product list. */
export const enquiryProductGroups: EnquiryProductGroup[] = [
  { label: 'Dental chairs', options: chairs.map((chair) => ({ id: chair.id, label: chair.series ? `${chair.name} (Aura series)` : chair.name })) },
  { label: 'Equipment', options: equipment.map((item) => ({ id: item.id, label: item.name })) },
  { label: 'Services', options: services.map((service) => ({ id: service.id, label: service.name })) },
  { label: 'Other', options: [{ id: NOT_SURE_PRODUCT, label: 'Not sure yet / several products' }] },
]

export function productLabel(id: string): string | undefined {
  for (const group of enquiryProductGroups) {
    const option = group.options.find((o) => o.id === id)
    if (option) return option.label
  }
  return undefined
}

/** Link to the contact page with the enquiry form pre-filled. */
export function enquiryHref(type: EnquiryTypeId, productId?: string): string {
  const params = new URLSearchParams({ type })
  if (productId) params.set('product', productId)
  return `/contact?${params.toString()}#enquiry`
}
