import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef, type ComponentRef } from 'react'
import { MathUtils, Vector3 } from 'three'
import type { ComponentId, Vec3, ViewerConfig } from '../../../types/product'
import type { ViewerController } from '../viewerTypes'

interface CameraAnimation {
  fromPosition: Vector3
  toPosition: Vector3
  fromTarget: Vector3
  toTarget: Vector3
  progress: number
  duration: number
}

interface CameraRigProps {
  viewer: ViewerConfig
  selectedId: ComponentId | null
  controllerRef: { current: ViewerController | null }
  reducedMotion: boolean
  onUserInteract: () => void
}

const UP = new Vector3(0, 1, 0)
const BASE_FOV = 30
/** Horizontal field of view at the reference 5:4 stage; kept on narrower (portrait) stages so the chair still fits. */
const MIN_HORIZONTAL_FOV = 2 * Math.atan(Math.tan(MathUtils.degToRad(BASE_FOV) / 2) * 1.25)

/** Widens the vertical field of view on tall stages (phones) so the whole chair stays in frame. */
export function ResponsiveFov() {
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const get = useThree((state) => state.get)

  useEffect(() => {
    const { camera, invalidate } = get()
    if (!('fov' in camera) || height === 0) return
    const aspect = width / height
    const fitted = MathUtils.radToDeg(2 * Math.atan(Math.tan(MIN_HORIZONTAL_FOV / 2) / aspect))
    camera.fov = Math.min(55, Math.max(BASE_FOV, fitted))
    camera.updateProjectionMatrix()
    invalidate()
  }, [width, height, get])

  return null
}
const vec = (v: Vec3) => new Vector3(v[0], v[1], v[2])
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Orbit controls plus smooth, interruptible camera moves for presets,
 * component close-ups and the toolbar buttons. Moves are instant when the
 * visitor prefers reduced motion.
 */
export function CameraRig({ viewer, selectedId, controllerRef, reducedMotion, onUserInteract }: CameraRigProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)
  const animation = useRef<CameraAnimation | null>(null)
  const get = useThree((state) => state.get)
  const initialTarget = (viewer.cameraPresets.find((p) => p.id === viewer.defaultPreset) ?? viewer.cameraPresets[0]).target

  const flyTo = useCallback(
    (position: Vector3, target: Vector3, duration = 1.1) => {
      const controls = controlsRef.current
      if (!controls) return
      const { camera, invalidate } = get()
      if (reducedMotion) {
        animation.current = null
        camera.position.copy(position)
        controls.target.copy(target)
        controls.update()
        invalidate()
        return
      }
      animation.current = {
        fromPosition: camera.position.clone(),
        toPosition: position,
        fromTarget: controls.target.clone(),
        toTarget: target,
        progress: 0,
        duration,
      }
      invalidate()
    },
    [get, reducedMotion],
  )

  useEffect(() => {
    controllerRef.current = {
      goToPreset: (id) => {
        const preset = viewer.cameraPresets.find((p) => p.id === id)
        if (preset) flyTo(vec(preset.position), vec(preset.target))
      },
      orbit: (degrees) => {
        const controls = controlsRef.current
        if (!controls) return
        const target = controls.target.clone()
        const offset = get().camera.position.clone().sub(target).applyAxisAngle(UP, MathUtils.degToRad(degrees))
        flyTo(target.clone().add(offset), target, 0.6)
      },
      zoom: (factor) => {
        const controls = controlsRef.current
        if (!controls) return
        const target = controls.target.clone()
        const offset = get().camera.position.clone().sub(target)
        const distance = MathUtils.clamp(offset.length() * factor, viewer.minDistance, viewer.maxDistance)
        flyTo(target.clone().add(offset.setLength(distance)), target, 0.5)
      },
    }
    return () => {
      controllerRef.current = null
    }
  }, [controllerRef, flyTo, get, viewer])

  // Fly to the close-up of whichever component is selected.
  useEffect(() => {
    if (!selectedId) return
    const hotspot = viewer.hotspots.find((h) => h.componentId === selectedId)
    if (hotspot) flyTo(vec(hotspot.focus.position), vec(hotspot.focus.target))
  }, [selectedId, viewer, flyTo])

  useFrame((state, delta) => {
    const current = animation.current
    const controls = controlsRef.current
    if (!current || !controls) return
    // Clamp delta: with on-demand rendering the first frame after idling can report a long gap.
    current.progress = Math.min(1, current.progress + Math.min(delta, 0.1) / current.duration)
    const eased = easeInOutCubic(current.progress)
    state.camera.position.lerpVectors(current.fromPosition, current.toPosition, eased)
    controls.target.lerpVectors(current.fromTarget, current.toTarget, eased)
    controls.update()
    if (current.progress < 1) state.invalidate()
    else animation.current = null
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={initialTarget}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.7}
      zoomSpeed={0.8}
      minDistance={viewer.minDistance}
      maxDistance={viewer.maxDistance}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 - 0.03}
      onStart={() => {
        animation.current = null
        onUserInteract()
      }}
    />
  )
}
