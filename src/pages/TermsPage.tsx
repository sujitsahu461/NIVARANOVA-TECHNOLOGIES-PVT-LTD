import { EmailLink, LegalDocument, LegalLink, LegalList } from '../components/sections/LegalDocument'
import { PageHeader } from '../components/sections/PageHeader'
import { Placeholder } from '../components/ui/Placeholder'
import { company, siteConfig } from '../config/company'
import { routeMeta } from '../content/routes'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Date these terms last changed. Update it whenever the text changes.
 * CHECK BEFORE LAUNCH: have the terms reviewed by someone qualified in Indian
 * law, and confirm the courts named under "Governing law".
 */
const LAST_UPDATED = '6 November 2026'

export default function TermsPage() {
  usePageMeta(routeMeta.terms)
  const { email } = company.contact
  const emailLine = email ? <EmailLink email={email} /> : <Placeholder label="Company email" />

  const sections = [
    {
      id: 'agreement',
      title: 'Agreement to these terms',
      body: (
        <>
          <p>
            This website is owned and run by {company.legalName} (“{company.brandName}”, “we”, “us”), based in{' '}
            {company.basedIn}. By using it, you agree to these terms. If you do not agree, please do not use the
            website.
          </p>
          <p>
            These terms cover this website only. Any work we do for you, including a CivicSetu pilot, will be governed
            by a separate written agreement.
          </p>
        </>
      ),
    },
    {
      id: 'using-the-website',
      title: 'Using the website',
      body: (
        <>
          <p>
            You are welcome to browse the website, share links to it, and print or save pages for your own reference
            or for internal discussion in your organisation. When you use it, you must not:
          </p>
          <LegalList
            items={[
              'break any law, or use the website for anything fraudulent or harmful;',
              'try to gain unauthorised access to the website, its hosting or any connected system, or test it for weaknesses without our written permission;',
              'interfere with how the website works, for example by overloading it or introducing malicious code;',
              'copy the website’s content in bulk by automated means, including to build datasets;',
              'send spam, abusive or unlawful content through the contact form, email or WhatsApp; or',
              'pretend to be us, or suggest that we endorse or are connected with you when we are not.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'information',
      title: 'Information on this website',
      body: (
        <>
          <p>
            The website gives general information about {company.brandName} and our work. We are an early-stage
            company, and our products are in development: descriptions of CivicSetu and its features describe our
            current plans and may change. Screens and illustrations use sample data.
          </p>
          <p>
            We work to keep the website accurate, but we do not promise that everything on it is complete or up to
            date. Nothing on it is an offer, a binding commitment, or professional advice, so please confirm anything
            important with us directly.
          </p>
        </>
      ),
    },
    {
      id: 'enquiries',
      title: 'Enquiries and communication',
      body: (
        <>
          <p>
            Sending us an enquiry, email or message does not create a contract or any obligation on either side. We
            aim to reply to every genuine enquiry, but we may decline any request.
          </p>
          <p>
            Please do not send confidential information until we have agreed in writing how it will be handled. How
            we treat the personal data you send is explained in our{' '}
            <LegalLink to={routeMeta.privacy.path}>Privacy policy</LegalLink>.
          </p>
        </>
      ),
    },
    {
      id: 'copyright',
      title: 'Copyright and intellectual property',
      body: (
        <>
          <p>
            © {siteConfig.buildYear} {company.legalName.replace(/\.$/, '')}. All rights reserved.
          </p>
          <p>
            The content of this website, including its text, graphics, illustrations, logos, page designs and code, is
            owned by or licensed to {company.legalName} and is protected by the Copyright Act, 1957 and other
            applicable laws.
          </p>
          <p>You may:</p>
          <LegalList
            items={[
              'view the website, and print or download pages for personal or internal business reference;',
              'link to any page of the website; and',
              `quote short passages, provided you name ${company.brandName} as the source.`,
            ]}
          />
          <p>
            Apart from that, you may not copy, reproduce, republish, modify, distribute, sell or create works based on
            any part of the website without our written permission.
          </p>
          <p>
            The {company.brandName} and CivicSetu names and logos identify our company and our products. You may not
            use them in a way that suggests we endorse, sponsor or are connected with you, or that is likely to
            confuse people, without our written permission. Other names mentioned belong to their owners.
          </p>
          <p>
            Some material is used under its own licence: the Inter and Manrope typefaces under the SIL Open Font
            License, and the Lucide icons under the ISC License.
          </p>
          <p>
            If you believe something on this website infringes your rights, please write to {emailLine} with the
            details, and we will look into it promptly.
          </p>
        </>
      ),
    },
    {
      id: 'other-websites',
      title: 'Links to other websites',
      body: (
        <p>
          The website links to services run by others, such as WhatsApp and Gmail. We do not control them and are not
          responsible for their content, availability or privacy practices. Their own terms apply when you use them.
        </p>
      ),
    },
    {
      id: 'availability',
      title: 'Availability and changes',
      body: (
        <p>
          We may update, change, suspend or withdraw any part of the website at any time without notice. We do not
          promise that it will always be available or free of errors, though we work to keep it running well.
        </p>
      ),
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      body: (
        <p>
          The website is provided “as is” and “as available”. To the fullest extent the law allows, we make no
          warranties of any kind about it, express or implied, including about its accuracy, its fitness for a
          particular purpose, or its freedom from viruses or other harmful components.
        </p>
      ),
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      body: (
        <>
          <p>
            To the fullest extent the law allows, we are not liable for any indirect or consequential loss, or for any
            loss of profit, business, data or goodwill, arising from your use of the website or your reliance on
            anything on it.
          </p>
          <p>Nothing in these terms limits any liability that cannot be limited under Indian law.</p>
        </>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy',
      body: (
        <p>
          Our <LegalLink to={routeMeta.privacy.path}>Privacy policy</LegalLink> explains how we collect, use and
          protect personal data, and forms part of these terms.
        </p>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to these terms',
      body: (
        <p>
          We may update these terms from time to time, and will change the date at the top of the page when we do.
          The version shown here when you use the website is the one that applies.
        </p>
      ),
    },
    {
      id: 'governing-law',
      title: 'Governing law',
      body: (
        <p>
          These terms are governed by the laws of India. Any dispute about them or the website is subject to the
          exclusive jurisdiction of the courts in Odisha, India.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Contact us',
      body: (
        <p>
          For any question about these terms, write to {emailLine} or use our{' '}
          <LegalLink to={routeMeta.contact.path}>contact page</LegalLink>.
        </p>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Terms and conditions"
        lead="The rules for using this website, including who owns its content and what you may do with it."
      />
      <LegalDocument
        lastUpdated={LAST_UPDATED}
        intro={<p>Please read these terms before using the website. If anything is unclear, ask us.</p>}
        sections={sections}
      />
    </>
  )
}
