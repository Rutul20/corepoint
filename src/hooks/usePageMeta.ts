import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { fileUrl, pageUrl, siteConfig } from '../config/site'
import { pageMeta } from '../data/pages'

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

/**
 * Keeps the <title>, description, canonical URL and social preview tags in
 * step with the current route. Static per-page HTML generated at build time
 * carries the same values for crawlers and link previews.
 */
export function usePageMeta(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    // Static hosts such as GitHub Pages add a trailing slash to page URLs.
    const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
    const meta = pageMeta(path)
    const title = meta?.title ?? `Page not found | ${siteConfig.name}`
    const description = meta?.description ?? siteConfig.description
    const url = pageUrl(path)
    const image = fileUrl(meta?.image ?? siteConfig.ogImage)

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url)
  }, [pathname])
}
