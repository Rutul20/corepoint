import { siteConfig } from '../config/site'
import type { EnquiryTypeId } from '../types/product'

export interface EnquiryPayload {
  fullName: string
  organisation: string
  email: string
  phone: string
  city: string
  enquiryType: EnquiryTypeId
  enquiryTypeLabel: string
  productId: string
  productName: string
  message: string
  /** Page the enquiry was sent from. */
  source: string
}

export type EnquiryResult =
  | { status: 'success' }
  | { status: 'not-configured' }
  | { status: 'error'; message: string }

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'
const TIMEOUT_MS = 15000
const accessKey = siteConfig.enquiry.web3formsAccessKey?.trim() || null

/** True once a Web3Forms access key is set in src/config/site.ts. Until then nothing is sent anywhere. */
export const isEnquiryBackendConfigured = accessKey !== null

/** The fields Web3Forms emails as a table. Keys are the row labels in the email. */
function toWeb3Forms(payload: EnquiryPayload, key: string) {
  return {
    access_key: key,
    subject: `Website enquiry: ${payload.enquiryTypeLabel} – ${payload.productName}`,
    from_name: `${siteConfig.name} website`,
    // Web3Forms shows "name" as the sender and uses "email" as the Reply-To address.
    name: payload.fullName,
    email: payload.email,
    'Clinic or organisation': payload.organisation || '–',
    Phone: payload.phone || '–',
    City: payload.city || '–',
    'Enquiry type': payload.enquiryTypeLabel,
    'Product or service': payload.productName,
    Message: payload.message || '–',
    'Sent from': payload.source,
  }
}

/**
 * Emails an enquiry to the business through Web3Forms (https://web3forms.com).
 *
 * Without an access key this returns `not-configured` immediately and the UI
 * offers email and WhatsApp instead. It reports success only when Web3Forms
 * confirms the email was accepted.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResult> {
  if (!accessKey) return { status: 'not-configured' }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(toWeb3Forms(payload, accessKey)),
      signal: controller.signal,
    })
    const data: { success?: boolean; message?: string } = await response.json().catch(() => ({}))
    if (response.ok && data.success === true) return { status: 'success' }

    console.error('Web3Forms did not accept the enquiry:', response.status, data.message)
    return { status: 'error', message: 'We could not send your enquiry just now.' }
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'AbortError'
    return {
      status: 'error',
      message: timedOut
        ? 'The request took too long. Please check your connection.'
        : 'We could not reach the server. Please check your connection.',
    }
  } finally {
    window.clearTimeout(timeout)
  }
}
