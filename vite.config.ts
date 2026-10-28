import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { basePath, fileUrl, pageUrl, siteConfig } from './src/config/site.ts'
import { allPages, type PageMeta } from './src/data/pages.ts'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Rewrites the title, description, canonical URL and social preview tags of a built HTML page. */
function applyMeta(html: string, page: PageMeta): string {
  const url = pageUrl(page.path)
  const image = fileUrl(page.image ?? siteConfig.ogImage)
  const set = (pattern: RegExp, value: string) => (source: string) => source.replace(pattern, (_match, start: string, end: string) => `${start}${escapeHtml(value)}${end}`)
  const steps = [
    set(/(<title>)[\s\S]*?(<\/title>)/, page.title),
    set(/(<meta name="description" content=")[^"]*(")/, page.description),
    set(/(<meta property="og:title" content=")[^"]*(")/, page.title),
    set(/(<meta property="og:description" content=")[^"]*(")/, page.description),
    set(/(<meta property="og:url" content=")[^"]*(")/, url),
    set(/(<meta property="og:image" content=")[^"]*(")/, image),
    set(/(<meta name="twitter:title" content=")[^"]*(")/, page.title),
    set(/(<meta name="twitter:description" content=")[^"]*(")/, page.description),
    set(/(<meta name="twitter:image" content=")[^"]*(")/, image),
    set(/(<link rel="canonical" href=")[^"]*(")/, url),
  ]
  return steps.reduce((source, step) => step(source), html)
}

/**
 * Fills the %SITE_*% placeholders in index.html from src/config/site.ts, then
 * after the build writes one HTML file per page (dist/<route>/index.html) with
 * that page's title, description and preview image, plus 404.html,
 * robots.txt and sitemap.xml. Crawlers and link previews (WhatsApp, Facebook)
 * see the right details for every page without running JavaScript, and static
 * hosts without URL rewrites (GitHub Pages) can serve every page directly.
 */
function siteMeta(): Plugin {
  let outDir = 'dist'
  const values: Record<string, string> = {
    SITE_NAME: siteConfig.name,
    SITE_TITLE: siteConfig.title,
    SITE_DESCRIPTION: siteConfig.description,
    SITE_URL: siteConfig.url.replace(/\/+$/, ''),
    SITE_LOCALE: siteConfig.locale,
    SITE_OG_IMAGE: fileUrl(siteConfig.ogImage),
  }

  return {
    name: 'site-meta',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/%(SITE_[A-Z_]+)%/g, (match, key: string) => (key in values ? escapeHtml(values[key]) : match))
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${fileUrl('/sitemap.xml')}\n` })
      const urls = allPages.map((page) => `  <url><loc>${pageUrl(page.path)}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
    async closeBundle() {
      const indexFile = join(outDir, 'index.html')
      let template: string
      try {
        template = await readFile(indexFile, 'utf8')
      } catch {
        return // Not a client build (e.g. dev server).
      }
      for (const page of allPages) {
        const html = applyMeta(template, page)
        if (page.path === '/') {
          await writeFile(indexFile, html)
        } else {
          const dir = join(outDir, ...page.path.split('/').filter(Boolean))
          await mkdir(dir, { recursive: true })
          await writeFile(join(dir, 'index.html'), html)
        }
      }
      // Unknown URLs: GitHub Pages serves 404.html, which loads the app and shows its "page not found" page.
      const notFound = template
        .replace(/<title>[\s\S]*?<\/title>/, `<title>Page not found | ${escapeHtml(siteConfig.name)}</title>`)
        .replace('<head>', '<head>\n    <meta name="robots" content="noindex" />')
      await writeFile(join(outDir, '404.html'), notFound)
    },
  }
}

export default defineConfig({
  // '/corepoint/' on GitHub Pages; '/' once siteConfig.url is a custom domain.
  base: basePath,
  plugins: [react(), tailwindcss(), siteMeta()],
  build: {
    // The 3D viewer chunk (three.js) is ~1 MB raw / ~280 kB gzipped but is only
    // loaded on demand, so it is allowed to exceed the default warning size.
    chunkSizeWarningLimit: 1100,
  },
})
