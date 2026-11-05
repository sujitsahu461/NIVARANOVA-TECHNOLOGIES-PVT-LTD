import { ArrowRight, BadgeCheck, Building2, CircleDashed } from 'lucide-react'
import type { ReactNode } from 'react'
import { capabilities, complaintCategories, statusCopy, statusOrder } from '../../content/civicsetu'
import { cn } from '../../lib/cn'
import type { Capability } from '../../types'
import { StatusBadge } from '../ui/StatusBadge'

/*
 * CivicSetu's capabilities, on the CivicSetu page. Seven headline features get
 * a tile each, with a small illustration; the rest of version 1 and everything
 * planned follow as compact rows. Every capability in src/content/civicsetu.ts
 * appears exactly once, and every status is read from there, never restated.
 */

/** The features that get a tile, in the order they are shown. */
const featuredNames = [
  'Photo, audio and video evidence',
  'English, Odia and Hindi',
  'Routing to departments',
  'Tracking code and complaint history',
  'Complaint submission',
  'Administration and audit log',
  'Citizen feedback',
] as const

function findCapability(name: (typeof featuredNames)[number]): Capability {
  const found = capabilities.find((item) => item.name === name)
  if (!found) throw new Error(`Unknown CivicSetu capability: ${name}`)
  return found
}

