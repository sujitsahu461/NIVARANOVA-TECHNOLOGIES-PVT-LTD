import './styles/index.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { canHydrate } from './lib/hydration'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element in index.html')

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Prerendered pages are hydrated. If a host served markup for a different
// route (for example an SPA fallback to index.html), render from scratch
// instead, so React never tries to reuse the wrong markup.
if (container.firstElementChild && canHydrate(container.dataset.route, window.location.pathname)) {
  hydrateRoot(container, app)
} else {
  container.replaceChildren()
  createRoot(container).render(app)
}
