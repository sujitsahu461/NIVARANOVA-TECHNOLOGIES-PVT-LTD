import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { telHref, whatsappHref } from '../../lib/phone-link'
import { PhoneChooser } from './PhoneChooser'

describe('phone links', () => {
  it('turns a formatted number into call and WhatsApp links', () => {
    expect(telHref('+91 76568 52710')).toBe('tel:+917656852710')
    expect(whatsappHref('+91 76568 52710')).toMatch(/^https:\/\/wa\.me\/917656852710\?text=Hello\+NivaraNova/)
  })
})

describe('PhoneChooser', () => {
  it('offers a call or a WhatsApp chat when the number is tapped', async () => {
    const user = userEvent.setup()
    render(<PhoneChooser number="+91 76568 52710" />)
    const toggle = screen.getByRole('button', { name: '+91 76568 52710, call or WhatsApp' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const call = screen.getByRole('link', { name: /^Call/ })
    expect(call).toHaveAttribute('href', 'tel:+917656852710')
    expect(call).toHaveFocus()
    const whatsapp = screen.getByRole('link', { name: /WhatsApp/ })
    expect(whatsapp).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/917656852710\?/))
    expect(whatsapp).toHaveAttribute('target', '_blank')
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('closes with Escape and returns focus to the number', async () => {
    const user = userEvent.setup()
    render(<PhoneChooser number="+91 76568 52710" />)
    const toggle = screen.getByRole('button')
    await user.click(toggle)
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('closes when the visitor taps elsewhere', async () => {
    const user = userEvent.setup()
    render(
      <>
        <PhoneChooser number="+91 76568 52710" />
        <p>Elsewhere</p>
      </>,
    )
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Elsewhere'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })
})
