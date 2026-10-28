import { Outlines, RoundedBox } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useContext, useMemo, type ReactNode } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import type { ComponentId, Vec3 } from '../../../types/product'
import { HIGHLIGHT_COLOUR, PartStateContext, useChairLook } from './chairLook'

export type FinishKind = 'upholstery' | 'shell' | 'metal' | 'dark' | 'glass' | 'ceramic' | 'lens' | 'led'

/** Material for a part, with highlight glow and outline when its component is selected. */
export function Finish({ kind }: { kind: FinishKind }) {
  const { upholstery } = useChairLook()
  const { selected, hovered } = useContext(PartStateContext)
  const glow = selected ? 0.32 : hovered ? 0.14 : 0
  const emissive = glow > 0 ? HIGHLIGHT_COLOUR : '#000000'

  let material: ReactNode
  switch (kind) {
    case 'upholstery':
      material = (
        <meshPhysicalMaterial
          color={upholstery}
          roughness={0.62}
          sheen={0.6}
          sheenRoughness={0.5}
          sheenColor="#ffffff"
          clearcoat={0.05}
          emissive={emissive}
          emissiveIntensity={glow}
        />
      )
      break
    case 'shell':
      material = (
        <meshPhysicalMaterial
          color="#F2F3F4"
          roughness={0.3}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          emissive={emissive}
          emissiveIntensity={glow}
        />
      )
      break
    case 'metal':
      material = <meshStandardMaterial color="#C4CAD0" metalness={0.85} roughness={0.3} emissive={emissive} emissiveIntensity={glow} />
      break
    case 'dark':
      material = <meshStandardMaterial color="#2B2F34" metalness={0.15} roughness={0.55} emissive={emissive} emissiveIntensity={glow} />
      break
    case 'glass':
      material = <meshPhysicalMaterial color="#15181C" roughness={0.12} clearcoat={1} emissive={emissive} emissiveIntensity={glow} />
      break
    case 'ceramic':
      material = <meshPhysicalMaterial color="#FBFBFB" roughness={0.15} clearcoat={1} emissive={emissive} emissiveIntensity={glow} />
      break
    case 'lens':
      material = <meshStandardMaterial color="#FFF8E6" emissive="#FFF1D0" emissiveIntensity={0.7} roughness={0.2} />
      break
    case 'led':
      material = <meshStandardMaterial color="#7CC3DB" emissive="#7CC3DB" emissiveIntensity={1.4} />
      break
  }

  return (
    <>
      {material}
      {selected && <Outlines thickness={0.006} color={HIGHLIGHT_COLOUR} />}
    </>
  )
}

interface ComponentGroupProps {
  id: ComponentId
  position?: Vec3
  rotation?: Vec3
  children: ReactNode
}

/** Groups the meshes of one component: hidden when disabled, clickable, and highlighted when selected. */
export function ComponentGroup({ id, position, rotation, children }: ComponentGroupProps) {
  const look = useChairLook()
  const state = useMemo(
    () => ({ selected: look.selectedId === id, hovered: look.hoveredId === id }),
    [look.selectedId, look.hoveredId, id],
  )
  if (!look.isEnabled(id)) return null

  return (
    <PartStateContext.Provider value={state}>
      <group
        position={position}
        rotation={rotation}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation()
          look.onSelect(id)
        }}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation()
          look.onHover(id)
        }}
        onPointerOut={() => look.onHover(null)}
      >
        {children}
      </group>
    </PartStateContext.Provider>
  )
}

interface BlockProps {
  size: Vec3
  radius: number
  finish: FinishKind
  position?: Vec3
  rotation?: Vec3
}

/** Rounded box. `radius` must be less than half the smallest dimension. */
export function Block({ size, radius, finish, position, rotation }: BlockProps) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={4} position={position} rotation={rotation}>
      <Finish kind={finish} />
    </RoundedBox>
  )
}

interface CylProps {
  radius: number
  radiusBottom?: number
  height: number
  finish: FinishKind
  position?: Vec3
  rotation?: Vec3
}

export function Cyl({ radius, radiusBottom, height, finish, position, rotation }: CylProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radiusBottom ?? radius, height, 40]} />
      <Finish kind={finish} />
    </mesh>
  )
}

interface TubeProps {
  points: Vec3[]
  radius: number
  finish: FinishKind
}

/** A smooth tube through `points`, used for hoses, cables and arms. */
export function Tube({ points, radius, finish }: TubeProps) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points])
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, radius, 12, false]} />
      <Finish kind={finish} />
    </mesh>
  )
}
