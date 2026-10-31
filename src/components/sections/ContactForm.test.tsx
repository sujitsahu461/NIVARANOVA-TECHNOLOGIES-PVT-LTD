import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from './ContactForm'

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
})

describe('ContactForm', () => {
  it('says plainly when no delivery service is connected', () => {
    renderForm(null)
    expect(screen.getByText('Online enquiries are not connected yet')).toBeInTheDocument()
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

  it('does not pretend to send when no endpoint is configured', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    renderForm(null)
    await fillValidForm(user)
    advanceClock(10_000)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    expect(await screen.findByText('Your enquiry was not sent')).toBeInTheDocument()
    expect(screen.queryByText('Enquiry sent')).not.toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
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
