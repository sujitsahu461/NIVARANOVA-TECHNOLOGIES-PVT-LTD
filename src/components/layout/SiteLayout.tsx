import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from '../navigation/Header'
import { ErrorBoundary } from './ErrorBoundary'
import { Footer } from './Footer'

/**
 * Page frame: skip link, sticky header, main landmark and footer.
 * On client-side navigation it scrolls to the top (or to a #hash target)
 * and moves focus to <main> so screen-reader users hear the new page.
 */
export function SiteLayout() {
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previous = useRef({ pathname, hash })

  useEffect(() => {
    const last = previous.current
    previous.current = { pathname, hash }
    if (last.pathname === pathname && last.hash === hash) return // first render

    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      return
    }
    if (last.pathname !== pathname) {
      window.scrollTo(0, 0)
      mainRef.current?.focus({ preventScroll: true })
    }
  }, [pathname, hash])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only-focusable fixed top-3 left-3 z-50 rounded-md bg-ink px-4 py-3 font-medium text-white"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Keyed by path so an error on one page clears when the visitor navigates away. */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
