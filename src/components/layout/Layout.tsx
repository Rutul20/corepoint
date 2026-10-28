import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

/**
 * On navigation: scroll to the #hash target if there is one, otherwise to the
 * top. Reloads keep the browser's own scroll restoration.
 */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  const firstRender = useRef(true)
  useEffect(() => {
    const isFirst = firstRender.current
    firstRender.current = false
    if (hash) {
      let cancelled = false
      const jump = () => {
        if (!cancelled) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' })
      }
      const frame = requestAnimationFrame(jump)
      // The web font can shift the layout after the first frame.
      void document.fonts?.ready.then(jump)
      return () => {
        cancelled = true
        cancelAnimationFrame(frame)
      }
    }
    if (!isFirst) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
}

export function Layout() {
  useScrollOnNavigate()
  usePageMeta()
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
