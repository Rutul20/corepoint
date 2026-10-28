import type { Product, SpecGroup, SpecItem } from '../types/product.ts'
import { aura500Benefits } from './benefits.ts'
import { auraColours } from './colours.ts'
import { aura500Components } from './components.ts'
import { aura500Features } from './features.ts'
import { localPhoto, productPhoto } from './images.ts'
import { aura500Viewer } from './viewer.ts'

/*
 * Dental chairs: the four Aura models, from Corepoint Healthcare's own
 * brochures. Only stated facts are used; everything else stays "to be
 * confirmed". Prices are deliberately not shown.
 */

const spec = (id: string, label: string, value: string, note?: string): SpecItem => ({ id, label, value, note })
const tbc = (id: string, label: string): SpecItem => ({ id, label, value: null, pending: 'tbc' })
const ask = (id: string, label: string): SpecItem => ({ id, label, value: null, pending: 'contact' })

/** Figures not given in any brochure yet. */
const toConfirm: SpecGroup = {
  id: 'to-confirm',
  title: 'Dimensions, power and warranty',
  items: [
    tbc('dimensions', 'Overall dimensions'),
    tbc('max-load', 'Maximum patient load'),
    tbc('power', 'Power requirements'),
    ask('warranty', 'Warranty'),
    ask('certifications', 'Certifications'),
  ],
}

const upholsteryColours = spec('colours', 'Upholstery colours', '14 colours, CH1–CH14', 'See the colour chart')
const comfortStool = spec('stool', "Doctor's stool", 'Comfort dental stool: zero back-ache design, height adjustment, 5 castors')

const brochure = (id: string, base: string, width: number, height: number, alt: string) =>
  localPhoto(id, base, [[1100, width, height]], alt, { caption: alt })

/* ------------------------------------------------------------------ */
/* Aura-500                                                           */
/* ------------------------------------------------------------------ */

