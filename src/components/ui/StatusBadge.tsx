import { Circle, CircleCheck, CircleDot } from 'lucide-react'
import type { CapabilityStatus } from '../../types'
import { statusCopy } from '../../content/civicsetu'
import { cn } from '../../lib/cn'

const styles: Record<CapabilityStatus, string> = {
  tested: 'border-teal-strong/30 bg-teal-tint text-teal-strong',
  implemented: 'border-deep/25 bg-mist text-deep',
  planned: 'border-dashed border-line-strong bg-white text-muted',
}

const icons = {
  tested: CircleCheck,
  implemented: CircleDot,
  planned: Circle,
} satisfies Record<CapabilityStatus, unknown>

interface StatusBadgeProps {
  status: CapabilityStatus
  className?: string
}

/** Shows how far a capability has progressed. Text, not colour, carries the meaning. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const Icon = icons[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[0.8125rem] font-medium',
        styles[status],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {statusCopy[status].label}
    </span>
  )
}
