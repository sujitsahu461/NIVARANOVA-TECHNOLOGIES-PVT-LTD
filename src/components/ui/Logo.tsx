import { brandColors, emblem, wordmark } from '../../config/brand'
import { cn } from '../../lib/cn'

interface EmblemProps {
  className?: string
}

/** The NNT emblem. Size it by height; the width follows. */
export function Emblem({ className }: EmblemProps) {
  return (
    <svg
      viewBox={`0 0 ${emblem.width} ${emblem.height}`}
      className={cn('shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d={emblem.plate} fill={brandColors.black} className="emblem-plate" />
      <path d={emblem.letters} fill={brandColors.white} />
      <path d={emblem.stem} fill={brandColors.blue} />
    </svg>
  )
}

interface WordmarkProps {
  className?: string
  /** Add "TECHNOLOGIES PRIVATE LIMITED" below the name (the lockup). */
  subline?: boolean
}

/**
 * "NIVARANOVA", optionally with the subline. Drawn as SVG text so the name
 * and subline keep the artwork's widths at every size. Size it by height.
 */
export function Wordmark({ className, subline = false }: WordmarkProps) {
  const nameSize = wordmark.nameCapHeight / wordmark.fontCapHeight
  const sublineSize = wordmark.sublineCapHeight / wordmark.fontCapHeight
  const sublineBaseline = wordmark.nameCapHeight + wordmark.sublineGap + wordmark.sublineCapHeight
  const height = subline ? sublineBaseline : wordmark.nameCapHeight

  return (
    <svg
      viewBox={`0 0 ${wordmark.width} ${height}`}
      className={cn('shrink-0 overflow-visible fill-wordmark font-display', className)}
      aria-hidden="true"
      focusable="false"
    >
      <text
        x={wordmark.width / 2}
        y={wordmark.nameCapHeight}
        textAnchor="middle"
        textLength={wordmark.width}
        lengthAdjust="spacing"
        fontSize={nameSize}
        fontWeight={400}
      >
        {wordmark.name}
      </text>
      {subline && (
        <text
          x={wordmark.width / 2}
          y={sublineBaseline}
          textAnchor="middle"
          textLength={wordmark.sublineWidth}
          lengthAdjust="spacing"
          fontSize={sublineSize}
          fontWeight={700}
        >
          {wordmark.subline}
        </text>
      )}
    </svg>
  )
}

interface LogoProps {
  className?: string
  /** "wordmark" for tight spaces such as the header; "lockup" adds the subline. */
  variant?: 'wordmark' | 'lockup'
  /** Accessible name. Leave out when the surrounding link already names the logo. */
  label?: string
}

/** Emblem and wordmark side by side. */
export function Logo({ className, variant = 'wordmark', label }: LogoProps) {
  const lockup = variant === 'lockup'
  return (
    <span
      className={cn('inline-flex items-center', lockup ? 'gap-3.5' : 'gap-3', className)}
      {...(label ? { role: 'img', 'aria-label': label } : {})}
    >
      <Emblem className={lockup ? 'h-10 w-auto sm:h-12' : 'h-8 w-auto lg:h-9'} />
      <Wordmark subline={lockup} className={lockup ? 'h-8 w-auto sm:h-9' : 'h-[0.6875rem] w-auto lg:h-[0.8125rem]'} />
    </span>
  )
}
