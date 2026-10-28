import type { ProductComponent } from '../types/product.ts'
import { productPhoto } from './images.ts'

/**
 * Selectable parts of the Aura-500 in the product explorer. Copy is taken
 * from the Aura-500 Premium Plus and Overhanging brochures; where the two
 * variants differ, the description says which one has what.
 */
export const aura500Components: ProductComponent[] = [
  {
    id: 'headrest',
    name: 'Headrest',
    description: "Supports the patient's head at the top of the backrest, upholstered to match the chair.",
    benefits: ['Supports patient positioning', 'Matches the memory foam upholstery of the chair'],
    enabled: true,
  },
  {
    id: 'backrest',
    name: 'Backrest',
    description: 'Memory foam backrest that moves with the chair through its preset positions and auto return.',
    benefits: ['9 preset programs for different procedures', 'Auto return to the starting position'],
    enabled: true,
  },
  {
    id: 'seat',
    name: 'Memory foam upholstery',
    description: 'Seat and leg rest in memory foam upholstery, available in the 14 colours of the Aura colour chart.',
    benefits: ['Enhanced comfort for patients during procedures', 'Choose from colours CH1–CH14'],
    enabled: true,
  },
  {
    id: 'armrests',
    name: 'Armrest',
    description: 'A curved armrest beside the seat for patients to rest their arm and hold when getting in and out.',
    benefits: ['Helps patients settle into the chair', 'Something to hold when getting up'],
    enabled: true,
  },
  {
    id: 'instrument-tray',
    name: 'Instrument tray',
    description: 'A broad tray on top of the delivery unit for instruments and materials during a procedure.',
    benefits: ['Space for instruments and materials', 'Moves with the delivery unit'],
    enabled: true,
  },
  {
    id: 'delivery-system',
    name: 'Delivery unit',
    description:
      'Premium Plus: a mobile trolley with hydraulic, motorised up-and-down movement. Overhanging: a compact over-arm unit with pneumatic lock, 2 air-rotor terminals, a three-way syringe and a micro-motor terminal.',
    benefits: ['Trolley moves around the surgery and saves space', 'Over-arm unit locks securely in place'],
    enabled: true,
    closeUp: productPhoto('aura-500-premium-plus-2', 'Aura-500 Premium Plus mobile trolley delivery unit'),
  },
  {
    id: 'control-panel',
    name: 'Touch panel',
    description: 'Touch panel on the delivery unit for chair functions, including the 9 preset programs and auto return.',
    benefits: ['Intuitive control of chair settings', 'Recall preset positions in one touch'],
    enabled: true,
    closeUp: productPhoto('aura-500-overhanging-3', 'Aura-500 delivery unit with touch panel and handpiece holders'),
  },
  {
    id: 'operating-light',
    name: '8-LED operating light',
    description: 'Healthy 8-LED light with adjustable intensity and 360° three-axis movement. Sensor-activated on the Overhanging variant.',
    benefits: ['Bright, clear working field that is gentle on the eyes', 'Positions precisely over the treatment area'],
    enabled: true,
    closeUp: productPhoto('aura-500-overhanging-4', 'Aura-500 8-LED operating light'),
  },
  {
    id: 'spittoon',
    name: 'Spittoon bowl',
    description: 'Spittoon bowl with cup filler that moves through 90° towards the patient. The Overhanging variant has a swivel bowl made of glass.',
    benefits: ['Positions for patient comfort', 'Easy to clean'],
    enabled: true,
    closeUp: productPhoto('aura-500-premium-plus-3', 'Aura-500 spittoon bowl with cup filler'),
  },
  {
    id: 'foot-control',
    name: 'Foot control',
    description: '4-way foot control for hands-free operation (Overhanging variant).',
    benefits: ['Hands stay free for the procedure', 'Fewer surfaces touched during treatment'],
    enabled: true,
  },
  {
    id: 'chair-base',
    name: 'Chair base',
    description: 'The enclosed base and column that carry the chair through its range of positions.',
    benefits: ['Stable foundation for the whole unit', 'Smooth, easy-to-clean surfaces'],
    enabled: true,
  },
]
