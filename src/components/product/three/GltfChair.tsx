import { useGLTF } from '@react-three/drei'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Mesh, MeshStandardMaterial, type Material, type Object3D } from 'three'
import type { ComponentId, ModelSource } from '../../../types/product'
import { asset } from '../../../utils/asset'
import { HIGHLIGHT_COLOUR, useChairLook } from './chairLook'

type GltfSource = Extract<ModelSource, { kind: 'gltf' }>

function materialsOf(mesh: Mesh): Material[] {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material]
}

/** Walks up from a mesh to the first ancestor named in the mesh map. */
function componentFor(object: Object3D | null, lookup: Map<string, ComponentId>): ComponentId | null {
  for (let node = object; node; node = node.parent) {
    const id = lookup.get(node.name)
    if (id) return id
  }
  return null
}

/**
 * Loads the real product model (GLB/GLTF). Meshes are mapped to components by
 * name through `meshMap`, so clicking and highlighting work the same way as
 * on the prototype. Materials named in `upholsteryMaterials` follow the colour picker.
 */
export function GltfChair({ source }: { source: GltfSource }) {
  const { scene } = useGLTF(asset(source.url))
  const look = useChairLook()
  const invalidate = useThree((state) => state.invalidate)

  // Own copy of the scene and its materials, so highlighting never leaks into the cached original.
  const model = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((node) => {
      if (node instanceof Mesh) {
        node.material = Array.isArray(node.material) ? node.material.map((m: Material) => m.clone()) : node.material.clone()
      }
    })
    return root
  }, [scene])

  const lookup = useMemo(() => {
    const map = new Map<string, ComponentId>()
    for (const [id, names] of Object.entries(source.meshMap) as [ComponentId, string[] | undefined][]) {
      names?.forEach((name) => map.set(name, id))
    }
    return map
  }, [source.meshMap])

  const { upholstery, selectedId, hoveredId, isEnabled } = look
  useEffect(() => {
    model.traverse((node) => {
      if (!(node instanceof Mesh)) return
      const id = componentFor(node, lookup)
      if (id && !isEnabled(id)) node.visible = false
      const glow = id && id === selectedId ? 0.32 : id && id === hoveredId ? 0.14 : 0
      for (const material of materialsOf(node)) {
        if (!(material instanceof MeshStandardMaterial)) continue
        if (source.upholsteryMaterials.includes(material.name)) material.color.set(upholstery)
        material.emissive.set(glow > 0 ? HIGHLIGHT_COLOUR : '#000000')
        material.emissiveIntensity = glow
      }
    })
    invalidate()
  }, [model, lookup, upholstery, selectedId, hoveredId, isEnabled, source.upholsteryMaterials, invalidate])

  return (
    <primitive
      object={model}
      scale={source.scale ?? 1}
      position={source.position ?? [0, 0, 0]}
      rotation={source.rotation ?? [0, 0, 0]}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        const id = componentFor(event.object, lookup)
        if (!id) return
        event.stopPropagation()
        look.onSelect(id)
      }}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        const id = componentFor(event.object, lookup)
        if (!id) return
        event.stopPropagation()
        look.onHover(id)
      }}
      onPointerOut={() => look.onHover(null)}
    />
  )
}
