import { cn } from '../../lib/cn'

interface LogoMarkProps {
  className?: string
}

/**
 * The NivaraNova mark: an N whose diagonal is a route between two nodes,
 * the same route motif used across the site.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={cn('shrink-0', className)} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="7" className="fill-ink" />
      <path
        d="M10 23V9l12 14V9"
        fill="none"
        className="stroke-white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="9" r="2.6" className="fill-teal-soft" />
      <circle cx="22" cy="23" r="2.6" className="fill-teal-soft" />
    </svg>
  )
}

interface WordmarkProps {
  className?: string
  /** Use on dark backgrounds. */
  inverse?: boolean
}

export function Wordmark({ className, inverse = false }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="size-8" />
      <span
        className={cn(
          'font-display text-[1.1875rem] font-bold tracking-[-0.02em]',
          inverse ? 'text-white' : 'text-ink',
        )}
      >
        NivaraNova
      </span>
    </span>
  )
}
