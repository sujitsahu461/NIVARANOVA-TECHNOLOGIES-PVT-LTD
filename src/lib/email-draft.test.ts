import { describe, expect, it } from 'vitest'
import type { Enquiry } from '../types'
import { emailAsText, enquiryEmail, gmailComposeHref, mailtoHref } from './email-draft'

const enquiry: Enquiry = {
  fullName: '  Asha   Mishra ',
  workEmail: 'Asha@Example.org',
  organisation: '',
  subject: 'Pilot & demo',
  enquiryType: 'civicsetu',
  message: 'Line one.\r\nLine two with 100+ wards.',
}

describe('enquiryEmail', () => {
  it('writes the enquiry out as a tidy email to the given inbox', () => {
    expect(enquiryEmail(enquiry, 'inbox@example.in')).toEqual({
      to: 'inbox@example.in',
      subject: 'Website enquiry: Pilot & demo',
      body: [
        'Name: Asha Mishra',
        'Email: asha@example.org',
        'Organisation: Not given',
        'Enquiry type: CivicSetu: pilot or demo',
        '',
        'Line one.',
        'Line two with 100+ wards.',
      ].join('\n'),
    })
  })
})

describe('links', () => {
  const draft = enquiryEmail(enquiry, 'inbox@example.in')

  it('builds a mailto link that mail apps read correctly', () => {
    const href = mailtoHref(draft)
    expect(href).toMatch(/^mailto:inbox@example\.in\?subject=Website%20enquiry%3A%20Pilot%20%26%20demo&body=/)
    // Spaces as %20 (a "+" would show up literally), line breaks as CRLF, and a real "+" kept.
    expect(href).toContain('Name%3A%20Asha%20Mishra%0D%0AEmail')
    expect(href).toContain('100%2B%20wards')
    expect(href).not.toMatch(/[ \n]/)
  })

  it('builds a Gmail compose link with the same email', () => {
    const url = new URL(gmailComposeHref(draft))
    expect(url.origin + url.pathname).toBe('https://mail.google.com/mail/')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      view: 'cm',
      fs: '1',
      to: draft.to,
      su: draft.subject,
      body: draft.body,
    })
  })

  it('gives a plain-text copy for pasting anywhere', () => {
    expect(emailAsText(draft)).toBe(`To: inbox@example.in\nSubject: Website enquiry: Pilot & demo\n\n${draft.body}`)
  })
})
