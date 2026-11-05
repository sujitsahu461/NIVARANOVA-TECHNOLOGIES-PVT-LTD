# Handover: NivaraNova corporate website

Prepared 1 November 2026. Everything under "Results" was run in this build environment, and the commands are listed so you can repeat them. Anything not run is marked **NOT VERIFIED**.

## 1. Before you publish: owner actions

These need a decision or a document only the company has. The site is honest without them, but it is not ready for the public until the first three are done.

1. **Legal name.** The site shows "NivaraNova Technologies Pvt. Ltd." as instructed. Project notes from October 2026 say incorporation was still pending. Section 453 of the Companies Act, 2013 penalises using "Private Limited" in a business name before incorporation. Publish the "Pvt. Ltd." form only once the Certificate of Incorporation is issued, with the spelling and casing exactly as it appears there. Until then, change `legalName` in `src/config/company.ts` to "NivaraNova Technologies". Confirm the details with your CA or CS.
2. **Contact route.** The email (nivaranovapvtltd@gmail.com) and two phone numbers supplied by the company are on the site, and the contact form emails each enquiry to that inbox through Web3Forms (README, "Connecting the contact form"). Check that inbox's spam folder now and then for the first few weeks. Consider moving to a mailbox on the company's own domain once it is registered.
3. **Privacy notice.** `/privacy` is a short, plain-language draft. It now shows the company email, but still needs a retention period and a review by someone qualified, against the Digital Personal Data Protection Act, 2023.
4. **Domain.** Set `VITE_SITE_URL` to enable canonical URLs, the social image tag and `sitemap.xml`.
5. **Brand name casing.** The brief says "NivaraNova", but the project description and company records say "Nivaranova". Pick one and use it everywhere, matching the incorporation documents. The wordmark is in `src/components/ui/Logo.tsx`, the names in `src/config/company.ts`.
6. **Registration details.** Add CIN, GSTIN, registered office and incorporation date to `src/config/company.ts` once issued. The placeholders vanish automatically.
7. **Leadership.** The About page has a placeholder. Team listings were not published because the project records still disagree on the roster.
8. **Confirm the "no machine learning in V1" claim.** The About page and CivicSetu content say V1 has no ML in the complaint path, which is the documented October decision. The status file still records legacy AI modules and pickled models in the codebase (conflict C3). Before launch, trace the complaint-submission code. If anything still calls the old models, either remove it or change the wording.

## 2. Decisions that differ from the brief

| Brief | What was built | Why |
|---|---|---|
| CivicSetu described as "AI-powered" | Described as a civic grievance management platform; AI categorisation listed as **Planned** | The October 2026 V1 decision removed ML from the complaint path. Calling it AI-powered would present a planned feature as operational, which the brief itself forbids. A unit test now blocks the phrase. |
| Phone-style placeholders in the UI | Labelled chips such as "Business email: to be added", which can be hidden with one setting | Visible, editable, and impossible to mistake for real data. |
| No privacy page listed | `/privacy` added | The contact form collects personal data, so a notice is needed. |
| Tested / implemented / planned | Every CivicSetu capability has a status and a recorded evidence source in `src/content/civicsetu.ts` | "Tested" means covered by the V1 test suite *as reported in the project's test report*. Those tests were not re-run here, and the page says so. Only two capabilities qualify (complaint submission, and photo/audio/video evidence). Role-based access stays at "Implemented" because the department-isolation tests are still on the roadmap. |

## 3. Repository audit (Phase 1)

- No existing website repository was available: the GitHub repo is not linked and no folder was shared. The site was therefore built as a new project from the official Vite template (`create-vite` 9.3.3, `react-ts`).
- The template's choices were kept: Vite 8, TypeScript 7, oxlint. `strict` mode was added, because the template does not enable it.
- The CivicSetu application code was not available. Product claims come from the project's own documents (requirements, the 13 October work report, the test report and the V1 decisions), as recorded in `claude/CURRENT_STATUS.md`.

## 4. Stack and versions (installed)

React 19.3.1, React Router 8.5.1, Vite 8.3.5, TypeScript 7.0.2 (strict), Tailwind CSS 4.3.3, lucide-react 1.66.0. Tests: Vitest 5.0.5 with Testing Library, Playwright 1.64.1, axe-core via @axe-core/playwright 4.14. Lint: oxlint 1.90.

There are only three runtime dependencies (react, react-dom, react-router) plus lucide-react for icons. The site has no backend, no analytics, no cookies and no third-party requests.

## 5. Results

Run in this environment on 1 November 2026, with Node 22.23.4 and Chrome for Testing 153 (`CHROME_PATH`).

| Check | Command | Result |
|---|---|---|
| Type check | `npm run typecheck` | Pass, 0 errors |
| Lint | `npm run lint` | Pass, 0 warnings (exceptions listed below) |
| Unit tests | `npm test` | **60 / 60 passed** (4 files) |
| Production build | `npm run build` | Pass. 9 HTML pages, `404.html`, `robots.txt` |
| Browser tests | `npm run test:e2e` | **56 / 56 passed** |
| Full pipeline from clean | `npm run check` | Exit code 0 |

