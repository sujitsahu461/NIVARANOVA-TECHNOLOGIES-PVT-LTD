import type { Insight } from '../types'

/**
 * Published articles, newest first.
 * Add an entry only when a real article is ready, dated the day it is published.
 * While this list is empty, the Insights page shows an empty state.
 */
export const insights: Insight[] = []
