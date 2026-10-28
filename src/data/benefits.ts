import type { PractitionerBenefit } from '../types/product.ts'

/** Aura-500 key benefits, as listed in the Overhanging brochure. */
export const aura500Benefits: PractitionerBenefit[] = [
  {
    id: 'efficiency',
    icon: 'workflow',
    title: 'Enhanced efficiency',
    description: 'Touchscreen controls, 9 preset programs and auto return keep each appointment moving.',
  },
  {
    id: 'patient-comfort',
    icon: 'positioning',
    title: 'Patient comfort',
    description: 'Memory foam upholstery and an adjustable spittoon bowl help patients settle in.',
  },
  {
    id: 'operator-comfort',
    icon: 'working-positions',
    title: 'Operator comfort',
    description: 'A comfort dental stool with height adjustment and five castors, plus an assistant arm on the Overhanging variant.',
  },
  {
    id: 'precision',
    icon: 'instruments',
    title: 'Precision',
    description: 'An 8-LED operating light, micro-motor terminal and three-way syringe for detailed work.',
  },
  {
    id: 'flexibility',
    icon: 'controls',
    title: 'Flexibility',
    description: '360° light movement and low and high suction settings adapt the unit to the procedure.',
  },
  {
    id: 'ease-of-use',
    icon: 'appearance',
    title: 'Ease of use',
    description: 'Hands-free operation with the 4-way foot control and intuitive controls on the delivery unit.',
  },
]
