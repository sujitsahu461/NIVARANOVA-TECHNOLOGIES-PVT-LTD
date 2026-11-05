import type { ReactNode } from 'react'
import { ArchitectureDiagram } from '../components/sections/ArchitectureDiagram'
import { CapabilityShowcase, CapabilityStatusCounts } from '../components/sections/CapabilityShowcase'
import { ClosingCta } from '../components/sections/ClosingCta'
import { WorkflowSteps } from '../components/sections/WorkflowSteps'
import { Container } from '../components/ui/Container'
import {
  authorityWorkflow,
  citizenWorkflow,
  civicSetuOverview,
  civicSetuProblem,
  civicSetuSolution,
  civicSetuStatus,
  civicSetuSummary,
  roadmap,
} from '../content/civicsetu'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'
import { contactHref } from '../lib/contact-link'
import { cn } from '../lib/cn'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'roadmap', label: 'Roadmap' },
] as const

interface SectionProps {
  id: string
  title: string
  intro?: string
  children: ReactNode
  className?: string
}

function Section({ id, title, intro, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn('border-t border-line', className)}>
      <Container className="py-20 lg:py-24">
        <div className="reveal max-w-prose">
          <h2 id={`${id}-heading`} className="text-h2">
            {title}
          </h2>
          {intro && <p className="mt-5 text-lead text-muted">{intro}</p>}
        </div>
        <div className="reveal mt-12">{children}</div>
      </Container>
    </section>
  )
}

export default function CivicSetuPage() {
  usePageMeta(routeMeta.civicsetu)

  return (
    <>
      <section className="bg-paper">
        <Container className="grid gap-12 pt-16 pb-14 sm:pt-20 lg:grid-cols-12 lg:gap-12 lg:pt-24 lg:pb-20">
          <div className="lg:col-span-7">
            <p className="font-medium text-teal-strong">A product of NivaraNova Technologies</p>
            <h1 className="mt-3 text-display">CivicSetu</h1>
            <p className="mt-6 max-w-prose text-lead text-muted">{civicSetuSummary}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-line bg-surface p-6">
              <h2 className="text-h3">Current status</h2>
              <dl className="mt-5 space-y-4">
                {civicSetuStatus.map((item) => (
                  <div key={item.label}>
                    <dt className="text-sm font-semibold text-ink">{item.label}</dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
        <div className="border-t border-line bg-surface">
          <Container>
            <nav aria-label="On this page" className="-mx-1 overflow-x-auto">
              <ul className="flex min-w-max gap-1 py-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-muted transition-colors hover:bg-mist hover:text-ink"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </div>
      </section>

      <Section id="overview" title="Overview">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
          <div>
            <h3 className="text-h3">What it is</h3>
            <div className="mt-4 space-y-4 leading-relaxed text-muted">
              {civicSetuOverview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-h3">The problem</h3>
            <div className="mt-4 space-y-4 leading-relaxed text-muted">
              {civicSetuProblem.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-h3">How CivicSetu helps</h3>
            <div className="mt-4 space-y-4 leading-relaxed text-muted">
              {civicSetuSolution.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="workflows"
        title="Workflows"
        intro="Two sides of the same record: what citizens do, and what the responsible department does."
        className="bg-paper"
      >
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="text-h3">Citizens</h3>
            <WorkflowSteps steps={citizenWorkflow} label="Citizen workflow" className="mt-8" />
          </div>
          <div>
            <h3 className="text-h3">Departments and administrators</h3>
            <WorkflowSteps steps={authorityWorkflow} label="Authority workflow" className="mt-8" />
          </div>
        </div>
      </Section>

      {/* Not a <Section>: its tiles reveal one by one, so the block around them must not reveal as well. */}
      <section id="capabilities" aria-labelledby="capabilities-heading" className="border-t border-line">
        <Container className="py-20 lg:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="reveal max-w-prose lg:col-span-7">
              <h2 id="capabilities-heading" className="text-h2">
                Capabilities
              </h2>
              <p className="mt-5 text-lead text-muted">
                Each feature carries its real status. Tested means covered by the version 1 test suite; nothing has
                run in a live deployment yet.
              </p>
            </div>
            <CapabilityStatusCounts className="reveal lg:col-span-5 lg:justify-end" />
          </div>
          <CapabilityShowcase className="mt-12 lg:mt-14" />
        </Container>
      </section>

      <Section
        id="architecture"
        title="Technology architecture"
        intro="A conventional, well-supported stack, chosen so the system is cheap to run and easy for another team to maintain."
        className="bg-paper"
      >
        <ArchitectureDiagram />
      </Section>

      <Section
        id="roadmap"
        title="Roadmap"
        intro="What comes next, in order. We do not publish dates until they are firm."
      >
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {roadmap.map((phase, index) => (
            <li key={phase.phase} className={cn('border-t-2 pt-5', index === 0 ? 'border-teal' : 'border-line-strong')}>
              <h3 className="text-h3">{phase.phase}</h3>
              <ul className="mt-4 space-y-3">
                {phase.items.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-muted/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <ClosingCta
        title="Interested in piloting CivicSetu?"
        text="We are looking for a first pilot partner: a municipal body, campus or township willing to run CivicSetu for a few weeks and measure the results with us."
        action={{ label: 'Discuss a pilot', to: contactHref({ type: 'civicsetu', subject: 'CivicSetu pilot' }) }}
      />
    </>
  )
}
