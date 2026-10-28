import { Link, useSearchParams } from 'react-router-dom'
import { ProductImage } from '../components/product/ProductImage'
import { Container } from '../components/ui/Container'
import { CtaBand } from '../components/ui/CtaBand'
import { PageHeader } from '../components/ui/PageHeader'
import { chairs } from '../data/chairs'
import { enquiryHref } from '../data/enquiry'
import type { ChairFactKey } from '../types/product'
import { buttonClasses } from '../utils/buttonClasses'

const rows: { key: ChairFactKey; label: string }[] = [
  { key: 'operation', label: 'Operation' },
  { key: 'controls', label: 'Controls' },
  { key: 'programs', label: 'Programs' },
  { key: 'delivery', label: 'Delivery unit' },
  { key: 'light', label: 'Operating light' },
  { key: 'spittoon', label: 'Spittoon' },
  { key: 'footControl', label: 'Foot control' },
  { key: 'upholstery', label: 'Upholstery' },
  { key: 'stool', label: "Doctor's stool" },
]

const DEFAULT_SELECTION = ['aura-500', 'aura-400', 'aura-300']
const SLOTS = 3

export function ComparePage() {
  const [params, setParams] = useSearchParams()
  const requested = (params.get('chairs') ?? '').split(',').filter((id) => chairs.some((chair) => chair.id === id))
  const selection = [...requested, ...DEFAULT_SELECTION.filter((id) => !requested.includes(id))].slice(0, SLOTS)
  const selected = selection.map((id) => chairs.find((chair) => chair.id === id)).filter((chair) => chair !== undefined)
  const visibleRows = rows.filter((row) => selected.some((chair) => chair.facts[row.key]))

  const choose = (slot: number, id: string) => {
    const next = [...selection]
    next[slot] = id
    setParams({ chairs: next.join(',') }, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="Compare"
        title="Compare dental chairs."
        description="Put up to three Aura chairs side by side. All details come from our Aura brochures."
        crumbs={[{ label: 'Dental chairs', to: '/dental-chairs' }, { label: 'Compare' }]}
      />

      <section aria-label="Comparison" className="bg-white py-14 sm:py-20">
        <Container>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">Dental chair comparison</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[18%] align-bottom pb-6 text-sm font-semibold text-muted">
                    Choose chairs
                  </th>
                  {selected.map((chair, slot) => (
                    <th key={slot} scope="col" className="w-[27%] px-3 pb-6 align-top">
                      <label className="sr-only" htmlFor={`compare-${slot}`}>
                        Chair {slot + 1}
                      </label>
                      <select
                        id={`compare-${slot}`}
                        value={chair.id}
                        onChange={(event) => choose(slot, event.target.value)}
                        className="h-10 w-full rounded-sm border border-line-strong bg-white px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                      >
                        {chairs.map((option) => (
                          <option key={option.id} value={option.id} disabled={option.id !== chair.id && selection.includes(option.id)}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      <Link to={`/dental-chairs/${chair.slug}`} className="mt-4 block aspect-[4/3] overflow-hidden border border-line bg-mist">
                        <ProductImage image={chair.variants[0].image} fit={chair.variants[0].image.onWhite ? 'contain' : 'cover'} blend sizes="25vw" />
                      </Link>
                      <p className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{chair.name}</p>
                      <p className="text-[13px] font-normal text-muted">{chair.tagline}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.key} className="border-t border-line">
                    <th scope="row" className="py-4 pr-3 align-top text-sm font-medium text-muted">
                      {row.label}
                    </th>
                    {selected.map((chair, slot) => (
                      <td key={slot} className="px-3 py-4 align-top text-sm text-ink">
                        {chair.facts[row.key] ?? <span className="text-muted">Not stated</span>}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-line">
                  <td />
                  {selected.map((chair, slot) => (
                    <td key={slot} className="px-3 pt-6">
                      <div className="flex flex-col gap-2">
                        <Link to={enquiryHref('quotation', chair.id)} className={buttonClasses('accent', 'sm')}>
                          Request a quote
                        </Link>
                        <Link to={`/dental-chairs/${chair.slug}`} className={buttonClasses('secondary', 'sm')}>
                          View details
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-xs text-muted">
            &ldquo;Not stated&rdquo; means the brochure does not give that detail. Ask us and we will confirm it.
          </p>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
