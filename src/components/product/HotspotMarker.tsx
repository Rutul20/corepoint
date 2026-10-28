import type { CSSProperties } from 'react'
import { cn } from '../../utils/cn'

interface HotspotMarkerProps {
  index: number
  label: string
  selected: boolean
  onSelect: () => void
  /** Hidden markers (e.g. behind the 3D model) are invisible and skipped by Tab. */
  hidden?: boolean
  /**
   * `absolute`: positioned with `style.left/top` and centred on that point (illustration view).
   * `inline`: in normal flow; the 3D view positions and centres it itself.
   */
  layout?: 'absolute' | 'inline'
  className?: string
  style?: CSSProperties
}

/** Numbered, keyboard-accessible hotspot used on both the illustration and the 3D model. */
export function HotspotMarker({ index, label, selected, onSelect, hidden = false, layout = 'absolute', className, style }: HotspotMarkerProps) {
  const number = String(index + 1).padStart(2, '0')
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${number}: ${label}`}
      aria-pressed={selected}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden || undefined}
      style={style}
      className={cn(
        'group/hotspot flex h-8 w-8 items-center justify-center rounded-full transition-opacity duration-300 sm:h-7 sm:w-7',
        layout === 'absolute' ? 'absolute -translate-x-1/2 -translate-y-1/2' : 'relative',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
        className,
      )}
    >
      {!selected && <span aria-hidden="true" className="animate-pulse-ring absolute inset-0 rounded-full bg-tech/45" />}
      <span
        aria-hidden="true"
        className={cn(
          'relative flex h-6 w-6 items-center justify-center rounded-full border-2 text-[9px] font-bold tabular-nums shadow-[0_2px_8px_rgba(20,22,25,0.18)] transition-[background-color,border-color,color,transform] duration-300 group-hover/hotspot:scale-110 sm:h-[22px] sm:w-[22px]',
          selected ? 'scale-110 border-accent bg-accent text-white' : 'border-tech bg-white text-tech-ink',
        )}
      >
        {number}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-sm bg-ink px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover/hotspot:opacity-100 group-focus-visible/hotspot:opacity-100"
      >
        {label}
      </span>
    </button>
  )
}
