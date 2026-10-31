import type { Enquiry, EnquiryType } from '../types'

/**
 * Contact-form rules. Pure functions with no DOM access, so the same checks
 * can run in a server endpoint when one is connected. The client-side checks
 * are for the visitor's convenience; a receiving server must validate again.
 */

export const enquiryTypes: ReadonlyArray<{ value: EnquiryType; label: string }> = [
  { value: 'general', label: 'General enquiry' },
  { value: 'civicsetu', label: 'CivicSetu: pilot or demo' },
  { value: 'project', label: 'A software project' },
  { value: 'partnership', label: 'Partnership or collaboration' },
  { value: 'other', label: 'Something else' },
]

export const limits = {
  fullName: { min: 2, max: 100 },
  workEmail: { max: 254 },
  organisation: { max: 150 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 5000 },
} as const

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>

export const emptyEnquiry: Enquiry = {
  fullName: '',
  workEmail: '',
  organisation: '',
  subject: '',
  enquiryType: '',
  message: '',
}

const EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/

// Control characters other than tab, line feed and carriage return. Matching them is the point.
// oxlint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export function isEnquiryType(value: string): value is EnquiryType {
  return enquiryTypes.some((type) => type.value === value)
}

export function isValidEmail(value: string): boolean {
  return value.length <= limits.workEmail.max && EMAIL_PATTERN.test(value) && !value.includes('..')
}

/** Trims fields, collapses whitespace in single-line fields and strips control characters. */
export function normaliseEnquiry(input: Enquiry): Enquiry {
  const singleLine = (value: string) => value.replace(CONTROL_CHARACTERS, '').replace(/\s+/g, ' ').trim()
  return {
    fullName: singleLine(input.fullName),
    workEmail: singleLine(input.workEmail).toLowerCase(),
    organisation: singleLine(input.organisation),
    subject: singleLine(input.subject),
    enquiryType: input.enquiryType,
    message: input.message.replace(CONTROL_CHARACTERS, '').replace(/\r\n/g, '\n').trim(),
  }
}

/** Returns one error message per invalid field. An empty object means the enquiry is valid. */
export function validateEnquiry(input: Enquiry): EnquiryErrors {
  const enquiry = normaliseEnquiry(input)
  const errors: EnquiryErrors = {}

  if (!enquiry.fullName) errors.fullName = 'Enter your full name.'
  else if (enquiry.fullName.length < limits.fullName.min) errors.fullName = 'Enter your full name.'
  else if (enquiry.fullName.length > limits.fullName.max)
    errors.fullName = `Name must be ${limits.fullName.max} characters or fewer.`

  if (!enquiry.workEmail) errors.workEmail = 'Enter your work email address.'
  else if (!isValidEmail(enquiry.workEmail))
    errors.workEmail = 'Enter an email address in the format name@example.com.'

  if (enquiry.organisation.length > limits.organisation.max)
    errors.organisation = `Organisation must be ${limits.organisation.max} characters or fewer.`

  if (!enquiry.enquiryType || !isEnquiryType(enquiry.enquiryType))
    errors.enquiryType = 'Choose what your enquiry is about.'

  if (!enquiry.subject) errors.subject = 'Enter a subject.'
  else if (enquiry.subject.length < limits.subject.min)
    errors.subject = `Subject must be at least ${limits.subject.min} characters.`
  else if (enquiry.subject.length > limits.subject.max)
    errors.subject = `Subject must be ${limits.subject.max} characters or fewer.`

  if (!enquiry.message) errors.message = 'Enter your message.'
  else if (enquiry.message.length < limits.message.min)
    errors.message = `Message must be at least ${limits.message.min} characters, so we have enough to go on.`
  else if (enquiry.message.length > limits.message.max)
    errors.message = `Message must be ${limits.message.max} characters or fewer.`

  return errors
}

export type SubmitResult = { status: 'sent' } | { status: 'not-configured' } | { status: 'failed' }

interface SubmitOptions {
  endpoint: string | null
  /** Milliseconds between the form appearing and being submitted; lets a server discard bot traffic. */
  elapsedMs: number
  fetchImpl?: typeof fetch
  timeoutMs?: number
}

/** Endpoints must use HTTPS, except a local development server. */
export function isAllowedEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint)
    if (url.protocol === 'https:') return true
    return url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  } catch {
    return false
  }
}

/**
 * Sends a validated enquiry as JSON. Never throws; failures are reported as
 * `failed` without exposing technical details to the visitor.
 */
export async function submitEnquiry(enquiry: Enquiry, options: SubmitOptions): Promise<SubmitResult> {
  const { endpoint, elapsedMs, fetchImpl = fetch, timeoutMs = 15000 } = options
  if (!endpoint) return { status: 'not-configured' }
  if (!isAllowedEndpoint(endpoint)) {
    console.error('Contact endpoint rejected: it must be an HTTPS URL.')
    return { status: 'not-configured' }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...normaliseEnquiry(enquiry), meta: { elapsedMs, source: 'website-contact' } }),
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'strict-origin-when-cross-origin',
    })
    return response.ok ? { status: 'sent' } : { status: 'failed' }
  } catch {
    return { status: 'failed' }
  } finally {
    clearTimeout(timer)
  }
}
