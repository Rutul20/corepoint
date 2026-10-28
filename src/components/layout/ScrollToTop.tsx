import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useScrolled } from '../../hooks/useScrolled'

/** Floating "back to top" button, shown once the visitor has scrolled down a screen or so. */
export function ScrollToTop() {
  const visible = useScrolled(700)
  const reducedMotion = useReducedMotion()

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    // Move keyboard focus back to the start of the page as well.
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          onClick={scrollUp}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-4 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-[0_10px_30px_-10px_rgba(20,22,25,0.35)] backdrop-blur transition-colors hover:border-ink hover:bg-ink hover:text-white sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </m.button>
      )}
    </AnimatePresence>
  )
}