**What the browser tests cover:** every route (status, single H1, unique title, meta); desktop navigation and `aria-current`; mobile menu (tap, Escape, keyboard); every home page call to action; the solution and pilot links prefilling the form; footer links; in-page anchors; the skip link; the unknown-route 404; contact form behaviour (empty submission, invalid email, a valid enquiry *not* sent and the visitor told so, the keyboard-only path, nothing written to browser storage). Also tested:

- no horizontal overflow on all 8 pages at 360, 390, 430, 768, 1024, 1440 and 1920 px;
- axe WCAG 2.2 AA plus best-practice rules on every page, the form in its error state and the open mobile menu: **0 violations**;
- reduced motion;
- every internal link resolving to a real page, no broken images, and self-hosted fonts loading;
- metadata present in the static HTML, structured data limited to verified fields, security headers present, no cookies or third-party hosts;
- a scan of the rendered text for invented emails, phone numbers, GSTIN/CIN patterns and unsupported claims.

Every browser test also fails on any console error (CSP violations included), uncaught exception or failed request.

**Lighthouse 13.6.0**, run against the local production build:

| Page | Mode | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|---|
| Home | Mobile | 99 | 100 | 100 | 100 | 1.9 s | 0 |
| CivicSetu | Mobile | 99 | 100 | 100 | 100 | 2.0 s | 0 |
| Contact | Mobile | 100 | 100 | 100 | 100 | 0.8 s | 0 |
| Home | Desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 |
| CivicSetu | Desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Contact | Desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 |

Scores on a real host will differ somewhat with network and CDN conditions. Re-run after deploying.

**Bundle:** the main JavaScript is 90 KB gzipped (React, router, layout and home page); other pages load as separate chunks of 1–6 KB, preloaded on their own HTML page. Two fonts total 73 KB. The whole `dist/` is 760 KB.

**Sitemap and canonical URLs** were checked with a test domain (`VITE_SITE_URL=https://www.example.in`): all 8 pages listed, canonical and `og:url` correct, the 404 page excluded and marked `noindex`.

### Lint exceptions (each commented in the code)

- `ContactForm.tsx`: the prefill from `?type=&subject=` runs in an effect on purpose. Reading the URL during render would break hydration of the prerendered page.
- `enquiry.ts`: a regular expression matches control characters, because its job is to strip them.
- `RouteMap.tsx`: `role="img"` on inline SVG is the correct accessible pattern; the lint rule's suggestion does not apply to SVG.

### NOT VERIFIED

- **Firefox and Safari.** Only Chromium was tested. No browser-specific APIs are used, but this has not been checked.
- **Real phones.** Touch was emulated in Chromium, not tested on a device.
- **Screen readers.** Automated axe checks only; no manual testing with NVDA, TalkBack or VoiceOver.
- **A live deployment.** Headers and clean URLs were verified through `vite preview`, which reads the same `_headers` file, but not on Cloudflare Pages or Netlify themselves.
- **A real contact endpoint.** The sending path is unit-tested with a mocked server only.
- **CivicSetu's own tests.** The "Tested" labels rely on the project's reported test results, which were not re-run here.

## 6. Security review

- Strict Content Security Policy: scripts, styles, fonts, images and connections are allowed from the site's own origin only. The build fails if prerendering ever produces an inline script.
- Also set: `frame-ancestors 'none'` and `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy, a restrictive `Permissions-Policy`, COOP, and HSTS without `includeSubDomains`.
- No secrets anywhere. The three `VITE_` variables are public by design, and `.env.example` warns about this.
- No `dangerouslySetInnerHTML` anywhere; the linter enforces this. All user input is rendered as text by React.
- Contact form: client validation, normalisation and control-character stripping; HTTPS-only endpoints; no cookies sent; a 15-second timeout; generic error messages only. Spam protection is a honeypot field plus a minimum fill time, and the elapsed time is sent so the server can apply it too. Nothing is stored in `localStorage`.
- Not yet possible: server-side validation, rate limiting and CORS. They belong to the endpoint you connect; the README lists exactly what it must do.

## 7. Accessibility notes

- One H1 per page and a logical heading order, with landmarks: header, main navigation, main, footer.
- A skip link; focus moves to the main content after each navigation, so screen readers hear the new page.
- Visible focus on every interactive element, white on dark sections.
- Colour pairs were checked against AA. The brand teal `#138C83` is only 4.1:1 on white, so it is used for decoration; teal text and buttons use `#0E6F68` (6.0:1).
- Form errors appear in a focused summary with links to each field, inline messages connected through `aria-describedby`, and `aria-invalid` on fields.
- The single animation, the hero route, is disabled under `prefers-reduced-motion`.
