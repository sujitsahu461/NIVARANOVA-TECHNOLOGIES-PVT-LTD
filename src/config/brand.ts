/**
 * NivaraNova logo artwork (Concept 05, "Iconic Corporate Emblem").
 *
 * The emblem shapes were measured from the approved design. This file is the
 * single source for the logo: the site draws it in src/components/ui/Logo.tsx
 * and scripts/generate-brand-assets.mjs draws the PNG icons from it.
 * It must stay free of imports so Node can load it directly.
 */

/** Logo colours, taken from the artwork. They are separate from the UI colour tokens. */
export const brandColors = {
  black: '#0f0f11',
  blue: '#1068e3',
  white: '#ffffff',
} as const

/** The emblem, drawn on a 308 × 222 grid. */
export const emblem = {
  width: 308,
  height: 222,
  /** Black plate with 45° cuts at the top-left and bottom-right corners. */
  plate: 'M49 0H308V171L257 222H0V49Z',
  /**
   * "NNT" in white: two Ns that share their middle stem, with the second N's
   * right stem doubling as the start of the T's bar.
   */
  letters: 'M27 49H50.5L104.5 127V49H128L182 127V49H282.5V73H208.5V173H185L131 95V173H107.5L53.5 95V173H27Z',
  /** The T's stem in blue, cut by a 45° slash. */
  stem: 'M233 73H255.5V108L233 130.5ZM233 150.5L255.5 128V173H233Z',
} as const

/**
 * The wordmark and lockup text, in the artwork's proportions. Units are those
 * of the wordmark's own grid: "NIVARANOVA" is 284 wide with capitals 20 tall,
 * and the line below is 230 wide with capitals 8.5 tall, 15 below it.
 */
export const wordmark = {
  width: 284,
  name: 'NIVARANOVA',
  nameCapHeight: 20,
  subline: 'TECHNOLOGIES PRIVATE LIMITED',
  sublineWidth: 230,
  sublineCapHeight: 8.5,
  sublineGap: 15,
  /** Manrope's capital height as a share of its font size. */
  fontCapHeight: 0.72,
} as const

/** The emblem as standalone SVG markup, for favicons and generated images. */
export function emblemSvg(attributes = ''): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${emblem.width} ${emblem.height}" ${attributes}>` +
    `<path d="${emblem.plate}" fill="${brandColors.black}"/>` +
    `<path d="${emblem.letters}" fill="${brandColors.white}"/>` +
    `<path d="${emblem.stem}" fill="${brandColors.blue}"/>` +
    `</svg>`
  )
}
