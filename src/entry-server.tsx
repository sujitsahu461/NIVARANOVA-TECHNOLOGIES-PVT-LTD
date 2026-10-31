/**
 * Build-time entry used only by scripts/prerender.mjs. It renders each route
 * to static HTML and exposes the metadata the prerender step writes into <head>.
 * Nothing here ships to the browser.
 */
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { App } from './App'

export { company, siteConfig } from './config/company'
export { insights } from './content/insights'
export { documentTitle, routeMeta, SITE_NAME } from './content/routes'

/**
 * Renders a URL to complete static HTML, waiting for lazy pages to load.
 *
 * `progressiveChunkSize: Infinity` stops React from outlining large Suspense
 * boundaries into streamed segments. Outlined segments are revealed by an
 * inline script, which the site's CSP blocks and which leaves the page empty
 * without JavaScript. The prerender step checks the output for this.
 */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )

  const decoder = new TextDecoder()
  let html = ''
  for await (const chunk of prelude as AsyncIterable<Uint8Array | string>) {
    html += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true })
  }
  return html + decoder.decode()
}