export const aura500: Product = {
  id: 'aura-500',
  slug: 'aura-500',
  name: 'Aura-500',
  series: 'Aura',
  brand: 'Corepoint Healthcare',
  ownLabel: true,
  category: 'Dental chair',
  tagline: 'Our flagship dental unit',
  summary: 'Flagship Aura dental unit with 9 preset programs, auto return, an 8-LED light and a choice of trolley or over-arm delivery.',
  description:
    'The Aura-500 is the top of the Aura range: a well-equipped, versatile dental unit designed to make procedures more efficient and more comfortable. It comes in two versions: Premium Plus, with a mobile hydraulic trolley, and Overhanging, with a compact over-arm delivery unit and assistant arm.',
  facts: {
    controls: 'Touch panel',
    programs: '9 preset programs, auto return',
    delivery: 'Hydraulic trolley (Premium Plus) or over-arm with pneumatic lock (Overhanging)',
    light: '8-LED, adjustable intensity, 360° 3-axis',
    spittoon: '90° movable bowl (glass swivel bowl on Overhanging)',
    footControl: '4-way, hands-free (Overhanging)',
    upholstery: 'Memory foam, 14 colours',
    stool: 'Comfort dental stool, 5 castors',
  },
  variants: [
    {
      id: 'premium-plus',
      name: 'Premium Plus',
      label: 'Mobile trolley delivery unit',
      description:
        'The trolley-type unit brings mobility and convenience: hydraulic, motorised up-and-down movement, easy movement around the dental office, and a compact size that helps make the most of clinic space.',
      image: productPhoto('aura-500-premium-plus-1', 'Aura-500 Premium Plus dental chair with trolley delivery unit, 8-LED light and spittoon'),
      gallery: [
        productPhoto('aura-500-premium-plus-1', 'Aura-500 Premium Plus dental chair with trolley delivery unit'),
        productPhoto('aura-500-premium-plus-2', 'Aura-500 Premium Plus mobile trolley delivery unit'),
        productPhoto('aura-500-premium-plus-3', 'Aura-500 Premium Plus spittoon bowl with cup filler'),
        productPhoto('aura-500-premium-plus-4', 'Aura-500 Premium Plus installed in a clinic', { onWhite: false }),
      ],
      badges: ['Save space', 'Move as you want', 'Full-featured', 'Take care of both sides'],
      highlights: [
        'Hydraulic trolley with motorised up-and-down movement',
        'Trolley moves easily around the dental office',
        'Compact unit that helps optimise clinic space',
        '9 preset programs and auto return',
        'Memory foam upholstery',
        '90° movable spittoon bowl',
        'Healthy 8-LED light with adjustable intensity and position, 360° 3-axis movement',
        'Comfort dental stool with height adjustment and 5 castors',
      ],
      specifications: [
        {
          id: 'chair',
          title: 'Chair',
          items: [
            spec('positions', 'Positioning', 'Range of adjustable positions'),
            spec('programs', 'Preset programs', '9'),
            spec('auto-return', 'Auto return', 'Yes, to a predetermined position'),
            spec('upholstery', 'Upholstery', 'Memory foam'),
            upholsteryColours,
          ],
        },
        {
          id: 'delivery',
          title: 'Delivery unit',
          items: [
            spec('type', 'Type', 'Trolley (mobile cart)'),
            spec('height', 'Height adjustment', 'Hydraulic, motorised up and down'),
            spec('footprint', 'Footprint', 'Compact, to optimise clinic space'),
          ],
        },
        {
          id: 'light-water',
          title: 'Light and spittoon',
          items: [
            spec('light', 'Operating light', 'Healthy 8-LED light'),
            spec('light-adjust', 'Light adjustment', 'Adjustable intensity and position'),
            spec('light-movement', 'Light movement', '360°, 3-axis'),
            spec('spittoon', 'Spittoon', '90° movable spittoon bowl'),
          ],
        },
        { id: 'included', title: 'Included', items: [comfortStool] },
        toConfirm,
      ],
      brochure: [
        brochure('brochure-aura-500-premium-plus', '/images/brochures/aura-500-premium-plus', 1051, 734, 'Aura-500 Premium Plus brochure'),
      ],
    },
    {
      id: 'overhanging',
      name: 'Overhanging',
      label: 'Over-arm delivery unit with assistant arm',
      description:
        'A comprehensive suite of features for efficiency, comfort and precision: a compact overhanging delivery unit with pneumatic lock, an assistant arm with high and low suction, a sensor-activated 8-LED light and a 4-way foot control for hands-free operation.',
      image: productPhoto('aura-500-overhanging-1', 'Aura-500 Overhanging dental chair with green upholstery and over-arm delivery unit'),
      gallery: [
        productPhoto('aura-500-overhanging-1', 'Aura-500 Overhanging dental chair with over-arm delivery unit'),
        productPhoto('aura-500-overhanging-3', 'Aura-500 Overhanging delivery unit with control buttons and handpiece holders'),
        productPhoto('aura-500-overhanging-2', 'Aura-500 Overhanging spittoon with cup filler'),
        productPhoto('aura-500-overhanging-4', 'Aura-500 8-LED operating light'),
      ],
      highlights: [
        'Touch panel for chair settings',
        'Over-arm delivery unit with 9 preset programs',
        'Auto return to zero position',
        'Memory foam upholstery',
        'Swivel spittoon bowl made of glass',
        '8-LED light: adjustable intensity, sensor-activated, 360° movement',
        'Compact overhanging delivery unit with pneumatic lock',
        '2 air-rotor terminals, three-way syringe and micro-motor terminal',
        '4-way foot control for hands-free operation',
        'Assistant arm with 2 canulae for low and high pneumatic suction',
      ],
      specifications: [
        {
          id: 'chair',
          title: 'Chair',
          items: [
            spec('controls', 'Controls', 'Touch panel'),
            spec('programs', 'Preset programs', '9'),
            spec('auto-return', 'Auto return', 'Yes, to zero position'),
            spec('upholstery', 'Upholstery', 'Memory foam'),
            upholsteryColours,
          ],
        },
        {
          id: 'delivery',
          title: 'Delivery unit',
          items: [
            spec('type', 'Type', 'Compact overhanging (over-arm)'),
            spec('lock', 'Lock', 'Pneumatic'),
            spec('air-rotor', 'Air-rotor terminals', '2'),
            spec('syringe', 'Three-way syringe', '1'),
            spec('micro-motor', 'Micro-motor', 'Terminal for micro-motor'),
          ],
        },
        {
          id: 'assistant',
          title: 'Assistant arm',
          items: [
            spec('suction', 'Suction', '2 canulae for low and high pneumatic suction'),
            spec('assistant-syringe', 'Syringe', 'Three-way syringe'),
          ],
        },
        {
          id: 'light-water',
          title: 'Light, spittoon and controls',
          items: [
            spec('light', 'Operating light', '8-LED, adjustable intensity, sensor-activated'),
            spec('light-movement', 'Light movement', '360°'),
            spec('spittoon', 'Spittoon', 'Swivel bowl made of glass'),
            spec('foot-control', 'Foot control', '4-way, hands-free'),
          ],
        },
        { id: 'included', title: 'Included', items: [spec('stool', "Doctor's stool", 'Comfort dental stool, ergonomic design')] },
        toConfirm,
      ],
      brochure: [brochure('brochure-aura-500-overhanging', '/images/brochures/aura-500-overhanging', 1063, 741, 'Aura-500 Overhanging brochure')],
    },
  ],
  experience: {
    viewer: aura500Viewer,
    components: aura500Components,
    features: aura500Features,
    benefits: aura500Benefits,
    colours: auraColours,
    defaultColourId: 'CH3',
  },
  verified: true,
}

