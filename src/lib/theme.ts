/**
 * Light and dark themes.
 *
 * The site is light unless the visitor switches to dark with the button in
 * the header. The choice is kept in localStorage so it survives reloads, and
 * public/theme.js applies it before the page paints, so a dark page never
 * flashes light first. All colours key off <html data-theme="dark">; see
 * src/styles/index.css.
 */

import { isRippling, rippleTheme, type RippleOrigin } from './theme-ripple'

export type Theme = 'light' | 'dark'

/** Where the choice is kept. public/theme.js reads the same key. */
export const THEME_STORAGE_KEY = 'nivaranova-theme'

const CHANGE_EVENT = 'nivaranova:themechange'

/** The theme the page is showing now. */
export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function afterNextPaint(callback: () => void) {
  if (typeof window.requestAnimationFrame !== 'function') {
    window.setTimeout(callback, 50)
    return
  }
  window.requestAnimationFrame(() => window.requestAnimationFrame(callback))
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Puts a theme on the page and tells subscribers. All colours change together, without per-element transitions. */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.add('theme-switching')
  root.dataset.theme = theme
  afterNextPaint(() => root.classList.remove('theme-switching'))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/**
 * Switches to a theme and remembers the choice. Given the point the switch
 * was pressed at, it plays the water-drop ripple from there (theme-ripple.ts):
 * spreading out going dark, draining back going light. Visitors who prefer
 * reduced motion, and browsers without View Transitions, switch at once.
 * While a ripple is playing, further switches are ignored.
 */
export function setTheme(theme: Theme, origin?: RippleOrigin) {
  if (isRippling()) return
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage is blocked (some private windows): the switch still holds until the page is closed.
  }
  if (origin && !prefersReducedMotion() && typeof document.startViewTransition === 'function') {
    void rippleTheme(theme === 'dark' ? 'spread' : 'drain', origin, () => applyTheme(theme))
  } else {
    applyTheme(theme)
  }
}

/** Switches from light to dark, or from dark to light. */
export function toggleTheme(origin?: RippleOrigin) {
  setTheme(readTheme() === 'dark' ? 'light' : 'dark', origin)
}

/** Calls onChange whenever the theme changes, on this page or in another tab of the site. */
export function subscribeToTheme(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) applyTheme(event.newValue === 'dark' ? 'dark' : 'light')
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}
