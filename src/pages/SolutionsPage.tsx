import { Info } from 'lucide-react'
import { Link } from 'react-router'
import { ClosingCta } from '../components/sections/ClosingCta'
import { PageHeader } from '../components/sections/PageHeader'
import { Container } from '../components/ui/Container'
import { routeMeta } from '../content/routes'
import { solutions } from '../content/solutions'
import { usePageMeta } from '../hooks/usePageMeta'
import { contactHref } from '../lib/contact-link'

export default function SolutionsPage() {
  usePageMeta(routeMeta.solutions)

  return (
    <>
      <PageHeader
        title="Solutions"
        lead="The kinds of problems we work on, and how we approach each one."
      >
        <div className="mt-10 flex max-w-3xl gap-3 rounded-lg border border-line bg-white p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-deep" aria-hidden="true" />
          <p className="text-[0.9375rem] leading-relaxed text-muted">
            NivaraNova is an early-stage company. These pages describe our approach, not packaged services. We do not
            publish fixed packages, certifications or service-level commitments. Scope, timeline and terms are agreed
            in writing before any work starts.
          </p>
        </div>
      </PageHeader>

      <Container className="py-16 lg:py-20">
        <nav aria-label="Solutions on this page" className="mb-6">
          <ul className="flex flex-wrap gap-2">
            {solutions.map((solution) => (
              <li key={solution.id}>
                <a
                  href={`#${solution.id}`}
                  className="inline-flex min-h-10 items-center rounded-md border border-line px-3 text-sm font-medium text-ink transition-colors hover:border-ink"
                >
                  {solution.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="divide-y divide-line">
          {solutions.map((solution) => (
            <article
              key={solution.id}
              id={solution.id}
              aria-labelledby={`${solution.id}-heading`}
              className="grid gap-8 py-14 lg:grid-cols-12 lg:gap-12 lg:py-16"
            >
              <div className="lg:col-span-4">
                <h2 id={`${solution.id}-heading`} className="text-h2">
                  {solution.title}
                </h2>
                <p className="mt-4 text-lead text-muted">{solution.summary}</p>
                <Link
                  to={contactHref({ type: 'project', subject: solution.title })}
                  className="mt-6 inline-flex min-h-11 items-center font-semibold text-teal-strong underline decoration-teal/40 underline-offset-[6px] transition-colors hover:decoration-teal-strong"
                >
                  Discuss a project like this
                  <span className="sr-only"> ({solution.title.toLowerCase()})</span>
                </Link>
              </div>

              <dl className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                <div>
                  <dt className="text-sm font-semibold text-ink">The problem</dt>
                  <dd className="mt-2 leading-relaxed text-muted">{solution.problem}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink">Our approach</dt>
                  <dd className="mt-2 leading-relaxed text-muted">{solution.approach}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink">What it is meant to achieve</dt>
                  <dd className="mt-2 leading-relaxed text-muted">{solution.value}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink">Typical technology</dt>
                  <dd className="mt-3">
                    <ul className="flex flex-wrap gap-2" aria-label={`Technology for ${solution.title}`}>
                      {solution.technology.map((item) => (
                        <li key={item} className="rounded bg-mist px-2.5 py-1 text-sm text-deep">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Container>

      <ClosingCta
        title="Not sure which of these fits?"
        text="Describe the problem in your own words. We will ask questions before suggesting anything."
        action={{ label: 'Start a conversation', to: routeMeta.contact.path }}
      />
    </>
  )
}
