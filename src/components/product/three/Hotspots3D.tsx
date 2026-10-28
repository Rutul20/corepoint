import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import { Matrix4, Raycaster, Vector3, type Object3D } from 'three'
import type { ComponentId, Hotspot } from '../../../types/product'

interface HotspotProjectorProps {
  hotspots: Hotspot[]
  /** DOM markers rendered over the canvas, keyed by component. */
  markers: RefObject<Map<ComponentId, HTMLElement>>
  /** The model; markers whose line of sight it blocks are reported as occluded. */
  occluder: RefObject<Object3D | null>
  onOcclusionChange: (id: ComponentId, occluded: boolean) => void
}

const raycaster = new Raycaster()
const projected = new Vector3()
const point = new Vector3()
const direction = new Vector3()

/**
 * Keeps the HTML hotspot markers glued to their 3D anchors. Positions are
 * written straight to the DOM every rendered frame (no React re-render);
 * occlusion is re-checked only when the camera has moved.
 */
export function HotspotProjector({ hotspots, markers, occluder, onOcclusionChange }: HotspotProjectorProps) {
  const lastCamera = useRef(new Matrix4())
  const lastSize = useRef('')
  const occluded = useRef(new Map<ComponentId, boolean>())

  useFrame(({ camera, size }) => {
    const sizeKey = `${size.width}x${size.height}`
    const moved = !lastCamera.current.equals(camera.matrixWorld) || sizeKey !== lastSize.current
    if (!moved && occluded.current.size === hotspots.length) return

    for (const hotspot of hotspots) {
      const element = markers.current?.get(hotspot.componentId)
      if (!element) continue

      point.set(...hotspot.position)
      projected.copy(point).project(camera)
      const x = (projected.x * 0.5 + 0.5) * size.width
      const y = (-projected.y * 0.5 + 0.5) * size.height
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      element.style.opacity = '1'

      direction.copy(point).sub(camera.position)
      const distance = direction.length()
      raycaster.set(camera.position, direction.normalize())
      raycaster.far = distance - 0.03
      const blocked = occluder.current ? raycaster.intersectObject(occluder.current, true).length > 0 : false
      const isOccluded = blocked || projected.z > 1
      if (occluded.current.get(hotspot.componentId) !== isOccluded) {
        occluded.current.set(hotspot.componentId, isOccluded)
        onOcclusionChange(hotspot.componentId, isOccluded)
      }
    }

    lastCamera.current.copy(camera.matrixWorld)
    lastSize.current = sizeKey
  })

  return null
}
