import { AxeBuilder } from '@axe-core/playwright'
import { expect, pages, test, viewportWidths } from './fixtures'

test.describe('responsive layout', () => {
  for (const width of viewportWidths) {
    test(`no horizontal overflow or clipped navigation at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const { path } of pages) {
        await page.goto(path)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0)

        // Desktop navigation from 1024px; a menu button below that.
        const menuButton = page.getByRole('button', { name: 'Menu' })
        if (width >= 1024) await expect(menuButton).toBeHidden()
        else await expect(menuButton).toBeVisible()

        // Primary buttons stay large enough to tap (WCAG 2.2 target size, with margin).
        const smallTargets = await page.locator('main a[class*="min-h-"], main button').evaluateAll((elements) =>
          elements
            .filter((element) => (element as HTMLElement).offsetParent !== null)
            .map((element) => element.getBoundingClientRect())
            .filter((box) => box.height < 24 || box.width < 24).length,
        )
        expect(smallTargets, `${path}: undersized tap targets`).toBe(0)
      }
    })
  }
})

test.describe('accessibility', () => {
  for (const { path } of [...pages, { path: '/this-page-does-not-exist' }]) {
    test(`${path} has no axe violations (WCAG 2.2 AA)`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze()
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) – ${v.help}`)
      expect(summary).toEqual([])
    })
  }

  test('the contact form with errors has no axe violations', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })

  test('the open mobile menu has no axe violations', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })

  test('the route animation is switched off for visitors who prefer reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const animation = await page.locator('.route-path').evaluate((el) => getComputedStyle(el).animationName)
    expect(animation).toBe('none')
  })
})

test.describe('links, assets and fonts', () => {
  test('every internal link points to an existing page', async ({ page, request }) => {
    const hrefs = new Set<string>()
    for (const { path } of pages) {
      await page.goto(path)
      const found = await page
        .locator('a[href^="/"]')
        .evaluateAll((elements) => elements.map((element) => element.getAttribute('href') ?? ''))
      for (const href of found) hrefs.add(href.split('#')[0]?.split('?')[0] || '/')
    }
    expect(hrefs.size).toBeGreaterThan(5)
    for (const href of hrefs) {
      const response = await request.get(href)
      expect(response.status(), href).toBe(200)
      const html = await response.text()
      // An unknown path would come back as the home page from the SPA fallback.
      if (href !== '/') expect(html, `${href} is not a prerendered page`).not.toContain('data-route="/"')
    }
  })

  test('icons, social image and crawler files are served', async ({ request }) => {
    for (const asset of ['/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/og-image.png', '/logo-512.png', '/robots.txt']) {
      const response = await request.get(asset)
      expect(response.status(), asset).toBe(200)
    }
    expect(await (await request.get('/robots.txt')).text()).toContain('User-agent: *')
  })

  test('there are no broken images', async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path)
      const broken = await page
        .locator('img')
        .evaluateAll((images) => images.filter((image) => !(image as HTMLImageElement).naturalWidth).length)
      expect(broken, path).toBe(0)
    }
  })

  test('the brand fonts load from the site itself', async ({ page }) => {
    const fontRequests: string[] = []
    page.on('request', (request) => {
      if (request.resourceType() === 'font') fontRequests.push(new URL(request.url()).host)
    })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const loaded = await page.evaluate(() => ({
      inter: document.fonts.check('16px "Inter Variable"'),
      manrope: document.fonts.check('600 32px "Manrope Variable"'),
    }))
    expect(loaded).toEqual({ inter: true, manrope: true })
    expect(new Set(fontRequests)).toEqual(new Set(['localhost:4173']))
  })
})

test.describe('SEO and security', () => {
  test('pages carry search and social metadata in the static HTML', async ({ request }) => {
    for (const { path } of pages) {
      const html = await (await request.get(path)).text()
      expect(html, path).toMatch(/<html lang="en-IN">/)
      expect(html, path).toMatch(/<meta name="description" content="[^"]{40,160}"/)
      expect(html, path).toContain('<meta property="og:title"')
      expect(html, path).toContain('<meta name="twitter:card"')
      expect(html, path).toMatch(/<h1[^>]*>/) // content is present without JavaScript
    }
  })

  test('only the home page carries organisation structured data, with verified fields only', async ({ request }) => {
    const html = await (await request.get('/')).text()
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]
    expect(json).toBeTruthy()
    const data = JSON.parse(json as string) as Record<string, unknown>
    expect(data['@type']).toBe('Organization')
    for (const field of ['address', 'telephone', 'foundingDate', 'founder', 'taxID', 'vatID', 'award']) {
      expect(data, field).not.toHaveProperty(field)
    }
    expect(await (await request.get('/about')).text()).not.toContain('application/ld+json')
  })

  test('responses carry the security headers', async ({ request }) => {
    const response = await request.get('/')
    const headers = response.headers()
    expect(headers['content-security-policy']).toContain("script-src 'self'")
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'")
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  })

  test('the site sets no cookies and no third-party requests', async ({ page, context }) => {
    const hosts = new Set<string>()
    page.on('request', (request) => hosts.add(new URL(request.url()).host))
    for (const { path } of pages) await page.goto(path)
    expect(await context.cookies()).toEqual([])
    expect([...hosts]).toEqual(['localhost:4173'])
  })
})

test.describe('no fabricated business information', () => {
  test('rendered pages contain no invented contact details or claims', async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path)
      const text = await page.locator('body').innerText()
      expect(text, `${path}: email address`).not.toMatch(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)
      expect(text, `${path}: phone number`).not.toMatch(/(\+91[\s-]?)?\b[6-9]\d{4}[\s-]?\d{5}\b/)
      expect(text, `${path}: GSTIN`).not.toMatch(/\b\d{2}[A-Z]{5}\d{4}[A-Z]\dZ[A-Z\d]\b/)
      expect(text, `${path}: CIN`).not.toMatch(/\b[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b/)
      expect(text, `${path}: unsupported claim`).not.toMatch(
        /testimonial|trusted by|our clients|award-winning|\bcertified\b|AI-powered|\blive in\b|deployed in \d|\d+\s*%/i,
      )
    }
  })

  test('CivicSetu is described as not deployed on every page that gives its status', async ({ page }) => {
    for (const path of ['/', '/products', '/products/civicsetu']) {
      await page.goto(path)
      await expect(page.getByText(/not deployed/i).first(), path).toBeVisible()
    }
  })
})
