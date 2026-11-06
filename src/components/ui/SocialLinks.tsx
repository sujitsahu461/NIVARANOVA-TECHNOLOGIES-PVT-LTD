import { ArrowUpRight, Mail } from 'lucide-react'
import type { ComponentType } from 'react'
import { company } from '../../config/company'
import { cn } from '../../lib/cn'
import { whatsappHref } from '../../lib/phone-link'
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from './BrandIcons'

interface SocialLink {
  label: string
  /** Full accessible name, e.g. "NivaraNova on LinkedIn". */
  name: string
  href: string
  icon: ComponentType<{ className?: string }>
  /** Opens another site in a new tab. */
  external: boolean
}

/** The company's profiles and direct channels, from src/config/company.ts. Missing ones are left out. */
function companyLinks(): SocialLink[] {
  const { brandName, social, contact } = company
  const links: SocialLink[] = []
  if (social.linkedin)
    links.push({ label: 'LinkedIn', name: `${brandName} on LinkedIn`, href: social.linkedin, icon: LinkedInIcon, external: true })
  if (social.instagram)
    links.push({ label: 'Instagram', name: `${brandName} on Instagram`, href: social.instagram, icon: InstagramIcon, external: true })
  if (contact.email)
    links.push({ label: 'Email', name: `Email ${brandName}`, href: `mailto:${contact.email}`, icon: Mail, external: false })
  if (contact.phone)
    links.push({
      label: 'WhatsApp',
      name: `Chat with ${brandName} on WhatsApp`,
      href: whatsappHref(contact.phone),
      icon: WhatsAppIcon,
      external: true,
    })
  return links
}

interface SocialLinksProps {
  /** "icons": a row of round icon buttons. "buttons": labelled buttons in a two-column grid. */
  variant?: 'icons' | 'buttons'
  className?: string
}

export function SocialLinks({ variant = 'icons', className }: SocialLinksProps) {
  const links = companyLinks()
  if (links.length === 0) return null

  return (
    <ul className={cn(variant === 'icons' ? 'flex flex-wrap gap-3' : 'grid grid-cols-2 gap-3', className)}>
      {links.map(({ label, name, href, icon: Icon, external }) => {
        const newTab = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
        const accessibleName = external ? `${name} (opens in a new tab)` : name
        return (
          <li key={label}>
            {variant === 'icons' ? (
              <a
                href={href}
                {...newTab}
                aria-label={accessibleName}
                title={label}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface text-deep transition-colors hover:border-teal-strong hover:bg-teal-tint hover:text-teal-strong"
              >
                <Icon className="size-[1.125rem]" />
              </a>
            ) : (
              <a
                href={href}
                {...newTab}
                aria-label={accessibleName}
                className="group flex min-h-12 items-center gap-3 rounded-lg border border-line-strong bg-surface px-3.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-teal-strong hover:bg-teal-tint"
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-mist text-deep transition-colors group-hover:bg-surface group-hover:text-teal-strong">
                  <Icon className="size-4" />
                </span>
                <span className="flex-1">{label}</span>
                {external && (
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted transition-colors group-hover:text-teal-strong"
                    aria-hidden="true"
                  />
                )}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}
