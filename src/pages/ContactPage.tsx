import { Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { ContactForm } from '../components/sections/ContactForm'
import { PageHeader } from '../components/sections/PageHeader'
import { Container } from '../components/ui/Container'
import { Placeholder } from '../components/ui/Placeholder'
import { company, siteConfig } from '../config/company'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'

function ContactLine({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
        <span className="text-deep">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 pl-[1.875rem] text-muted">{children}</dd>
    </div>
  )
}

export default function ContactPage() {
  usePageMeta(routeMeta.contact)
  const { email, phone } = company.contact

  return (
    <>
      <PageHeader
        title="Contact"
        lead="Tell us about the problem you are working on. Enquiries about CivicSetu pilots, software projects and partnerships are all welcome."
      />

      <Container className="grid gap-14 py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div className="lg:col-span-7">
          <ContactForm endpoint={siteConfig.contactEndpoint} />
        </div>

        <aside aria-labelledby="reach-heading" className="lg:col-span-4 lg:col-start-9">
          <h2 id="reach-heading" className="text-h3">
            Other ways to reach us
          </h2>
          <dl className="mt-6 space-y-5">
            {(email || siteConfig.showPlaceholders) && (
              <ContactLine icon={<Mail className="size-5" aria-hidden="true" />} label="Email">
                {email ? (
                  <a href={`mailto:${email}`} className="font-medium text-teal-strong underline underline-offset-4">
                    {email}
                  </a>
                ) : (
                  <Placeholder label="Business email" />
                )}
              </ContactLine>
            )}
            {(phone || siteConfig.showPlaceholders) && (
              <ContactLine icon={<Phone className="size-5" aria-hidden="true" />} label="Phone">
                {phone ? (
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-medium text-teal-strong underline underline-offset-4">
                    {phone}
                  </a>
                ) : (
                  <Placeholder label="Business phone" />
                )}
              </ContactLine>
            )}
            <ContactLine icon={<MapPin className="size-5" aria-hidden="true" />} label="Based in">
              {company.basedIn}
            </ContactLine>
          </dl>

          <div className="mt-12 border-t border-line pt-8">
            <h2 className="text-h3">What helps us reply well</h2>
            <ul className="mt-4 space-y-3 leading-relaxed text-muted">
              <li>The problem you are trying to solve, in your own words.</li>
              <li>Who it affects, and roughly how many people or requests are involved.</li>
              <li>Any deadline, budget range or system you already use.</li>
            </ul>
          </div>
        </aside>
      </Container>
    </>
  )
}
