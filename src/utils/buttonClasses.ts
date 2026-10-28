import { cn } from './cn'

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-black',
  accent: 'bg-accent text-white hover:bg-accent-deep',
  secondary: 'border border-line-strong bg-white/70 text-ink hover:border-ink hover:bg-white',
  ghost: 'text-ink hover:bg-ink/5',
  inverse: 'bg-white text-ink hover:bg-mist',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px]',
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string): string {
  return cn(
    'group/button inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.005em]',
    'transition-[background-color,border-color,color,transform] duration-300 ease-premium active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}
