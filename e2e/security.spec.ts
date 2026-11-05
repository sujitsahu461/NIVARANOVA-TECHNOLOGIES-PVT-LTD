/**
 * Security tests. Run on their own with `npm run test:security`, or with the
 * other browser tests in `npm run test:e2e`.
 *
 * - Repository: no secrets in committed files, .env and key files kept out of
 *   git, only public VITE_* variables reach the browser, no unsafe DOM APIs.
 * - Build output: what `npm run build` writes to dist/ is safe to publish.
 * - Running site: headers, Content Security Policy, clickjacking, script
 *   injection and file exposure, checked in a real browser.
 */
import { test as base, type Request } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { expect, fakeWeb3Forms, fillValidEnquiry, pages, test } from './fixtures'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')

// ---------------------------------------------------------------------------
// Helpers

/** Folders git ignores (see .gitignore). Everything else would be committed. */
const IGNORED_DIRS = new Set(['.git', 'node_modules', 'dist', 'dist-ssr', 'coverage', 'playwright-report', 'test-results'])
const TEXT_FILE = /\.(ts|tsx|js|mjs|cjs|json|html|css|md|txt|svg|xml|ya?ml)$|^(\.env\.example|\.gitignore|\.oxlintrc\.json|_headers)$/

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return IGNORED_DIRS.has(entry.name) ? [] : walk(full)
    return [full]
  })
}

const rel = (file: string, from = root) => path.relative(from, file).replaceAll('\\', '/')

/** Text files that git would commit: skips ignored folders, .env files and the generated lockfile. */
function committedTextFiles(): string[] {
  return walk(root).filter((file) => {
    const name = path.basename(file)
    if (name.startsWith('.env') && name !== '.env.example') return false
    if (name === 'package-lock.json' || name === 'settings.local.json') return false
    return TEXT_FILE.test(name)
  })
}

