import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'

interface ClosingCtaProps {
  title: string
  text: string
  action: { label: string; to: string }
}

/** Dark closing band with a single action, on a frosted panel over soft blue and teal light. */
export function ClosingCta({ title, text, action }: ClosingCtaProps) {
  return (
    <section className="on-dark aurora aurora-dark bg-night text-white">
      <Container className="py-20 lg:py-24">
        <div className="reveal relative isolate">
          <div aria-hidden="true" className="glass-orb glass-orb-blue -top-12 right-6 size-40 sm:right-16 sm:size-52" />
          <div aria-hidden="true" className="glass-orb glass-orb-teal -bottom-14 left-1/4 size-36 sm:size-44" />
          <div className="glass-dark grid gap-8 rounded-2xl p-7 sm:p-10 lg:grid-cols-12 lg:items-end lg:p-12">
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
        </div>
      </Container>
    </section>
  )
}
