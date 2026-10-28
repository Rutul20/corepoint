import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  id?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
  titleClassName?: string
}

export function SectionHeading({ eyebrow, title, description, id, align = 'left', tone = 'light', className, titleClassName }: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className={cn('eyebrow flex items-center gap-3', dark ? 'text-white/60' : 'text-muted', align === 'center' && 'justify-center')}>
        <span aria-hidden="true" className="h-px w-8 bg-accent" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          'mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-balance sm:text-[2.6rem] lg:text-[3.1rem]',
          dark ? 'text-white' : 'text-ink',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('mt-5 text-base leading-relaxed text-pretty sm:text-lg', dark ? 'text-white/70' : 'text-muted')}>{description}</p>
      )}
    </Reveal>
  )
}
