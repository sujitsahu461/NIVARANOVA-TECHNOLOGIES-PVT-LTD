import { useSyncExternalStore } from 'react'
import { readTheme, subscribeToTheme, toggleTheme, type Theme } from '../lib/theme'

/**
 * Prerendered pages are built light. Hydration starts from the same value, so
 * the markup matches, and React then re-renders with the theme the page is
 * actually showing.
 */
const prerenderedTheme = (): Theme => 'light'

/** The theme the page is showing, and a function that switches it. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, prerenderedTheme)
  return { theme, toggleTheme }
}
