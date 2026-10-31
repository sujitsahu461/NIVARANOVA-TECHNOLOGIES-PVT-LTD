import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'

interface ClosingCtaProps {
  title: string
  text: string
  action: { label: string; to: string }
}

/** Dark closing band with a single action. */
export function ClosingCta({ title, text, action }: ClosingCtaProps) {
  return (
    <section className="on-dark bg-ink text-white">
      <Container className="py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 className="text-h2 text-white">{title}</h2>
            <p className="mt-5 max-w-prose text-lead text-white/80">{text}</p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <ButtonLink to={action.to} variant="inverse" size="lg">
              {action.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  )
}
