# NivaraNova Technologies website

The corporate website for NivaraNova Technologies and its first product, CivicSetu.

It is a static site: React and TypeScript, built with Vite, with every page prerendered to plain HTML at build time. There is no server to run and no database. Any static host can serve the `dist/` folder.

For what was built, the test results and the open items before launch, see [HANDOVER.md](HANDOVER.md).

## Requirements

- Node.js 20.19 or newer (developed on Node 22)
- npm 10 or newer

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies. Use `npm ci` in CI. |
| `npm run dev` | Development server at http://localhost:5173 with hot reload. |
| `npm run typecheck` | TypeScript check in strict mode. |
| `npm run lint` | oxlint, including accessibility rules. Fails on any warning. |
| `npm test` | Unit tests (Vitest): form validation, submission, content guards, contact form behaviour. |
| `npm run build` | Typecheck, build, then prerender every page into `dist/`. |
| `npm run preview` | Serve `dist/` at http://localhost:4173 with the production security headers. |
| `npm run test:e2e` | Browser tests (Playwright) against the production build. Run `npm run build` first. |
| `npm run check` | All of the above in order. Run this before every deploy. |
| `npm run generate:assets` | Rewrite `favicon.svg` and re-render `og-image.png`, `logo-512.png` and the PNG icons from `src/config/brand.ts` after changing the logo. |

The first time you run the browser tests, install Playwright's browser:

```bash
npx playwright install chromium
```

Or point the tests at an installed Chrome: `CHROME_PATH=/path/to/chrome npm run test:e2e`.

## Where things live

```
src/
  config/company.ts        Business identity: legal name, contact details, CIN, GSTIN. Edit here first.
  content/                 All page copy that changes over time
    routes.ts              Page titles, descriptions and the main navigation
    civicsetu.ts           CivicSetu status, workflows, capabilities (with evidence), architecture, roadmap
    solutions.ts           The six solution areas
    focus-areas.ts         Home page focus areas
    insights.ts            Articles (empty until the first real one is written)
  pages/                   One component per page
  components/
    layout/                Page frame, footer, error boundary
    navigation/            Header and mobile menu
    sections/              Larger reusable blocks (page header, workflow steps, contact form, hero map…)
    ui/                    Small building blocks (button, logo, status badge, placeholder)
  lib/                     Contact form rules and submission, helpers
  styles/index.css         Design tokens (colours, fonts, type scale) and base styles
  assets/fonts/            Self-hosted Inter and Manrope (Latin subset, SIL OFL)
  entry-server.tsx         Build-time entry used only for prerendering
scripts/
  prerender.mjs            Writes the static HTML pages, robots.txt and sitemap.xml
  generate-brand-assets.mjs
public/
  _headers                 Security and caching headers (Cloudflare Pages / Netlify format)
  favicon.svg, *.png       Icons and the social sharing image
e2e/                       Playwright browser tests
```

### Common edits

- **Add verified company details** (email, phone, CIN, GSTIN, registered office): fill in `src/config/company.ts`. The "to be added" placeholders disappear by themselves. One unit test checks these fields are still empty, so update it in the same change; that keeps the edit deliberate.
- **Change CivicSetu's status or a capability**: edit `src/content/civicsetu.ts`. Every capability carries an `evidence` note. A unit test fails if something is marked `tested` without test evidence, or if an AI feature is marked anything other than `planned`.
- **Publish an article**: add an entry to `src/content/insights.ts`, dated the day it goes live. It gets its own page at `/insights/<slug>` and is added to the sitemap automatically.
- **Change colours or fonts**: `src/styles/index.css`. Tailwind's default palette is switched off, so only the tokens defined there can be used.

## Configuration

Copy `.env.example` to `.env.production`, or set these in your host's build settings. All three are public values compiled into the site. Never put a secret in a `VITE_` variable.

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Final address, e.g. `https://www.example.in`. Turns on canonical URLs, `og:url`, the social image tag and `sitemap.xml`. |
| `VITE_CONTACT_ENDPOINT` | Optional. Your own HTTPS URL that accepts the contact form as JSON; overrides Web3Forms. See below. |
| `VITE_SHOW_PLACEHOLDERS` | `false` hides the "to be added" labels for missing details. |

### Connecting the contact form

**Current setup: Web3Forms.** Enquiries are emailed to nivaranovapvtltd@gmail.com through [Web3Forms](https://web3forms.com), a free form-to-email service. The access key lives in `src/config/company.ts` (`web3formsAccessKey`). It is public by design: it can only send mail to the inbox it was created for. To get a new key, enter the inbox address at web3forms.com; the key arrives by email. Replying to an enquiry email replies straight to the visitor.

Web3Forms runs its own spam check. The site adds a hidden honeypot field and a minimum fill time, and validates every field before sending. There is no server-side validation or rate limiting of our own; if spam becomes a problem, move to your own endpoint (below).

**Your own endpoint.** Setting `VITE_CONTACT_ENDPOINT` overrides Web3Forms. The form then POSTs JSON to that address:

```json
{
  "fullName": "…", "workEmail": "…", "organisation": "…",
  "subject": "…", "enquiryType": "general | civicsetu | project | partnership | other",
  "message": "…",
  "meta": { "elapsedMs": 8421, "source": "website-contact" }
}
```

It treats any 2xx response as sent. The receiving end must:

1. Validate every field again. `src/lib/enquiry.ts` has no browser dependencies, so its `validateEnquiry` can be reused in a Node or serverless function.
2. Rate-limit by IP, and discard requests where `meta.elapsedMs` is under about 3 seconds.
3. Allow CORS only from the site's own origin.
4. Return a generic error message, never internal details.

Then put the endpoint's origin in `connect-src` in `public/_headers` (in place of `https://api.web3forms.com`), or the browser will block the request.

Options, cheapest first: a small serverless function on the same host (Cloudflare Pages Functions or Netlify Functions, both free at this volume) that emails the enquiry; a form-delivery service; or an endpoint on the CivicSetu Django backend once it is deployed.

## Deployment

The output is static, so hosting can cost nothing. The domain is the only recurring cost.

**Cloudflare Pages (recommended)**: connect the repository, then set:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_SITE_URL`, plus `NODE_VERSION=22`

Pages reads `dist/_headers` for security headers, serves `/about` from `about.html`, and returns `404.html` with a real 404 status for unknown addresses.

**Netlify** works the same way with the same settings.

**Any other static host or nginx**: serve `dist/`, map clean URLs to `.html` files, and copy the headers from `public/_headers` into the server config:

```nginx
location / {
  try_files $uri $uri.html $uri/ =404;
}
error_page 404 /404.html;
location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

After the first deploy, check the headers at https://securityheaders.com and the social card with any Open Graph preview tool.

## Licences

Inter and Manrope are under the SIL Open Font License 1.1 (`src/assets/fonts/*-OFL.txt`). Icons are from Lucide (ISC). The NivaraNova mark and the route illustration are original to this project.
