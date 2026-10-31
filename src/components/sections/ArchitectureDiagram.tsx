import { architecture } from '../../content/civicsetu'

/**
 * Layered architecture as accessible HTML: the current stack on the left,
 * planned additions on the right in dashed outline.
 */
export function ArchitectureDiagram() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <p className="text-sm font-semibold text-ink">Version 1</p>
        <ol className="mt-4" aria-label="Version 1 layers, from the user down to the data">
          {architecture.current.map((layer, index) => (
            <li key={layer.layer}>
              {index > 0 && (
                <span aria-hidden="true" className="ml-8 block h-6 w-0.5 rounded-full bg-teal/50" />
              )}
              <div className="rounded-lg border border-deep/25 bg-white p-5">
                <h3 className="font-display text-[1.0625rem] font-semibold">{layer.layer}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{layer.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:col-span-5">
        <p className="text-sm font-semibold text-ink">Planned additions</p>
        <ul className="mt-4 space-y-4" aria-label="Planned additions">
          {architecture.planned.map((layer) => (
            <li key={layer.layer} className="rounded-lg border border-dashed border-line-strong bg-paper p-5">
              <h3 className="font-display text-[1.0625rem] font-semibold">{layer.layer}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{layer.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
