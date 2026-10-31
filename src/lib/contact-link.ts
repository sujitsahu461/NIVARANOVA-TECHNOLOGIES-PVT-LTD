import { routeMeta } from '../content/routes'
import type { EnquiryType } from '../types'

/** Builds a link to the contact page with the enquiry type and subject prefilled. */
export function contactHref({ type, subject }: { type: EnquiryType; subject?: string }): string {
  const params = new URLSearchParams({ type })
  if (subject) params.set('subject', subject)
  return `${routeMeta.contact.path}?${params.toString()}`
}
