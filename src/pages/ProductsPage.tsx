import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  CircleDashed,
  CircleDot,
  FileText,
  Landmark,
  MessagesSquare,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import { ClosingCta } from '../components/sections/ClosingCta'
import { ProductShowcase } from '../components/sections/ProductShowcase'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import {
  civicSetuRoles,
  civicSetuShift,
  civicSetuSnapshot,
  civicSetuSummary,
  civicSetuTagline,
} from '../content/civicsetu'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'
import { cn } from '../lib/cn'
import { contactHref } from '../lib/contact-link'

const pilotHref = contactHref({ type: 'civicsetu', subject: 'CivicSetu pilot' })

const snapshotIcons: LucideIcon[] = [CircleDot, CircleDashed, Users]
const channelIcons: LucideIcon[] = [Phone, Landmark, FileText, MessagesSquare]
const roleIcons: LucideIcon[] = [UserRound, Building2, ShieldCheck]

export default function ProductsPage() {
  usePageMeta(routeMeta.products)

  return (
    <>
      {/* Hero: dark in both themes, like the closing band */}
      <section
        aria-labelledby="products-heading"
        className="products-hero on-dark aurora aurora-dark border-b border-white/10 bg-night text-white"
      >
        <Container className="grid grid-cols-1 items-center gap-14 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-16">
          <div className="lg:col-span-6">
            <h1
              id="products-heading"
              className="hero-rise hero-rise-1 inline-flex rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-sans text-[0.8125rem] font-semibold tracking-[0.18em] text-teal-soft uppercase"
            >
              Products
            </h1>
            <h2 className="hero-rise hero-rise-2 products-title mt-6 text-[clamp(3.5rem,1.75rem+7.5vw,7.25rem)] leading-[0.95] font-bold tracking-[-0.045em]">
              CivicSetu
            </h2>
            <p className="hero-rise hero-rise-3 mt-6 max-w-xl font-display text-[clamp(1.375rem,1.15rem+0.9vw,1.875rem)] leading-snug font-semibold tracking-[-0.015em] text-white">
              {civicSetuTagline}
            </p>
            <p className="hero-rise hero-rise-3 mt-4 max-w-xl text-lead text-white/75">{civicSetuSummary}</p>

            <ul className="hero-rise hero-rise-4 mt-8 flex flex-wrap gap-2.5" aria-label="Where CivicSetu stands">
              {civicSetuSnapshot.map((line, index) => {
                const Icon = snapshotIcons[index] ?? CircleDot
                return (
                  <li
                    key={line}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-sm text-white/90"
                  >
                    <Icon className="size-4 text-teal-soft" aria-hidden="true" />
                    {line}
                  </li>
                )
              })}
            </ul>

            <div className="hero-rise hero-rise-5 mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to={routeMeta.civicsetu.path} variant="inverse" size="lg">
                Explore CivicSetu
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <Link
                to={pilotHref}
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/30 px-6 font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
              >
                Discuss a pilot
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ProductShowcase />
          </div>
        </Container>
      </section>

      {/* Before and after */}
      <section aria-labelledby="shift-heading" className="border-b border-line">
        <Container className="py-20 lg:py-28">
          <SectionIntro
            id="shift-heading"
            eyebrow="Why it exists"
            title="From scattered complaints to one clear record"
            text="In many towns, a broken streetlight or a dry tap is reported by phone, at a counter, on paper or in a messaging group. CivicSetu replaces all of that with one record that everyone can follow."
          />

          <div className="mt-12 grid grid-cols-1 items-stretch gap-5 lg:mt-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
            <div className="reveal">
              <div className="h-full rounded-2xl border border-dashed border-line-strong bg-paper p-7 sm:p-9">
                <p className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Today</p>
                <ul className="mt-6 flex flex-wrap gap-3" aria-label="How complaints arrive today">
                  {civicSetuShift.before.channels.map((channel, index) => {
                    const Icon = channelIcons[index] ?? FileText
                    return (
                      <li
                        key={channel}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink shadow-sm',
                          ['-rotate-2', 'translate-y-2 rotate-1', '-rotate-1', 'translate-y-1 rotate-2'][index],
                        )}
                      >
                        <Icon className="size-4 text-muted" aria-hidden="true" />
                        {channel}
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-10 leading-relaxed text-muted">{civicSetuShift.before.note}</p>
              </div>
            </div>

            <div className="flex items-center justify-center" aria-hidden="true">
              <span className="grid size-12 place-items-center rounded-full bg-linear-to-br from-teal to-deep text-surface shadow-lg">
                <ArrowDown className="size-5 lg:hidden" />
                <ArrowRight className="hidden size-5 lg:block" />
              </span>
            </div>

            <div className="reveal">
              <div className="lift-card h-full p-7 sm:p-9">
                <p className="text-sm font-semibold tracking-[0.14em] text-teal-strong uppercase">With CivicSetu</p>
                <ul className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {civicSetuShift.after.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal-tint text-teal-strong">
                        <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span className="leading-snug font-medium text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Roles */}
      <section aria-labelledby="roles-heading" className="aurora border-b border-line bg-paper">
        <Container className="py-20 lg:py-28">
          <SectionIntro
            id="roles-heading"
            eyebrow="Who it serves"
            title="Built for every side of a complaint"
            text="The citizen who reports it, the officer who fixes it and the administrator who keeps the system honest each get a view made for them."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-14 lg:gap-6">
            {civicSetuRoles.map((role, index) => {
              const Icon = roleIcons[index] ?? UserRound
              return (
                <div key={role.role} className="reveal">
                  <article className="lift-card h-full p-7 sm:p-8">
                    <span className="grid size-12 place-items-center rounded-xl bg-teal-tint text-teal-strong">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-h3">{role.role}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{role.lead}</p>
                    <ul className="mt-6 space-y-3 border-t border-line pt-6">
                      {role.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-[0.9375rem] text-ink">
                          <Check className="mt-1 size-4 shrink-0 text-teal-strong" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              )
            })}
          </div>
          <div className="reveal mt-12">
            <ButtonLink to={`${routeMeta.civicsetu.path}#capabilities`} variant="secondary" size="lg">
              See what version 1 does
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <ClosingCta
        title="Help shape CivicSetu’s first pilot"
        text="We are looking for one campus or municipal body for a pilot of six to eight weeks, measuring time to assign, time to resolve and fixes confirmed by citizens."
        action={{ label: 'Discuss a pilot', to: pilotHref }}
      />
    </>
  )
}

function SectionIntro({
  id,
  eyebrow,
  title,
  text,
  className,
}: {
  id: string
  eyebrow: string
  title: string
  text: string
  className?: string
}) {
  return (
    <div className={cn('reveal max-w-2xl', className)}>
      <p className="font-medium text-teal-strong">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-h2">
        {title}
      </h2>
      <p className="mt-5 text-lead text-muted">{text}</p>
    </div>
  )
}
