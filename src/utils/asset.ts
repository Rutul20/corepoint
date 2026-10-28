/**
 * Data refers to files in /public with root paths such as '/images/x.webp'.
 * These helpers add the base path the site is served from (e.g. '/corepoint/'
 * on GitHub Pages), so the same data works on any host.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function asset(path: string): string {
  return path.startsWith('/') ? `${base}${path}` : path
}

export function assetSrcSet(srcSet: string | undefined): string | undefined {
  return srcSet
    ?.split(',')
    .map((entry) => {
      const [url, ...descriptor] = entry.trim().split(/\s+/)
      return [asset(url), ...descriptor].join(' ')
    })
    .join(', ')
}
