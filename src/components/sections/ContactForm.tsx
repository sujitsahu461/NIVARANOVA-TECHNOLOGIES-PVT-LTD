import { AlertCircle, Check, CheckCircle2, Copy, ExternalLink, Mail } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { company } from '../../config/company'
import { routeMeta } from '../../content/routes'
import {
  emailAsText,
  enquiryEmail,
  gmailComposeHref,
  mailtoHref,
  openEmailApp,
  type EmailDraft,
} from '../../lib/email-draft'
import {
  emptyEnquiry,
  enquiryTypes,
  isEnquiryType,
  limits,
  submitEnquiry,
  validateEnquiry,
  type EnquiryErrors,
} from '../../lib/enquiry'
import { cn } from '../../lib/cn'
import type { Enquiry } from '../../types'
import { Button } from '../ui/Button'

/** Submissions faster than this are almost certainly automated. */
const MIN_FILL_TIME_MS = 3000

/** `email-app`: the enquiry was handed to the visitor's mail app, because no delivery service is connected. */
type FormStatus = 'idle' | 'submitting' | 'too-fast' | 'email-app' | 'failed' | 'sent'

const emailOptionClasses =
  'inline-flex min-h-11 items-center gap-2 rounded-md border border-line-strong bg-surface px-3.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink'

/** Other ways to send the same email, for when the mail app did not open or the delivery service failed. */
function EmailOptions({ draft }: { draft: EmailDraft }) {
  const [copied, setCopied] = useState(false)
  const canCopy = typeof navigator !== 'undefined' && Boolean(navigator.clipboard)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(emailAsText(draft))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <a href={mailtoHref(draft)} className={emailOptionClasses}>
        <Mail className="size-4 shrink-0" aria-hidden="true" />
        Open email app
      </a>
      <a href={gmailComposeHref(draft)} target="_blank" rel="noopener noreferrer" className={emailOptionClasses}>
        <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
        Open in Gmail
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {canCopy && (
        <button type="button" onClick={copyEmail} className={emailOptionClasses}>
          {copied ? (
            <Check className="size-4 shrink-0 text-teal-strong" aria-hidden="true" />
          ) : (
            <Copy className="size-4 shrink-0" aria-hidden="true" />
          )}
          {copied ? 'Copied' : 'Copy message'}
        </button>
      )}
    </div>
  )
}

const fieldOrder: Array<keyof Enquiry> = ['fullName', 'workEmail', 'organisation', 'enquiryType', 'subject', 'message']

const controlClasses = (hasError: boolean) =>
  cn(
    'block w-full rounded-md border bg-surface px-3.5 py-2.5 text-base text-ink transition-colors',
    'placeholder:text-muted/70 focus:border-ink',
    hasError ? 'border-danger' : 'border-line-strong hover:border-muted',
  )

interface FieldProps {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  children: (describedBy: string | undefined) => ReactNode
}

function Field({ id, label, optional, hint, error, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label htmlFor={id} className="block font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      <div className="mt-2">{children(describedBy)}</div>
    </div>
  )
}

interface ContactFormProps {
  /** HTTPS endpoint that accepts the enquiry as JSON, or null when none is connected. */
  endpoint: string | null
  /** Web3Forms access key, when the endpoint is Web3Forms. */
  web3formsKey?: string | null
}

