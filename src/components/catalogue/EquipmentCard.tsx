import { Link } from 'react-router-dom'
import { enquiryHref } from '../../data/enquiry'
import type { EquipmentItem } from '../../types/product'
import { buttonClasses } from '../../utils/buttonClasses'
import { ProductImage } from '../product/ProductImage'

export function EquipmentCard({ item }: { item: EquipmentItem }) {
  return (
    <article className="flex h-full flex-col border border-line bg-white">
      <div className="aspect-square overflow-hidden bg-white p-4">
        <ProductImage image={item.image} fit="contain" blend sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col border-t border-line p-5">
        {item.brand && <p className="eyebrow text-[10px] text-tech-ink">{item.brand}</p>}
        <h3 className="mt-1.5 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">{item.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>
        {item.facts.length > 0 && (
          <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-[13px]">
            {item.facts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-3">
                <dt className="text-muted">{fact.label}</dt>
                <dd className="text-right font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-auto pt-5">
          <Link to={enquiryHref('quotation', item.id)} className={buttonClasses('secondary', 'sm', 'w-full')}>
            Request a quote
          </Link>
        </div>
      </div>
    </article>
  )
}
