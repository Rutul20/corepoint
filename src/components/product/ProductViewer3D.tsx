import { ContactShadows, Environment, Lightformer, useCursor, useProgress } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { NeutralToneMapping, type Group } from 'three'
import type { ComponentId, Hotspot } from '../../types/product'
import { HotspotMarker } from './HotspotMarker'
import { CameraRig, ResponsiveFov } from './three/CameraRig'
import { ChairLookContext, type ChairLook } from './three/chairLook'
import { ChairPrototype } from './three/ChairPrototype'
import { HotspotProjector } from './three/Hotspots3D'
import type { ProductViewer3DProps } from './viewerTypes'

// The GLTF/Draco/Meshopt loaders are only downloaded once a real model is configured.
const GltfChair = lazy(() => import('./three/GltfChair').then((module) => ({ default: module.GltfChair })))

/**
 * The 3D product viewer. Loaded lazily (see viewerLoader.ts) so three.js is
 * only downloaded when the explorer is about to be seen.
 */
export default function ProductViewer3D(props: ProductViewer3DProps) {
  const { viewer, components, selectedId, onSelect, onError } = props
  const preset = viewer.cameraPresets.find((p) => p.id === viewer.defaultPreset) ?? viewer.cameraPresets[0]
  const markers = useRef(new Map<ComponentId, HTMLElement>())
  const [occluded, setOccluded] = useState<Partial<Record<ComponentId, boolean>>>({})

  // React Three Fiber forces a context loss when the canvas unmounts (e.g. switching to 2D).
  // Only a loss while the viewer is still mounted counts as a failure.
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const handleOcclusion = useCallback((id: ComponentId, value: boolean) => setOccluded((current) => ({ ...current, [id]: value })), [])

  const enabled = useMemo(() => new Set(components.map((c) => c.id)), [components])
  const hotspots = useMemo(() => viewer.hotspots.filter((h) => enabled.has(h.componentId)), [viewer.hotspots, enabled])

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        frameloop="demand"
        camera={{ position: preset.position, fov: 30, near: 0.1, far: 50 }}
        aria-hidden="true"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = NeutralToneMapping
          gl.toneMappingExposure = 1.05
          gl.domElement.addEventListener(
            'webglcontextlost',
            (event) => {
              if (!mounted.current) return
              event.preventDefault()
              onError(new Error('WebGL context lost'))
            },
            { once: true },
          )
        }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ViewerScene {...props} hotspots={hotspots} enabled={enabled} markers={markers} onOcclusionChange={handleOcclusion} />
      </Canvas>

      {/* Hotspot markers: plain DOM over the canvas, positioned each frame by HotspotProjector. */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {hotspots.map((hotspot, index) => {
          const component = components.find((c) => c.id === hotspot.componentId)
          if (!component) return null
          const selected = selectedId === hotspot.componentId
          const hidden = Boolean(occluded[hotspot.componentId]) && !selected
          return (
            <div
              key={hotspot.componentId}
              ref={(element) => {
                if (element) markers.current.set(hotspot.componentId, element)
                else markers.current.delete(hotspot.componentId)
              }}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <HotspotMarker
                index={index}
                label={component.name}
                selected={selected}
                onSelect={() => onSelect(hotspot.componentId)}
                hidden={hidden}
                layout="inline"
                className="pointer-events-auto"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ViewerSceneProps extends ProductViewer3DProps {
  hotspots: Hotspot[]
  enabled: Set<ComponentId>
  markers: RefObject<Map<ComponentId, HTMLElement>>
  onOcclusionChange: (id: ComponentId, occluded: boolean) => void
}

function ViewerScene({
  viewer,
  selectedId,
  onSelect,
  upholstery,
  controllerRef,
  reducedMotion,
  onReady,
  onProgress,
  onUserInteract,
  hotspots,
  enabled,
  markers,
  onOcclusionChange,
}: ViewerSceneProps) {
  const chairRef = useRef<Group>(null)
  const [hoveredId, setHoveredId] = useState<ComponentId | null>(null)
  useCursor(hoveredId !== null)

  const look = useMemo<ChairLook>(
    () => ({
      upholstery,
      selectedId,
      hoveredId,
      isEnabled: (id) => enabled.has(id),
      onSelect,
      onHover: setHoveredId,
    }),
    [upholstery, selectedId, hoveredId, enabled, onSelect],
  )

  return (
    <ChairLookContext.Provider value={look}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 4]} intensity={1.5} />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 2, 1]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[5, 2, -1]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={0.8} position={[2, 3, 5]} scale={3} />
      </Environment>

      <Suspense fallback={<ProgressReporter onProgress={onProgress} />}>
        <group ref={chairRef}>{viewer.model.kind === 'gltf' ? <GltfChair source={viewer.model} /> : <ChairPrototype />}</group>
        <ContactShadows position={[0.05, 0.001, 0]} scale={4.5} blur={2.4} far={2.2} opacity={0.5} resolution={512} frames={1} color="#1b2026" />
        <HotspotProjector hotspots={hotspots} markers={markers} occluder={chairRef} onOcclusionChange={onOcclusionChange} />
        <ReadySignal onReady={onReady} />
      </Suspense>

      <ResponsiveFov />
      <CameraRig
        viewer={viewer}
        selectedId={selectedId}
        controllerRef={controllerRef}
        reducedMotion={reducedMotion}
        onUserInteract={onUserInteract}
      />
    </ChairLookContext.Provider>
  )
}

/** Reports model download progress while the Suspense boundary is waiting. */
function ProgressReporter({ onProgress }: { onProgress: (progress: number) => void }) {
  const { progress } = useProgress()
  useEffect(() => {
    onProgress(progress)
  }, [progress, onProgress])
  return null
}

/** Mounts once the model is ready, renders a frame, then tells the explorer to reveal the canvas. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    invalidate()
    const frame = requestAnimationFrame(() => onReady())
    return () => cancelAnimationFrame(frame)
  }, [invalidate, onReady])
  return null
}
