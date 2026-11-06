import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import { SiteLayout } from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// Inner pages load on demand. The prerender step adds <link rel="modulepreload">
// for each page's own chunk, so a direct visit does not wait on a second request.
const AboutPage = lazy(() => import('./pages/AboutPage'))
const SolutionsPage = lazy(() => import('./pages/SolutionsPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const CivicSetuPage = lazy(() => import('./pages/CivicSetuPage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))
const InsightArticlePage = lazy(() => import('./pages/InsightArticlePage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))

/** Route table shared by the browser entry and the prerender entry. */
export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="solutions" element={<SolutionsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/civicsetu" element={<CivicSetuPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="insights/:slug" element={<InsightArticlePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