/** Reads KEY=value lines from an env file in the project root. */
function readEnvFile(name: string): Record<string, string> {
  const file = path.join(root, name)
  if (!existsSync(file)) return {}
  const entries = readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/))
    .filter((match) => match !== null)
    .map((match) => [match[1], match[2].replace(/^(['"])(.*)\1$/, '$2')])
  return Object.fromEntries(entries)
}

/** Well-known credential formats. Any match in a committed file is a leak. */
const SECRET_PATTERNS: ReadonlyArray<readonly [string, RegExp]> = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{36,}/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}/],
  ['Stripe secret key', /\b[sr]k_live_[0-9A-Za-z]{16,}/],
  ['JSON web token', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
]
/** `password = "…"`, `apiKey: '…'` and the like. */
const ASSIGNED_SECRET =
  /\b(password|passwd|secret|api_?key|access_?key|auth_?token|client_?secret)\b\s*[:=]\s*['"`]([^'"`\s]{8,})['"`]/gi
/** Values that are plainly made up for tests. */
const TEST_VALUE = /test|example|dummy|fake|placeholder|changeme|x{4,}/i
/** The shape of a Web3Forms access key. */
const UUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i

function findSecrets(text: string, { includeUuids }: { includeUuids: boolean }): string[] {
  const found = SECRET_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([label]) => label)
  for (const match of text.matchAll(ASSIGNED_SECRET)) {
    if (!TEST_VALUE.test(match[2] ?? '')) found.push(`hard-coded ${match[1]}`)
  }
  if (includeUuids && UUID.test(text)) found.push('UUID-style access key')
  return found
}

function gitIsAvailable(): boolean {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * Asks git which paths an ignore file (.gitignore, or .vercelignore, which uses the same rules)
 * keeps out, using a throwaway repository.
 */
function ignoredBy(ignoreFile: string, paths: readonly string[]): Record<string, boolean> {
  const repo = mkdtempSync(path.join(tmpdir(), 'nivaranova-ignore-'))
  try {
    execFileSync('git', ['init', '-q'], { cwd: repo })
    copyFileSync(path.join(root, ignoreFile), path.join(repo, '.gitignore'))
    return Object.fromEntries(
      paths.map((file) => {
        try {
          execFileSync('git', ['check-ignore', '-q', '--no-index', file], { cwd: repo })
          return [file, true]
        } catch {
          return [file, false]
        }
      }),
    )
  } finally {
    rmSync(repo, { recursive: true, force: true })
  }
}

/** Reads a Cloudflare/Netlify `_headers` file into path → header name → value. */
function parseHeadersFile(text: string): Record<string, Record<string, string>> {
  const rules: Record<string, Record<string, string>> = {}
  let current: Record<string, string> | undefined
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      current = rules[line.trim()] = {}
      continue
    }
    const separator = line.indexOf(':')
    if (current) current[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }
  return rules
}

// ---------------------------------------------------------------------------
// Repository

test.describe('repository', () => {
  test('committed files contain no keys, tokens or passwords', () => {
    const findings = committedTextFiles().flatMap((file) =>
      findSecrets(readFileSync(file, 'utf8'), { includeUuids: true }).map((label) => `${rel(file)}: ${label}`),
    )
    expect(findings).toEqual([])
  })

  test('the contact-form key in .env appears in no committed file', () => {
    const key = readEnvFile('.env').VITE_WEB3FORMS_ACCESS_KEY
    test.skip(!key, 'No VITE_WEB3FORMS_ACCESS_KEY in .env on this machine')
    const leaks = committedTextFiles().filter((file) => readFileSync(file, 'utf8').includes(key as string))
    expect(leaks.map((file) => rel(file))).toEqual([])
  })

  test('git ignores .env files, keys and credentials, and keeps the source and the template', () => {
    test.skip(!gitIsAvailable(), 'git is not installed')
    const mustIgnore = [
      '.env',
      '.env.local',
      '.env.production',
      '.env.development.local',
      'server.pem',
      'private.key',
      'certificate.p12',
      'id_rsa',
      'credentials.json',
      'service-account.json',
      'secrets/api.txt',
      '.npmrc',
      '.claude/settings.local.json',
      '.vercel/project.json',
      'dist/index.html',
      'dist-ssr/entry-server.js',
      'node_modules/react/index.js',
    ]
    const mustCommit = [
      '.env.example',
      '.gitignore',
      '.vercelignore',
      'vercel.json',
      'package.json',
      'public/_headers',
      'src/config/company.ts',
      '.claude/launch.json',
    ]
    const result = ignoredBy('.gitignore', [...mustIgnore, ...mustCommit])
    expect(mustIgnore.filter((file) => !result[file]), 'should be ignored').toEqual([])
    expect(mustCommit.filter((file) => result[file]), 'should be committed').toEqual([])
  })

  test('the Vercel CLI never uploads .env files or local build output', () => {
    test.skip(!gitIsAvailable(), 'git is not installed (it is used to read the ignore rules)')
    const mustSkip = ['.env', '.env.local', '.env.production', 'node_modules/react/index.js', 'dist/index.html', '.vercel/project.json']
    const mustUpload = ['.env.example', 'package.json', 'package-lock.json', 'vercel.json', 'src/main.tsx', 'public/_headers']
    const result = ignoredBy('.vercelignore', [...mustSkip, ...mustUpload])
    expect(mustSkip.filter((file) => !result[file]), 'should not be uploaded').toEqual([])
    expect(mustUpload.filter((file) => result[file]), 'should be uploaded').toEqual([])
  })

  test('vercel.json sends exactly the headers in public/_headers', () => {
    const fromHeadersFile = parseHeadersFile(readFileSync(path.join(root, 'public/_headers'), 'utf8'))
    const vercel = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf8')) as {
      headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>
    }
    const fromVercel = Object.fromEntries(
      vercel.headers.map((rule) => [
        rule.source.replace('(.*)', '*'),
        Object.fromEntries(rule.headers.map((header) => [header.key, header.value])),
      ]),
    )
    expect(fromVercel).toEqual(fromHeadersFile)
  })

  test('.env.example is an empty template that documents every variable the site reads', () => {
    const example = readEnvFile('.env.example')
    for (const [name, value] of Object.entries(example)) {
      if (/KEY|TOKEN|SECRET|PASSWORD|ENDPOINT|URL/.test(name)) expect(value, `${name} must be empty`).toBe('')
    }
    const declared = [...readFileSync(path.join(root, 'src/vite-env.d.ts'), 'utf8').matchAll(/readonly (VITE_\w+)/g)]
    expect(Object.keys(example).sort()).toEqual(declared.map((match) => match[1]).sort())
  })

  test('only public VITE_ variables can reach the browser', () => {
    // envPrefix would let Vite compile other environment variables into the public bundle.
    expect(readFileSync(path.join(root, 'vite.config.ts'), 'utf8')).not.toMatch(/envPrefix/)
    const builtIn = new Set(['MODE', 'DEV', 'PROD', 'SSR', 'BASE_URL'])
    const problems: string[] = []
    for (const file of walk(path.join(root, 'src')).filter((name) => /\.tsx?$/.test(name))) {
      const source = readFileSync(file, 'utf8')
      if (/process\.env/.test(source)) problems.push(`${rel(file)}: process.env`)
      for (const match of source.matchAll(/\b(?:import\.meta\.env|env)\.([A-Z][A-Z0-9_]*)/g)) {
        const name = match[1] ?? ''
        if (!name.startsWith('VITE_') && !builtIn.has(name)) problems.push(`${rel(file)}: ${name}`)
      }
    }
    expect(problems).toEqual([])
  })

  test('the site code uses no API that turns text into HTML or code', () => {
    const risky =
      /dangerouslySetInnerHTML|\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML|document\.write|\beval\s*\(|new Function\s*\(/
    const files = [...walk(path.join(root, 'src')), ...walk(path.join(root, 'public'))].filter(
      (file) => /\.(tsx?|js)$/.test(file) && !/\.test\.tsx?$/.test(file),
    )
    expect(files.filter((file) => risky.test(readFileSync(file, 'utf8'))).map((file) => rel(file))).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Build output

test.describe('build output (dist/)', () => {
  test.beforeAll(() => {
    if (!existsSync(dist)) throw new Error('dist/ is missing: run `npm run build` first')
  })

  test('ships no source maps, env files or source code', () => {
    const files = walk(dist).map((file) => rel(file, dist))
    expect(files.filter((file) => /\.map$|(^|\/)\.env|\.tsx?$|entry-server/.test(file))).toEqual([])
    for (const file of files.filter((name) => /\.(js|css)$/.test(name))) {
      expect(readFileSync(path.join(dist, file), 'utf8'), file).not.toContain('sourceMappingURL')
    }
  })

  test('contains no secrets and no paths from the build machine', () => {
    // The Web3Forms key is in the bundle by design (it can only email the company inbox), so UUIDs are allowed here.
    const machinePaths = [root, root.replaceAll('\\', '/')]
    const findings: string[] = []
    for (const file of walk(dist).filter((name) => TEXT_FILE.test(path.basename(name)))) {
      const text = readFileSync(file, 'utf8')
      for (const label of findSecrets(text, { includeUuids: false })) findings.push(`${rel(file, dist)}: ${label}`)
      if (machinePaths.some((local) => text.includes(local))) findings.push(`${rel(file, dist)}: local file path`)
    }
    expect(findings).toEqual([])
  })

  test('pages have no inline scripts, inline event handlers or javascript: links', () => {
    const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'))
    expect(htmlFiles.length).toBeGreaterThan(5)
    for (const file of htmlFiles) {
      const html = readFileSync(file, 'utf8')
      const name = rel(file, dist)
      for (const [, attributes] of html.matchAll(/<script\b([^>]*)>/g)) {
        // Allowed: external files from the site itself, and JSON-LD, which is data, not code.
        expect(/\ssrc="\//.test(attributes ?? '') || /type="application\/ld\+json"/.test(attributes ?? ''), `${name}: <script${attributes}>`).toBe(true)
      }
      expect(html, `${name}: inline event handler`).not.toMatch(/<[^>]+\son[a-z]+\s*=/i)
      expect(html, `${name}: javascript: URL`).not.toMatch(/javascript:/i)
    }
  })
})

// ---------------------------------------------------------------------------
// Running site

/** Parses a CSP header into directive → sources. */
function parseCsp(header: string): Map<string, string[]> {
  return new Map(
    header
      .split(';')
      .map((directive) => directive.trim().split(/\s+/))
      .filter(([name]) => Boolean(name))
      .map(([name, ...sources]) => [name as string, sources]),
  )
}

test.describe('running site: headers', () => {
  test('every page, the 404 page and static files send the security headers', async ({ request }) => {
    for (const url of [...pages.map((page) => page.path), '/this-page-does-not-exist', '/theme.js', '/favicon.svg']) {
      const headers = (await request.get(url)).headers()
      expect(headers['content-security-policy'], `${url}: CSP`).toBeTruthy()
      expect(headers['x-content-type-options'], url).toBe('nosniff')
      expect(headers['x-frame-options'], url).toBe('DENY')
      expect(headers['referrer-policy'], url).toBe('strict-origin-when-cross-origin')
      expect(headers['cross-origin-opener-policy'], url).toBe('same-origin')
      expect(headers['permissions-policy'], url).toMatch(/camera=\(\).*microphone=\(\).*geolocation=\(\)/)
    }
  })

  test('the Content Security Policy allows nothing unsafe', async ({ request }) => {
    const csp = parseCsp((await request.get('/')).headers()['content-security-policy'] ?? '')
    expect(csp.get('default-src')).toEqual(["'self'"])
    expect(csp.get('script-src')).toEqual(["'self'"])
    expect(csp.get('object-src')).toEqual(["'none'"])
    expect(csp.get('base-uri')).toEqual(["'self'"])
    expect(csp.get('form-action')).toEqual(["'self'"])
    expect(csp.get('frame-ancestors')).toEqual(["'none'"])
    // No 'unsafe-inline', 'unsafe-eval', wildcards, data: or plain-HTTP sources anywhere.
    for (const [directive, sources] of csp) {
      for (const source of sources) {
        const safe = source === "'self'" || source === "'none'" || /^https:\/\/[a-z0-9.-]+$/.test(source)
        expect(safe, `${directive} allows ${source}`).toBe(true)
      }
    }
  })
})

// These tests expect the browser to log a CSP or framing error, so they use the
// plain Playwright test rather than the fixture that fails on console errors.
base.describe('running site: attacks the browser must block', () => {
  base('a script injected into the page does not run', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    // If CSP failed, this would serve the external script locally; no real request is ever made.
    await page.route('https://attacker.example/**', (route) =>
      route.fulfill({ contentType: 'text/javascript', body: 'window.injectedExternal = true' }),
    )
    await page.goto('/')
    await page.evaluate(() => {
      const inline = document.createElement('script')
      inline.textContent = 'window.injectedInline = true'
      const external = document.createElement('script')
      external.src = 'https://attacker.example/steal.js'
      document.body.append(inline, external)
    })
    await expect.poll(() => errors.join('\n')).toMatch(/Content Security Policy/)
    const ran = await page.evaluate(() => {
      const flags = window as unknown as { injectedInline?: boolean; injectedExternal?: boolean }
      return { inline: flags.injectedInline ?? false, external: flags.injectedExternal ?? false }
    })
    expect(ran).toEqual({ inline: false, external: false })
  })

  base('another site cannot show this site in a frame (clickjacking)', async ({ page, baseURL }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    await page.setContent(`<iframe src="${baseURL}/contact" width="800" height="600"></iframe>`)
    await expect.poll(() => errors.join('\n'), { message: 'the browser should refuse the frame' }).toMatch(
      /frame-ancestors|X-Frame-Options/,
    )
    // Chrome shows its own "refused to connect" page in the frame; the site itself never loads.
    const frame = await (await page.waitForSelector('iframe')).contentFrame()
    const siteContent = frame ? await frame.locator('#root').count().catch(() => 0) : 0
    expect(siteContent, 'the framed site rendered').toBe(0)
  })
})

test.describe('running site: hostile input', () => {
  const payload = `"><img src=x onerror="window.xssMarker=1"><script>window.xssMarker=1</script>`
  const xssRan = (page: import('@playwright/test').Page) =>
    page.evaluate(() => (window as unknown as { xssMarker?: number }).xssMarker !== undefined)

  test('HTML in a contact link is shown as text, never run', async ({ page }) => {
    await page.goto(`/contact?type=${encodeURIComponent('<script>')}&subject=${encodeURIComponent(payload)}`)
    await expect(page.getByLabel('Subject')).toHaveValue(payload)
    await expect(page.getByLabel('Enquiry type')).toHaveValue('')
    expect(await page.locator('img[src="x"], main script').count()).toBe(0)
    expect(await xssRan(page)).toBe(false)
  })

  test('HTML typed into the form is shown as text, never run', async ({ page }) => {
    await page.goto('/contact')
    for (const label of ['Full name', 'Organisation (optional)', 'Subject', 'Message']) {
      await page.getByLabel(label).fill(payload)
    }
    await page.getByLabel('Work email').fill(`${payload}@example.org`)
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    expect(await page.locator('img[src="x"], main script').count()).toBe(0)
    expect(await xssRan(page)).toBe(false)
  })

  test('an enquiry goes only to the form service, as JSON, without cookies', async ({ page }) => {
    await fakeWeb3Forms(page, { success: true })
    const posts: Request[] = []
    page.on('request', (request) => {
      if (request.method() === 'POST') posts.push(request)
    })
    await page.goto('/contact')
    await fillValidEnquiry(page)
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByRole('heading', { name: 'Enquiry sent' })).toBeVisible()

    expect(posts).toHaveLength(1)
    const [post] = posts as [Request]
    expect(new URL(post.url()).origin).toBe('https://api.web3forms.com')
    const headers = await post.allHeaders()
    expect(headers).not.toHaveProperty('cookie')
    expect(headers['content-type']).toBe('application/json')
  })

  test('source code, config and env files are not served', async ({ request }) => {
    const probes = [
      '/.env',
      '/.env.example',
      '/.env.production',
      '/.git/config',
      '/package.json',
      '/vite.config.ts',
      '/src/config/company.ts',
      '/src/main.tsx',
      '/dist-ssr/entry-server.js',
      '/.claude/launch.json',
      '/node_modules/react/package.json',
    ]
    for (const url of probes) {
      const body = await (await request.get(url)).text()
      // Unknown paths come back as a web page (the 404 page or the app shell), never as the file itself.
      expect(body, url).not.toMatch(/VITE_|"devDependencies"|\[core\]|export const|from '|"configurations"/)
    }
  })

  test('no link can run script, and new tabs cannot reach back to this page', async ({ page }) => {
    for (const { path: url } of pages) {
      await page.goto(url)
      const unsafe = await page.locator('a').evaluateAll((links) =>
        links
          .filter((link) => {
            const href = link.getAttribute('href') ?? ''
            const opensNewTab = link.getAttribute('target') === '_blank'
            return /^\s*javascript:/i.test(href) || (opensNewTab && !/noopener/.test(link.getAttribute('rel') ?? ''))
          })
          .map((link) => link.getAttribute('href')),
      )
      expect(unsafe, url).toEqual([])
    }
  })
})
