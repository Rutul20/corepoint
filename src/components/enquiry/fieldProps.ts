import { cn } from '../../utils/cn'

export const inputClasses = (invalid: boolean) =>
  cn(
    'w-full rounded-sm border bg-white px-4 text-[15px] text-ink placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200',
    'focus:border-ink focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-tech/15',
    invalid ? 'border-accent' : 'border-line-strong hover:border-ink/40',
  )

/** aria attributes linking a control to its FormField error or hint. */
export function fieldAria(id: string, error?: string, hint?: string) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return { 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy }
}
