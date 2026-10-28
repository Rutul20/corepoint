/**
 * Site-wide business settings: company name, domain, contact details and
 * addresses. Edit this file when any of them change.
 *
 * It is also read by vite.config.ts at build time (head metadata, robots.txt,
 * sitemap.xml and per-page preview HTML), so keep it free of browser-only code
 * and imports from the rest of src/.
 */

export interface PhoneNumber {
  label: string
  /** Display format, e.g. "+91 90998 53100". */
  display: string
  /** Name of the person who answers, if any. */
  person?: string
}

export interface Address {
  label: string
  lines: string[]
  /** Opens directions in Google Maps. */
  mapsUrl: string
}

export interface SocialLink {
  label: string
  href: string
}

export interface SiteConfig {
  /** Company name, also used beside the logo mark. */
  name: string
  tagline: string
  /** Short descriptor for the footer. */
  descriptor: string
  /** Default <title>. */
  title: string
  /** Default meta description (keep it under ~160 characters). */
  description: string
  /**
   * Public address of the site, without a trailing slash. Its path also sets
   * where the site is served from: 'https://rutul20.github.io/corepoint' →
   * /corepoint/, a custom domain such as 'https://www.example.in' → /.
   * Used for the build base path, canonical URLs, Open Graph and the sitemap.
   */
  url: string
  locale: string
  /** Default social sharing image, an absolute path under /public. */
  ogImage: string
  contact: {
    phones: PhoneNumber[]
    email: string
    /** International number, digits only, for wa.me links. */
    whatsapp: string | null
    whatsappPerson?: string
    addresses: Address[]
    /** Google Business profile. */
    googleProfile: string | null
    indiamartProfile: string | null
  }
  registration: {
    founded: number
    legalStatus: string
    gstin: string | null
  }
  enquiry: {
    /**
     * Web3Forms access key. Get one free at https://web3forms.com by entering
     * the inbox that should receive enquiries; the key arrives by email. It is
     * designed to be public, so it is safe to keep in this file. While null,
     * the form offers email and WhatsApp instead of sending.
     */
    web3formsAccessKey: string | null
  }
  social: SocialLink[]
  /**
   * While true, anything not yet supplied is shown as a clearly marked
   * "to be confirmed" placeholder. Set to false to hide those markers.
   */
  showPlaceholders: boolean
}

const maps = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const siteConfig: SiteConfig = {
  name: 'Corepoint Healthcare',
  tagline: 'One Stop Dental Solution',
  descriptor: 'Dental chairs, dental equipment, service and clinic set-up from Ahmedabad.',
  title: 'Corepoint Healthcare | Aura Dental Chairs & Dental Equipment, Ahmedabad',
  description:
    'Aura series dental chairs, dental imaging and clinic equipment, servicing and clinic set-up from Corepoint Healthcare, Ashram Road, Ahmedabad.',
  // GitHub Pages address. When you move to your own domain, change this one line.
  url: 'https://rutul20.github.io/corepoint',
  locale: 'en-IN',
  ogImage: '/images/products/aura-500-premium-plus-1-1000.jpeg',
  contact: {
    phones: [
      { label: 'Office', display: '+91 70469 36869' },
      { label: 'Sales', display: '+91 90998 53100', person: 'Harshit Patel' },
      { label: 'Sales', display: '+91 82008 28785', person: 'Prit Patel' },
    ],
    email: 'corepointhealthcare@gmail.com',
    whatsapp: '918200828785',
    whatsappPerson: 'Prit Patel',
    addresses: [
      {
        label: 'Office',
        lines: ['A533, Sunwest Bank', 'Opp. City Gold Cinema, Ashram Road', 'Ahmedabad 380009, Gujarat'],
        mapsUrl: maps('A533 Sunwest Bank, Opp. City Gold Cinema, Ashram Road, Ahmedabad 380009'),
      },
      {
        label: 'Warehouse',
        lines: ['Block no. 1268, Bareja–Navagam Road', 'Bareja 382425, Gujarat'],
        mapsUrl: maps('Block no 1268, Bareja Navagam Road, Bareja 382425'),
      },
    ],
    googleProfile: 'https://share.google/xlzzCarRoe9buObb0',
    indiamartProfile: 'https://www.indiamart.com/corepointhealthcare/',
  },
  registration: {
    founded: 2020,
    legalStatus: 'Proprietorship',
    gstin: '24DBQPP1246B1ZT',
  },
  enquiry: {
    // Created for corepointhealthcare@gmail.com.
    web3formsAccessKey: 'd4d4abde-92b3-48d7-bec7-478c58ae6a73',
  },
  social: [],
  showPlaceholders: true,
}

/** `tel:` link for a display number. */
export const telHref = (display: string) => `tel:${display.replace(/[^\d+]/g, '')}`

/** Path the site is served from, derived from `url`: '/corepoint/' on GitHub Pages, '/' on a custom domain. */
export const basePath = `${new URL(siteConfig.url).pathname.replace(/\/+$/, '')}/`

/** Absolute public URL of a page path such as '/dental-chairs' (directory style, with a trailing slash). */
export const pageUrl = (path: string) => `${siteConfig.url.replace(/\/+$/, '')}${path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`}`

/** Absolute public URL of a file in /public, such as '/images/products/aura-400-1-1000.jpeg'. */
export const fileUrl = (path: string) => `${siteConfig.url.replace(/\/+$/, '')}${path}`
