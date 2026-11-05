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

export const WEB3FORMS = 'https://api.web3forms.com/submit'

/**
 * Stands in for Web3Forms so tests never send real email. Returns the JSON
 * bodies the form posted.
 */
export async function fakeWeb3Forms(page: Page, reply: { success: boolean }) {
  const posted: Array<Record<string, unknown>> = []
  await page.route(WEB3FORMS, async (route) => {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Accept' }
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors })
    posted.push(route.request().postDataJSON() as Record<string, unknown>)
    return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify(reply) })
  })
  return posted
}

/** Fills the contact form with a valid enquiry and waits out the minimum fill time. */
export async function fillValidEnquiry(page: Page) {
  await page.getByLabel('Full name').fill('Asha Mishra')
  await page.getByLabel('Work email').fill('asha@example.org')
  await page.getByLabel('Organisation (optional)').fill('Example Municipality')
  await page.getByLabel('Enquiry type').selectOption('civicsetu')
  await page.getByLabel('Subject').fill('CivicSetu pilot')
  await page.getByLabel('Message').fill('We would like to understand how a pilot would work for our wards.')
  await page.waitForTimeout(3100) // past the minimum fill time
}
