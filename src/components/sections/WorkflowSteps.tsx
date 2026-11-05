import type { WorkflowStep } from '../../types'
import { cn } from '../../lib/cn'

interface WorkflowStepsProps {
  steps: WorkflowStep[]
  /** Accessible name for the list, e.g. "Citizen workflow". */
  label: string
  /** Let each step rise into view in turn as it is scrolled to. Leave off inside a block that already does. */
  reveal?: boolean
  className?: string
}

/**
 * An ordered sequence joined by the route line. Numbered because the
 * content is a real sequence.
 */
export function WorkflowSteps({ steps, label, reveal = false, className }: WorkflowStepsProps) {
  return (
    <ol aria-label={label} className={cn('relative', className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <li key={step.title} className={cn('relative flex gap-5 pb-8 last:pb-0', reveal && 'reveal')}>
            {!isLast && (
              <span aria-hidden="true" className="absolute top-9 bottom-1 left-[1.0625rem] w-0.5 rounded-full bg-teal/35" />
            )}
            <span
              aria-hidden="true"
              className={cn(
                'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold',
                isLast ? 'border-teal-strong bg-teal-strong text-surface' : 'border-teal bg-surface text-teal-strong',
              )}
            >
              {index + 1}
            </span>
            <div className="pt-1.5">
              <h3 className="font-display text-[1.0625rem] font-semibold">{step.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{step.detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
