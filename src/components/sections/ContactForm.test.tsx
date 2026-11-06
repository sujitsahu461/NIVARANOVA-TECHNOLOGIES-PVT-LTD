import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { openEmailApp } from '../../lib/email-draft'
import { ContactForm } from './ContactForm'

// Opening a mailto: link would try to navigate jsdom; record the call instead.
vi.mock('../../lib/email-draft', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/email-draft')>()),
  openEmailApp: vi.fn(),
}))

function renderForm(endpoint: string | null, initialPath = '/contact') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ContactForm endpoint={endpoint} />
    </MemoryRouter>,
  )
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full name'), 'Asha Mishra')
  await user.type(screen.getByLabelText('Work email'), 'asha@example.org')
  await user.selectOptions(screen.getByLabelText('Enquiry type'), 'civicsetu')
  await user.type(screen.getByLabelText('Subject'), 'CivicSetu pilot')
  await user.type(screen.getByLabelText(/^Message/), 'We would like to understand how a pilot would work.')
}

/** Moves Date.now forward so the minimum fill time has passed. */
function advanceClock(ms: number) {
  const realNow = Date.now()
  vi.spyOn(Date, 'now').mockReturnValue(realNow + ms)
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.mocked(openEmailApp).mockClear()
})

describe('ContactForm', () => {
  it('says that sending opens the email app when no delivery service is connected', () => {
    renderForm(null)
    expect(screen.getByText(/opens your email app with your message ready to send/)).toBeInTheDocument()
    expect(screen.queryByText(/not connected/)).not.toBeInTheDocument()
  })

  it('lists every problem and marks fields invalid when submitted empty', async () => {
    const user = userEvent.setup()
    renderForm(null)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    const summary = await screen.findByRole('alert')
    expect(summary).toHaveTextContent('Check the highlighted fields')
    expect(summary).toHaveTextContent('Enter your full name.')
    expect(summary).toHaveTextContent('Enter your work email address.')
    expect(summary).toHaveTextContent('Choose what your enquiry is about.')
    expect(screen.getByLabelText('Full name')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Organisation (optional)')).not.toHaveAttribute('aria-invalid')
  })

  it('clears a field error as soon as the visitor edits it', async () => {
    const user = userEvent.setup()
    renderForm(null)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))
    await user.type(screen.getByLabelText('Full name'), 'A')
    expect(screen.getByLabelText('Full name')).not.toHaveAttribute('aria-invalid')
  })

  it('opens the visitor’s email app with the enquiry when no endpoint is configured', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    renderForm(null)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    expect(openEmailApp).toHaveBeenCalledTimes(1)
    const href = vi.mocked(openEmailApp).mock.calls[0]?.[0] ?? ''
    expect(href).toMatch(/^mailto:nivaranovapvtltd@gmail\.com\?subject=Website%20enquiry%3A%20CivicSetu%20pilot&body=/)
    expect(decodeURIComponent(href)).toContain('Name: Asha Mishra\r\nEmail: asha@example.org')
    expect(decodeURIComponent(href)).toContain('We would like to understand how a pilot would work.')
    expect(fetchSpy).not.toHaveBeenCalled()

    // If no mail app opened, the visitor has other ways to send the same email.
    expect(await screen.findByText('Finish sending in your email app')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open email app' })).toHaveAttribute('href', href)
    expect(screen.getByRole('link', { name: /Open in Gmail/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=nivaranovapvtltd%40gmail\.com&/),
    )
    expect(screen.queryByText('Enquiry sent')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Full name')).toHaveValue('Asha Mishra')
  })

  it('asks the visitor to check again when submitted implausibly fast', async () => {
    const user = userEvent.setup()
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    renderForm('https://api.example.in/enquiries')
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))
    expect(await screen.findByText(/That was quick/)).toBeInTheDocument()
  })

  it('sends to a configured endpoint and confirms', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 201 }))
    renderForm('https://api.example.in/enquiries')
    await fillValidForm(user)
    advanceClock(10_000)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    expect(await screen.findByRole('heading', { name: 'Enquiry sent' })).toBeInTheDocument()
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('reports a failed send and keeps the message', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 503 }))
    renderForm('https://api.example.in/enquiries')
    await fillValidForm(user)
    advanceClock(10_000)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    expect(await screen.findByText('Your enquiry could not be sent')).toBeInTheDocument()
    expect(screen.getByLabelText('Subject')).toHaveValue('CivicSetu pilot')
    // Email is offered as a way round the failure, but never opened without the visitor choosing it.
    expect(screen.getByRole('link', { name: 'Open email app' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:nivaranovapvtltd@gmail\.com\?/),
    )
    expect(openEmailApp).not.toHaveBeenCalled()
  })

  it('silently drops submissions that fill the hidden honeypot field', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const { container } = renderForm('https://api.example.in/enquiries')
    const honeypot = container.querySelector<HTMLInputElement>('input[name="nn_contact_ref"]')
    expect(honeypot).not.toBeNull()
    await user.type(honeypot as HTMLInputElement, 'http://spam.example')
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('prefills the enquiry type and subject from the link that opened it', async () => {
    renderForm(null, '/contact?type=civicsetu&subject=CivicSetu%20pilot')
    expect(await screen.findByDisplayValue('CivicSetu pilot')).toBeInTheDocument()
    expect(screen.getByLabelText('Enquiry type')).toHaveValue('civicsetu')
  })

  it('ignores an unknown enquiry type in the link', async () => {
    renderForm(null, '/contact?type=bogus')
    expect(screen.getByLabelText('Enquiry type')).toHaveValue('')
  })
})
