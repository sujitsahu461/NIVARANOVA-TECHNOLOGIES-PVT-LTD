import { NotebookPen } from 'lucide-react'
import { Link } from 'react-router'
import { PageHeader } from '../components/sections/PageHeader'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { insights } from '../content/insights'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatDate } from '../lib/format-date'

export default function InsightsPage() {
  usePageMeta(routeMeta.insights)

  return (
    <>
      <PageHeader
        title="Insights"
        lead="Engineering notes, product updates and lessons from building CivicSetu."
      />

      <Container className="py-16 lg:py-24">
        {insights.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-xl border border-dashed border-line-strong px-6 py-14 text-center sm:px-12">
            <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-mist text-deep">
              <NotebookPen className="size-6" aria-hidden="true" strokeWidth={1.75} />
            </span>
            <h2 className="mt-6 text-h3">Nothing published yet</h2>
            <p className="mt-3 leading-relaxed text-muted">
              We will publish here when we have something useful to share. Until then, the CivicSetu page has the
              latest on what we are building.
            </p>
            <ButtonLink to={routeMeta.civicsetu.path} variant="secondary" className="mt-8">
              Read about CivicSetu
            </ButtonLink>
          </div>
        ) : (
          <ol className="divide-y divide-line border-y border-line" aria-label="Articles, newest first">
            {insights.map((article) => (
              <li key={article.slug} className="grid gap-2 py-8 md:grid-cols-12 md:gap-8">
                <time dateTime={article.publishedOn} className="text-sm text-muted md:col-span-3">
                  {formatDate(article.publishedOn)}
                </time>
                <div className="md:col-span-8">
                  <h2 className="text-h3">
                    <Link to={`${routeMeta.insights.path}/${article.slug}`} className="hover:text-teal-strong">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted">{article.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  )
}
