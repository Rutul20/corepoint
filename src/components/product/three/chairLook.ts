import { createContext, useContext } from 'react'
import type { ComponentId } from '../../../types/product'

/** Technical accent used to highlight the selected component in 3D. */
export const HIGHLIGHT_COLOUR = '#4D9CB7'

/** Shared state for every part of the 3D chair: colour, selection and hover. */
export interface ChairLook {
  upholstery: string
  selectedId: ComponentId | null
  hoveredId: ComponentId | null
  isEnabled: (id: ComponentId) => boolean
  onSelect: (id: ComponentId) => void
  onHover: (id: ComponentId | null) => void
}

export const ChairLookContext = createContext<ChairLook | null>(null)

export function useChairLook(): ChairLook {
  const look = useContext(ChairLookContext)
  if (!look) throw new Error('useChairLook must be used inside ChairLookContext')
  return look
}

/** Whether the component a mesh belongs to is selected or hovered. */
export const PartStateContext = createContext({ selected: false, hovered: false })
