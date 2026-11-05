import { ClosingCta } from '../components/sections/ClosingCta'
import { RouteMap } from '../components/sections/RouteMap'
import { WorkflowSteps } from '../components/sections/WorkflowSteps'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Emblem } from '../components/ui/Logo'
import { lifecycle } from '../content/civicsetu'
import { focusAreas } from '../content/focus-areas'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'
import { useRevealOnEnter } from '../hooks/useRevealOnEnter'

export default function HomePage() {
  usePageMeta(routeMeta.home)
  // The focus ring plays its entrance the first time it scrolls into view.
  const orbitRef = useRevealOnEnter<HTMLDivElement>()

  return (
    <>
      {/* Hero */}
      <section className="aurora border-b border-line">
        <Container className="grid gap-12 pt-14 pb-16 sm:pt-20 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24">
          <div className="lg:col-span-6">
            <h1 className="max-w-[13ch] text-display">Engineering technology for a better connected future.</h1>
            <p className="mt-7 max-w-[34rem] text-lead text-muted">
              NivaraNova Technologies designs and builds practical software for real-world problems. We are starting
              with CivicSetu, a platform that helps public complaints reach the right people and get resolved.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to={routeMeta.products.path} size="lg" className="w-full sm:w-auto">
                Explore our work
              </ButtonLink>
              <ButtonLink to={routeMeta.contact.path} size="lg" variant="glass" className="w-full sm:w-auto">
                Contact us
              </ButtonLink>
            </div>
          </div>
          <div className="relative isolate lg:col-span-6">
            {/* Coloured discs behind the glass map, so the frosting has something to blur. */}
            <div aria-hidden="true" className="glass-orb glass-orb-blue -top-10 -right-6 size-44 sm:size-56" />
            <div aria-hidden="true" className="glass-orb glass-orb-teal -bottom-12 -left-8 size-48 sm:size-64" />
            <RouteMap />
          </div>
        </Container>
      </section>

      {/* Introduction */}
      <section aria-labelledby="intro-heading">
        <Container className="grid gap-8 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
          <h2 id="intro-heading" className="reveal text-h2 lg:col-span-5">
            A technology company named for resolution
          </h2>
          <div className="reveal space-y-5 text-lead text-muted lg:col-span-6 lg:col-start-7">
            <p>
              <span className="font-medium text-ink">Nivaran</span> means resolution, or redressal. NivaraNova is an
              early-stage technology company from Gunupur, Odisha, and the name describes the work we choose: problems
              where better software means issues actually get resolved, not just recorded.
            </p>
            <p>
              We start small and specific, build carefully, and say plainly what is finished and what is not.
            </p>
          </div>
        </Container>
      </section>

      {/* Focus areas: a ring from 736px (see .focus-orbit in src/styles/index.css), a list on phones */}
      <section aria-labelledby="focus-heading" className="border-t border-line">
        <Container className="grid gap-10 py-20 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-24">
          {/* Beside the ring from 1024px, centred on it; above it on smaller screens. */}
          <div className="reveal lg:col-span-3">
            <h2 id="focus-heading" className="text-h2">
              Where we focus
            </h2>
            <p className="mt-5 text-muted">
              The areas we work in and are building capability around. If a project falls outside them, we will say
              so.
            </p>
          </div>
          <div className="lg:col-span-9">
            <div ref={orbitRef} className="focus-orbit">
              <Emblem className="focus-orbit-core" />
              <ul className="focus-orbit-items">
                {focusAreas.map(({ title, detail, icon: Icon }) => (
                  <li key={title}>
                    <span className="focus-node">
                      <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                    </span>
                    <div className="focus-label">
                      <h3 className="text-h3 min-[46rem]:text-[1.0625rem] min-[46rem]:leading-snug">{title}</h3>
                      <p className="mt-2 leading-relaxed text-muted min-[46rem]:mt-1.5 min-[46rem]:text-sm">{detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured product */}
      <section aria-labelledby="product-heading" className="aurora border-t border-line bg-paper">
        <Container className="grid gap-14 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
          <div className="reveal lg:col-span-5">
            <p className="font-medium text-teal-strong">Our first product</p>
            <h2 id="product-heading" className="mt-3 text-h2">
              CivicSetu
            </h2>
            <p className="mt-5 text-lead text-muted">
              CivicSetu is being built to improve how citizens report civic problems, and how the departments
              responsible receive, manage and resolve them.
            </p>
            <div className="glass mt-8 rounded-lg p-5">
              <p className="text-sm font-semibold text-ink">Where it stands</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                Version 1 is in development and under internal testing. It is not deployed, and no municipality is
                using it yet.
              </p>
            </div>
            <ButtonLink to={routeMeta.civicsetu.path} size="lg" className="mt-8">
              Explore CivicSetu
            </ButtonLink>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="reveal mb-8 text-sm font-semibold text-muted">How a complaint moves through CivicSetu</p>
            <WorkflowSteps steps={lifecycle} label="How a complaint moves through CivicSetu" reveal />
          </div>
        </Container>
      </section>

      <ClosingCta
        title="Have a problem worth solving?"
        text="Let’s build something meaningful. Tell us what isn’t working today, and we’ll tell you honestly whether we can help."
        action={{ label: 'Start a conversation', to: routeMeta.contact.path }}
      />
    </>
  )
}
