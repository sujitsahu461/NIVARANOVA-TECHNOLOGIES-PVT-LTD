import { useEffect, useRef } from 'react'
import { revealOnEnter } from '../lib/reveal'

/**
 * Plays one element's entrance animation the first time it scrolls into view,
 * once `threshold` of it is showing (see src/lib/reveal.ts). Used by the home
 * page's focus ring; ordinary blocks use the "reveal" class instead.
 */
export function useRevealOnEnter<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    return revealOnEnter([element], { threshold, rootMargin: '0px', stagger: 0 })
  }, [threshold])

  return ref
}
