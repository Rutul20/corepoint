import type { UpholsteryColour } from '../../types/product'

/** The Aura upholstery colour chart, CH1–CH14. */
export function ColourChart({ colours }: { colours: UpholsteryColour[] }) {
  return (
    <div>
      <ul className="grid grid-cols-4 gap-3 sm:grid-cols-7">
        {colours.map((colour) => {
          const [code, name] = colour.name.split(' · ')
          return (
            <li key={colour.id} className="text-center">
              <span
                aria-hidden="true"
                className="mx-auto block aspect-square w-full max-w-16 rounded-md border border-black/10 shadow-[inset_0_-8px_14px_rgba(0,0,0,0.15)]"
                style={{ backgroundColor: colour.hex }}
              />
              <span className="mt-2 block text-[12px] font-semibold text-ink">{code}</span>
              {name && <span className="block text-[11px] text-muted">{name}</span>}
            </li>
          )
        })}
      </ul>
      <p className="mt-5 text-xs text-muted">
        Colours as printed in the Aura brochure; on-screen colours are approximate. Ask us for upholstery samples and availability for your model.
      </p>
    </div>
  )
}
