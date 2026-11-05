import type { ReactNode } from 'react'
import { PageHeader } from '../components/sections/PageHeader'
import { Container } from '../components/ui/Container'
import { Placeholder } from '../components/ui/Placeholder'
import { company, siteConfig } from '../config/company'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'
import { WEB3FORMS_ENDPOINT } from '../lib/enquiry'

/** Date this notice's wording last changed. Update it whenever the text changes. */
const LAST_UPDATED = '5 November 2026'

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-8 first:border-t-0 first:pt-0">
      <h2 className="text-h3">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  usePageMeta(routeMeta.privacy)
  const emailLine = company.contact.email ? (
    <a href={`mailto:${company.contact.email}`} className="font-medium text-teal-strong underline underline-offset-4">
      {company.contact.email}
    </a>
  ) : (
    <Placeholder label="Privacy contact email" />
  )

  return (
    <>
      <PageHeader
        title="Privacy notice"
        lead="How this website handles the information you send us. It is short because the site collects very little."
      />
      <Container className="py-16 lg:py-20">
        <div className="max-w-prose">
          <p className="mb-10 text-sm text-muted">Last updated {LAST_UPDATED}</p>

          <Block title="What this site collects">
            <p>
              This website does not use cookies, analytics or advertising trackers. The only personal information it
              handles is what you type into the contact form: your name, work email, organisation and message.
            </p>
          </Block>

          <Block title="Why we use it">
            <p>
              We use your details only to reply to your enquiry and to keep a record of the conversation. We do not
              sell them, share them for marketing, or add you to a mailing list.
            </p>
          </Block>

          <Block title="Where it goes">
            {siteConfig.contactEndpoint === WEB3FORMS_ENDPOINT ? (
              <p>
                When you send the form, your enquiry goes over an encrypted (HTTPS) connection to Web3Forms, a
                form-to-email service, which delivers it to our company inbox. It is then kept in that inbox so we can
                reply.
              </p>
            ) : siteConfig.contactEndpoint ? (
              <p>Your enquiry is sent over an encrypted (HTTPS) connection to the service we use to receive enquiries.</p>
            ) : (
              <p>
                Online submission is not connected yet, so the contact form does not send or store anything. Your
                message stays in your browser until you close the page.
              </p>
            )}
            <p>
              Our hosting provider may keep standard server logs, such as IP addresses and request times, for
              security and to keep the site running.
            </p>
          </Block>

          <Block title="How long we keep it">
            <p>
              <Placeholder label="Retention period for enquiries" />
            </p>
          </Block>

          <Block title="Your choices">
            <p>You can ask us to show, correct or delete the information you sent us by writing to {emailLine}.</p>
          </Block>
        </div>
      </Container>
    </>
  )
}
