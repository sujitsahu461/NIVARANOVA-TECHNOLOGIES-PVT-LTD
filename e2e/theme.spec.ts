import { AxeBuilder } from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { expect, pages, test } from './fixtures'

/** Must match THEME_STORAGE_KEY in src/lib/theme.ts and the key in public/theme.js. */
const storageKey = 'nivaranova-theme'

type RippleWindow = Window & { rippleLog?: string[] }

/** Records each piece of the ripple (the drop and the ring layer) as it is added to the page, in order. */
async function watchRipple(page: Page) {
  await page.evaluate(() => {
    const record = window as RippleWindow
    record.rippleLog = []
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) =>
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          const kind = node.getAttribute('class')
          if (kind === 'theme-drop' && node instanceof HTMLElement) {
            record.rippleLog?.push(`drop ${parseFloat(node.style.left)} ${parseFloat(node.style.top)}`)
          } else if (kind === 'theme-ripple-layer') {
            record.rippleLog?.push('rings')
          }
        }),
      )
    }).observe(document.body, { childList: true })
  })
  return {
    log: () => page.evaluate(() => (window as RippleWindow).rippleLog ?? []),
    kinds: () => page.evaluate(() => ((window as RippleWindow).rippleLog ?? []).map((entry) => entry.split(' ')[0])),
    clear: () => page.evaluate(() => ((window as RippleWindow).rippleLog = [])),
  }
}

test.describe('theme switch', () => {
  test('switches to dark and back, and keeps the choice across pages and reloads', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    const toggle = page.getByRole('button', { name: 'Dark mode' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await expect(html).not.toHaveAttribute('data-theme', 'dark')

    await toggle.click()
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(11, 18, 32)')

    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(html).toHaveAttribute('data-theme', 'dark')

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await toggle.click()
    await expect(html).toHaveAttribute('data-theme', 'light')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe('light')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(255, 255, 255)')
  })

  test('going dark, a drop lands on the switch and ripples out; going light, it drains back and rises', async ({
    page,
  }) => {
    await page.goto('/')
    const html = page.locator('html')
    const toggle = page.getByRole('button', { name: 'Dark mode' })
    const box = await toggle.boundingBox()
    if (!box) throw new Error('The theme switch has no position')
    const ripple = await watchRipple(page)

    await toggle.click()
    await expect(html).toHaveAttribute('data-theme', 'dark')
    // The drop falls first, then the rings spread from where it landed.
    await expect.poll(ripple.kinds).toEqual(['drop', 'rings'])
    const [, x, y] = (await ripple.log())[0]?.split(' ').map(Number) ?? []
    expect(x).toBeCloseTo(box.x + box.width / 2, 0)
    expect(y).toBeCloseTo(box.y + box.height / 2, 0)
    await expect(page.locator('.theme-drop, .theme-ripple-layer')).toHaveCount(0)
    await expect(html).not.toHaveClass(/theme-ripple/)

    await ripple.clear()
    await toggle.click()
    await expect(html).toHaveAttribute('data-theme', 'light')
    // The reverse: the rings drain back into the switch, then the drop rises out.
    await expect.poll(ripple.kinds).toEqual(['rings', 'drop'])
    await expect(page.locator('.theme-drop, .theme-ripple-layer')).toHaveCount(0)
    await expect(html).not.toHaveClass(/theme-ripple/)
  })

  test('visitors who prefer reduced motion get an instant switch, with no ripple', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const ripple = await watchRipple(page)
    await page.getByRole('button', { name: 'Dark mode' }).click()
    // The theme has already changed by the time the click returns, and nothing was animated.
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
    expect(await ripple.log()).toEqual([])
  })

  test('a saved dark theme is applied before the page body is parsed, so it never flashes light', async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, 'dark')
      const record = window as unknown as { themeAtFirstBody?: string }
      new MutationObserver((_records, observer) => {
        if (!document.body) return
        record.themeAtFirstBody = document.documentElement.dataset.theme ?? 'none'
        observer.disconnect()
      }).observe(document, { childList: true, subtree: true })
    }, storageKey)
    await page.goto('/contact')
    const themeAtFirstBody = await page.evaluate(
      () => (window as unknown as { themeAtFirstBody?: string }).themeAtFirstBody,
    )
    expect(themeAtFirstBody).toBe('dark')
  })

  test('on a phone the switch is a row in the menu, and on a tablet an icon in the header', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 })
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Dark mode' })
    await expect(toggle).toBeHidden()
    await page.getByRole('button', { name: 'Menu' }).click()
    await expect(toggle).toBeVisible()
    expect((await toggle.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44)
    await toggle.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await page.setViewportSize({ width: 768, height: 1024 })
    const headerToggle = page.getByRole('banner').getByRole('button', { name: 'Dark mode' })
    await expect(headerToggle.first()).toBeVisible()
    expect((await headerToggle.first().boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44)
  })
})

test.describe('dark theme accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => localStorage.setItem(key, 'dark'), storageKey)
    // Show every block at once, so axe checks content that would otherwise wait for its scroll reveal.
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  for (const { path } of pages) {
    test(`${path} has no axe violations in the dark theme`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze()
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) – ${v.help}`)
      expect(summary).toEqual([])
    })
  }

  test('the contact form with errors has no axe violations in the dark theme', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
})
