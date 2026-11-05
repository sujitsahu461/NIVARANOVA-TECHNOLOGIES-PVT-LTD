import { AudioLines, Check, Droplet, Image, MapPin, Play } from 'lucide-react'
import { useRef, type PointerEvent } from 'react'
import { prefersReducedMotion } from '../../lib/reveal'

/*
 * The Products page hero visual: an illustration of a complaint in CivicSetu
 * version 1, with sample data. It is drawn in HTML so it stays sharp, and it
 * is hidden from screen readers; the caption describes it instead.
 *
 * On wide screens the window sits at a slight angle and follows the mouse.
 * The entrance (panels rising in, the timeline ticking through its steps) is
 * pure CSS: see "Products page" in src/styles/index.css.
 */

type StepState = 'done' | 'active' | 'todo'

const timeline: Array<{ label: string; time?: string; state: StepState }> = [
  { label: 'Reported by a citizen', time: '09:12', state: 'done' },
  { label: 'Routed to Water Supply', time: '09:12', state: 'done' },
  { label: 'Assigned to a field officer', time: '10:05', state: 'done' },
  { label: 'Work in progress', time: '11:40', state: 'active' },
  { label: 'Resolved, with a note', state: 'todo' },
  { label: 'Citizen confirms the fix', state: 'todo' },
]

const queue = [
  { code: 'CS-7Q4-K28', title: 'No water supply', status: 'In progress', high: true },
  { code: 'CS-7Q1-B90', title: 'Low pressure', status: 'Assigned', high: false },
  { code: 'CS-7P8-M33', title: 'Leaking pipe', status: 'New', high: true },
]

const audit = [
  { time: '11:40', text: 'Status set to In progress' },
  { time: '10:05', text: 'Assigned to a field officer' },
  { time: '09:12', text: 'Routed by rule: Water supply' },
]

export function ProductShowcase() {
  const stageRef = useRef<HTMLDivElement>(null)

  // Tilt toward the mouse. Set as CSS variables (not a style attribute, which the CSP blocks).
  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const stage = stageRef.current
    if (!stage || event.pointerType !== 'mouse' || prefersReducedMotion()) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    stage.style.setProperty('--tilt-y', `${(-9 + x * 14).toFixed(2)}deg`)
    stage.style.setProperty('--tilt-x', `${(5 - y * 10).toFixed(2)}deg`)
  }

  function onPointerLeave() {
    stageRef.current?.style.removeProperty('--tilt-x')
    stageRef.current?.style.removeProperty('--tilt-y')
  }

  return (
    <figure className="showcase" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {/* Above the window, where the floating panels never cover it. */}
      <figcaption className="hero-rise hero-rise-2 mb-5 flex items-center gap-2 text-sm text-white/70 lg:mb-8">
        <span className="size-1.5 shrink-0 rounded-full bg-teal-soft" aria-hidden="true" />
        <span>
          Illustration of the version 1 interface, with sample data
          <span className="sr-only">
            : a water supply complaint with photo, voice note and video evidence, routed to the water supply
            department, assigned to an officer and in progress, beside that department’s queue and the audit log.
          </span>
        </span>
      </figcaption>
      <div ref={stageRef} className="showcase-stage relative" aria-hidden="true">
        {/* Main window: one complaint, its evidence and its timeline */}
        <div className="showcase-window showcase-panel overflow-hidden">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </span>
            <span className="truncate text-[0.8125rem] font-medium text-white/70">CivicSetu · Track a complaint</span>
            <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-white/12 p-0.5 text-[0.75rem]">
              <span className="rounded-full bg-white/15 px-2 py-0.5 font-semibold text-white">EN</span>
              <span className="px-1.5 text-white/70">ଓଡ଼ିଆ</span>
              <span className="px-1.5 text-white/70">हिन्दी</span>
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-soft/15 px-2.5 py-1 text-[0.8125rem] font-semibold text-blue-soft">
                <Droplet className="size-3.5" />
                Water supply
              </span>
              <span className="rounded-full bg-amber-soft/15 px-2.5 py-1 text-[0.8125rem] font-semibold text-amber-soft">
                High priority
              </span>
              <span className="ml-auto font-mono text-[0.8125rem] text-white/70">CS-7Q4-K28</span>
            </div>

            <p className="mt-4 font-display text-lg leading-snug font-semibold text-white sm:text-xl">
              No water supply on Station Road since morning
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] text-white/70">
              <MapPin className="size-3.5 text-teal-soft" />
              Ward 7 · location pinned on the map
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <span className="showcase-media grid h-14 place-items-center rounded-lg">
                <Image className="size-5 text-white/80" />
              </span>
              <span className="showcase-media flex h-14 items-center justify-center gap-[3px] rounded-lg">
                <AudioLines className="size-5 text-white/80" />
                <span className="text-[0.75rem] text-white/70">0:24</span>
              </span>
              <span className="showcase-media grid h-14 place-items-center rounded-lg">
                <span className="grid size-7 place-items-center rounded-full bg-white/15">
                  <Play className="size-3.5 fill-white text-white" />
                </span>
              </span>
            </div>

            <ol className="mt-5">
              {timeline.map((step) => (
                <li key={step.label} className="showcase-step relative pb-3.5 pl-9 last:pb-0" data-state={step.state}>
                  <span className="showcase-node absolute top-0 left-0 grid size-6 place-items-center rounded-full">
                    {step.state === 'done' && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className="flex items-baseline gap-2.5">
                    <span
                      className={
                        step.state === 'todo'
                          ? 'text-[0.875rem] text-white/60'
                          : step.state === 'active'
                            ? 'text-[0.875rem] font-semibold text-blue-soft'
                            : 'text-[0.875rem] text-white/90'
                      }
                    >
                      {step.label}
                    </span>
                    {step.time && <span className="font-mono text-[0.75rem] text-white/60">{step.time}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Floating: the department's queue */}
        <div className="showcase-float showcase-float-queue showcase-panel absolute hidden w-64 p-4 lg:block">
          <p className="text-[0.75rem] font-semibold tracking-[0.12em] text-teal-soft uppercase">Water Supply · Queue</p>
          <ul className="mt-3 space-y-2">
            {queue.map((item) => (
              <li key={item.code} className="flex items-center gap-2.5 rounded-lg bg-white/[0.06] px-2.5 py-2">
                <span className={item.high ? 'size-2 shrink-0 rounded-full bg-amber-soft' : 'size-2 shrink-0 rounded-full bg-white/40'} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8125rem] font-medium text-white">{item.title}</span>
                  <span className="block font-mono text-[0.6875rem] text-white/60">{item.code}</span>
                </span>
                <span className="shrink-0 text-[0.6875rem] font-medium text-white/70">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Floating: the audit log */}
        <div className="showcase-float showcase-float-audit showcase-panel absolute hidden w-64 p-4 lg:block">
          <p className="text-[0.75rem] font-semibold tracking-[0.12em] text-teal-soft uppercase">Audit log</p>
          <ul className="mt-3 space-y-2.5">
            {audit.map((entry) => (
              <li key={entry.time} className="flex gap-3 text-[0.75rem]">
                <span className="font-mono text-white/60">{entry.time}</span>
                <span className="text-white/85">{entry.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </figure>
  )
}
