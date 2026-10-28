import type { Service } from '../types/product.ts'
import { installationPhotos, productPhoto } from './images.ts'

export const services: Service[] = [
  {
    id: 'clinic-setup',
    name: 'Clinic set-up and site planning',
    summary:
      'Planning a new surgery or upgrading one? We help plan where the chair, delivery unit, compressor and imaging go, and supply the equipment as one package.',
    points: [
      'Site planning for new and expanding clinics',
      'Dental chair, imaging, sterilisation and clinic equipment from one supplier',
      'One point of contact from planning to supply',
    ],
    image: installationPhotos[0],
    enquiryType: 'product-information',
  },
  {
    id: 'chair-service',
    name: 'Dental chair repair and service',
    summary: 'Repair and servicing for dental chairs and delivery units.',
    points: ['Repair and servicing of dental chairs', 'Service in Gujarat'],
    image: productPhoto('service-chair-repair', 'Dental chair repair and service', { onWhite: false }),
    enquiryType: 'support',
  },
  {
    id: 'rvg-service',
    name: 'RVG sensor repair',
    summary: 'Repair service for dental RVG and intraoral sensors.',
    points: ['RVG sensor repair', 'Intraoral sensor repair'],
    image: productPhoto('service-rvg-repair', 'Dental RVG sensor repair', { onWhite: false }),
    enquiryType: 'support',
  },
]
