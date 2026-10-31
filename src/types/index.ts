/** Shared types for site content and configuration. */
import type { LucideIcon } from 'lucide-react'

export interface RouteMeta {
  path: string
  /** Page title without the site suffix. */
  title: string
  description: string
  /** Excluded from the sitemap and marked noindex when true. */
  noindex?: boolean
}

/**
 * How far a CivicSetu capability has progressed.
 * - implemented: present in the V1 codebase
 * - tested: covered by the V1 automated test suite (as reported by the development team)
 * - planned: on the roadmap, not built
 */
export type CapabilityStatus = 'implemented' | 'tested' | 'planned'

export interface Capability {
  name: string
  detail: string
  status: CapabilityStatus
  /** Where the status comes from. Not shown on the site; kept for reviewers. */
  evidence: string
}

export interface WorkflowStep {
  title: string
  detail: string
}

export interface Solution {
  id: string
  title: string
  summary: string
  problem: string
  approach: string
  technology: string[]
  value: string
}

export interface FocusArea {
  title: string
  detail: string
  icon: LucideIcon
}

export interface Insight {
  slug: string
  title: string
  /** ISO date (YYYY-MM-DD) of real publication. Never backdate. */
  publishedOn: string
  summary: string
  body: string[]
}

export type EnquiryType = 'general' | 'civicsetu' | 'project' | 'partnership' | 'other'

export interface Enquiry {
  fullName: string
  workEmail: string
  organisation: string
  subject: string
  enquiryType: EnquiryType | ''
  message: string
}
