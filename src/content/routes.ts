import type { RouteMeta } from '../types'

/**
 * Single source of truth for page titles and descriptions.
 * Used by the pages at runtime and by the prerender step for static <head> tags.
 */
export const SITE_NAME = 'NivaraNova Technologies'

export const routeMeta = {
  home: {
    path: '/',
    title: 'Practical software for public-service problems',
    description:
      'NivaraNova Technologies is an early-stage technology company from Gunupur, Odisha, building practical software for real-world problems, starting with CivicSetu.',
  },
  about: {
    path: '/about',
    title: 'About',
    description:
      'Who NivaraNova Technologies is, what the name means, and how the team approaches building software for public services.',
  },
  solutions: {
    path: '/solutions',
    title: 'Solutions',
    description:
      'The kinds of software problems NivaraNova works on, from custom applications to workflow automation, and how it approaches each one.',
  },
  products: {
    path: '/products',
    title: 'Products',
    description:
      'Products in development at NivaraNova Technologies, starting with CivicSetu, a civic grievance management platform.',
  },
  civicsetu: {
    path: '/products/civicsetu',
    title: 'CivicSetu',
    description:
      'CivicSetu is a civic grievance management platform in development: citizens report problems, departments act on them, and every step is recorded.',
  },
  insights: {
    path: '/insights',
    title: 'Insights',
    description: 'Engineering notes and product updates from NivaraNova Technologies.',
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    description:
      'Send NivaraNova Technologies an enquiry about CivicSetu, a software project or a partnership.',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy policy',
    description:
      'How NivaraNova Technologies collects, uses and protects personal data sent through this website, by email, phone or WhatsApp.',
  },
  terms: {
    path: '/terms',
    title: 'Terms and conditions',
    description:
      'The terms for using the NivaraNova Technologies website, including copyright in its content and what you may do with it.',
  },
  notFound: {
    path: '/404',
    title: 'Page not found',
    description: 'The page you asked for does not exist on this site.',
    noindex: true,
  },
} satisfies Record<string, RouteMeta>

/** Full document title for a page. */
export function documentTitle(meta: RouteMeta): string {
  return meta.path === '/' ? `${SITE_NAME} | ${meta.title}` : `${meta.title} | ${SITE_NAME}`
}

/** Primary navigation, in display order. */
export const navItems = [
  { label: 'Home', to: routeMeta.home.path },
  { label: 'About', to: routeMeta.about.path },
  { label: 'Solutions', to: routeMeta.solutions.path },
  { label: 'Products', to: routeMeta.products.path },
  { label: 'Insights', to: routeMeta.insights.path },
  { label: 'Contact', to: routeMeta.contact.path },
] as const
