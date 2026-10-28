import { AnimatePresence, m } from 'framer-motion'
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ComponentId, ImagePoint, ProductComponent, ProductImageAsset, ViewerConfig } from '../../types/product'
import { ProductImage } from './ProductImage'

/** The main product photo magnified around a hotspot: the close-up when no dedicated photo exists. */
function ZoomedPhoto({ image, point }: { image: ProductImageAsset; point: ImagePoint }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <div className="absolute inset-0" style={{ transform: 'scale(2.6)', transformOrigin: `${point.x}% ${point.y}%` }}>
        <ProductImage image={image} fit="contain" blend />
      </div>
    </div>
  )
}

interface ComponentPanelProps {
  viewer: ViewerConfig
  /** Enabled components, in hotspot order. */
  components: ProductComponent[]
  selectedId: ComponentId | null
  onSelect: (id: ComponentId | null) => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function ComponentPanel({ viewer, components, selectedId, onSelect }: ComponentPanelProps) {
  const index = components.findIndex((c) => c.id === selectedId)
  const selected = index >= 0 ? components[index] : null
  const total = components.length
  const step = (delta: number) => onSelect(components[(index + delta + total) % total].id)
  const selectedPoint = viewer.hotspots.find((h) => h.componentId === selectedId)?.photo

  return (
    <div className="border border-line bg-white">
      <p className="sr-only" aria-live="polite">
        {selected ? `${selected.name} selected.` : ''}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        {selected ? (
          <m.div
            key={selected.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All components
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous component"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next component"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="px-5 pb-6 pt-5">
              <p className="eyebrow text-tech-ink">
                Component {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
              <h3 className="mt-2 text-2xl font-semibold uppercase tracking-[0.02em] text-ink">{selected.name}</h3>
              {selected.closeUp ? (
                <div className="mt-4 aspect-[4/3] overflow-hidden border border-line bg-white">
                  <ProductImage image={selected.closeUp} fit="contain" blend sizes="(min-width: 1024px) 30vw, 100vw" />
                </div>
              ) : selectedPoint ? (
                <div className="mt-4 aspect-[4/3] overflow-hidden border border-line" aria-hidden="true">
                  <ZoomedPhoto image={viewer.photo} point={selectedPoint} />
                </div>
              ) : null}
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{selected.description}</p>
              <h4 className="eyebrow mt-6 text-muted">Key benefits</h4>
              <ul className="mt-3 space-y-2.5">
                {selected.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm leading-snug text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-tech-ink" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        ) : (
          <m.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="border-b border-line px-5 py-4">
              <p className="eyebrow text-muted">Components</p>
              <p className="mt-1 text-sm text-muted">Select a component to see what it does.</p>
            </div>
            <ul className="divide-y divide-line">
              {components.map((component, i) => (
                <li key={component.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(component.id)}
                    className="group flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-mist"
                  >
                    <span className="w-6 text-[11px] font-bold tabular-nums text-tech-ink">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 text-[15px] font-medium text-ink">{component.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
