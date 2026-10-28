import { useReducedMotion } from 'framer-motion'
import { Box, Camera, Info, LoaderCircle, Minus, Plus, RotateCcw, RotateCw, Undo2 } from 'lucide-react'
import { Suspense, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useNearViewport } from '../../hooks/useNearViewport'
import type { CameraPresetId, ComponentId, Product, ProductExperience } from '../../types/product'
import { cn } from '../../utils/cn'
import { getWebGLCapability } from '../../utils/webgl'
import { ComponentPanel } from './ComponentPanel'
import { HotspotMarker } from './HotspotMarker'
import { ProductConfigurator } from './ProductConfigurator'
import { ProductImage } from './ProductImage'
import { LazyProductViewer3D, prefetchProductViewer3D } from './viewerLoader'
import { ViewerErrorBoundary } from './ViewerErrorBoundary'
import type { ViewerController } from './viewerTypes'

type ViewMode = 'photo' | '3d'
type ViewerStatus = 'loading' | 'ready' | 'failed'

/**
 * Product explorer. Opens on the real product photo with numbered hotspots;
 * the 3D view (a labelled prototype until the real model is supplied) is one
 * click away and is downloaded in the background once the explorer is near
 * the viewport. Selection and the component panel are shared by both views.
 */
export function ProductExplorer({ product, experience }: { product: Product; experience: ProductExperience }) {
  const { viewer } = experience
  const enabledIds = new Set(experience.components.filter((c) => c.enabled).map((c) => c.id))
  const hotspots = viewer.hotspots.filter((h) => enabledIds.has(h.componentId))
  const components = hotspots
    .map((h) => experience.components.find((c) => c.id === h.componentId))
    .filter((c): c is NonNullable<typeof c> => c !== undefined)

  const [selectedId, setSelectedId] = useState<ComponentId | null>(null)
  const [colourId, setColourId] = useState(experience.defaultColourId)
  const colour = experience.colours.find((c) => c.id === colourId) ?? experience.colours[0]

  const [capability] = useState(getWebGLCapability)
  const stageRef = useRef<HTMLDivElement>(null)
  const near = useNearViewport(stageRef, '400px')
  const [mode, setMode] = useState<ViewMode>('photo')
  const [status, setStatus] = useState<ViewerStatus>('loading')
  const [progress, setProgress] = useState(0)
  const [activePreset, setActivePreset] = useState<CameraPresetId | null>(viewer.defaultPreset)
  const controllerRef = useRef<ViewerController | null>(null)
  const reducedMotion = useReducedMotion() ?? false
  const coarsePointer = useMediaQuery('(pointer: coarse)')

  const can3d = capability.supported && status !== 'failed'
  const mount3d = mode === '3d' && can3d
  const show3d = mount3d && status === 'ready'
  const isPrototype = viewer.model.kind === 'prototype'

  // Download the 3D viewer in the background so switching is instant.
  useEffect(() => {
    if (near && capability.supported && !capability.constrained) prefetchProductViewer3D()
  }, [near, capability])

  const selectMode = (next: ViewMode) => {
    if (next === mode) return
    setStatus('loading')
    setMode(next)
  }

  const handleReady = useCallback(() => setStatus('ready'), [])
  const handleError = useCallback((error: Error) => {
    console.error(error)
    setStatus('failed')
  }, [])
  const handleInteract = useCallback(() => setActivePreset(null), [])

  const goToPreset = (id: CameraPresetId) => {
    setActivePreset(id)
    controllerRef.current?.goToPreset(id)
  }

  const reset = () => {
    setSelectedId(null)
    goToPreset(viewer.defaultPreset)
  }

  const onStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Escape clears the selection while focus is inside the explorer.
    if (event.key === 'Escape' && selectedId) {
      setSelectedId(null)
      return
    }
    // Arrow keys and +/- drive the 3D camera, but only when the stage itself has focus.
    if (!show3d || event.target !== event.currentTarget) return
    const controller = controllerRef.current
    if (!controller) return
    const actions: Record<string, () => void> = {
      ArrowLeft: () => controller.orbit(-20),
      ArrowRight: () => controller.orbit(20),
      '+': () => controller.zoom(0.8),
      '=': () => controller.zoom(0.8),
      '-': () => controller.zoom(1.25),
    }
    const action = actions[event.key]
    if (action) {
      event.preventDefault()
      setActivePreset(null)
      action()
    }
  }

  // Let the page scroll normally over the 3D view; zoom needs Ctrl/⌘ + scroll (or a trackpad pinch).
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !show3d) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) event.stopPropagation()
    }
    stage.addEventListener('wheel', onWheel, { capture: true })
    return () => stage.removeEventListener('wheel', onWheel, { capture: true })
  }, [show3d])

  const selectedComponent = components.find((c) => c.id === selectedId) ?? null
  const selectedPoint = hotspots.find((h) => h.componentId === selectedId)?.photo
  const photo = viewer.photo
  const ratio = (photo.width ?? 3) / (photo.height ?? 2)

  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
      <div className="lg:col-span-8">
        <div
          ref={stageRef}
          role="group"
          aria-roledescription="product viewer"
          aria-label={
            show3d
              ? `Interactive 3D prototype of the ${product.name}. Use the arrow keys to rotate and plus or minus to zoom.`
              : `Photo of the ${product.name} with ${hotspots.filter((h) => h.photo).length} component hotspots.`
          }
          tabIndex={0}
          onKeyDown={onStageKeyDown}
          className="studio-backdrop relative aspect-[4/5] overflow-hidden border border-line [container-type:size] sm:aspect-[4/3]"
        >
          {/* Product photo with hotspots: the default view, and the fallback when 3D is unavailable. */}
          {!show3d && (
            <div className="absolute inset-0 flex items-center justify-center pb-16 pt-14">
              <div className="relative" style={{ aspectRatio: `${ratio}`, width: `min(100cqw - 1.5rem, calc((100cqh - 7.5rem) * ${ratio}))` }}>
                {/* Spotlight: fade everything except the selected part into the backdrop. */}
                <div
                  className={cn('h-full w-full', photo.onWhite && 'mix-blend-multiply')}
                  style={
                    selectedPoint
                      ? {
                          maskImage: `radial-gradient(circle at ${selectedPoint.x}% ${selectedPoint.y}%, #000 0, #000 9%, rgba(0,0,0,0.28) 24%)`,
                          WebkitMaskImage: `radial-gradient(circle at ${selectedPoint.x}% ${selectedPoint.y}%, #000 0, #000 9%, rgba(0,0,0,0.28) 24%)`,
                        }
                      : undefined
                  }
                >
                  <ProductImage image={photo} fit="contain" sizes="(min-width: 1024px) 60vw, 100vw" />
                </div>
                {hotspots.map((hotspot, index) =>
                  hotspot.photo ? (
                    <HotspotMarker
                      key={hotspot.componentId}
                      index={index}
                      label={components[index].name}
                      selected={selectedId === hotspot.componentId}
                      onSelect={() => setSelectedId(hotspot.componentId)}
                      style={{ left: `${hotspot.photo.x}%`, top: `${hotspot.photo.y}%` }}
                    />
                  ) : null,
                )}
              </div>
            </div>
          )}

          {mount3d && (
            <div className={cn('absolute inset-0 transition-opacity duration-700', show3d ? 'opacity-100' : 'pointer-events-none opacity-0')}>
              <ViewerErrorBoundary onError={handleError}>
                <Suspense fallback={null}>
                  <LazyProductViewer3D
                    viewer={viewer}
                    components={components}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    upholstery={colour.hex}
                    controllerRef={controllerRef}
                    reducedMotion={reducedMotion}
                    onReady={handleReady}
                    onProgress={setProgress}
                    onError={handleError}
                    onUserInteract={handleInteract}
                  />
                </Suspense>
              </ViewerErrorBoundary>
            </div>
          )}

          {/* Top bar: what the visitor is looking at, and the view switch. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-4">
            <ModelBadge
              text={show3d ? (isPrototype ? 'Interactive prototype · not the actual product' : '3D product model') : `${product.name} · product photo`}
              detail={
                show3d && isPrototype
                  ? `A simplified 3D stand-in for exploring the layout of a dental unit. Its shapes and proportions differ from the real ${product.name}; the photo view shows the actual chair.`
                  : 'Select a numbered point to see what each part of the chair does.'
              }
            />
            {capability.supported && status !== 'failed' && (
              <div role="group" aria-label="View" className="pointer-events-auto flex shrink-0 rounded-full border border-line bg-white/90 p-0.5 shadow-sm backdrop-blur">
                <ModeButton active={mode === 'photo'} onClick={() => selectMode('photo')} icon={<Camera className="h-3.5 w-3.5" />} label="Photo" />
                <ModeButton active={mode === '3d'} onClick={() => selectMode('3d')} icon={<Box className="h-3.5 w-3.5" />} label="3D" />
              </div>
            )}
          </div>

          {mount3d && !show3d && status === 'loading' && (
            <div className="absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-medium text-ink shadow-md">
              <LoaderCircle className="h-4 w-4 animate-spin text-tech-ink" aria-hidden="true" />
              <span role="status">Loading 3D view{progress > 0 && progress < 100 ? ` · ${Math.round(progress)}%` : '…'}</span>
            </div>
          )}

          {status === 'failed' && (
            <p role="status" className="absolute inset-x-3 top-14 z-30 rounded-sm bg-white/95 px-3 py-2 text-[13px] text-muted shadow-sm sm:inset-x-auto sm:left-4">
              The 3D view isn&rsquo;t available on this device, so you&rsquo;re seeing the product photo instead.
            </p>
          )}

          {/* Bottom toolbar. */}
          <div className="absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
            {show3d ? (
              <>
                <div role="group" aria-label="Camera angle" className="flex max-w-full overflow-x-auto rounded-full border border-line bg-white/90 p-0.5 shadow-sm backdrop-blur">
                  {viewer.cameraPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => goToPreset(preset.id)}
                      aria-pressed={activePreset === preset.id}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors',
                        activePreset === preset.id ? 'bg-ink text-white' : 'text-muted hover:text-ink',
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 rounded-full border border-line bg-white/90 p-0.5 shadow-sm backdrop-blur">
                  <ToolButton label="Rotate left" onClick={() => controllerRef.current?.orbit(-30)} icon={<RotateCcw className="h-4 w-4" />} />
                  <ToolButton label="Rotate right" onClick={() => controllerRef.current?.orbit(30)} icon={<RotateCw className="h-4 w-4" />} />
                  <ToolButton label="Zoom out" onClick={() => controllerRef.current?.zoom(1.25)} icon={<Minus className="h-4 w-4" />} />
                  <ToolButton label="Zoom in" onClick={() => controllerRef.current?.zoom(0.8)} icon={<Plus className="h-4 w-4" />} />
                  <ToolButton label="Reset view" onClick={reset} icon={<Undo2 className="h-4 w-4" />} />
                </div>
              </>
            ) : (
              <>
                <p className="rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-muted backdrop-blur">Select a numbered point to learn more</p>
                {selectedId && (
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-ink shadow-sm"
                  >
                    <Undo2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear selection
                  </button>
                )}
              </>
            )}
          </div>

          {show3d && (
            <p aria-hidden="true" className="pointer-events-none absolute right-4 top-14 z-20 hidden text-[11px] text-muted sm:block">
              {coarsePointer ? 'Drag to rotate · pinch to zoom' : 'Drag to rotate · Ctrl + scroll to zoom'}
            </p>
          )}
        </div>

        {selectedComponent && (
          <p className="mt-3 text-[13px] text-muted lg:hidden">
            Showing <span className="font-semibold text-ink">{selectedComponent.name}</span>. Details below.
          </p>
        )}
      </div>

      <aside aria-label="Component details" className="space-y-5 lg:col-span-4">
        <ComponentPanel components={components} viewer={viewer} selectedId={selectedId} onSelect={setSelectedId} />
        <ProductConfigurator
          colours={experience.colours}
          selectedId={colour.id}
          onChange={(id) => {
            setColourId(id)
            if (capability.supported && mode === 'photo') selectMode('3d')
          }}
          note={capability.supported ? 'Choosing a colour previews it on the 3D prototype.' : undefined}
        />
      </aside>
    </div>
  )
}

function ModelBadge({ text, detail }: { text: string; detail: string }) {
  return (
    <div className="group pointer-events-auto relative min-w-0">
      <p
        tabIndex={0}
        aria-describedby="model-badge-detail"
        className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-line bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink-soft shadow-sm backdrop-blur"
      >
        <Info className="h-3.5 w-3.5 shrink-0 text-tech-ink" aria-hidden="true" />
        <span className="truncate">{text}</span>
      </p>
      <p
        id="model-badge-detail"
        role="tooltip"
        className="invisible absolute left-0 top-full mt-2 w-64 rounded-sm bg-ink px-3 py-2 text-[12px] leading-snug text-white opacity-0 shadow-lg transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {detail}
      </p>
    </div>
  )
}

function ModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label === '3D' ? '3D prototype view' : 'Photo view'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors',
        active ? 'bg-ink text-white' : 'text-muted hover:text-ink',
      )}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  )
}

function ToolButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
