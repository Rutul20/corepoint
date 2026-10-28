import type { EnquiryTypeId } from '../types/product'

export interface EnquiryFormValues {
  fullName: string
  organisation: string
  email: string
  phone: string
  city: string
  enquiryType: EnquiryTypeId | ''
  productId: string
  message: string
  consent: boolean
  /** Honeypot field. Real visitors never see or fill it. */
  website: string
}

export type EnquiryField = Exclude<keyof EnquiryFormValues, 'website'>
export type EnquiryErrors = Partial<Record<EnquiryField, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[\d\s()-]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function validateEnquiry(values: EnquiryFormValues): EnquiryErrors {
  const errors: EnquiryErrors = {}

  if (values.fullName.trim().length < 2) errors.fullName = 'Please enter your full name.'

  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!isValidEmail(values.email)) errors.email = 'Please enter a valid email address, like name@clinic.com.'

  const phone = values.phone.trim()
  if (phone) {
    const digits = phone.replace(/\D/g, '').length
    if (!PHONE_PATTERN.test(phone) || digits < 7 || digits > 15) {
      errors.phone = 'Please enter a valid phone number, including the country code if outside your country.'
    }
  }

  if (!values.enquiryType) errors.enquiryType = 'Please choose what your enquiry is about.'
  if (!values.productId) errors.productId = 'Please choose a product or service.'
  if (values.message.length > 2000) errors.message = 'Please keep your message under 2,000 characters.'
  if (!values.consent) errors.consent = 'Please confirm we may contact you about your enquiry.'

  return errors
}
