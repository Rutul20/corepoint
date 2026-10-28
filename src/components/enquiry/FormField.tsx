import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

/** Label, control, hint and error message wired together with ids for screen readers. */
export function FormField({ id, label, required, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-2 text-[13px] font-semibold text-ink">
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-accent" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {!required && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] font-medium text-accent-deep">
          {error}
        </p>
      )}
    </div>
  )
}