/* ------------------------------------------------------------------ */
/* Aura-400, 300 and 200                                              */
/* ------------------------------------------------------------------ */

export const aura400: Product = {
  id: 'aura-400',
  slug: 'aura-400',
  name: 'Aura-400',
  series: 'Aura',
  brand: 'Corepoint Healthcare',
  ownLabel: true,
  category: 'Dental chair',
  tagline: 'Fully electric, synchronised movement',
  summary: 'Fully electric Aura chair with synchronised movement, under-the-arm delivery, 9 preset programs and sensor-operated water control.',
  description:
    'A well-designed, feature-rich dental unit. The fully electric chair moves with coordinated, synchronised adjustments for smooth transitions between positions, with an under-the-arm delivery unit that keeps instruments and materials easy to reach.',
  facts: {
    operation: 'Fully electric, synchronised movement',
    controls: 'Touch panel',
    programs: '9 preset programs, auto return',
    delivery: 'Under-the-arm delivery unit',
    light: '6-LED, adjustable intensity, 360° 3-axis',
    spittoon: '90° movable bowl, sensor-operated water control',
    upholstery: 'Memory foam, 14 colours',
    stool: 'Comfort dental stool, 5 castors',
  },
  variants: [
    {
      id: 'standard',
      name: 'Aura-400',
      label: 'Under-the-arm delivery unit',
      description: 'Fully electric operation with a touch panel, synchronised movement and sensor-operated water control.',
      image: productPhoto('aura-400-1', 'Aura-400 dental chair with blue upholstery, 6-LED light and under-the-arm delivery unit'),
      gallery: [
        productPhoto('aura-400-1', 'Aura-400 dental chair with blue upholstery'),
        productPhoto('aura-400-3', 'Aura-400 delivery unit with control buttons and handpieces'),
        productPhoto('aura-400-2', 'Aura-400 spittoon unit'),
      ],
      highlights: [
        'Fully electrically operated chair with touch panel',
        'Synchronised movement for smooth transitions between positions',
        'Under-the-arm delivery unit',
        '9 preset programs and auto return',
        'Memory foam upholstery',
        '90° movable spittoon bowl',
        'Sensor-operated water control',
        'Healthy 6-LED light with adjustable intensity and 360° 3-axis movement',
        'Comfort dental stool with height adjustment and 5 castors',
      ],
      specifications: [
        {
          id: 'chair',
          title: 'Chair',
          items: [
            spec('operation', 'Operation', 'Fully electric'),
            spec('movement', 'Movement', 'Synchronised, coordinated adjustments'),
            spec('controls', 'Controls', 'Touch panel'),
            spec('programs', 'Preset programs', '9'),
            spec('auto-return', 'Auto return', 'Yes'),
            spec('upholstery', 'Upholstery', 'Memory foam'),
            upholsteryColours,
          ],
        },
        { id: 'delivery', title: 'Delivery unit', items: [spec('type', 'Type', 'Under-the-arm')] },
        {
          id: 'light-water',
          title: 'Light and water',
          items: [
            spec('light', 'Operating light', 'Healthy 6-LED light'),
            spec('light-adjust', 'Light adjustment', 'Adjustable intensity'),
            spec('light-movement', 'Light movement', '360°, 3-axis'),
            spec('spittoon', 'Spittoon', '90° movable spittoon bowl'),
            spec('water', 'Water control', 'Sensor-operated'),
          ],
        },
        { id: 'included', title: 'Included', items: [comfortStool] },
        toConfirm,
      ],
      brochure: [brochure('brochure-aura-400', '/images/brochures/aura-400', 1060, 737, 'Aura-400 brochure')],
    },
  ],
  verified: true,
}

