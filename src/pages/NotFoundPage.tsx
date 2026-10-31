import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta(routeMeta.notFound)

  return (
    <Container className="py-24 lg:py-32">
      <div className="max-w-prose">
        <p className="font-medium text-teal-strong">Error 404</p>
        <h1 className="mt-3 text-h1">Page not found</h1>
        <p className="mt-6 text-lead text-muted">
          There is no page at this address. It may have moved, or the link may be mistyped.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to={routeMeta.home.path}>Go to the home page</ButtonLink>
          <ButtonLink to={routeMeta.civicsetu.path} variant="secondary">
            Read about CivicSetu
          </ButtonLink>
          <ButtonLink to={routeMeta.contact.path} variant="secondary">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </Container>
  )
}
