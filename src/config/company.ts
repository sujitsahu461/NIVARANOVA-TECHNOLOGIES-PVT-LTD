/**
 * Business identity for NivaraNova.
 *
 * Rule for this file: a value goes in only after it has been checked against
 * a primary document (Certificate of Incorporation, GST registration, domain
 * registrar, the actual mailbox). `null` means "not verified yet"; the site
 * then shows a clearly labelled placeholder, or nothing, but never a guess.
 */

/** Read once at build time. Set in `.env.production` (see `.env.example`). */
const env = import.meta.env

function optionalEnv(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export const company = {
  /** Brand used in the wordmark and running text. */
  brandName: 'NivaraNova',

  /**
   * Legal name as instructed by the company.
   * CHECK BEFORE LAUNCH: use this exact form only once the Certificate of
   * Incorporation has been issued, and match its spelling and casing.
   */
  legalName: 'NivaraNova Technologies Pvt. Ltd.',

  /** One-sentence description used in metadata and the footer. */
  description:
    'NivaraNova Technologies is an early-stage technology company from Gunupur, Odisha, building practical software for public-service problems, starting with CivicSetu.',

  /** Provided by the company. A town, not a registered office address. */
  basedIn: 'Gunupur, Odisha, India',

  /** Registration details. Leave null until verified. */
  registration: {
    cin: null as string | null,
    gstin: null as string | null,
    registeredOffice: null as string | null,
    incorporatedOn: null as string | null,
  },

  /** Contact details. Leave null until the mailbox or number is live. */
  contact: {
    email: null as string | null,
    phone: null as string | null,
  },

  /** Public profiles. Leave null until the profile exists. */
  social: {
    linkedin: null as string | null,
    github: null as string | null,
    x: null as string | null,
  },
} as const

export const siteConfig = {
  /**
   * Canonical origin, e.g. https://www.example.in (no trailing slash).
   * Canonical URLs, Open Graph URLs and the sitemap are only emitted once set.
   */
  siteUrl: optionalEnv(env.VITE_SITE_URL)?.replace(/\/+$/, '') ?? null,

  /**
   * HTTPS endpoint that accepts the contact form as JSON (your own API or a
   * form-delivery service). While null, the form validates input but tells
   * the visitor plainly that it cannot send messages yet.
   */
  contactEndpoint: optionalEnv(env.VITE_CONTACT_ENDPOINT),

  /**
   * Show labelled placeholders (e.g. "Business email: to be added") for
   * missing details. Set VITE_SHOW_PLACEHOLDERS=false to hide them instead.
   */
  showPlaceholders: env.VITE_SHOW_PLACEHOLDERS !== 'false',

  /** Year the site was built, for the copyright line. */
  buildYear: __BUILD_YEAR__,
} as const
