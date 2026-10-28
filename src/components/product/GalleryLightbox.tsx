import { AnimatePresence, m } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { useDialog } from '../../hooks/useDialog'
import type { ProductImageAsset } from '../../types/product'
import { cn } from '../../utils/cn'
import { ProductImage } from './ProductImage'

interface GalleryLightboxProps {
  items: ProductImageAsset[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

/** Full-screen image viewer with keyboard, swipe and click-to-zoom. */
export function GalleryLightbox({ items, index, onClose, onIndexChange }: GalleryLightboxProps) {
  return (
    <AnimatePresence>
      {index !== null && items[index] && (
        <LightboxDialog key="lightbox" items={items} index={index} onClose={onClose} onIndexChange={onIndexChange} />
      )}
    </AnimatePresence>
  )
}

function LightboxDialog({ items, index, onClose, onIndexChange }: GalleryLightboxProps & { index: number }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [direction, setDirection] = useState(0)
  const swipeStart = useRef<number | null>(null)
  useDialog(dialogRef, true, onClose)

  const item = items[index]
  const total = items.length

  const go = useCallback(
    (delta: number) => {
      setZoom(null)
      setDirection(delta)
      onIndexChange((index + delta + total) % total)
    },
    [index, total, onIndexChange],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [go])

  const relativePoint = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 }
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStart.current = event.clientX
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (start === null) return
    const dx = event.clientX - start
    if (!zoom && Math.abs(dx) > 50) {
      go(dx < 0 ? 1 : -1)
      return
    }
    if (Math.abs(dx) < 6) setZoom(zoom ? null : relativePoint(event))
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom && event.pointerType === 'mouse') setZoom(relativePoint(event))
  }

  return (
    <m.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[70] flex flex-col bg-night/95 text-white backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="text-sm tabular-nums text-white/70" aria-live="polite">
          <span className="font-semibold text-white">{index + 1}</span> / {total}
          {item.caption && <span className="ml-3 hidden text-white/70 sm:inline">{item.caption}</span>}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom(zoom ? null : { x: 50, y: 50 })}
            aria-label={zoom ? 'Zoom out' : 'Zoom in'}
            aria-pressed={zoom !== null}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          >
            {zoom ? <ZoomOut className="h-5 w-5" aria-hidden="true" /> : <ZoomIn className="h-5 w-5" aria-hidden="true" />}
          </button>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close image viewer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6 sm:px-20">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <m.figure
            key={item.id}
            className="m-0 flex w-full flex-col items-center"
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={cn(
                'relative h-[calc(100svh-11rem)] w-full max-w-[1200px] touch-pan-y overflow-hidden',
                item.onWhite ? 'bg-white' : 'bg-transparent',
                zoom ? 'cursor-zoom-out' : 'cursor-zoom-in',
              )}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerMove={onPointerMove}
            >
              <div
                className="h-full w-full transition-transform duration-300 ease-premium"
                style={{
                  transform: zoom ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : 'center',
                }}
              >
                <ProductImage image={item} priority sizes="90vw" fit="contain" />
              </div>
            </div>
            {item.caption && <figcaption className="mt-3 text-center text-sm text-white/75">{item.caption}</figcaption>}
          </m.figure>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:left-5"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-5"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </m.div>
  )
}
