/** Normalises a pathname: drops a trailing slash and a ".html" suffix. */
export function normalisePath(pathname: string): string {
  const path = pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/+$/, '$1')
  return path === '' ? '/' : path
}

/**
 * True when prerendered markup for `route` can be hydrated at `pathname`.
 * `*` marks the 404 page, which is valid for any path.
 */
export function canHydrate(route: string | undefined, pathname: string): boolean {
  if (!route) return false
  if (route === '*') return true
  return normalisePath(route) === normalisePath(pathname)
}
