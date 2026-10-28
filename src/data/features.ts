import type { ProductFeature } from '../types/product.ts'
import { productPhoto } from './images.ts'

/** Aura-500 feature stories, from the Premium Plus and Overhanging brochures. */
export const aura500Features: ProductFeature[] = [
  {
    id: 'patient-comfort',
    category: 'Patient comfort',
    title: 'Memory foam, head to foot',
    description:
      'Memory foam upholstery across the headrest, backrest, seat and leg rest, with a spittoon bowl that moves towards the patient.',
    benefit: 'Keeps patients comfortable through longer procedures.',
    components: ['seat', 'spittoon'],
    image: productPhoto('aura-500-premium-plus-4', 'Aura-500 Premium Plus with light blue upholstery installed in a clinic', { onWhite: false }),
  },
  {
    id: 'ergonomic-positioning',
    category: 'Ergonomic positioning',
    title: '9 preset programs, auto return',
    description:
      'Store chair positions for different procedures and recall them from the touch panel. Auto return brings the chair back to its starting position.',
    benefit: 'Repeatable positioning and a faster turnaround between patients.',
    components: ['backrest', 'control-panel'],
    image: productPhoto('aura-500-overhanging-1', 'Aura-500 Overhanging dental chair with green upholstery'),
  },
  {
    id: 'instrument-accessibility',
    category: 'Instrument accessibility',
    title: 'Trolley or over-arm delivery',
    description:
      'Choose the Premium Plus hydraulic trolley, which moves around the surgery, or the Overhanging unit with pneumatic lock, 2 air-rotor terminals, a three-way syringe and a micro-motor terminal.',
    benefit: 'Instruments where you want them, whichever way your surgery is laid out.',
    components: ['delivery-system', 'instrument-tray'],
    image: productPhoto('aura-500-premium-plus-2', 'Aura-500 Premium Plus mobile trolley delivery unit'),
  },
  {
    id: 'clinical-workflow',
    category: 'Clinical workflow',
    title: 'An assistant arm as standard',
    description:
      'The Overhanging variant adds an assistant arm with two canulae for low and high pneumatic suction and a three-way syringe.',
    benefit: 'Clinician and assistant each have their own instruments within reach.',
    components: ['delivery-system'],
    image: productPhoto('aura-500-overhanging-3', 'Aura-500 delivery unit with handpiece holders and control buttons'),
  },
  {
    id: 'control-operation',
    category: 'Control and operation',
    title: 'Touch panel and 4-way foot control',
    description:
      'Chair settings on an intuitive touch panel, plus a 4-way foot control for hands-free operation on the Overhanging variant.',
    benefit: 'Hands stay on the procedure; fewer surfaces touched.',
    components: ['control-panel', 'foot-control'],
    image: productPhoto('aura-500-premium-plus-1', 'Aura-500 Premium Plus with touch panel on the trolley delivery unit'),
  },
  {
    id: 'design-construction',
    category: 'Lighting',
    title: 'Healthy 8-LED light',
    description:
      'An 8-LED operating light with adjustable intensity and 360° three-axis movement, sensor-activated on the Overhanging variant.',
    benefit: 'A bright, clear working field that is gentle on the eyes.',
    components: ['operating-light'],
    image: productPhoto('aura-500-overhanging-4', 'Aura-500 8-LED operating light'),
  },
]