export function ContactForm({ endpoint, web3formsKey = null }: ContactFormProps) {
  const formId = useId()
  const fieldId = (name: keyof Enquiry) => `${formId}-${name}`

  const [values, setValues] = useState<Enquiry>(emptyEnquiry)
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const startedAt = useRef<number>(0)
  const summaryRef = useRef<HTMLDivElement>(null)
  const sentRef = useRef<HTMLHeadingElement>(null)
  const [searchParams] = useSearchParams()
  const inbox = company.contact.email

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  // Prefill the enquiry type and subject from links such as "Discuss a pilot".
  // Runs after hydration so the prerendered markup and the first client render match.
  useEffect(() => {
    const type = searchParams.get('type') ?? ''
    const subject = (searchParams.get('subject') ?? '').slice(0, limits.subject.max)
    if (!type && !subject) return
    // Deliberately an effect: reading the URL during render would make the first client
    // render differ from the prerendered /contact markup and break hydration.
    // oxlint-disable-next-line react/set-state-in-effect
    setValues((current) => ({
      ...current,
      enquiryType: current.enquiryType || (isEnquiryType(type) ? type : ''),
      subject: current.subject || subject,
    }))
  }, [searchParams])

  useEffect(() => {
    if (status === 'sent') sentRef.current?.focus()
  }, [status])

  const errorList = fieldOrder.flatMap((name) => (errors[name] ? [{ name, message: errors[name] }] : []))

  function update(name: keyof Enquiry) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value } = event.target
      setValues((current) => ({ ...current, [name]: value }))
      if (errors[name]) {
        setErrors((current) => {
          const next = { ...current }
          delete next[name]
          return next
        })
      }
      if (status !== 'idle' && status !== 'submitting') setStatus('idle')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    // Honeypot: real visitors never see or fill this field.
    if (honeypot) {
      setStatus('sent')
      return
    }

    const nextErrors = validateEnquiry(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    // No delivery service: hand the enquiry to the visitor's own mail app, addressed to the company inbox.
    if (!endpoint) {
      if (!inbox) {
        setStatus('failed')
        return
      }
      setStatus('email-app')
      openEmailApp(mailtoHref(enquiryEmail(values, inbox)))
      return
    }

    const elapsedMs = Date.now() - startedAt.current
    if (elapsedMs < MIN_FILL_TIME_MS) {
      setStatus('too-fast')
      return
    }

    setStatus('submitting')
    const result = await submitEnquiry(values, { endpoint, accessKey: web3formsKey, elapsedMs })
    setStatus(result.status === 'not-configured' ? 'failed' : result.status)
  }

  function focusField(name: keyof Enquiry) {
    document.getElementById(fieldId(name))?.focus()
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-teal-strong/30 bg-teal-tint p-8">
        <CheckCircle2 className="size-8 text-teal-strong" aria-hidden="true" />
        <h2 ref={sentRef} tabIndex={-1} className="mt-4 text-h3 focus:outline-none">
          Enquiry sent
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          Thank you. Your enquiry has been sent, and we will reply to the email address you gave.
        </p>
      </div>
    )
  }

  return (
    <div>
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={`${formId}-summary-heading`}
          className="mb-8 rounded-lg border-2 border-danger bg-danger-tint p-5 focus:outline-none"
        >
          <h2 id={`${formId}-summary-heading`} className="font-sans text-base font-semibold text-danger">
            Check the highlighted fields
          </h2>
          <ul className="mt-3 space-y-1.5">
            {errorList.map((item) => (
              <li key={item.name}>
                <a
                  href={`#${fieldId(item.name)}`}
                  onClick={(event) => {
                    event.preventDefault()
                    focusField(item.name)
                  }}
                  className="text-[0.9375rem] font-medium text-danger underline underline-offset-2"
                >
                  {item.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} aria-describedby={`${formId}-privacy`} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={fieldId('fullName')} label="Full name" error={errors.fullName}>
            {(describedBy) => (
              <input
                id={fieldId('fullName')}
                name="fullName"
                type="text"
                autoComplete="name"
                maxLength={limits.fullName.max}
                required
                value={values.fullName}
                onChange={update('fullName')}
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={describedBy}
                className={controlClasses(Boolean(errors.fullName))}
              />
            )}
          </Field>

          <Field id={fieldId('workEmail')} label="Work email" error={errors.workEmail}>
            {(describedBy) => (
              <input
                id={fieldId('workEmail')}
                name="workEmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                maxLength={limits.workEmail.max}
                required
                value={values.workEmail}
                onChange={update('workEmail')}
                aria-invalid={errors.workEmail ? true : undefined}
                aria-describedby={describedBy}
                className={controlClasses(Boolean(errors.workEmail))}
              />
            )}
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={fieldId('organisation')} label="Organisation" optional error={errors.organisation}>
            {(describedBy) => (
              <input
                id={fieldId('organisation')}
                name="organisation"
                type="text"
                autoComplete="organization"
                maxLength={limits.organisation.max}
                value={values.organisation}
                onChange={update('organisation')}
                aria-invalid={errors.organisation ? true : undefined}
                aria-describedby={describedBy}
                className={controlClasses(Boolean(errors.organisation))}
              />
            )}
          </Field>

          <Field id={fieldId('enquiryType')} label="Enquiry type" error={errors.enquiryType}>
            {(describedBy) => (
              <select
                id={fieldId('enquiryType')}
                name="enquiryType"
                required
                value={values.enquiryType}
                onChange={update('enquiryType')}
                aria-invalid={errors.enquiryType ? true : undefined}
                aria-describedby={describedBy}
                className={cn(controlClasses(Boolean(errors.enquiryType)), 'min-h-[2.875rem]')}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {enquiryTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field id={fieldId('subject')} label="Subject" error={errors.subject}>
          {(describedBy) => (
            <input
              id={fieldId('subject')}
              name="subject"
              type="text"
              maxLength={limits.subject.max}
              required
              value={values.subject}
              onChange={update('subject')}
              aria-invalid={errors.subject ? true : undefined}
              aria-describedby={describedBy}
              className={controlClasses(Boolean(errors.subject))}
            />
          )}
        </Field>

        <Field
          id={fieldId('message')}
          label="Message"
          hint="What are you trying to solve, and for whom? At least 20 characters."
          error={errors.message}
        >
          {(describedBy) => (
            <textarea
              id={fieldId('message')}
              name="message"
              rows={7}
              maxLength={limits.message.max}
              required
              value={values.message}
              onChange={update('message')}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy}
              className={cn(controlClasses(Boolean(errors.message)), 'resize-y leading-relaxed')}
            />
          )}
        </Field>

        {/* Honeypot for automated submissions. Hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor={`${formId}-hp`}>Leave this field empty</label>
          <input
            id={`${formId}-hp`}
            name="nn_contact_ref"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div aria-live="polite" aria-atomic="true">
          {status === 'too-fast' && (
            <p className="rounded-lg border border-line-strong bg-paper p-4 text-[0.9375rem] text-ink">
              That was quick. Please check your message, then select Send enquiry again.
            </p>
          )}
          {status === 'email-app' && inbox && (
            <div
              className="rounded-lg border border-teal-strong/30 bg-teal-tint p-4 text-[0.9375rem]"
              data-testid="form-status-email-app"
            >
              <p className="font-semibold text-ink">Finish sending in your email app</p>
              <p className="mt-1 text-muted">
                Your enquiry is ready in a new email to {inbox}. Press Send in your email app to deliver it. If no
                email app opened, use one of these instead:
              </p>
              <EmailOptions draft={enquiryEmail(values, inbox)} />
            </div>
          )}
          {status === 'failed' && (
            <div role="alert" className="rounded-lg border-2 border-danger bg-danger-tint p-4 text-[0.9375rem]">
              <p className="font-semibold text-danger">Your enquiry could not be sent</p>
              <p className="mt-1 text-ink">
                Something went wrong on our side. Your message is still in the form.{' '}
                {inbox ? 'Try again in a few minutes, or send it by email instead:' : 'Please try again in a few minutes.'}
              </p>
              {inbox && <EmailOptions draft={enquiryEmail(values, inbox)} />}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p id={`${formId}-privacy`} className="text-sm text-muted">
            {!endpoint && inbox && <>Selecting Send enquiry opens your email app with your message ready to send. </>}
            We use these details only to reply to you.{' '}
            <Link to={routeMeta.privacy.path} className="font-medium text-teal-strong underline underline-offset-2">
              Privacy policy
            </Link>
          </p>
          <Button type="submit" size="lg" disabled={status === 'submitting'} className="sm:shrink-0">
            {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
          </Button>
        </div>
      </form>
    </div>
  )
}
