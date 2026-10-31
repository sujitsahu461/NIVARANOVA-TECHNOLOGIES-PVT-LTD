import { test as base, expect, type Page } from '@playwright/test'

/** Every public page, with the heading it must show. */
export const pages = [
  { path: '/', h1: 'Engineering technology for a better connected future.' },
  { path: '/about', h1: 'About NivaraNova' },
  { path: '/solutions', h1: 'Solutions' },
  { path: '/products', h1: 'Products' },
  { path: '/products/civicsetu', h1: 'CivicSetu' },
  { path: '/insights', h1: 'Insights' },
  { path: '/contact', h1: 'Contact' },
  { path: '/privacy', h1: 'Privacy notice' },
] as const

export const viewportWidths = [360, 390, 430, 768, 1024, 1440, 1920] as const

/**
 * A page that records console errors (including CSP violations), uncaught
 * exceptions and failed requests, and fails the test if any occurred.
 */
export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    const problems: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`console: ${message.text()}`)
    })
    page.on('pageerror', (error) => problems.push(`exception: ${error.message}`))
    page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`))
    page.on('response', (response) => {
      if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`)
    })
    await use(page)
    expect(problems, 'browser reported problems').toEqual([])
  },
})

export { expect }
