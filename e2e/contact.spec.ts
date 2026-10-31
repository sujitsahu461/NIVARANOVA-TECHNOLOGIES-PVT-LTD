import { expect, test } from './fixtures'

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('states up front that online enquiries are not connected', async ({ page }) => {
    await expect(page.getByText('Online enquiries are not connected yet')).toBeVisible()
  })

  test('an empty submission lists every problem and moves focus to the summary', async ({ page }) => {
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    const summary = page.getByRole('alert')
    await expect(summary).toBeFocused()
    await expect(summary.getByRole('listitem')).toHaveCount(5)
    await expect(page.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Work email')).toHaveAttribute('aria-invalid', 'true')

    // Each summary entry takes the visitor to its field.
    await summary.getByRole('link', { name: 'Enter your work email address.' }).click()
    await expect(page.getByLabel('Work email')).toBeFocused()
  })

  test('an invalid email address is explained', async ({ page }) => {
    await page.getByLabel('Work email').fill('asha@example')
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByText('Enter an email address in the format name@example.com.').first()).toBeVisible()
    await expect(page.getByLabel('Work email')).toHaveAttribute('aria-describedby', /error/)
  })

  test('a valid enquiry is not sent, and the visitor is told so', async ({ page }) => {
    const posts: string[] = []
    page.on('request', (request) => {
      if (request.method() !== 'GET') posts.push(request.url())
    })

    await page.getByLabel('Full name').fill('Asha Mishra')
    await page.getByLabel('Work email').fill('asha@example.org')
    await page.getByLabel('Organisation (optional)').fill('Example Municipality')
    await page.getByLabel('Enquiry type').selectOption('civicsetu')
    await page.getByLabel('Subject').fill('CivicSetu pilot')
    await page.getByLabel('Message').fill('We would like to understand how a pilot would work for our wards.')
    await page.waitForTimeout(3100) // past the minimum fill time
    await page.getByRole('button', { name: 'Send enquiry' }).click()

    await expect(page.getByTestId('form-status-not-configured')).toContainText('Your enquiry was not sent')
    await expect(page.getByText('Enquiry sent')).toHaveCount(0)
    await expect(page.getByLabel('Message')).toHaveValue(/pilot would work/)
    expect(posts).toEqual([])
  })

  test('the form can be completed with the keyboard alone', async ({ page }) => {
    await page.getByLabel('Full name').focus()
    await page.keyboard.type('Asha Mishra')
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Work email')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Organisation (optional)')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Enquiry type')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Subject')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Message')).toBeFocused()
    // Next come the privacy link and the button; the hidden spam trap is skipped.
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Privacy notice' }).first()).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Send enquiry' })).toBeFocused()
  })

  test('nothing typed into the form is written to browser storage', async ({ page }) => {
    await page.getByLabel('Full name').fill('Asha Mishra')
    await page.getByLabel('Message').fill('A private message that should stay in memory only.')
    const stored = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))
    expect(stored).toEqual({ local: 0, session: 0 })
  })
})