export const aura300: Product = {
  id: 'aura-300',
  slug: 'aura-300',
  name: 'Aura-300',
  series: 'Aura',
  brand: 'Corepoint Healthcare',
  ownLabel: true,
  category: 'Dental chair',
  tagline: 'A focused, more affordable Aura',
  summary: 'Aura chair with touch panel, 4 programs, 4-LED light, counterbalance flex arm and 4-way foot control, at a more affordable price.',
  description:
    'The Aura-300 offers a focused set of features designed to improve efficiency, comfort, precision and hygiene in dental procedures, while providing a more affordable option than the higher-tier Aura models.',
  facts: {
    controls: 'Touch panel',
    programs: '4 programs, auto return',
    delivery: 'Counterbalance flex arm with pneumatic lock, broad tray',
    light: '4-LED, adjustable intensity, 360° 3-axis',
    spittoon: '90° movable bowl',
    footControl: '4-way, hands-free',
    upholstery: 'Memory foam, 14 colours',
    stool: 'Zero back-ache dental stool',
  },
  variants: [
    {
      id: 'standard',
      name: 'Aura-300',
      label: 'Counterbalance flex arm delivery',
      description: 'Touch panel control, a counterbalance flex arm with pneumatic lock and hands-free operation through a 4-way foot control.',
      image: productPhoto('aura-300-1', 'Aura-300 dental chair with purple upholstery, 4-LED light and delivery unit'),
      gallery: [productPhoto('aura-300-1', 'Aura-300 dental chair with purple upholstery')],
      highlights: [
        'Touch panel for chair functions',
        '4 programs and auto return',
        'Memory foam upholstery',
        '90° movable spittoon bowl',
        'Healthy 4-LED light with adjustable intensity and 360° 3-axis movement',
        'Counterbalance flex arm with pneumatic lock and broad delivery tray',
        'Hands-free operation with a 4-way foot control',
        'Zero back-ache dental stool',
      ],
      specifications: [
        {
          id: 'chair',
          title: 'Chair',
          items: [
            spec('controls', 'Controls', 'Touch panel'),
            spec('programs', 'Programs', '4'),
            spec('auto-return', 'Auto return', 'Yes'),
            spec('upholstery', 'Upholstery', 'Memory foam'),
            upholsteryColours,
          ],
        },
        {
          id: 'delivery',
          title: 'Delivery unit',
          items: [
            spec('arm', 'Arm', 'Counterbalance flex arm'),
            spec('lock', 'Lock', 'Pneumatic'),
            spec('tray', 'Tray', 'Broad delivery tray'),
          ],
        },
        {
          id: 'light-water',
          title: 'Light, spittoon and controls',
          items: [
            spec('light', 'Operating light', 'Healthy 4-LED light'),
            spec('light-adjust', 'Light adjustment', 'Adjustable intensity'),
            spec('light-movement', 'Light movement', '360°, 3-axis'),
            spec('spittoon', 'Spittoon', '90° movable spittoon bowl'),
            spec('foot-control', 'Foot control', '4-way, hands-free'),
          ],
        },
        { id: 'included', title: 'Included', items: [spec('stool', "Doctor's stool", 'Zero back-ache dental stool')] },
        toConfirm,
      ],
      brochure: [brochure('brochure-aura-300', '/images/brochures/aura-300', 1057, 734, 'Aura-300 brochure')],
    },
  ],
  verified: true,
}

