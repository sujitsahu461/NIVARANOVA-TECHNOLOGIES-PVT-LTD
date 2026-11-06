/**
 * Business identity for NivaraNova.
 *
 * Rule for this file: a value goes in only after it has been checked against
 * a primary document (Certificate of Incorporation, GST registration, domain
 * registrar, the actual mailbox). `null` means "not verified yet"; the site
 * then shows a clearly labelled placeholder, or nothing, but never a guess.
 */

import { WEB3FORMS_ENDPOINT } from '../lib/enquiry'

/** Read once at build time from `.env` (see `.env.example`) or the host's build settings. */
const env = import.meta.env

function optionalEnv(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/**
 * Web3Forms access key for the company inbox (nivaranovapvtltd@gmail.com).
 * Kept out of the repository in VITE_WEB3FORMS_ACCESS_KEY. It still ends up in
 * the public JavaScript, which is how Web3Forms is designed to work: the key
 * can only send email to that one inbox. Leave it unset to switch the form
 * off; it then says plainly that it cannot send.
 */
const web3formsAccessKey = optionalEnv(env.VITE_WEB3FORMS_ACCESS_KEY)

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

  /** Registration details. Leave null until verified; each appears in the footer once set. */
  registration: {
    cin: null as string | null,
    gstin: null as string | null,
  },

  /** Contact details, provided by the company. Leave null until the mailbox or number is live. */
  contact: {
    email: 'nivaranovapvtltd@gmail.com' as string | null,
    phone: '+91 76568 52710' as string | null,
    /** Second number, shown under the main one. */
    phoneAlternative: '+91 82602 35030' as string | null,
  },

  /** Public profiles, provided by the company. Leave null until the profile exists. */
  social: {
    linkedin: 'https://www.linkedin.com/in/nivaranova-technologies-private-limited-85b887449' as string | null,
    instagram: 'https://www.instagram.com/nivaranovatechnologiespvtltd/' as string | null,
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
   * Where the contact form sends enquiries. VITE_CONTACT_ENDPOINT (your own
   * HTTPS API) takes priority; otherwise Web3Forms is used once its access key
   * is set. While null, the form validates input but tells the visitor
   * plainly that it cannot send messages yet.
   */
  contactEndpoint: optionalEnv(env.VITE_CONTACT_ENDPOINT) ?? (web3formsAccessKey ? WEB3FORMS_ENDPOINT : null),

  /** Sent with each enquiry when the endpoint is Web3Forms. */
  contactAccessKey: web3formsAccessKey,

  /**
   * Show labelled placeholders (e.g. "Business email: to be added") for
   * missing details. Set VITE_SHOW_PLACEHOLDERS=false to hide them instead.
   */
  showPlaceholders: env.VITE_SHOW_PLACEHOLDERS !== 'false',

  /** Year the site was built, for the copyright line. */
  buildYear: __BUILD_YEAR__,
} as const
