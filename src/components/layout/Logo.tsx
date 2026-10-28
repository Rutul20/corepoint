import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { cn } from '../../utils/cn'

/**
 * Corepoint Healthcare mark (dark "C" enclosing a red "P"), redrawn as SVG
 * from the business card and brochures. Replace with the official artwork
 * when the original logo file is available.
 */
export function LogoMark({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path d="M36.7 11.3 A18 18 0 1 0 36.7 36.7" fill="none" stroke={tone === 'dark' ? '#1F2240' : '#FFFFFF'} strokeWidth="8" />
      <path d="M19 15.5h7.5a6 6 0 0 1 0 12H24.5v7h-5.5z" fill="#D71935" />
    </svg>
  )
}

export function Logo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const [first, ...rest] = siteConfig.name.split(' ')
  return (
    <Link to="/" aria-label={`${siteConfig.name}, home`} className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark tone={tone} className="h-9 w-9 shrink-0" />
      <span
        className={cn(
          'flex flex-col font-serif text-[15px] font-bold uppercase leading-[0.95] tracking-[0.02em]',
          tone === 'dark' ? 'text-brand' : 'text-white',
        )}
      >
        <span>{first}</span>
        <span className={tone === 'dark' ? 'text-brand-blue' : 'text-white/80'}>{rest.join(' ')}</span>
      </span>
    </Link>
  )
}
