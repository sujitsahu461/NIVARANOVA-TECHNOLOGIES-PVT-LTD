import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SocialLinks } from './SocialLinks'

describe('SocialLinks', () => {
  it.each(['icons', 'buttons'] as const)('links to every company channel (%s)', (variant) => {
    render(<SocialLinks variant={variant} />)
    const links = screen.getAllByRole('link')
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual([
      'NivaraNova on LinkedIn (opens in a new tab)',
      'NivaraNova on Instagram (opens in a new tab)',
      'Email NivaraNova',
      'Chat with NivaraNova on WhatsApp (opens in a new tab)',
    ])
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/nivaranova-technologies-private-limited-85b887449',
    )
    expect(screen.getByRole('link', { name: /Instagram/ })).toHaveAttribute(
      'href',
      'https://www.instagram.com/nivaranovatechnologiespvtltd/',
    )
    expect(screen.getByRole('link', { name: 'Email NivaraNova' })).toHaveAttribute(
      'href',
      'mailto:nivaranovapvtltd@gmail.com',
    )
    expect(screen.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/wa\.me\/917656852710\?/),
    )
    for (const link of links.filter((item) => item.getAttribute('target') === '_blank')) {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
