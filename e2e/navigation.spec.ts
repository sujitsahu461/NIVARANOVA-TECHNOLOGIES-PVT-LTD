import { expect, pages, test } from './fixtures'

test.describe('routes', () => {
  for (const { path, h1 } of pages) {
    test(`${path} loads with its own title and heading`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(page).toHaveTitle(/NivaraNova Technologies/)
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy()
    })
  }

  test('every page has a unique title', async ({ page }) => {
    const titles = new Set<string>()
    for (const { path } of pages) {
      await page.goto(path)
      titles.add(await page.title())
    }
    expect(titles.size).toBe(pages.length)
  })

  test('an unknown address shows the not-found page and is not indexed', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
    await expect(page).toHaveTitle('Page not found | NivaraNova Technologies')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
    await page.getByRole('link', { name: 'Go to the home page' }).click()
    await expect(page).toHaveURL('/')
  })

  test('an unknown insight article shows the not-found page', async ({ page }) => {
    await page.goto('/insights/no-such-article')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  })
})

test.describe('desktop navigation', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('main navigation reaches every section and marks the current page', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main' })
    for (const { label, h1 } of [
      { label: 'About', h1: 'About NivaraNova' },
      { label: 'Solutions', h1: 'Solutions' },
      { label: 'Products', h1: 'Products' },
      { label: 'Insights', h1: 'Insights' },
      { label: 'Contact', h1: 'Contact' },
      { label: 'Home', h1: 'Engineering technology for a better connected future.' },
    ]) {
      await nav.getByRole('link', { name: label, exact: true }).click()
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1)
      await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page')
    }
  })

  test('the page title updates during client-side navigation', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Solutions' }).click()
    await expect(page).toHaveTitle('Solutions | NivaraNova Technologies')
  })

  test('home page calls to action go to the right pages', async ({ page }) => {
    const checks = [
      { name: 'Explore our work', url: '/products' },
      { name: 'Contact us', url: '/contact' },
      { name: 'Explore CivicSetu', url: '/products/civicsetu' },
      { name: 'Start a conversation', url: '/contact' },
      { name: 'Get in touch', url: '/contact' },
    ]
    for (const check of checks) {
      await page.goto('/')
      await page.getByRole('link', { name: check.name, exact: true }).first().click()
      await expect(page).toHaveURL(check.url)
    }
  })

  test('solution and product calls to action prefill the contact form', async ({ page }) => {
    await page.goto('/solutions')
    await page.getByRole('link', { name: /^Discuss a project like this \(workflow automation\)$/ }).click()
    await expect(page).toHaveURL(/\/contact\?type=project&subject=Workflow/)
    await expect(page.getByLabel('Enquiry type')).toHaveValue('project')
    await expect(page.getByLabel('Subject')).toHaveValue('Workflow automation')

    await page.goto('/products/civicsetu')
    await page.getByRole('link', { name: 'Discuss a pilot' }).click()
    await expect(page.getByLabel('Enquiry type')).toHaveValue('civicsetu')
    await expect(page.getByLabel('Subject')).toHaveValue('CivicSetu pilot')
  })

  test('footer links all lead to real pages', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    const hrefs = await footer.getByRole('link').evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href') ?? ''),
    )
    // Email links open the visitor's mail app, so check their address instead of clicking them.
    expect(new Set(hrefs.filter((href) => href.startsWith('mailto:')))).toEqual(
      new Set(['mailto:nivaranovapvtltd@gmail.com']),
    )
    const links = hrefs.filter((href) => href.startsWith('/'))
    expect(links.length).toBeGreaterThanOrEqual(7)
    for (const href of links) {
      await page.goto('/')
      await footer.locator(`a[href="${href}"]`).first().click()
      await expect(page).toHaveURL(href)
      await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Page not found')
    }
  })

  test('the footer links to the company profiles and WhatsApp, in new tabs', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    const expected = {
      'NivaraNova on LinkedIn': /^https:\/\/www\.linkedin\.com\/in\/nivaranova-technologies-private-limited-85b887449$/,
      'NivaraNova on Instagram': /^https:\/\/www\.instagram\.com\/nivaranovatechnologiespvtltd\/$/,
      'Chat with NivaraNova on WhatsApp': /^https:\/\/wa\.me\/917656852710\?text=/,
    }
    for (const [name, href] of Object.entries(expected)) {
      const link = footer.getByRole('link', { name: `${name} (opens in a new tab)` })
      await expect(link).toHaveAttribute('href', href)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
    await expect(footer.getByRole('link', { name: 'Email NivaraNova' })).toHaveAttribute(
      'href',
      'mailto:nivaranovapvtltd@gmail.com',
    )
  })

  test('in-page section links jump to their sections', async ({ page }) => {
    await page.goto('/products/civicsetu')
    await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Roadmap' }).click()
    await expect(page).toHaveURL(/#roadmap$/)
    await expect(page.getByRole('heading', { name: 'Roadmap', level: 2 })).toBeInViewport()
  })

  test('the skip link moves focus to the main content', async ({ page }) => {
    await page.goto('/about')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to main content' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test('the menu opens, navigates and closes', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Menu' })
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.tap()
    await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true')
    const nav = page.getByRole('navigation', { name: 'Main' })
    await expect(nav).toBeVisible()

    await nav.getByRole('link', { name: 'Products' }).tap()
    await expect(page).toHaveURL('/products')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Products')
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden()
  })

  test('Escape closes the menu and returns focus to the toggle', async ({ page }) => {
    await page.goto('/about')
    await page.getByRole('button', { name: 'Menu' }).click()
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused()
  })

  test('the menu is usable with the keyboard alone', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Menu' })
    await toggle.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' })).toBeFocused()
  })
})
