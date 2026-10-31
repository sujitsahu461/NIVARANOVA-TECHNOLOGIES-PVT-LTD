import { useId } from 'react'

/** Street grid: block edges along each axis. Streets are the 20-unit gaps between blocks. */
const columns = [
  [0, 120],
  [140, 250],
  [270, 410],
  [430, 560],
] as const
const rows = [
  [0, 90],
  [110, 220],
  [240, 330],
  [350, 460],
] as const

/** Blocks drawn slightly darker, to suggest a built-up centre. */
const denseBlocks = new Set(['1-1', '2-1', '1-2', '2-2'])

/** Other complaints moving through the same streets, drawn faintly. */
const otherRoutes = ['M0 230H130V100H260V0', 'M560 340H420V460', 'M260 460V340', 'M560 100H420']

/** The highlighted route, along street centre lines. */
const mainRoute = 'M130 410V340H260V230H420V52'

interface Label {
  text: string
  x: number
  y: number
  width: number
  delay: string
}

const labels: Label[] = [
  { text: 'Reported', x: 146, y: 397, width: 80, delay: '[animation-delay:0.2s]' },
  { text: 'Routed to department', x: 276, y: 246, width: 162, delay: '[animation-delay:1s]' },
  { text: 'Resolved', x: 314, y: 39, width: 82, delay: '[animation-delay:1.8s]' },
]

/**
 * Hero illustration: one complaint's route across an abstract town grid,
 * from the moment it is reported to its resolution. Decorative; the page
 * copy carries the meaning. The route draws once on load unless the
 * visitor prefers reduced motion.
 */
export function RouteMap() {
  const titleId = useId()

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-white">
      {/* role="img" + <title> is the accessible pattern for inline SVG; an <img> tag can't use the theme classes. */}
      <svg
        viewBox="0 0 560 460"
        className="block h-auto w-full"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        role="img"
        aria-labelledby={titleId}
        focusable="false"
      >
        <title id={titleId}>
          Illustration: a route across a town map, from a reported problem to its resolution
        </title>

        <rect width="560" height="460" className="fill-mist" />

        {rows.map(([y0, y1], rowIndex) =>
          columns.map(([x0, x1], columnIndex) => (
            <rect
              key={`${columnIndex}-${rowIndex}`}
              x={x0}
              y={y0}
              width={x1 - x0}
              height={y1 - y0}
              rx="6"
              className={
                denseBlocks.has(`${columnIndex}-${rowIndex}`) ? 'fill-paper stroke-line' : 'fill-white stroke-line'
              }
              strokeWidth="1"
            />
          )),
        )}

        {otherRoutes.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            className="stroke-line-strong"
            strokeWidth="2"
            strokeDasharray="2 7"
            strokeLinecap="round"
          />
        ))}

        <path
          d={mainRoute}
          pathLength={1}
          fill="none"
          className="route-path stroke-teal"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Reported */}
        <g className="route-node [animation-delay:0.1s]">
          <circle cx="130" cy="410" r="9" className="fill-white stroke-ink" strokeWidth="2.5" />
          <circle cx="130" cy="410" r="3.5" className="fill-ink" />
        </g>

        {/* Routed */}
        <g className="route-node [animation-delay:0.95s]">
          <circle cx="260" cy="230" r="8.5" className="fill-deep stroke-white" strokeWidth="3" />
        </g>

        {/* Resolved */}
        <g className="route-node [animation-delay:1.75s]">
          <circle cx="420" cy="52" r="13" className="fill-teal-strong" />
          <path
            d="M414.5 52.5l3.8 3.8 7.2-7.6"
            fill="none"
            className="stroke-white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {labels.map((label) => (
          <g key={label.text} className={`route-node max-sm:hidden ${label.delay}`} aria-hidden="true">
            <rect
              x={label.x}
              y={label.y}
              width={label.width}
              height="27"
              rx="5"
              className="fill-white stroke-line-strong"
              strokeWidth="1"
            />
            <text
              x={label.x + 11}
              y={label.y + 18}
              className="fill-ink font-sans text-[13px] font-medium"
            >
              {label.text}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}
