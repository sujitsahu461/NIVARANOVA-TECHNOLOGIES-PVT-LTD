import type { Enquiry } from '../types'
import { enquiryTypes, normaliseEnquiry } from './enquiry'

/**
 * An enquiry written out as an email the visitor sends from their own mail app.
 * Used when no delivery service is connected, and as the fallback when one fails.
 */
export interface EmailDraft {
  to: string
  subject: string
  body: string
}

export function enquiryEmail(enquiry: Enquiry, to: string): EmailDraft {
  const clean = normaliseEnquiry(enquiry)
  const typeLabel = enquiryTypes.find((type) => type.value === clean.enquiryType)?.label ?? clean.enquiryType
  const body = [
    `Name: ${clean.fullName}`,
    `Email: ${clean.workEmail}`,
    `Organisation: ${clean.organisation || 'Not given'}`,
    `Enquiry type: ${typeLabel}`,
    '',
    clean.message,
  ].join('\n')
  return { to, subject: `Website enquiry: ${clean.subject}`, body }
}

/**
 * A mailto: link (RFC 6068). Spaces become %20, not "+", and line breaks
 * %0D%0A, which every mail app reads correctly.
 */
export function mailtoHref({ to, subject, body }: EmailDraft): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`
}

/** Gmail's compose window in the browser, for visitors without a mail app set up. */
export function gmailComposeHref({ to, subject, body }: EmailDraft): string {
  return `https://mail.google.com/mail/?${new URLSearchParams({ view: 'cm', fs: '1', to, su: subject, body })}`
}

/** The whole email as plain text, for pasting into any mail service. */
export function emailAsText({ to, subject, body }: EmailDraft): string {
  return `To: ${to}\nSubject: ${subject}\n\n${body}`
}

/** Hands the email to the visitor's default mail app. The page stays where it is. */
export function openEmailApp(href: string): void {
  window.location.href = href
}
