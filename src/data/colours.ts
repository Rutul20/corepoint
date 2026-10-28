import type { UpholsteryColour } from '../types/product.ts'

/**
 * Aura upholstery colour chart (CH1–CH14), as printed in the Aura brochure.
 * Hex values are sampled from the printed chart, so treat them as close
 * approximations; the names are descriptive labels, not official ones.
 */
export const auraColours: UpholsteryColour[] = [
  { id: 'CH1', name: 'CH1 · Sky blue', hex: '#719BCB', confirmed: true },
  { id: 'CH2', name: 'CH2 · Navy', hex: '#1D223F', confirmed: true },
  { id: 'CH3', name: 'CH3 · Leaf green', hex: '#92C96B', confirmed: true },
  { id: 'CH4', name: 'CH4 · Ochre', hex: '#B8802B', confirmed: true },
  { id: 'CH5', name: 'CH5 · Coral', hex: '#D95B42', confirmed: true },
  { id: 'CH6', name: 'CH6 · Sand', hex: '#C7B19A', confirmed: true },
  { id: 'CH7', name: 'CH7 · Teal', hex: '#3F8CA3', confirmed: true },
  { id: 'CH8', name: 'CH8 · Ivory', hex: '#F0E4D8', confirmed: true },
  { id: 'CH9', name: 'CH9 · Royal blue', hex: '#1C59A9', confirmed: true },
  { id: 'CH10', name: 'CH10 · Champagne', hex: '#D4C697', confirmed: true },
  { id: 'CH11', name: 'CH11 · Silver', hex: '#CECABF', confirmed: true },
  { id: 'CH12', name: 'CH12 · Maroon', hex: '#711A2D', confirmed: true },
  { id: 'CH13', name: 'CH13 · Red', hex: '#E33F44', confirmed: true },
  { id: 'CH14', name: 'CH14 · Black', hex: '#333331', confirmed: true },
]
