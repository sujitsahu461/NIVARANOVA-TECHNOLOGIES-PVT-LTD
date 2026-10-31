import type { ReactNode } from 'react'
import { ClosingCta } from '../components/sections/ClosingCta'
import { PageHeader } from '../components/sections/PageHeader'
import { Container } from '../components/ui/Container'
import { Placeholder } from '../components/ui/Placeholder'
import { company, siteConfig } from '../config/company'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'

const principles = [
  {
    title: 'Start from the workflow',
    detail:
      'We learn who does what today, and where work gets stuck, before deciding what to build. The first version solves one problem well.',
  },
  {
    title: 'Say what is true',
    detail:
      'Every feature we describe is labelled as tested, implemented or planned. We do not present plans as finished work.',
  },
  {
    title: 'Build to be maintained',
    detail:
      'Typed code, automated tests, clear documentation and widely used tools, so the software can be run and changed long after launch.',
  },
  {
    title: 'Right-size the infrastructure',
    detail:
      'We design for the load a system actually has. Public bodies and small organisations should not pay every month for capacity they do not use.',
  },
  {
    title: 'Accessible and local by default',
    detail:
      'Software for public services has to work on low-cost phones, with a keyboard or screen reader, and in the languages people speak.',
  },
]

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
      <dt className="text-sm font-semibold text-ink">{term}</dt>
      <dd className="text-muted">{children}</dd>
    </div>
  )
}

export default function AboutPage() {
  usePageMeta(routeMeta.about)
  const { registration } = company
  const unverifiedFacts = [
    { term: 'Registered office', value: registration.registeredOffice, placeholder: 'Registered office' },
    { term: 'CIN', value: registration.cin, placeholder: 'CIN' },
    { term: 'Incorporated', value: registration.incorporatedOn, placeholder: 'Date of incorporation' },
    { term: 'Leadership', value: null, placeholder: 'Leadership profiles' },
  ]

  return (
    <>
      <PageHeader
        title="About NivaraNova"
        lead="An early-stage technology company from Gunupur, Odisha, building practical software for problems in public services."
      />

      <section aria-labelledby="name-heading">
        <Container className="grid gap-8 py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
          <h2 id="name-heading" className="text-h2 lg:col-span-4">
            What the name means
          </h2>
          <div className="max-w-prose space-y-5 text-lead text-muted lg:col-span-7 lg:col-start-6">
            <p>
              <span className="font-medium text-ink">Nivaran</span> means resolution, or redressal. It reflects what
              we care about: making sure problems are actually resolved, not just recorded.
            </p>
            <p>
              Our first product, CivicSetu, applies that idea to public complaints. Over time, we want to build
              configurable workflow software for public-service organisations across India.
            </p>
          </div>
        </Container>
      </section>

      <section aria-label="Vision and mission" className="border-y border-line bg-paper">
        <Container className="grid gap-12 py-20 md:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <h2 className="text-h3 text-teal-strong">Vision</h2>
            <p className="mt-4 font-display text-[1.5rem] leading-snug font-semibold tracking-[-0.015em] text-ink lg:text-[1.75rem]">
              To build meaningful technology that makes digital experiences and essential services more accessible,
              intelligent and effective.
            </p>
          </div>
          <div>
            <h2 className="text-h3 text-teal-strong">Mission</h2>
            <p className="mt-4 font-display text-[1.5rem] leading-snug font-semibold tracking-[-0.015em] text-ink lg:text-[1.75rem]">
              To engineer practical, scalable software for real-world problems, starting by giving citizens a
              reliable way to report civic issues and giving authorities the tools to resolve them on time.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="philosophy-heading">
        <Container className="py-20 lg:py-24">
          <div className="max-w-prose">
            <h2 id="philosophy-heading" className="text-h2">
              How we build
            </h2>
            <p className="mt-5 text-lead text-muted">The engineering principles we hold ourselves to.</p>
          </div>
          <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle) => (
              <li key={principle.title} className="border-t-2 border-teal pt-5">
                <h3 className="text-h3">{principle.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{principle.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="innovation-heading" className="border-t border-line">
        <Container className="grid gap-16 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <h2 id="innovation-heading" className="text-h2">
              Our approach to innovation
            </h2>
            <div className="mt-6 max-w-prose space-y-5 leading-relaxed text-muted">
              <p>
                We treat AI as a tool to be justified, not a label to attach. A feature starts as a clear,
                rule-based system that people can understand and check. Once real use produces data, we test
                whether a model does better, and we keep a person accountable for each decision.
              </p>
              <p>
                That is why CivicSetu’s first version has no machine learning in the complaint path. Citizens choose
                the category, and fixed rules route and prioritise each complaint. AI suggestions are planned for
                later, once they can be evaluated against pilot data.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-h2">Long-term direction</h2>
            <div className="mt-6 max-w-prose space-y-5 leading-relaxed text-muted">
              <p>
                We are beginning with grievance handling for municipalities and campuses. Over time, we aim to offer
                configurable, integration-ready workflow software for public-service organisations in India.
              </p>
              <p>
                We expect to grow through careful pilots and honest results rather than broad claims.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="facts-heading" className="border-t border-line bg-paper">
        <Container className="py-20 lg:py-24">
          <h2 id="facts-heading" className="text-h2">
            Company details
          </h2>
          <dl className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
            <Fact term="Name">{company.legalName}</Fact>
            <Fact term="Based in">{company.basedIn}</Fact>
            <Fact term="Stage">Early-stage. First product in development.</Fact>
            {unverifiedFacts.map(({ term, value, placeholder }) =>
              value ? (
                <Fact key={term} term={term}>
                  {value}
                </Fact>
              ) : siteConfig.showPlaceholders ? (
                <Fact key={term} term={term}>
                  <Placeholder label={placeholder} />
                </Fact>
              ) : null,
            )}
          </dl>
        </Container>
      </section>

      <ClosingCta
        title="Working on a public-service problem?"
        text="We would like to hear about it, whether it is a complaint process, a paper workflow or a system that no longer fits."
        action={{ label: 'Start a conversation', to: routeMeta.contact.path }}
      />
    </>
  )
}
