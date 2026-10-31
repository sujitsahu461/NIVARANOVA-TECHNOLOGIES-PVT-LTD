import { siteConfig } from '../../config/company'
import { cn } from '../../lib/cn'

interface PlaceholderProps {
  /** What is missing, e.g. "Business email". */
  label: string
  className?: string
}

/**
 * Marks company information that has not been verified yet.
 * Edit src/config/company.ts to replace it with the real value.
 * Hidden entirely when VITE_SHOW_PLACEHOLDERS=false.
 */
export function Placeholder({ label, className }: PlaceholderProps) {
  if (!siteConfig.showPlaceholders) return null
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border border-dashed border-line-strong bg-paper px-2 py-0.5 text-sm text-muted',
        className,
      )}
      data-placeholder={label}
    >
      {label}: to be added
    </span>
  )
}
