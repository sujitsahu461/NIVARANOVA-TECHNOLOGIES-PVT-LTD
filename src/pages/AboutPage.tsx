import type { ReactNode } from 'react'
import { ClosingCta } from '../components/sections/ClosingCta'
import { PageHeader } from '../components/sections/PageHeader'
import { Container } from '../components/ui/Container'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'
import { cn } from '../lib/cn'

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

interface AboutSectionProps {
  id: string
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
  className?: string
}

/**
 * One section of the About page. Every section uses the same grid: eyebrow,
 * heading and intro in the left four columns, content from the sixth column,
 * so all the headings line up on one edge and all the text on another.
 */
function AboutSection({ id, eyebrow, title, intro, children, className }: AboutSectionProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className={className}>
      <Container className="grid gap-8 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
        <div className="reveal lg:col-span-4">
          <p className="font-medium text-teal-strong">{eyebrow}</p>
          <h2 id={`${id}-heading`} className="mt-3 text-h2">
            {title}
          </h2>
          {intro && <p className="mt-5 max-w-sm text-muted">{intro}</p>}
        </div>
        <div className="lg:col-span-7 lg:col-start-6">{children}</div>
      </Container>
    </section>
  )
}

const statement = 'font-display font-semibold tracking-[-0.015em] text-ink'

export default function AboutPage() {
  usePageMeta(routeMeta.about)

  return (
    <>
      <PageHeader
        title="About NivaraNova"
        lead="An early-stage technology company from Gunupur, Odisha, building practical software for problems in public services."
      />

      <AboutSection id="name" eyebrow="Our name" title="What the name means">
        {/* Set like a dictionary entry: the word the company is named after. */}
        <dl className="reveal rounded-2xl border border-line bg-paper p-7 sm:p-9">
          <dt className="font-display text-[2.75rem] leading-none font-bold tracking-[-0.035em] text-ink sm:text-[3.25rem]">
            Nivaran
          </dt>
          <dd className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-sm text-muted italic">noun</span>
            <span className="text-lead text-ink">resolution; redressal</span>
          </dd>
        </dl>
        <div className="reveal mt-8 space-y-5 text-lead text-muted">
          <p>
            The name reflects what we care about: making sure problems are actually resolved, not just recorded.
          </p>
          <p>
            Our first product, CivicSetu, applies that idea to public complaints. Over time, we want to build
            configurable workflow software for public-service organisations across India.
          </p>
        </div>
      </AboutSection>

      <AboutSection
        id="purpose"
        eyebrow="Purpose"
        title="Vision and mission"
        className="aurora border-y border-line bg-paper"
      >
        <div className="space-y-5">
          <article className="reveal glass rounded-2xl p-7 sm:p-9">
            <h3 className="font-sans text-base font-medium text-teal-strong">Vision</h3>
            <p className={cn('mt-3 text-[1.375rem] leading-snug lg:text-[1.5rem]', statement)}>
              To build meaningful technology that makes digital experiences and essential services more accessible,
              intelligent and effective.
            </p>
          </article>
          <article className="reveal glass rounded-2xl p-7 sm:p-9">
            <h3 className="font-sans text-base font-medium text-teal-strong">Mission</h3>
            <p className={cn('mt-3 text-[1.375rem] leading-snug lg:text-[1.5rem]', statement)}>
              To engineer practical, scalable software for real-world problems, starting by giving citizens a reliable
              way to report civic issues and giving authorities the tools to resolve them on time.
            </p>
          </article>
        </div>
      </AboutSection>

      <AboutSection
        id="principles"
        eyebrow="Principles"
        title="How we build"
        intro="The engineering principles we hold ourselves to."
      >
        <ul className="border-t border-line">
          {principles.map((principle) => (
            <li
              key={principle.title}
              className="reveal grid gap-2 border-b border-line py-6 sm:grid-cols-[13rem_1fr] sm:gap-8"
            >
              <h3 className="flex gap-3 text-[1.0625rem] leading-snug">
                <span aria-hidden="true" className="mt-[0.45rem] size-2 shrink-0 rounded-full bg-teal" />
                {principle.title}
              </h3>
              <p className="leading-relaxed text-muted">{principle.detail}</p>
            </li>
          ))}
        </ul>
      </AboutSection>

      <AboutSection
        id="innovation"
        eyebrow="Innovation"
        title="Our approach to innovation"
        className="border-y border-line bg-paper"
      >
        <p className={cn('reveal border-l-2 border-teal pl-5 text-[1.375rem] leading-snug sm:text-[1.5rem]', statement)}>
          We treat AI as a tool to be justified, not a label to attach.
        </p>
        <div className="reveal mt-6 space-y-5 leading-relaxed text-muted">
          <p>
            A feature starts as a clear, rule-based system that people can understand and check. Once real use
            produces data, we test whether a model does better, and we keep a person accountable for each decision.
          </p>
          <p>
            That is why CivicSetu’s first version has no machine learning in the complaint path. Citizens choose the
            category, and fixed rules route and prioritise each complaint. AI suggestions are planned for later, once
            they can be evaluated against pilot data.
          </p>
        </div>
      </AboutSection>

      <AboutSection id="direction" eyebrow="Direction" title="Long-term direction">
        <div className="reveal space-y-5 text-lead text-muted">
          <p>
            We are beginning with grievance handling for municipalities and campuses. Over time, we aim to offer
            configurable, integration-ready workflow software for public-service organisations in India.
          </p>
          <p>We expect to grow through careful pilots and honest results rather than broad claims.</p>
        </div>
      </AboutSection>

      <ClosingCta
        title="Working on a public-service problem?"
        text="We would like to hear about it, whether it is a complaint process, a paper workflow or a system that no longer fits."
        action={{ label: 'Start a conversation', to: routeMeta.contact.path }}
      />
    </>
  )
}
