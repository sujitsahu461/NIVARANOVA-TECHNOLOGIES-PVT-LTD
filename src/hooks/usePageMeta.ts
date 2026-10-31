import { useEffect } from 'react'
import { documentTitle } from '../content/routes'
import type { RouteMeta } from '../types'

function setMeta(name: string, content: string | null) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (content === null) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.append(element)
  }
  element.content = content
}

/**
 * Keeps <title>, description and robots in step during client-side navigation.
 * The prerendered HTML already carries the full set of tags for first load and crawlers.
 */
export function usePageMeta(meta: RouteMeta) {
  useEffect(() => {
    document.title = documentTitle(meta)
    setMeta('description', meta.description)
    setMeta('robots', meta.noindex ? 'noindex' : null)
  }, [meta])
}
