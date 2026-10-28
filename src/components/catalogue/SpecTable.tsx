import { Link } from 'react-router-dom'
import { enquiryHref } from '../../data/enquiry'
import type { PendingReason, SpecGroup } from '../../types/product'
import { Reveal } from '../ui/Reveal'

const pendingText: Record<PendingReason, string> = {
  tbc: 'Specification to be confirmed',
  contact: 'Contact us for details',
}

/** Specification groups as definition lists. Missing values link to an enquiry. */
export function SpecTable({ groups, productId }: { groups: SpecGroup[]; productId: string }) {
  return (
    <div className="grid gap-x-14 gap-y-12 lg:grid-cols-2">
      {groups.map((group, groupIndex) => (
        <Reveal key={group.id} delay={(groupIndex % 2) * 0.06}>
          <h3 className="eyebrow border-b-2 border-ink pb-3 text-ink">{group.title}</h3>
          <dl className="divide-y divide-line">
            {group.items.map((item) => (
              <div key={item.id} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-6">
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="text-sm">
                  {item.value ? (
                    <span className="font-semibold text-ink">{item.value}</span>
                  ) : item.pending === 'contact' ? (
                    <Link
                      to={enquiryHref('product-information', productId)}
                      className="font-medium text-tech-ink underline decoration-tech/40 underline-offset-4 hover:decoration-tech-ink"
                    >
                      {pendingText.contact}
                    </Link>
                  ) : (
                    <span className="text-muted italic">{pendingText[item.pending ?? 'tbc']}</span>
                  )}
                  {item.note && <span className="mt-1 block text-xs text-muted">{item.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ))}
    </div>
  )
}
