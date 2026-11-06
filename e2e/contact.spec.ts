import { expect, fakeWeb3Forms, fillValidEnquiry, test } from './fixtures'

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('is connected, so it does not warn that enquiries cannot be sent', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Contact', level: 1 })).toBeVisible()
    await expect(page.getByText('Online enquiries are not connected yet')).toHaveCount(0)
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

  test('a valid enquiry is emailed through Web3Forms and the visitor sees it was sent', async ({ page }) => {
    const posted = await fakeWeb3Forms(page, { success: true })
    await fillValidEnquiry(page)
    await page.getByRole('button', { name: 'Send enquiry' }).click()

    await expect(page.getByRole('heading', { name: 'Enquiry sent' })).toBeFocused()
    expect(posted).toHaveLength(1)
    expect(posted[0]).toMatchObject({
      access_key: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
      subject: 'New website enquiry: CivicSetu pilot',
      name: 'Asha Mishra',
      email: 'asha@example.org',
      organisation: 'Example Municipality',
      enquiry_type: 'CivicSetu: pilot or demo',
      message: 'We would like to understand how a pilot would work for our wards.',
    })
  })

  test('if Web3Forms does not confirm, the visitor is told and keeps the message', async ({ page }) => {
    await fakeWeb3Forms(page, { success: false })
    await fillValidEnquiry(page)
    await page.getByRole('button', { name: 'Send enquiry' }).click()

    await expect(page.getByText('Your enquiry could not be sent')).toBeVisible()
    await expect(page.getByText('Enquiry sent')).toHaveCount(0)
    await expect(page.getByLabel('Message')).toHaveValue(/pilot would work/)
    // The same enquiry can still go by email.
    await expect(page.getByRole('link', { name: 'Open email app' })).toHaveAttribute(
      'href',
      /^mailto:nivaranovapvtltd@gmail\.com\?subject=Website%20enquiry%3A%20CivicSetu%20pilot&body=/,
    )
  })

  test('tapping a phone number offers a call or a WhatsApp chat', async ({ page }) => {
    const number = page.getByRole('main').getByRole('button', { name: '+91 76568 52710, call or WhatsApp' })
    await number.click()
    await expect(number).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('link', { name: /^Call/ })).toHaveAttribute('href', 'tel:+917656852710')
    await expect(page.getByRole('link', { name: /^WhatsApp/ })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/917656852710\?text=/,
    )
    await page.keyboard.press('Escape')
    await expect(number).toHaveAttribute('aria-expanded', 'false')
    await expect(number).toBeFocused()
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
    await expect(page.getByRole('link', { name: 'Privacy policy' }).first()).toBeFocused()
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
