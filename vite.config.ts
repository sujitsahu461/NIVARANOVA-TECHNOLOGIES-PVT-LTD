import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'

/**
 * Reads the `/*` block of public/_headers so `vite preview` (and therefore the
 * Playwright tests) serve pages under the same security headers as production.
 * Strict-Transport-Security is skipped because preview runs over plain HTTP,
 * and upgrade-insecure-requests is dropped for the same reason.
 */
function productionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  let inSiteBlock = false
  for (const line of readFileSync(new URL('./public/_headers', import.meta.url), 'utf8').split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      inSiteBlock = line.trim() === '/*'
      continue
    }
    if (!inSiteBlock) continue
    const separator = line.indexOf(':')
    const name = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (name === 'Strict-Transport-Security') continue
    headers[name] = name === 'Content-Security-Policy' ? value.replace(/;\s*upgrade-insecure-requests/, '') : value
  }
  return headers
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Fixed at build time so prerendered HTML and the hydrated client agree.
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    // Lets the prerender step add <link rel="modulepreload"> for each page's chunk.
    manifest: true,
    target: 'es2022',
  },
  preview: {
    headers: productionHeaders(),
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
    css: false,
  },
})
