import { Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { company, siteConfig } from '../../config/company'
import { routeMeta } from '../../content/routes'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import { PhoneChooser } from '../ui/PhoneChooser'
import { Placeholder } from '../ui/Placeholder'
import { SocialLinks } from '../ui/SocialLinks'

const columns = [
  {
    heading: 'Company',
    links: [
      { label: 'About', to: routeMeta.about.path },
      { label: 'Insights', to: routeMeta.insights.path },
      { label: 'Contact', to: routeMeta.contact.path },
    ],
  },
  {
    heading: 'Work',
    links: [
      { label: 'Solutions', to: routeMeta.solutions.path },
      { label: 'Products', to: routeMeta.products.path },
      { label: 'CivicSetu', to: routeMeta.civicsetu.path },
    ],
  },
] as const

const heading = 'font-sans text-sm font-semibold tracking-wide text-ink'
const footerLink = 'text-[0.9375rem] text-muted transition-colors hover:text-ink'

function ContactItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex min-h-8 items-center gap-3 text-[0.9375rem] text-muted">
      <span className="text-teal-strong">{icon}</span>
      {children}
    </li>
  )
}

/**
 * On wide screens, four blocks spread edge to edge with equal gaps (who we
 * are, two columns of links, how to reach us), mirroring the copyright and
 * legal links below. On tablets, a 2 × 2 grid: who we are beside how to reach
 * us, then the two link columns. On phones, the link columns sit side by side
 * between the other two.
 */
export function Footer() {
  const { registration, contact } = company

  return (
    <footer className="border-t border-line bg-paper">
      <Container className="py-14 lg:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:flex lg:justify-between lg:gap-12">
          <div className="col-span-2 md:col-span-1 lg:max-w-xs">
            <Logo variant="lockup" label="NivaraNova Technologies Private Limited" />
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-muted">{company.description}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={`${column.heading} links`} className="md:order-2 lg:order-none">
              <h2 className={heading}>{column.heading}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.to} className="flex min-h-8 items-center">
                    <Link to={link.to} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 md:order-1 md:col-span-1 lg:order-none">
            <h2 className={heading}>Contact us</h2>
            <ul className="mt-4 space-y-3">
              <ContactItem icon={<Mail className="size-4" aria-hidden="true" />}>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="transition-colors hover:text-ink">
                    {contact.email}
                  </a>
                ) : (
                  <Placeholder label="Business email" />
                )}
              </ContactItem>
              {contact.phone && (
                <ContactItem icon={<Phone className="size-4" aria-hidden="true" />}>
                  <PhoneChooser number={contact.phone} placement="up" tone="quiet" />
                </ContactItem>
              )}
              <ContactItem icon={<MapPin className="size-4" aria-hidden="true" />}>{company.basedIn}</ContactItem>
            </ul>
            <SocialLinks className="mt-6" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {siteConfig.buildYear} {company.legalName.replace(/\.$/, '')}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {registration.cin ? <span>CIN {registration.cin}</span> : null}
            {registration.gstin ? <span>GSTIN {registration.gstin}</span> : null}
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link to={routeMeta.privacy.path} className="transition-colors hover:text-ink">
                Privacy policy
              </Link>
              <Link to={routeMeta.terms.path} className="transition-colors hover:text-ink">
                Terms and conditions
              </Link>
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  )
}
