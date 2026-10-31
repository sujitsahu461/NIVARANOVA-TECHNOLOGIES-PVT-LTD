import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Container } from '../ui/Container'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches rendering errors in a page so the header and footer stay usable.
 * Shows a plain message; technical details go to the console only.
 * Give it a `key` (such as the pathname) to reset it on navigation.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page failed to render', error, info.componentStack)
  }

  override render() {
    if (!this.state.hasError) return this.props.children

    return (
      <Container className="py-24">
        <div role="alert" className="max-w-prose">
          <h1 className="text-h2">This page couldn’t be displayed</h1>
          <p className="mt-4 text-lead text-muted">
            Something went wrong while loading it. Reload the page to try again, or go back to the home page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 items-center rounded-md bg-ink px-4 font-medium text-white hover:bg-deep"
            >
              Reload the page
            </button>
            <a
              href="/"
              className="inline-flex min-h-11 items-center rounded-md border border-line-strong px-4 font-medium text-ink hover:border-ink"
            >
              Go to the home page
            </a>
          </div>
        </div>
      </Container>
    )
  }
}
