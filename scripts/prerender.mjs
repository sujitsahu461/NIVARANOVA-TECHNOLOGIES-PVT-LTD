/**
 * Prerenders every route to static HTML after `vite build`.
 *
 * Inputs:  dist/ (client build with .vite/manifest.json)
 *          dist-ssr/entry-server.js (server build of src/entry-server.tsx)
 * Outputs: dist/index.html, dist/about.html, dist/products/civicsetu.html, …,
 *          dist/404.html, dist/robots.txt and, once VITE_SITE_URL is set,
 *          dist/sitemap.xml.
 *
 * Each page gets its own <title>, description, Open Graph and Twitter tags,
 * font preloads and modulepreload hints for its lazily loaded chunk.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const server = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const { render, routeMeta, documentTitle, company, siteConfig, insights, SITE_NAME } = server

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(await readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'))
const siteUrl = siteConfig.siteUrl

/** Source module of each lazily loaded page, for modulepreload hints. */
const pageSources = {
  [routeMeta.about.path]: 'src/pages/AboutPage.tsx',
  [routeMeta.solutions.path]: 'src/pages/SolutionsPage.tsx',
  [routeMeta.products.path]: 'src/pages/ProductsPage.tsx',
  [routeMeta.civicsetu.path]: 'src/pages/CivicSetuPage.tsx',
  [routeMeta.insights.path]: 'src/pages/InsightsPage.tsx',
  [routeMeta.contact.path]: 'src/pages/ContactPage.tsx',
  [routeMeta.privacy.path]: 'src/pages/PrivacyPage.tsx',
  [routeMeta.terms.path]: 'src/pages/TermsPage.tsx',
}

const pages = [
  routeMeta.home,
  routeMeta.about,
  routeMeta.solutions,
  routeMeta.products,
  routeMeta.civicsetu,
  routeMeta.insights,
  routeMeta.contact,
  routeMeta.privacy,
  routeMeta.terms,
  ...insights.map((article) => ({
    path: `${routeMeta.insights.path}/${article.slug}`,
    title: article.title,
    description: article.summary,
    source: 'src/pages/InsightArticlePage.tsx',
  })),
]

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absolute = (pathname) => (siteUrl ? `${siteUrl}${pathname === '/' ? '/' : pathname}` : null)

/** Chunk files a page needs beyond the entry chunk, following static imports. */
function chunkFiles(source) {
  if (!source) return []
  const entry = manifest[source]
  if (!entry) throw new Error(`prerender: ${source} is missing from the Vite manifest. Update pageSources.`)
  const files = new Set()
  const visit = (key) => {
    const chunk = manifest[key]
    if (!chunk || chunk.isEntry || files.has(chunk.file)) return
    files.add(chunk.file)
    for (const imported of chunk.imports ?? []) visit(imported)
  }
  visit(source)
  return [...files]
}

const fontFiles = (await readdir(path.join(dist, 'assets'))).filter((file) => file.endsWith('.woff2'))

function headTags(meta, { source, jsonLd } = {}) {
  const title = documentTitle(meta)
  const url = absolute(meta.path)
  const image = siteUrl ? `${siteUrl}/og-image.png` : null
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  ]
  if (meta.noindex) tags.push('<meta name="robots" content="noindex" />')
  if (url && !meta.noindex) tags.push(`<link rel="canonical" href="${escapeHtml(url)}" />`)

  tags.push(
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    '<meta property="og:locale" content="en_IN" />',
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  )
  if (url) tags.push(`<meta property="og:url" content="${escapeHtml(url)}" />`)
  if (image) {
    tags.push(
      `<meta property="og:image" content="${escapeHtml(image)}" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      `<meta property="og:image:alt" content="${escapeHtml(`${company.brandName} wordmark`)}" />`,
      `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    )
  }

  for (const font of fontFiles) {
    tags.push(`<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`)
  }
  for (const file of chunkFiles(source)) {
    if (template.includes(`/${file}`)) continue // Vite already preloads it
    tags.push(`<link rel="modulepreload" crossorigin href="/${file}" />`)
  }
  if (jsonLd) {
    // JSON-LD is a data block, not executed script, so it needs no CSP allowance.
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json">${json}</script>`)
  }
  return tags.join('\n    ')
}

/** Organisation data, limited to verified facts. Address, CIN etc. are added only once verified. */
function organisationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    alternateName: company.brandName,
    description: company.description,
  }
  if (siteUrl) {
    data.url = `${siteUrl}/`
    data.logo = `${siteUrl}/logo-512.png`
  }
  if (company.contact.email) data.email = company.contact.email
  const sameAs = Object.values(company.social).filter(Boolean)
  if (sameAs.length) data.sameAs = sameAs
  return data
}

function outputFile(pathname) {
  if (pathname === '/') return 'index.html'
  return `${pathname.replace(/^\//, '')}.html`
}

async function writePage(meta, url, file, options) {
  const appHtml = await render(url)
  // The page must be complete static HTML: no streaming placeholders or inline scripts,
  // which would need JavaScript to show content and would be blocked by the CSP.
  if (/<script|<template|<!--\$\?-->/.test(appHtml)) {
    throw new Error(`prerender: ${url} rendered with a pending Suspense boundary or inline script`)
  }
  // data-route tells the client which route this markup belongs to ("*" = any unknown path).
  const route = file === '404.html' ? '*' : url
  const html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace('<!--app-head-->', headTags(meta, options))
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-route="${escapeHtml(route)}">${appHtml}</div>`)
  if (!html.includes('data-route=')) throw new Error('prerender: #root placeholder not found in dist/index.html')
  const target = path.join(dist, file)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, html)
  return file
}

const written = []
for (const page of pages) {
  const source = page.source ?? pageSources[page.path]
  const jsonLd = page.path === '/' ? organisationJsonLd() : undefined
  written.push(await writePage(page, page.path, outputFile(page.path), { source, jsonLd }))
}
written.push(await writePage(routeMeta.notFound, routeMeta.notFound.path, '404.html', {}))

// robots.txt and sitemap.xml
const robots = ['User-agent: *', 'Allow: /']
if (siteUrl) {
  const urls = pages
    .filter((page) => !page.noindex)
    .map((page) => `  <url><loc>${escapeHtml(absolute(page.path))}</loc></url>`)
  await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
  )
  robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
  written.push('sitemap.xml')
} else {
  console.warn('prerender: VITE_SITE_URL is not set, so canonical URLs, og:url, og:image and sitemap.xml were skipped.')
}
await writeFile(path.join(dist, 'robots.txt'), `${robots.join('\n')}\n`)
written.push('robots.txt')

// The manifest was only needed here; don't publish it.
await rm(path.join(dist, '.vite'), { recursive: true, force: true })
await rm(ssrDir, { recursive: true, force: true })

console.log(`prerender: wrote ${written.length} files\n  ${written.join('\n  ')}`)
