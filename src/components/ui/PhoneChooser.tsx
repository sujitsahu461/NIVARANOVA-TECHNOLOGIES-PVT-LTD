import { ChevronDown, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { telHref, whatsappHref } from '../../lib/phone-link'

interface PhoneChooserProps {
  number: string
  /** Which way the options open. Use "up" near the bottom of the page. */
  placement?: 'down' | 'up'
  className?: string
}

/**
 * A phone number that, when tapped, offers a choice: call it, or open a
 * WhatsApp chat with it. A disclosure button, so it works with a keyboard
 * and screen readers; Escape, tapping elsewhere or moving focus away closes it.
 */
export function PhoneChooser({ number, placement = 'down', className }: PhoneChooserProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const firstOptionRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    firstOptionRef.current?.focus()

    const outside = (target: EventTarget | null) => !rootRef.current?.contains(target as Node)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (outside(event.target)) setOpen(false)
    }
    const onFocusIn = (event: FocusEvent) => {
      if (outside(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open])

  const option =
    'flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-[0.9375rem] text-ink transition-colors hover:bg-mist focus-visible:bg-mist'

  return (
    <span ref={rootRef} className={cn('relative inline-block', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${number}, call or WhatsApp`}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-8 items-center gap-1 font-medium text-teal-strong underline underline-offset-4"
      >
        {number}
        <ChevronDown
          className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <span
          id={panelId}
          className={cn(
            'absolute left-0 z-30 block w-60 rounded-lg border border-line bg-surface p-1.5 shadow-lg',
            placement === 'up' ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
        >
          <a ref={firstOptionRef} href={telHref(number)} onClick={() => setOpen(false)} className={option}>
            <Phone className="size-4 shrink-0 text-deep" aria-hidden="true" />
            <span>
              <span className="block font-medium">Call</span>
              <span className="block text-sm text-muted">{number}</span>
            </span>
          </a>
          <a
            href={whatsappHref(number)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={option}
          >
            <MessageCircle className="size-4 shrink-0 text-teal-strong" aria-hidden="true" />
            <span>
              <span className="block font-medium">WhatsApp</span>
              <span className="block text-sm text-muted">Send a message</span>
            </span>
          </a>
        </span>
      )}
    </span>
  )
}
