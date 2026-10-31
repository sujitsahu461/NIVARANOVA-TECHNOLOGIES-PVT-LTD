import { PageHeader } from '../components/sections/PageHeader'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { LogoMark } from '../components/ui/Logo'
import { civicSetuStatus, civicSetuSummary, complaintCategories } from '../content/civicsetu'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'

export default function ProductsPage() {
  usePageMeta(routeMeta.products)

  return (
    <>
      <PageHeader title="Products" lead="What we are building, and exactly where each product stands." />

      <Container className="py-16 lg:py-24">
        <article
          aria-labelledby="civicsetu-heading"
          className="grid overflow-hidden rounded-xl border border-line lg:grid-cols-12"
        >
          <div className="p-7 sm:p-10 lg:col-span-7 lg:p-12">
            <p className="font-medium text-teal-strong">Featured product</p>
            <h2 id="civicsetu-heading" className="mt-3 text-h1">
              CivicSetu
            </h2>
            <p className="mt-5 max-w-prose text-lead text-muted">{civicSetuSummary}</p>

            <div className="mt-8">
              <p className="text-sm font-semibold text-ink">Complaint categories</p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Complaint categories">
                {complaintCategories.map((category) => (
                  <li key={category} className="rounded bg-mist px-2.5 py-1 text-sm text-deep">
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            <ButtonLink to={routeMeta.civicsetu.path} size="lg" className="mt-10">
              Explore CivicSetu
            </ButtonLink>
          </div>

          <div className="border-t border-line bg-paper p-7 sm:p-10 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-12">
            <h3 className="text-h3">Current status</h3>
            <dl className="mt-6 space-y-5">
              {civicSetuStatus.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm font-semibold text-ink">{item.label}</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </article>

        <div className="mt-16 flex max-w-2xl gap-5">
          <LogoMark className="size-10 opacity-40" />
          <div>
            <h2 className="text-h3">More products</h2>
            <p className="mt-2 leading-relaxed text-muted">
              CivicSetu is our only product at the moment. New products will be listed here when they are ready to
              talk about, with the same plain account of their status.
            </p>
          </div>
        </div>
      </Container>
    </>
  )
}
