import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10', className)}>{children}</div>
}
