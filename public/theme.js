/*
 * Applies a saved dark theme before the page paints, so a dark page never
 * flashes light first. index.html loads this as an ordinary blocking script in
 * <head>. It cannot be inline: the site's Content Security Policy only runs
 * scripts from the site itself. The key must match THEME_STORAGE_KEY in
 * src/lib/theme.ts.
 */
try {
  if (localStorage.getItem('nivaranova-theme') === 'dark') document.documentElement.dataset.theme = 'dark'
} catch {
  // Storage is blocked (for example in some private windows), so the page stays light.
}
