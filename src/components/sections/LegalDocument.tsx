import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Container } from '../ui/Container'

export interface LegalSection {
  /** Anchor for the section, e.g. "copyright" → /terms#copyright. */
  id: string
  title: string
  body: ReactNode
}

interface LegalDocumentProps {
  /** Date the wording last changed, e.g. "6 November 2026". */
  lastUpdated: string
  intro: ReactNode
  sections: LegalSection[]
}

/** Layout for the privacy policy and the terms: a contents list beside numbered sections. */
export function LegalDocument({ lastUpdated, intro, sections }: LegalDocumentProps) {
  return (
    <Container className="py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
          <h2 className="font-sans text-sm font-semibold text-ink">On this page</h2>
          <ol className="mt-3 text-sm sm:columns-2 lg:columns-1">
            {sections.map((section, index) => (
              <li key={section.id} className="break-inside-avoid">
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-8 items-center text-muted transition-colors hover:text-ink"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-prose lg:col-span-8 lg:col-start-5">
          <p className="text-sm text-muted">Last updated {lastUpdated}</p>
          <div className="mt-6 space-y-3 leading-relaxed text-muted">{intro}</div>
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="mt-10 border-t border-line pt-8">
              <h2 className="text-h3">
                {index + 1}. {section.title}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted">{section.body}</div>
            </section>
          ))}
        </div>
      </div>
    </Container>
  )
}

/** Bulleted list in a legal section. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-line-strong">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

const inlineLink = 'font-medium text-teal-strong underline underline-offset-4'

/** Link to another page of this site, inside legal text. */
export function LegalLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={inlineLink}>
      {children}
    </Link>
  )
}

/** Link to another website, inside legal text. Opens in a new tab. */
export function ExternalLegalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={inlineLink}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

/** The company email as a link, for "contact us" lines. */
export function EmailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className={inlineLink}>
      {email}
    </a>
  )
}