/** How many features have each status, as badges. */
export function CapabilityStatusCounts({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="Features by status">
      {statusOrder.map((status) => {
        const count = capabilities.filter((item) => item.status === status).length
        return (
          <li
            key={status}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3.5 pl-1"
          >
            <StatusBadge status={status} className="rounded-full" />
            <span className="text-sm text-muted">
              {count} {count === 1 ? 'feature' : 'features'}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function CapabilityShowcase({ className }: { className?: string }) {
  const featured = new Set<string>(featuredNames)
  const alsoBuilt = capabilities.filter((item) => item.status !== 'planned' && !featured.has(item.name))
  const planned = capabilities.filter((item) => item.status === 'planned')

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <Tile capability={findCapability('Photo, audio and video evidence')} className="md:col-span-2">
          <EvidenceVisual />
        </Tile>
        <Tile capability={findCapability('English, Odia and Hindi')}>
          <LanguagesVisual />
        </Tile>
        <Tile capability={findCapability('Routing to departments')}>
          <RoutingVisual />
        </Tile>
        <Tile capability={findCapability('Tracking code and complaint history')}>
          <TrackingVisual />
        </Tile>
        <Tile capability={findCapability('Complaint submission')}>
          <SubmissionVisual />
        </Tile>
        <Tile capability={findCapability('Administration and audit log')} className="md:col-span-2">
          <AuditVisual />
        </Tile>
        <Tile capability={findCapability('Citizen feedback')} className="md:col-span-2 lg:col-span-1">
          <FeedbackVisual />
        </Tile>
      </div>

      {alsoBuilt.length > 0 && (
        <div className="reveal mt-6 rounded-2xl border border-line bg-paper p-6 sm:p-8">
          <h3 className="font-display text-lg font-semibold text-ink">Also in version 1</h3>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alsoBuilt.map((item) => (
              <li key={item.name} className="flex flex-col rounded-xl border border-line bg-surface p-4">
                <StatusBadge status={item.status} className="self-start" />
                <p className="mt-3 font-semibold text-ink">{item.name}</p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="reveal mt-6 rounded-2xl border border-dashed border-line-strong p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
          <div className="lg:w-64 lg:shrink-0">
            <StatusBadge status="planned" />
            <h3 className="mt-3 font-display text-lg font-semibold text-ink">Coming after version 1</h3>
            <p className="mt-1 text-sm text-muted">{statusCopy.planned.explanation}</p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {planned.map((item) => (
              <li
                key={item.name}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-[0.9375rem] text-ink"
              >
                <CircleDashed className="size-4 text-muted" aria-hidden="true" />
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** One feature: its status, name and description, over a small illustration. */
function Tile({ capability, className, children }: { capability: Capability; className?: string; children: ReactNode }) {
  return (
    <div className={cn('reveal', className)}>
      <article className="lift-card flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-h3">{capability.name}</h3>
          <StatusBadge status={capability.status} className="shrink-0" />
        </div>
        <p className="mt-2 leading-relaxed text-muted">{capability.detail}</p>
        <div className="mt-6 flex flex-1 items-end" aria-hidden="true">
          <div className="w-full">{children}</div>
        </div>
      </article>
    </div>
  )
}

/* Tile illustrations, with sample data. Decorative: each tile's text already says what the feature does. */

function EvidenceVisual() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="tile-media relative h-24 overflow-hidden rounded-xl">
        <svg viewBox="0 0 120 80" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="88" cy="22" r="9" className="fill-teal/50" />
          <path d="M0 80 L34 42 L56 62 L78 40 L120 80 Z" className="fill-deep/35" />
        </svg>
        <span className="absolute bottom-2 left-2 rounded bg-surface/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-ink">
          Photo
        </span>
      </div>
      <div className="tile-media flex h-24 flex-col justify-center gap-2 rounded-xl px-3">
        <div className="flex h-8 items-center gap-[3px]">
          {[40, 70, 100, 55, 85, 30, 65, 95, 50, 75, 35, 60].map((height, index) => (
            <span key={index} className={cn('w-1 rounded-full bg-teal', waveHeights[height])} />
          ))}
        </div>
        <span className="text-[0.6875rem] font-semibold text-ink">Voice note · 0:24</span>
      </div>
      <div className="tile-media relative grid h-24 place-items-center rounded-xl">
        <span className="grid size-10 place-items-center rounded-full bg-ink text-surface">
          <svg viewBox="0 0 12 12" className="ml-0.5 size-3.5 fill-current">
            <path d="M2 1 L11 6 L2 11 Z" />
          </svg>
        </span>
        <span className="absolute bottom-2 left-2 rounded bg-surface/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-ink">
          Video
        </span>
      </div>
    </div>
  )
}

/** Fixed Tailwind classes for the waveform bars (class names must be literal for Tailwind to find them). */
const waveHeights: Record<number, string> = {
  30: 'h-[30%]',
  35: 'h-[35%]',
  40: 'h-[40%]',
  50: 'h-[50%]',
  55: 'h-[55%]',
  60: 'h-[60%]',
  65: 'h-[65%]',
  70: 'h-[70%]',
  75: 'h-[75%]',
  85: 'h-[85%]',
  95: 'h-[95%]',
  100: 'h-full',
}

function LanguagesVisual() {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      {[
        { glyph: 'A', name: 'English' },
        { glyph: 'ଅ', name: 'ଓଡ଼ିଆ' },
        { glyph: 'अ', name: 'हिन्दी' },
      ].map((language) => (
        <div key={language.name} className="tile-media rounded-xl py-3">
          <span className="block font-display text-4xl leading-tight font-semibold text-ink">{language.glyph}</span>
          <span className="mt-1 block text-[0.75rem] text-muted">{language.name}</span>
        </div>
      ))}
    </div>
  )
}

function RoutingVisual() {
  return (
    <div className="flex items-center gap-3">
      <ul className="flex flex-1 flex-col gap-1.5">
        {complaintCategories.slice(0, 3).map((category, index) => (
          <li
            key={category}
            className={cn(
              'rounded-md border px-2.5 py-1 text-[0.8125rem]',
              index === 1 ? 'border-teal/50 bg-teal-tint font-semibold text-teal-strong' : 'border-line text-muted',
            )}
          >
            {category}
          </li>
        ))}
      </ul>
      <ArrowRight className="size-4 shrink-0 text-teal" />
      <div className="tile-media flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-3 text-center">
        <Building2 className="size-5 text-deep" />
        <span className="text-[0.75rem] leading-tight font-semibold text-ink">Responsible department</span>
      </div>
    </div>
  )
}

function TrackingVisual() {
  return (
    <div className="tile-media rounded-xl p-3.5">
      <span className="font-mono text-sm font-semibold text-ink">CS-7Q4-K28</span>
      <div className="mt-3 flex items-center">
        {['Reported', 'Routed', 'Assigned', 'In progress'].map((label, index, all) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <span
              className={cn(
                'size-3 shrink-0 rounded-full',
                index < all.length - 1 ? 'bg-teal' : 'border-2 border-teal bg-surface',
              )}
            />
            {index < all.length - 1 && <span className="h-0.5 flex-1 bg-teal/50" />}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[0.75rem] text-muted">4 steps so far · In progress</p>
    </div>
  )
}

function SubmissionVisual() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {complaintCategories.map((category) => (
        <span key={category} className="rounded-md bg-mist px-2.5 py-1 text-[0.8125rem] text-deep">
          {category}
        </span>
      ))}
    </div>
  )
}

function AuditVisual() {
  return (
    <ul className="tile-media divide-y divide-line rounded-xl font-mono text-[0.8125rem]">
      {[
        { time: '11:40', who: 'Officer', what: 'Status → In progress' },
        { time: '10:05', who: 'Department head', what: 'Assigned to a field officer' },
        { time: '09:12', who: 'Routing rule', what: 'Water supply → Water Supply' },
      ].map((entry) => (
        <li key={entry.time} className="flex flex-wrap gap-x-4 gap-y-0.5 px-3.5 py-2.5">
          <span className="text-muted">{entry.time}</span>
          <span className="font-semibold text-ink">{entry.who}</span>
          <span className="text-muted">{entry.what}</span>
        </li>
      ))}
    </ul>
  )
}

function FeedbackVisual() {
  return (
    <div className="tile-media rounded-xl p-3.5">
      <p className="text-[0.8125rem] font-semibold text-ink">Was the problem fixed?</p>
      <div className="mt-2.5 flex gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-tint px-3 py-1.5 text-[0.8125rem] font-semibold text-teal-strong">
          <BadgeCheck className="size-4" />
          Yes, fixed
        </span>
        <span className="rounded-md border border-line px-3 py-1.5 text-[0.8125rem] text-muted">Not yet</span>
      </div>
    </div>
  )
}
