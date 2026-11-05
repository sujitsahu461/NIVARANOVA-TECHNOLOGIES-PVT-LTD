/**
 * Entrance animations that play once, as content first scrolls into view.
 *
 * Each element still below the fold is marked data-reveal="waiting", and
 * "play" when it arrives; the CSS decides what that looks like (see "Scroll
 * reveal" and the focus ring's entrance in src/styles/index.css). Content that
 * is already on screen is left alone, so nothing blinks out and back. Without
 * IntersectionObserver, or for visitors who prefer reduced motion, nothing is
 * marked and everything simply shows, as it does without JavaScript.
 */

interface RevealOptions {
  /** How much of the element must be in view to start; 0 means any of it. */
  threshold?: number
  /** Shrinks the viewport for the check, so content starts once it is clearly in view. */
  rootMargin?: string
  /** Milliseconds between elements that arrive at the same moment, so they follow each other. */
  stagger?: number
}

export function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Watches the elements and plays each one's entrance once. Returns a function that stops watching. */
export function revealOnEnter(
  elements: Iterable<HTMLElement>,
  { threshold = 0, rootMargin = '0px 0px -8% 0px', stagger = 90 }: RevealOptions = {},
) {
  const enabled = typeof IntersectionObserver === 'function' && !prefersReducedMotion()
  const observer = enabled
    ? new IntersectionObserver(
        (entries) => {
          const arriving = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target)
          arriving.forEach((element, index) => {
            if (!(element instanceof HTMLElement)) return
            observer?.unobserve(element)
            if (index > 0 && stagger > 0) {
              element.style.transitionDelay = `${Math.min(index, 5) * stagger}ms`
              window.setTimeout(() => element.style.removeProperty('transition-delay'), 1500)
            }
            element.dataset.reveal = 'play'
          })
        },
        { threshold, rootMargin },
      )
    : null

  for (const element of elements) {
    const box = element.getBoundingClientRect()
    const onScreen = box.top < window.innerHeight && box.bottom > 0
    if (!observer || onScreen) {
      if (element.dataset.reveal === 'waiting') delete element.dataset.reveal
      continue
    }
    element.dataset.reveal = 'waiting'
    observer.observe(element)
  }

  return () => observer?.disconnect()
}
