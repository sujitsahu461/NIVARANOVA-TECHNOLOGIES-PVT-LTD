import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/cn'

/** The middle of the switch (its icon, or its on/off pill in the menu): where the drop lands. */
function rippleOrigin(button: HTMLElement) {
  const target = button.querySelector<HTMLElement>('[data-ripple-origin]') ?? button
  const box = target.getBoundingClientRect()
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
}

interface ThemeToggleProps {
  /** "icon" for the header bar; "menu" for a full-width row in the mobile menu. */
  variant?: 'icon' | 'menu'
  className?: string
}

/**
 * Switches the site between its light and dark themes. Screen readers hear
 * "Dark mode, toggle button, pressed / not pressed". What it shows (the moon
 * or sun icon, the switch position) is drawn by CSS from the page's theme, so
 * it is right from the first paint, before the page has hydrated.
 */
export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  if (variant === 'menu') {
    return (
      <button
        type="button"
        aria-pressed={dark}
        onClick={(event) => toggleTheme(rippleOrigin(event.currentTarget))}
        className={cn(
          'flex min-h-12 w-full items-center justify-between gap-4 border-b border-line py-3 text-left font-display text-lg font-semibold text-ink',
          className,
        )}
      >
        Dark mode
        {/* A switch: off (knob left) in the light theme, on (knob right, teal) in the dark. */}
        <span
          aria-hidden="true"
          data-ripple-origin
          className="relative inline-flex h-6 w-10 shrink-0 items-center rounded-full bg-muted transition-colors dark:bg-teal-strong"
        >
          <span className="absolute left-0.5 size-5 rounded-full bg-surface transition-transform dark:translate-x-4" />
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={dark}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={(event) => toggleTheme(rippleOrigin(event.currentTarget))}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-mist hover:text-ink',
        className,
      )}
    >
      <Moon className="size-5 dark:hidden" aria-hidden="true" strokeWidth={1.75} />
      <Sun className="hidden size-5 dark:block" aria-hidden="true" strokeWidth={1.75} />
    </button>
  )
}
