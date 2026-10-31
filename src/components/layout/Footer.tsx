import { Link } from 'react-router'
import { company, siteConfig } from '../../config/company'
import { routeMeta } from '../../content/routes'
import { Container } from '../ui/Container'
import { Wordmark } from '../ui/Logo'
import { Placeholder } from '../ui/Placeholder'

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

const footerLink = 'text-[0.9375rem] text-muted transition-colors hover:text-ink'

export function Footer() {
  const { registration, contact } = company

  return (
    <footer className="border-t border-line bg-paper">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark />
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-muted">{company.description}</p>
            <div className="mt-5 text-[0.9375rem]">
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="font-medium text-teal-strong underline-offset-4 hover:underline">
                  {contact.email}
                </a>
              ) : (
                <Placeholder label="Business email" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:max-w-md lg:col-span-4 lg:col-start-8">
            {columns.map((column) => (
              <nav key={column.heading} aria-label={`${column.heading} links`}>
                <h2 className="font-sans text-sm font-semibold text-ink">{column.heading}</h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className={footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {siteConfig.buildYear} {company.legalName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {registration.cin ? <span>CIN {registration.cin}</span> : <Placeholder label="CIN" />}
            {registration.gstin ? <span>GSTIN {registration.gstin}</span> : null}
            <Link to={routeMeta.privacy.path} className="transition-colors hover:text-ink">
              Privacy notice
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
