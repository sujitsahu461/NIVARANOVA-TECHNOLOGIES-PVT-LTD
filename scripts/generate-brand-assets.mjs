/**
 * Writes the brand assets in public/ from the logo in src/config/brand.ts:
 *   favicon.svg, and with headless Chromium og-image.png (1200x630),
 *   logo-512.png, apple-touch-icon.png (180) and favicon-32.png
 *
 * Run after changing the logo or brand copy:  npm run generate:assets
 * Needs Node 22.18 or later (it imports a .ts file directly).
 * Uses Playwright's Chromium, or the browser at CHROME_PATH if set.
 */
import { chromium } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { brandColors, emblem, emblemSvg, wordmark } from '../src/config/brand.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const fontsDir = path.join(root, 'src', 'assets', 'fonts')

const fontData = async (file) => (await readFile(path.join(fontsDir, file))).toString('base64')
const inter = await fontData('inter-latin-wght-normal.woff2')
const manrope = await fontData('manrope-latin-wght-normal.woff2')

const fontCss = `
  @font-face { font-family: 'Inter Variable'; font-weight: 100 900; src: url(data:font/woff2;base64,${inter}) format('woff2'); }
  @font-face { font-family: 'Manrope Variable'; font-weight: 200 800; src: url(data:font/woff2;base64,${manrope}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body { -webkit-font-smoothing: antialiased; }
`

/** The emblem centred in a square, with a transparent background: the favicon. */
const faviconSvg = () => {
  const inset = (emblem.width - emblem.height) / 2
  return emblemSvg().replace(
    `viewBox="0 0 ${emblem.width} ${emblem.height}"`,
    `viewBox="0 ${-inset} ${emblem.width} ${emblem.width}"`,
  )
}

/** The emblem centred on white, for icons that must be square and opaque (Apple, search engines). */
const squareIcon = (size) => {
  const width = Math.round(size * 0.76)
  return `<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:${brandColors.white}">
    ${emblemSvg(`width="${width}"`)}
  </div>`
}

/** "NIVARANOVA" with its subline, matching src/components/ui/Logo.tsx. */
const lockupSvg = (height) => {
  const baseline = wordmark.nameCapHeight + wordmark.sublineGap + wordmark.sublineCapHeight
  const size = (capHeight) => capHeight / wordmark.fontCapHeight
  const text = (y, length, capHeight, weight, content) =>
    `<text x="${wordmark.width / 2}" y="${y}" text-anchor="middle" textLength="${length}" lengthAdjust="spacing" font-size="${size(capHeight)}" font-weight="${weight}">${content}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wordmark.width} ${baseline}" height="${height}" overflow="visible" fill="${brandColors.black}" font-family="Manrope Variable">
    ${text(wordmark.nameCapHeight, wordmark.width, wordmark.nameCapHeight, 400, wordmark.name)}
    ${text(baseline, wordmark.sublineWidth, wordmark.sublineCapHeight, 700, wordmark.subline)}
  </svg>`
}

const ogImage = `
  <html><head><style>${fontCss}
    body { width: 1200px; height: 630px; background: #f7f9fb; font-family: 'Inter Variable'; color: #101b2b; position: relative; overflow: hidden; }
    .grid { position: absolute; right: -40px; top: -40px; }
    .content { position: absolute; left: 88px; top: 96px; width: 640px; }
    .brand { display: flex; align-items: center; gap: 24px; }
    h1 { margin-top: 64px; font-family: 'Manrope Variable'; font-weight: 600; font-size: 60px; line-height: 1.06; letter-spacing: -0.03em; }
    p { margin-top: 28px; font-size: 26px; line-height: 1.45; color: #536273; }
  </style></head><body>
    <svg class="grid" width="520" height="720" viewBox="0 0 520 720" xmlns="http://www.w3.org/2000/svg">
      <g fill="#ffffff" stroke="#dce3ea">
        ${[0, 1, 2, 3, 4, 5]
          .flatMap((row) =>
            [0, 1, 2].map(
              (col) => `<rect x="${40 + col * 160}" y="${40 + row * 120}" width="140" height="100" rx="8"/>`,
            ),
          )
          .join('')}
      </g>
      <path d="M190 600V510H350V150" fill="none" stroke="#138c83" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="190" cy="600" r="14" fill="#fff" stroke="#101b2b" stroke-width="4"/>
      <circle cx="190" cy="600" r="5.5" fill="#101b2b"/>
      <circle cx="350" cy="390" r="12" fill="#173b57" stroke="#fff" stroke-width="4"/>
      <circle cx="350" cy="150" r="20" fill="#0e6f68"/>
      <path d="M341 151l6 6 11-12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="content">
      <div class="brand">${emblemSvg('height="76"')}${lockupSvg(54)}</div>
      <h1>Practical software for public-service problems</h1>
      <p>NivaraNova Technologies, Gunupur, Odisha</p>
    </div>
  </body></html>`

const iconPage = (svg, size) =>
  `<html><head><style>${fontCss} body { width: ${size}px; height: ${size}px; }</style></head><body>${svg}</body></html>`

await writeFile(path.join(publicDir, 'favicon.svg'), `${faviconSvg()}\n`)
console.log('generated public/favicon.svg')

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
try {
  const outputs = [
    { file: 'og-image.png', html: ogImage, width: 1200, height: 630 },
    { file: 'logo-512.png', html: iconPage(squareIcon(512), 512), width: 512, height: 512 },
    { file: 'apple-touch-icon.png', html: iconPage(squareIcon(180), 180), width: 180, height: 180 },
    {
      file: 'favicon-32.png',
      html: iconPage(faviconSvg().replace('<svg ', '<svg width="32" height="32" '), 32),
      width: 32,
      height: 32,
      omitBackground: true,
    },
  ]
  for (const output of outputs) {
    const page = await browser.newPage({ viewport: { width: output.width, height: output.height } })
    await page.setContent(output.html, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({
      path: path.join(publicDir, output.file),
      omitBackground: Boolean(output.omitBackground),
    })
    await page.close()
    console.log(`generated public/${output.file}`)
  }
} finally {
  await browser.close()
}
