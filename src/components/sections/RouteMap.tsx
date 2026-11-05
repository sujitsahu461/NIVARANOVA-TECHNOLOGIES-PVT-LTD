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

/**
 * The complaint's route along street centre lines: reported at (130, 410),
 * routed at the junction (260, 230), resolved at (420, 52). It is 648 units
 * long. The keyframes in src/styles/index.css are computed from these street
 * lengths, so change the two together.
 */
const mainRoute = 'M130 410V340H260V230H420V52'

/**
 * Departments the complaint could have gone to. During the animation these
 * branches sketch out from the junction and withdraw as the complaint commits
 * to Roads; at rest they are hidden. The names are real CivicSetu categories.
 */
const branches = [
  { id: 'left', d: 'M260 230H150', tip: [150, 230], tag: { text: 'Drainage', x: 146, y: 257 } },
  { id: 'up', d: 'M260 230V130', tip: [260, 130], tag: { text: 'Water supply', x: 272, y: 135 } },
] as const

/** A circle as a path that starts at the top and runs clockwise, so it draws on like a clock hand. */
function ring(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r}a${r} ${r} 0 1 1 0 ${2 * r}a${r} ${r} 0 1 1 0 ${-2 * r}`
}

interface Label {
  text: string
  x: number
  y: number
  width: number
  /** Sets when the label appears; see src/styles/index.css. */
  className: string
}

const labels: Label[] = [
  { text: 'Reported', x: 146, y: 397, width: 80, className: 'route-label-reported' },
  { text: 'Routed to Roads', x: 276, y: 246, width: 124, className: 'route-label-routed' },
  { text: 'Resolved', x: 314, y: 39, width: 82, className: 'route-label-resolved' },
]

/**
 * Hero illustration: one complaint's journey across an abstract town grid.
 * On load it travels from the moment it is reported, through routing to the
 * right department, to its resolution, once, in about three and a half
 * seconds (the "Dispatch" sequence in src/styles/index.css). Visitors who
 * prefer reduced motion see the finished map. Decorative; the page copy
 * carries the meaning.
 */
export function RouteMap() {
  const titleId = useId()

  return (
    // Glass: the streets and blocks are translucent, so the colour behind the map shows through frosted.
    <figure className="glass overflow-hidden rounded-xl">
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
          Illustration: a complaint’s route across a town map, from the moment it is reported, through routing to the
          right department, to its resolution
        </title>

        <rect width="560" height="460" className="fill-mist/50" />

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
                denseBlocks.has(`${columnIndex}-${rowIndex}`) ? 'fill-paper/75 stroke-line' : 'fill-surface/60 stroke-line'
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

        {branches.map((branch) => (
          <path
            key={branch.id}
            d={branch.d}
            pathLength={1}
            fill="none"
            className={`route-branch route-branch-${branch.id} stroke-muted/55`}
            strokeWidth="2"
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

        {/* The complaint itself. It passes under the nodes, like a vehicle through stations, and is hidden once it has arrived. */}
        <g className="route-complaint">
          <circle r="7" className="fill-teal-strong stroke-surface" strokeWidth="2.5" />
        </g>

        {/* Closes around Resolved at the end: the citizen confirms the fix. */}
        <path
          d={ring(420, 52, 19)}
          pathLength={1}
          fill="none"
          className="route-loop stroke-teal-strong/45"
          strokeWidth="1.5"
        />

        {/* Reported */}
        <path
          d={ring(130, 410, 9)}
          pathLength={1}
          className="route-reported-ring fill-surface stroke-ink"
          strokeWidth="2.5"
        />
        <circle cx="130" cy="410" r="3.5" className="route-pop route-reported-dot fill-ink" />

        {/* Routed */}
        <circle cx="260" cy="230" r="8.5" className="route-pop route-routed fill-deep stroke-surface" strokeWidth="3" />

        {/* Resolved */}
        <g className="route-pop route-resolved">
          <circle cx="420" cy="52" r="13" className="fill-teal-strong" />
          <path
            d="M414.5 52.5l3.8 3.8 7.2-7.6"
            pathLength={1}
            fill="none"
            className="route-tick stroke-surface"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {branches.map((branch) => (
          <g
            key={branch.id}
            className={`route-branch-tag route-branch-tag-${branch.id} max-sm:hidden`}
            aria-hidden="true"
          >
            <circle cx={branch.tip[0]} cy={branch.tip[1]} r="3.5" className="fill-muted/60" />
            <text x={branch.tag.x} y={branch.tag.y} className="fill-muted font-sans text-[12px] font-medium">
              {branch.tag.text}
            </text>
          </g>
        ))}

        {labels.map((label) => (
          <g key={label.text} className={`route-label ${label.className} max-sm:hidden`} aria-hidden="true">
            <rect
              x={label.x}
              y={label.y}
              width={label.width}
              height="27"
              rx="5"
              className="fill-surface stroke-line-strong"
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
