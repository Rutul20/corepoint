import { siteConfig } from '../config/site.ts'
import { chairs } from './chairs.ts'

/**
 * Title, description and sharing image for every public page. Used in the
 * browser (usePageMeta) and at build time (vite.config.ts) to write
 * per-page HTML with the right preview tags, plus sitemap.xml.
 */
export interface PageMeta {
  path: string
  title: string
  description: string
  /** Absolute path under /public for the social preview image. */
  image?: string
}

const suffix = ` | ${siteConfig.name}`

export const staticPages: PageMeta[] = [
  { path: '/', title: siteConfig.title, description: siteConfig.description },
  {
    path: '/dental-chairs',
    title: `Dental Chairs: Aura-200 to Aura-500${suffix}`,
    description: 'The Aura series dental chairs from Corepoint Healthcare: Aura-200, Aura-300, Aura-400 and the flagship Aura-500, with 14 upholstery colours.',
  },
  {
    path: '/equipment',
    title: `Dental Equipment: X-Ray, Imaging, Sterilisation${suffix}`,
    description: 'Dental X-ray, OPG, CBCT, RVG sensors, intraoral scanners, scalers, compressors, autoclaves and clinic equipment from Corepoint Healthcare, Ahmedabad.',
    image: '/images/products/cbct-machine-1000.jpg',
  },
  {
    path: '/compare',
    title: `Compare Dental Chairs${suffix}`,
    description: 'Compare Aura dental chairs side by side: controls, programs, delivery unit, LED light, spittoon, foot control and upholstery.',
  },
  {
    path: '/services',
    title: `Clinic Set-up, Dental Chair Service and Repair${suffix}`,
    description: 'Clinic site planning, dental chair repair and servicing, and RVG sensor repair from Corepoint Healthcare, Ahmedabad.',
    image: '/images/installations/installation-light-blue-1600.webp',
  },
  {
    path: '/gallery',
    title: `Gallery: Dental Chairs and Installations${suffix}`,
    description: 'Photos of Aura dental chairs, recent clinic installations, dental equipment and brochures from Corepoint Healthcare.',
    image: '/images/installations/installation-grey-1600.webp',
  },
  {
    path: '/about',
    title: `About Us${suffix}`,
    description: 'Corepoint Healthcare, Ashram Road, Ahmedabad: dental chairs, dental equipment, clinic set-up and service since 2020. One stop dental solution.',
  },
  {
    path: '/contact',
    title: `Contact Us${suffix}`,
    description: 'Call +91 70469 36869, email corepointhealthcare@gmail.com or visit us at A533 Sunwest Bank, Ashram Road, Ahmedabad 380009.',
  },
  { path: '/privacy', title: `Privacy Policy${suffix}`, description: `How ${siteConfig.name} handles the information you send through this website.` },
  { path: '/terms', title: `Terms and Conditions${suffix}`, description: `Terms for using the ${siteConfig.name} website.` },
]

export const chairPages: PageMeta[] = chairs.map((chair) => ({
  path: `/dental-chairs/${chair.slug}`,
  title: `${chair.name}${/chair/i.test(chair.name) ? '' : ' Dental Chair'}${chair.series ? ` (${chair.series} Series)` : ''}${suffix}`,
  description: chair.summary,
  image: chair.variants[0].image.src,
}))

export const allPages: PageMeta[] = [...staticPages, ...chairPages]

export function pageMeta(path: string): PageMeta | undefined {
  return allPages.find((page) => page.path === path)
}
