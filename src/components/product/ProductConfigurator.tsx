import type { UpholsteryColour } from '../../types/product'
import { cn } from '../../utils/cn'

interface ProductConfiguratorProps {
  colours: UpholsteryColour[]
  selectedId: string
  onChange: (id: string) => void
  /** Small print under the swatches. */
  note?: string
}

/**
 * Upholstery colour picker. Hidden when only one colour is offered.
 * Unconfirmed (sample) colours are labelled as such.
 */
export function ProductConfigurator({ colours, selectedId, onChange, note }: ProductConfiguratorProps) {
  if (colours.length < 2) return null
  const selected = colours.find((c) => c.id === selectedId) ?? colours[0]
  const hasSamples = colours.some((c) => !c.confirmed)

  return (
    <fieldset className="border border-line bg-white px-5 py-5">
      <legend className="sr-only">Upholstery colour</legend>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p aria-hidden="true" className="eyebrow text-muted">
          Upholstery colour chart
        </p>
        {hasSamples && (
          <span className="rounded-sm border border-dashed border-line-strong bg-mist px-2 py-0.5 text-[11px] text-muted">
            Sample colours, to be confirmed
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {colours.map((colour) => (
          <label key={colour.id} className="relative cursor-pointer" title={colour.name}>
            <input
              type="radio"
              name="upholstery-colour"
              value={colour.id}
              checked={colour.id === selected.id}
              onChange={() => onChange(colour.id)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                'block h-8 w-8 rounded-full border border-black/10 shadow-[inset_0_-6px_10px_rgba(0,0,0,0.18)] ring-offset-2 transition-shadow duration-300',
                'peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-tech-ink',
              )}
              style={{ backgroundColor: colour.hex }}
            />
            <span className="sr-only">
              {colour.name}
              {!colour.confirmed && ' (sample colour)'}
            </span>
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink" aria-live="polite">
        <span className="font-semibold">{selected.name}</span>
        {!selected.confirmed && <span className="text-muted"> · sample</span>}
      </p>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </fieldset>
  )
}
