import { describe, expect, it } from 'vitest'
import { canHydrate, normalisePath } from './hydration'

describe('normalisePath', () => {
  it.each([
    ['/', '/'],
    ['/about', '/about'],
    ['/about/', '/about'],
    ['/about.html', '/about'],
    ['/index.html', '/'],
    ['/products/civicsetu/', '/products/civicsetu'],
  ])('%s -> %s', (input, expected) => {
    expect(normalisePath(input)).toBe(expected)
  })
})

describe('canHydrate', () => {
  it('hydrates markup that belongs to the current route', () => {
    expect(canHydrate('/about', '/about/')).toBe(true)
    expect(canHydrate('/', '/')).toBe(true)
  })

  it('refuses markup for a different route, such as an SPA fallback', () => {
    expect(canHydrate('/', '/unknown-page')).toBe(false)
    expect(canHydrate('/about', '/contact')).toBe(false)
  })

  it('treats the 404 page as valid for any path', () => {
    expect(canHydrate('*', '/anything/at/all')).toBe(true)
  })

  it('refuses markup without a route marker', () => {
    expect(canHydrate(undefined, '/')).toBe(false)
  })
})
