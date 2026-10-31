import { ClosingCta } from '../components/sections/ClosingCta'
import { RouteMap } from '../components/sections/RouteMap'
import { WorkflowSteps } from '../components/sections/WorkflowSteps'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { lifecycle } from '../content/civicsetu'
import { focusAreas } from '../content/focus-areas'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'

export default function HomePage() {
  usePageMeta(routeMeta.home)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
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
              <ButtonLink to={routeMeta.contact.path} size="lg" variant="secondary" className="w-full sm:w-auto">
                Contact us
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-6">
            <RouteMap />
          </div>
        </Container>
      </section>

      {/* Introduction */}
      <section aria-labelledby="intro-heading">
        <Container className="grid gap-8 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
          <h2 id="intro-heading" className="text-h2 lg:col-span-5">
            A technology company named for resolution
          </h2>
          <div className="space-y-5 text-lead text-muted lg:col-span-6 lg:col-start-7">
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

      {/* Focus areas */}
      <section aria-labelledby="focus-heading" className="border-t border-line">
        <Container className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 id="focus-heading" className="text-h2">
                Where we focus
              </h2>
              <p className="mt-5 text-muted">
                The areas we work in and are building capability around. If a project falls outside them, we will
                say so.
              </p>
            </div>
          </div>
          <ul className="divide-y divide-line border-y border-line lg:col-span-7 lg:col-start-6">
            {focusAreas.map(({ title, detail, icon: Icon }) => (
              <li key={title} className="grid grid-cols-[2.75rem_1fr] gap-x-5 py-7">
                <span className="flex size-11 items-center justify-center rounded-lg bg-mist text-deep">
                  <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-h3">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Featured product */}
      <section aria-labelledby="product-heading" className="border-t border-line bg-paper">
        <Container className="grid gap-14 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
          <div className="lg:col-span-5">
            <p className="font-medium text-teal-strong">Our first product</p>
            <h2 id="product-heading" className="mt-3 text-h2">
              CivicSetu
            </h2>
            <p className="mt-5 text-lead text-muted">
              CivicSetu is being built to improve how citizens report civic problems, and how the departments
              responsible receive, manage and resolve them.
            </p>
            <div className="mt-8 rounded-lg border border-line bg-white p-5">
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
            <p className="mb-8 text-sm font-semibold text-muted">How a complaint moves through CivicSetu</p>
            <WorkflowSteps steps={lifecycle} label="How a complaint moves through CivicSetu" />
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
