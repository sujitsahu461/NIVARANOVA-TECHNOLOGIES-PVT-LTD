import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { Container } from '../components/ui/Container'
import { insights } from '../content/insights'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatDate } from '../lib/format-date'
import NotFoundPage from './NotFoundPage'

function ArticleMeta({ title, summary, slug }: { title: string; summary: string; slug: string }) {
  const meta = useMemo(
    () => ({ path: `${routeMeta.insights.path}/${slug}`, title, description: summary }),
    [slug, title, summary],
  )
  usePageMeta(meta)
  return null
}

/** A single article. Unknown slugs fall through to the not-found page. */
export default function InsightArticlePage() {
  const { slug } = useParams()
  const article = insights.find((item) => item.slug === slug)

  if (!article) return <NotFoundPage />

  return (
    <article>
      <ArticleMeta title={article.title} summary={article.summary} slug={article.slug} />
      <Container className="py-16 lg:py-24">
        <div className="mx-auto max-w-prose">
          <Link to={routeMeta.insights.path} className="text-sm font-medium text-teal-strong hover:underline">
            All insights
          </Link>
          <h1 className="mt-6 text-h1">{article.title}</h1>
          <time dateTime={article.publishedOn} className="mt-5 block text-sm text-muted">
            {formatDate(article.publishedOn)}
          </time>
          <div className="mt-10 space-y-6 text-[1.0625rem] leading-[1.75] text-ink">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </article>
  )
}
