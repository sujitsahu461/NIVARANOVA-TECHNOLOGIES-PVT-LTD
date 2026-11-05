import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'inverse' | 'glass'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-surface hover:bg-deep',
  secondary: 'border border-line-strong bg-surface text-ink hover:border-ink',
  /** For the dark closing band, which stays dark in both themes. */
  inverse: 'bg-white text-night hover:bg-teal-soft',
  /** Frosted secondary action, for use over a coloured (.aurora) background. */
  glass: 'glass border-line-strong/60 text-ink hover:border-ink/40 hover:bg-surface/85',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-4 text-[0.9375rem]',
  lg: 'min-h-12 px-6 text-base',
}

function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonLinkProps extends Omit<LinkProps, 'className'> {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

/** A navigation link styled as a button. */
export function ButtonLink({ variant, size, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ variant, size, className, type = 'button', children, ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  )
}
