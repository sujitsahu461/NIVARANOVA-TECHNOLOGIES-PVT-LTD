import { EmailLink, ExternalLegalLink, LegalDocument, LegalLink, LegalList } from '../components/sections/LegalDocument'
import { PageHeader } from '../components/sections/PageHeader'
import { Placeholder } from '../components/ui/Placeholder'
import { company, siteConfig } from '../config/company'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'
import { WEB3FORMS_ENDPOINT } from '../lib/enquiry'

/**
 * Date this policy's wording last changed. Update it whenever the text changes.
 * CHECK BEFORE LAUNCH: have the policy reviewed by someone qualified in Indian
 * data protection law, and confirm the retention periods with the company.
 */
const LAST_UPDATED = '6 November 2026'

export default function PrivacyPage() {
  usePageMeta(routeMeta.privacy)
  const { email, phone } = company.contact
  const emailLine = email ? <EmailLink email={email} /> : <Placeholder label="Privacy contact email" />
  const usesWeb3Forms = siteConfig.contactEndpoint === WEB3FORMS_ENDPOINT

  const sections = [
    {
      id: 'who-we-are',
      title: 'Who we are',
      body: (
        <>
          <p>
            This website is run by {company.legalName} (“{company.brandName}”, “we”, “us”), a technology company
            based in {company.basedIn}. We decide why and how the personal data described here is used, which makes
            us the Data Fiduciary under India’s Digital Personal Data Protection Act, 2023 (the “DPDP Act”).
          </p>
          <p>
            This policy covers personal data we receive through this website, and when you contact us by email,
            phone or WhatsApp using the details on it. It does not cover the CivicSetu platform itself, which will
            have its own privacy terms when it is offered to an organisation.
          </p>
        </>
      ),
    },
    {
      id: 'summary',
      title: 'The short version',
      body: (
        <LegalList
          items={[
            'This website uses no cookies, no analytics and no advertising or tracking tools.',
            'We only receive the information you choose to send us, and we use it to reply to you.',
            'We never sell or rent your personal data, and we do not add you to marketing lists without asking.',
            'You can ask us at any time to show, correct or delete what you sent us.',
          ]}
        />
      ),
    },
    {
      id: 'what-we-collect',
      title: 'What we collect',
      body: (
        <>
          <p>
            <strong className="font-semibold text-ink">When you use the contact form:</strong> your name, work email
            address, organisation (if you give one), the type of enquiry, the subject and your message.
          </p>
          <p>
            <strong className="font-semibold text-ink">When you email, call or message us on WhatsApp:</strong> your
            email address or phone number, the name on your account, and whatever you choose to tell us.
          </p>
          <p>
            <strong className="font-semibold text-ink">When you visit the website:</strong> our hosting provider
            automatically records standard technical information, such as your IP address, browser type, the page
            requested and the time. We do not use this to identify you.
          </p>
          <p>
            <strong className="font-semibold text-ink">On your own device:</strong> if you switch the site to dark
            mode, your browser saves that one setting in its local storage so the next page opens the same way. It
            stays on your device, says nothing about you, and is never sent to us.
          </p>
          <p>
            Please do not send us sensitive information such as bank or card details, passwords, health information
            or government ID numbers. We do not need them to reply to an enquiry.
          </p>
        </>
      ),
    },
    {
      id: 'how-we-use-it',
      title: 'How we use it',
      body: (
        <>
          <p>We use your personal data only to:</p>
          <LegalList
            items={[
              'reply to your enquiry and continue the conversation you started;',
              'discuss, plan or propose work you have asked us about, such as a CivicSetu pilot or a software project;',
              'keep a record of our correspondence;',
              'keep the website secure and protect it, and our inbox, from spam and misuse; and',
              'meet our obligations under Indian law.',
            ]}
          />
          <p>
            We do not use your data for advertising, we do not build profiles of visitors, and we make no decisions
            about you by automated means.
          </p>
        </>
      ),
    },
    {
      id: 'legal-basis',
      title: 'Why we are allowed to use it',
      body: (
        <>
          <p>
            We process your personal data on the basis of your consent, which you give when you send us an enquiry,
            email, call or message for the purpose of getting a reply. Where the law requires us to keep or disclose
            information, we do so as a legitimate use permitted by the DPDP Act.
          </p>
          <p>
            You can withdraw your consent at any time by writing to {emailLine}. We will then stop using your data,
            and delete it unless the law requires us to keep it. Withdrawing consent does not affect anything we did
            before you withdrew it.
          </p>
        </>
      ),
    },
    {
      id: 'sharing',
      title: 'Who we share it with',
      body: (
        <>
          <p>
            We share personal data only with service providers that help us run this website and our
            communications, and only as far as they need it:
          </p>
          <LegalList
            items={[
              <>
                <strong className="font-semibold text-ink">Website hosting:</strong> Vercel Inc. serves this website
                and keeps the technical logs described above (
                <ExternalLegalLink href="https://vercel.com/legal/privacy-policy">Vercel’s privacy policy</ExternalLegalLink>
                ).
              </>,
              usesWeb3Forms ? (
                <>
                  <strong className="font-semibold text-ink">Form delivery:</strong> Web3Forms, a form-to-email
                  service, receives your enquiry over an encrypted connection and delivers it to our inbox. If you
                  choose to send it from your own email app instead, it travels through your email provider like any
                  other email.
                </>
              ) : (
                <>
                  <strong className="font-semibold text-ink">Your email provider:</strong> when you send the form, it
                  opens your own email app with your enquiry ready. Nothing is sent until you press Send there, and it
                  then travels through your email provider like any other email.
                </>
              ),
              <>
                <strong className="font-semibold text-ink">Email:</strong> our inbox is provided by Google (Gmail) (
                <ExternalLegalLink href="https://policies.google.com/privacy">Google’s privacy policy</ExternalLegalLink>
                ).
              </>,
              <>
                <strong className="font-semibold text-ink">WhatsApp:</strong> if you message us on WhatsApp, WhatsApp
                (part of Meta) handles that conversation under its own terms (
                <ExternalLegalLink href="https://www.whatsapp.com/legal/privacy-policy">
                  WhatsApp’s privacy policy
                </ExternalLegalLink>
                ).
              </>,
            ]}
          />
          <p>
            We may also disclose information if the law requires it, for example in response to a valid order from
            a court or government authority. We never sell, rent or trade your personal data.
          </p>
        </>
      ),
    },
    {
      id: 'where-it-is-stored',
      title: 'Where it is stored',
      body: (
        <p>
          Our service providers may store and process data on servers outside India, including in the United States.
          We choose established providers that protect data with recognised security practices, and we transfer data
          only as Indian law allows.
        </p>
      ),
    },
    {
      id: 'how-long-we-keep-it',
      title: 'How long we keep it',
      body: (
        <>
          <p>
            We keep enquiries and the correspondence that follows for up to 24 months after our last exchange with
            you, so we can refer back to the conversation, and then delete them. If an enquiry leads to a contract,
            we keep the related records for as long as Indian law requires for business and tax records.
          </p>
          <p>
            Technical logs are kept by our hosting provider for a short period under its own policy. You can ask us to
            delete your data sooner, as explained below.
          </p>
        </>
      ),
    },
    {
      id: 'security',
      title: 'How we protect it',
      body: (
        <>
          <p>
            This website is served only over encrypted (HTTPS) connections, with strict security settings that block
            unknown scripts and stop other sites from embedding it. The website itself does not store anything you
            type into the form. Access to our inbox is limited to the people at {company.brandName} who need it to
            reply to you.
          </p>
          <p>
            No method of sending or storing data is completely secure. If a personal data breach affects you, we will
            inform you and the Data Protection Board of India as the DPDP Act requires.
          </p>
        </>
      ),
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      body: (
        <>
          <p>Under the DPDP Act, you have the right to:</p>
          <LegalList
            items={[
              'get a summary of the personal data we hold about you and how we use it;',
              'have it corrected, completed or updated;',
              'have it erased, where we no longer need it or you withdraw consent;',
              'withdraw your consent at any time;',
              'have your complaints about our handling of your data addressed; and',
              'nominate someone to exercise these rights for you in the event of your death or incapacity.',
            ]}
          />
          <p>
            To use any of these rights, write to {emailLine}. We may ask you to confirm your identity before acting
            on a request, and we will respond within the time the law allows. There is no charge.
          </p>
        </>
      ),
    },
    {
      id: 'children',
      title: 'Children',
      body: (
        <p>
          This website is meant for organisations and adults. We do not knowingly collect personal data from anyone
          under 18. If you believe a child has sent us their details, please contact us and we will delete them.
        </p>
      ),
    },
    {
      id: 'other-websites',
      title: 'Links to other websites',
      body: (
        <p>
          This website links to services we do not control, such as WhatsApp and Gmail. When you use them, their own
          privacy policies apply, so please read those too.
        </p>
      ),
    },
    {
      id: 'grievances',
      title: 'Questions and complaints',
      body: (
        <>
          <p>
            If you have a question or a complaint about how we handle your personal data, contact our Grievance
            Officer at {emailLine}
            {phone ? <>, or call {phone}</> : null}. Please put “Privacy” in the subject line.
          </p>
          <p>
            If you are not satisfied with our response, you can complain to the Data Protection Board of India.
          </p>
        </>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      body: (
        <p>
          We will update this policy if the way we handle personal data changes, and change the date at the top of
          the page when we do. The current version always applies. See also our{' '}
          <LegalLink to={routeMeta.terms.path}>Terms and conditions</LegalLink>.
        </p>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Privacy policy"
        lead="How we collect, use and protect your personal data when you visit this website or get in touch with us."
      />
      <LegalDocument
        lastUpdated={LAST_UPDATED}
        intro={
          <p>
            Your privacy matters to us. This website is deliberately built to collect as little as possible, and this
            policy explains in plain language what we do with the little we receive.
          </p>
        }
        sections={sections}
      />
    </>
  )
}
