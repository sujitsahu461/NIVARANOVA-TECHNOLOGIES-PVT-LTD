import type { SVGProps } from 'react'

/**
 * Brand marks that Lucide no longer ships, drawn in the same 24px, 2px-stroke
 * style so they sit evenly beside Lucide icons. Inline, so no third-party request.
 */
type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </Svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </Svg>
  )
}

/** A speech bubble with a handset inside, as in the WhatsApp mark. */
export function WhatsAppIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path
        stroke="none"
        fill="currentColor"
        d="M9.1 7.9c.35-.35.9-.3 1.13.14l.86 1.62c.17.32.1.71-.15.96l-.47.47c.5 1.1 1.38 1.98 2.48 2.48l.47-.47c.25-.25.64-.32.96-.15l1.62.86c.44.23.49.78.14 1.13l-.62.62c-.62.62-1.55.8-2.35.43-2.15-.98-3.87-2.7-4.85-4.85-.37-.8-.19-1.73.43-2.35z"
      />
    </Svg>
  )
}
