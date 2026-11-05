import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readTheme, setTheme, subscribeToTheme, THEME_STORAGE_KEY, toggleTheme } from './theme'

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is light until the visitor chooses otherwise', () => {
    expect(readTheme()).toBe('light')
  })

  it('switches to dark and remembers the choice', () => {
    setTheme('dark')
    expect(readTheme()).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('toggles back to light', () => {
    setTheme('dark')
    toggleTheme()
    expect(readTheme()).toBe('light')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('still switches when the browser blocks storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is blocked', 'SecurityError')
    })
    setTheme('dark')
    expect(readTheme()).toBe('dark')
  })

  it('tells subscribers about changes, including ones made in another tab', () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToTheme(onChange)

    setTheme('dark')
    expect(onChange).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: 'light' }))
    expect(readTheme()).toBe('light')
    expect(onChange).toHaveBeenCalledTimes(2)

    unsubscribe()
    setTheme('dark')
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