export const aura200: Product = {
  id: 'aura-200',
  slug: 'aura-200',
  name: 'Aura-200',
  series: 'Aura',
  brand: 'Corepoint Healthcare',
  ownLabel: true,
  category: 'Dental chair',
  tagline: 'Full features, friendly budget',
  summary: 'Fully electric Aura chair with touch screen, joystick control, 28,000 lux LED light, ceramic spittoon and assistant arm.',
  description:
    'The Aura-200 brings efficiency, comfort and technology together in an attractive design at a friendly budget, for modern dental practices that need reliability and ease of use.',
  facts: {
    operation: 'Fully electric',
    controls: 'Touch screen panel and joystick',
    delivery: 'Under-the-arm, 3-way operating system, pneumatic lock',
    light: 'LED, 28,000 lux, multiple intensities, sensor operated, 360° 3-axis',
    spittoon: '90° movable ceramic bowl',
    footControl: 'Multifunctional',
    upholstery: 'Memory foam, 14 colours',
    stool: "Zero back-ache doctor's stool, 5 castors",
  },
  variants: [
    {
      id: 'standard',
      name: 'Aura-200',
      label: 'Under-the-arm delivery unit',
      description:
        'Fully electric operation with a touch screen panel for all chair controls, and a joystick for up-down, back-forward and spittoon tumbler movements.',
      image: productPhoto('aura-200-1', 'Aura-200 dental chair installed in a clinic', { onWhite: false }),
      gallery: [
        productPhoto('aura-200-1', 'Aura-200 dental chair installed in a clinic', { onWhite: false }),
        productPhoto('aura-200-3', 'Dental chair installation by Corepoint Healthcare', { onWhite: false }),
      ],
      highlights: [
        'Fully electrically operated dental chair',
        'Touch screen panel for all chair controls',
        'Joystick for up-down, back-forward and spittoon tumbler',
        'Under-the-arm delivery unit with 3-way operating system: main unit, assistant side and foot control',
        'Auto return to zero position',
        'Memory foam upholstery',
        '90° movable ceramic spittoon bowl',
        'LED light, 28,000 lux, with multiple intensity control and sensor operation',
        'Big working tray and broad delivery tray',
        "Zero back-ache doctor's stool with 5 castors",
      ],
      specifications: [
        {
          id: 'chair',
          title: 'Chair',
          items: [
            spec('operation', 'Operation', 'Fully electric'),
            spec('controls', 'Controls', 'Touch screen panel for all chair controls'),
            spec('joystick', 'Joystick', 'Up-down, back-forward and spittoon tumbler'),
            spec('auto-return', 'Auto return', 'Yes, to zero position'),
            spec('upholstery', 'Upholstery', 'Memory foam'),
            upholsteryColours,
          ],
        },
        {
          id: 'delivery',
          title: 'Delivery unit',
          items: [
            spec('type', 'Type', 'Under-the-arm, 3-way operating system (main unit, assistant side, foot control)'),
            spec('lock', 'Lock', 'Pneumatic'),
            spec('tray', 'Tray', 'Big working tray, broad delivery tray'),
            spec('air-rotor', 'Air-rotor terminals', '2'),
            spec('syringe', 'Three-way syringe', 'Yes'),
            spec('micro-motor', 'Micro-motor', '1 inbuilt terminal, digital control'),
          ],
        },
        {
          id: 'assistant',
          title: 'Assistant arm',
          items: [
            spec('suction', 'Suction', '2 canulae for low and high pneumatic suction'),
            spec('assistant-syringe', 'Syringe', 'Three-way syringe'),
          ],
        },
        {
          id: 'light-water',
          title: 'Light, spittoon and controls',
          items: [
            spec('light', 'Operating light', 'LED, 28,000 lux'),
            spec('light-adjust', 'Light adjustment', 'Multiple intensity levels, sensor operated'),
            spec('light-movement', 'Light movement', '360°, 3-axis'),
            spec('spittoon', 'Spittoon', '90° movable bowl, ceramic'),
            spec('foot-control', 'Foot control', 'Multifunctional'),
          ],
        },
        { id: 'included', title: 'Included', items: [spec('stool', "Doctor's stool", 'Zero back-ache stool, 5 castors, back and front movement')] },
        toConfirm,
      ],
      brochure: [
        localPhoto('brochure-aura-200-cover', '/images/brochures/aura-200-cover', [[700, 655, 917]], 'Aura-200 brochure cover', { caption: 'Aura-200 brochure cover' }),
        localPhoto('brochure-aura-200-features', '/images/brochures/aura-200-features', [[700, 649, 890]], 'Aura-200 key features', { caption: 'Aura-200 key features' }),
      ],
    },
  ],
  verified: true,
}

/** The Aura range: the only chairs on the site. */
export const auraChairs: Product[] = [aura500, aura400, aura300, aura200]

export const chairs: Product[] = auraChairs

export function getChairBySlug(slug: string): Product | undefined {
  return chairs.find((chair) => chair.slug === slug)
}
