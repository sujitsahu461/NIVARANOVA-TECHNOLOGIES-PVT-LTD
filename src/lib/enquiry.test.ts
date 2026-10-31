import { describe, expect, it, vi } from 'vitest'
import type { Enquiry } from '../types'
import {
  emptyEnquiry,
  isAllowedEndpoint,
  isValidEmail,
  limits,
  normaliseEnquiry,
  submitEnquiry,
  validateEnquiry,
} from './enquiry'

const valid: Enquiry = {
  fullName: 'Asha Mishra',
  workEmail: 'asha@example.org',
  organisation: 'Example Municipality',
  subject: 'CivicSetu pilot',
  enquiryType: 'civicsetu',
  message: 'We would like to understand how a pilot would work for our wards.',
}

describe('validateEnquiry', () => {
  it('accepts a complete enquiry', () => {
    expect(validateEnquiry(valid)).toEqual({})
  })

  it('reports every required field when the form is empty', () => {
    expect(Object.keys(validateEnquiry(emptyEnquiry)).sort()).toEqual(
      ['enquiryType', 'fullName', 'message', 'subject', 'workEmail'].sort(),
    )
  })

  it('treats organisation as optional', () => {
    expect(validateEnquiry({ ...valid, organisation: '' })).toEqual({})
  })

  it('rejects whitespace-only values', () => {
    const errors = validateEnquiry({ ...valid, fullName: '   ', subject: '\t', message: '\n\n' })
    expect(errors.fullName).toBeDefined()
    expect(errors.subject).toBeDefined()
    expect(errors.message).toBeDefined()
  })

  it('explains an invalid email address', () => {
    expect(validateEnquiry({ ...valid, workEmail: 'asha@' }).workEmail).toBe(
      'Enter an email address in the format name@example.com.',
    )
  })

  it('requires a message long enough to act on', () => {
    expect(validateEnquiry({ ...valid, message: 'Too short' }).message).toMatch(/at least 20 characters/)
  })

  it('enforces maximum lengths', () => {
    const errors = validateEnquiry({
      ...valid,
      fullName: 'a'.repeat(limits.fullName.max + 1),
      organisation: 'a'.repeat(limits.organisation.max + 1),
      subject: 'a'.repeat(limits.subject.max + 1),
      message: 'a'.repeat(limits.message.max + 1),
    })
    expect(Object.keys(errors).sort()).toEqual(['fullName', 'message', 'organisation', 'subject'])
  })

  it('rejects an unknown enquiry type', () => {
    expect(validateEnquiry({ ...valid, enquiryType: 'sales' as never }).enquiryType).toBeDefined()
  })
})

describe('isValidEmail', () => {
  it.each(['name@example.com', 'first.last@sub.example.co.in', 'a+tag@example.org'])('accepts %s', (email) => {
    expect(isValidEmail(email)).toBe(true)
  })

  it.each(['plain', 'a@b', 'a@b.c', 'a..b@example.com', 'a@-example.com', 'a b@example.com', '@example.com'])(
    'rejects %s',
    (email) => {
      expect(isValidEmail(email)).toBe(false)
    },
  )
})

describe('normaliseEnquiry', () => {
  it('trims fields, collapses spaces, lowercases email and strips control characters', () => {
    const result = normaliseEnquiry({
      ...valid,
      fullName: '  Asha   Mishra\u0007 ',
      workEmail: ' Asha@Example.ORG ',
      message: '  Line one\r\nLine two\u0000  ',
    })
    expect(result.fullName).toBe('Asha Mishra')
    expect(result.workEmail).toBe('asha@example.org')
    expect(result.message).toBe('Line one\nLine two')
  })
})

describe('isAllowedEndpoint', () => {
  it('allows HTTPS and local development servers only', () => {
    expect(isAllowedEndpoint('https://api.example.in/enquiries')).toBe(true)
    expect(isAllowedEndpoint('http://localhost:8000/enquiries')).toBe(true)
    expect(isAllowedEndpoint('http://api.example.in/enquiries')).toBe(false)
    expect(isAllowedEndpoint('javascript:alert(1)')).toBe(false)
    expect(isAllowedEndpoint('not a url')).toBe(false)
  })
})

describe('submitEnquiry', () => {
  it('reports not-configured without a network call when no endpoint is set', async () => {
    const fetchImpl = vi.fn()
    expect(await submitEnquiry(valid, { endpoint: null, elapsedMs: 5000, fetchImpl })).toEqual({
      status: 'not-configured',
    })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('refuses a plain-HTTP endpoint', async () => {
    const fetchImpl = vi.fn()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await submitEnquiry(valid, { endpoint: 'http://example.in/x', elapsedMs: 5000, fetchImpl })).toEqual({
      status: 'not-configured',
    })
    expect(fetchImpl).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('posts normalised JSON and reports success', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    const result = await submitEnquiry(
      { ...valid, fullName: '  Asha Mishra ' },
      { endpoint: 'https://api.example.in/enquiries', elapsedMs: 4200, fetchImpl },
    )
    expect(result).toEqual({ status: 'sent' })
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.example.in/enquiries')
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('omit')
    expect(JSON.parse(init.body as string)).toMatchObject({
      fullName: 'Asha Mishra',
      workEmail: 'asha@example.org',
      enquiryType: 'civicsetu',
      meta: { elapsedMs: 4200, source: 'website-contact' },
    })
  })

  it('reports failure for an error response or a network error', async () => {
    const endpoint = 'https://api.example.in/enquiries'
    const rejected = vi.fn().mockResolvedValue(new Response('nope', { status: 500 }))
    const offline = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    expect(await submitEnquiry(valid, { endpoint, elapsedMs: 5000, fetchImpl: rejected })).toEqual({ status: 'failed' })
    expect(await submitEnquiry(valid, { endpoint, elapsedMs: 5000, fetchImpl: offline })).toEqual({ status: 'failed' })
  })
})
