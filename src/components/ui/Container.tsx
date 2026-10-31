import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Horizontal page frame: max content width plus responsive side gutters. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-site px-5 sm:px-8 lg:px-10', className)}>{children}</div>
}
