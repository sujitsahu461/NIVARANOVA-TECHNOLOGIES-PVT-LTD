/**
 * The theme switch, played as a drop falling on still water.
 *
 * Going dark: a drop falls onto the switch, and the dark theme spreads across
 * the page from where it lands, like a ripple, with evenly spaced rings riding
 * behind the wavefront and fading as they travel. Going back to light plays
 * exactly the reverse: the dark drains back into the switch, the rings
 * converging ahead of it, and the drop rises out.
 *
 * It runs on View Transitions. The page before and after the switch become
 * snapshots, and the dark one is clipped to a circle that grows (going dark)
 * or shrinks (going light). The rings are their own layer above both
 * snapshots, redrawn every frame to follow the wavefront. Positions are set
 * through attributes and the CSSOM, never a style attribute in markup, so it
 * works under the site's Content Security Policy. Styles are in
 * src/styles/index.css ("Theme switch ripple").
 */

const SVG_NS = 'http://www.w3.org/2000/svg'

/** Milliseconds for the drop to fall (or rise), and for the wave to cross the page. */
const DROP_MS = 180
const WAVE_MS = 900

/** Pixels between rings. The same for every ring, so the waves stay coherent. */
const WAVELENGTH = 34

/** The crest at the wavefront, then three trailing rings, each fainter and finer. */
const RINGS = [
  { opacity: 0.85, width: 2.5 },
  { opacity: 0.55, width: 2 },
  { opacity: 0.34, width: 1.5 },
  { opacity: 0.18, width: 1.25 },
] as const

/**
 * The wave leaves the drop quickly and slows as it spreads, but not so fast at
 * first that the rings blur. Draining uses the exact time-reverse of the curve.
 */
const SPREAD = 'cubic-bezier(0.25, 0.45, 0.35, 1)'
const DRAIN = 'cubic-bezier(0.65, 0, 0.75, 0.55)'

/** A falling drop speeds up; a rising one slows down. Each curve is the other reversed. */
const FALL = 'cubic-bezier(0.55, 0, 1, 0.45)'
const RISE = 'cubic-bezier(0, 0.55, 0.45, 1)'

/** Where the drop lands: the middle of the switch, in viewport pixels. */
export interface RippleOrigin {
  x: number
  y: number
}

let rippling = false

/** True while a switch is playing. Clicks in the meantime are ignored. */
export function isRippling() {
  return rippling
}

/** Distance from the origin to the farthest corner of the viewport: how far the wave must travel. */
function reachFrom({ x, y }: RippleOrigin) {
  return Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
}

function animateDrop(origin: RippleOrigin, direction: 'fall' | 'rise') {
  const drop = document.createElement('div')
  drop.className = 'theme-drop'
  drop.style.left = `${origin.x}px`
  drop.style.top = `${origin.y}px`
  document.body.append(drop)
  const above = { transform: 'translateY(-28px) scale(0.55)', opacity: 0 }
  const landed = { transform: 'translateY(0) scale(1)', opacity: 1 }
  const animation = drop.animate(direction === 'fall' ? [above, landed] : [landed, above], {
    duration: DROP_MS,
    easing: direction === 'fall' ? FALL : RISE,
  })
  return animation.finished.catch(() => undefined).finally(() => drop.remove())
}

function createRings(origin: RippleOrigin) {
  const layer = document.createElementNS(SVG_NS, 'svg')
  layer.setAttribute('class', 'theme-ripple-layer')
  layer.setAttribute('aria-hidden', 'true')
  const rings = RINGS.map((ring) => {
    const circle = document.createElementNS(SVG_NS, 'circle')
    circle.setAttribute('cx', String(origin.x))
    circle.setAttribute('cy', String(origin.y))
    circle.setAttribute('r', '0')
    circle.setAttribute('stroke-width', String(ring.width))
    circle.setAttribute('stroke-opacity', '0')
    layer.append(circle)
    return { circle, ring }
  })

  /** Places the rings behind a wavefront of radius `edge`, fainter the farther it has spread. */
  function draw(edge: number, reach: number) {
    const damping = (1 - Math.min(edge / reach, 1)) ** 0.9
    rings.forEach(({ circle, ring }, index) => {
      const radius = edge - 1 - index * WAVELENGTH
      circle.setAttribute('r', String(Math.max(radius, 0)))
      circle.setAttribute('stroke-opacity', radius > 0 ? String(ring.opacity * damping) : '0')
    })
  }

  return { layer, draw }
}

/**
 * Plays the switch from `origin`. "spread" is light to dark; "drain" is dark
 * to light. `apply` changes the theme; it runs once the browser has a snapshot
 * of the page as it was.
 */
export async function rippleTheme(direction: 'spread' | 'drain', origin: RippleOrigin, apply: () => void) {
  if (rippling) return
  rippling = true
  const root = document.documentElement
  const reach = reachFrom(origin)
  const rings = createRings(origin)

  try {
    if (direction === 'spread') await animateDrop(origin, 'fall')

    root.classList.add('theme-ripple')
    if (direction === 'drain') root.classList.add('theme-ripple-drain')
    const transition = document.startViewTransition(() => {
      apply()
      document.body.append(rings.layer)
    })

    try {
      await transition.ready
      const circle = (radius: number) => `circle(${radius}px at ${origin.x}px ${origin.y}px)`
      const wave = root.animate(
        { clipPath: direction === 'spread' ? [circle(0), circle(reach)] : [circle(reach), circle(0)] },
        {
          duration: WAVE_MS,
          easing: direction === 'spread' ? SPREAD : DRAIN,
          fill: 'forwards',
          pseudoElement: direction === 'spread' ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      )
      // The rings follow the wavefront frame by frame, so they stay locked to its edge.
      const follow = () => {
        const progress = wave.effect?.getComputedTiming().progress ?? 1
        rings.draw((direction === 'spread' ? progress : 1 - progress) * reach, reach)
        if (wave.playState !== 'finished' && wave.playState !== 'idle') requestAnimationFrame(follow)
      }
      follow()
      await transition.finished
    } catch {
      // The browser skipped the transition (for example, the window was resized). The theme has still changed.
    } finally {
      rings.layer.remove()
      root.classList.remove('theme-ripple', 'theme-ripple-drain')
    }

    if (direction === 'drain') await animateDrop(origin, 'rise')
  } finally {
    rippling = false
  }
}
