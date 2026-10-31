import { Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { navItems, routeMeta } from '../../content/routes'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Wordmark } from '../ui/Logo'

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative py-2 text-[0.9375rem] font-medium transition-colors duration-150',
    'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors',
    isActive ? 'text-ink after:bg-teal' : 'text-muted hover:text-ink after:bg-transparent',
  )

const mobileLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex min-h-12 items-center justify-between border-b border-line py-3 font-display text-lg font-semibold',
    isActive ? 'text-teal-strong' : 'text-ink',
  )

export function Header() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  // Close the menu after any navigation, including browser back and forward.
  // Adjusting state during render avoids an extra effect pass.
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link to="/" className="rounded-sm" aria-label="NivaraNova Technologies, home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className={desktopLink}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <ButtonLink to={routeMeta.contact.path}>Get in touch</ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-[0.9375rem] font-medium text-ink lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          {open ? 'Close' : 'Menu'}
        </button>
      </Container>

      <div
        id={menuId}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-white shadow-[0_24px_48px_-24px_rgb(16_27_43/0.25)] lg:hidden"
      >
        <Container className="pt-2 pb-8">
          <nav aria-label="Main">
            <ul>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === '/'} className={mobileLink}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <ButtonLink to={routeMeta.contact.path} size="lg" className="mt-6 w-full">
            Get in touch
          </ButtonLink>
        </Container>
      </div>
    </header>
  )
}
