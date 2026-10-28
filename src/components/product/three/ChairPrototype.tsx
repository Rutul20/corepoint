import { Shape, Vector2 } from 'three'
import type { Vec3 } from '../../../types/product'
import { Block, ComponentGroup, Cyl, Finish, Tube } from './ChairParts'

/**
 * SIMPLIFIED PROCEDURAL PROTOTYPE, NOT THE ACTUAL PRODUCT.
 *
 * A stand-in built from basic shapes so the viewer, hotspots and camera
 * presets can be developed and tested before the real GLB model exists. It
 * follows the same layout as the 2D illustration (metres, Y up, feet to +X,
 * clinician side +Z). Replace it by pointing `chairViewer.model` in
 * src/data/viewer.ts at the real model file.
 */

const BACKREST_PIVOT: Vec3 = [-0.261, 0.611, 0]
const BACKREST_TILT: Vec3 = [0, 0, 0.611]
const LEG_REST_PIVOT: Vec3 = [0.367, 0.606, 0]
const LEG_REST_TILT: Vec3 = [0, 0, -0.297]
const LIGHT_HEAD_POSITION: Vec3 = [-0.611, 1.83, 0]
const LIGHT_HEAD_TILT: Vec3 = [0, 0, -0.314]

// Tapered lift column, extruded from a trapezoid.
const COLUMN_SHAPE = new Shape([new Vector2(-0.2, 0), new Vector2(0.2, 0), new Vector2(0.139, 0.433), new Vector2(-0.139, 0.433)])
const COLUMN_EXTRUDE = { depth: 0.26, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.018, bevelSegments: 4, curveSegments: 4 }

// Spittoon bowl profile (radius, height), revolved around Y.
const BOWL_PROFILE = [
  [0, 0],
  [0.04, 0],
  [0.07, 0.025],
  [0.088, 0.065],
  [0.09, 0.08],
  [0.08, 0.08],
  [0.074, 0.06],
  [0.058, 0.03],
  [0.03, 0.015],
  [0, 0.015],
].map(([r, y]) => new Vector2(r, y))

const LIGHT_ARM: Vec3[] = [
  [-0.4875, 1.95, -0.56],
  [-0.49, 2.03, -0.42],
  [-0.56, 2.045, -0.2],
  [-0.611, 2.03, -0.02],
]
const SPOUT: Vec3[] = [
  [-0.3, 0.78, -0.5],
  [-0.3, 0.9, -0.5],
  [-0.32, 0.93, -0.47],
  [-0.34, 0.92, -0.44],
]
const DELIVERY_ARM: Vec3[] = [
  [0.667, 0.94, 0.45],
  [0.56, 0.955, 0.43],
  [0.42, 0.955, 0.36],
  [0.32, 0.955, 0.3],
]
const FOOT_CABLE: Vec3[] = [
  [0.86, 0.01, 0.35],
  [0.62, 0.008, 0.34],
  [0.32, 0.008, 0.24],
  [0.16, 0.012, 0.13],
]

const HOLDER_X = [0.144, 0.183, 0.222, 0.261]
const HOSES: Vec3[][] = HOLDER_X.map((x, i) => [
  [x, 0.92, 0.385],
  [x - 0.005, 0.8, 0.4],
  [x + 0.06, 0.72 - i * 0.025, 0.41],
  [x + 0.13, 0.8, 0.39],
  [x + 0.14, 0.92, 0.36],
])

export function ChairPrototype() {
  return (
    <group>
      {/* Chair base: floor plate, lift column, seat carrier */}
      <ComponentGroup id="chair-base">
        <Block size={[1.0, 0.04, 0.56]} radius={0.015} finish="metal" position={[0.056, 0.02, 0]} />
        <mesh position={[0, 0.039, -0.13]}>
          <extrudeGeometry args={[COLUMN_SHAPE, COLUMN_EXTRUDE]} />
          <Finish kind="shell" />
        </mesh>
        <Block size={[0.694, 0.05, 0.42]} radius={0.02} finish="shell" position={[0.014, 0.492, 0]} />
      </ComponentGroup>

      {/* Seat and leg rest */}
      <ComponentGroup id="seat">
        <Block size={[0.672, 0.056, 0.54]} radius={0.025} finish="shell" position={[0.053, 0.539, 0]} />
        <Block size={[0.678, 0.105, 0.56]} radius={0.045} finish="upholstery" position={[0.061, 0.608, 0]} />
        <group position={LEG_REST_PIVOT} rotation={LEG_REST_TILT}>
          <Block size={[0.633, 0.039, 0.48]} radius={0.015} finish="shell" position={[0.317, -0.031, 0]} />
          <Block size={[0.644, 0.089, 0.52]} radius={0.04} finish="upholstery" position={[0.306, 0.006, 0]} />
          <Block size={[0.033, 0.156, 0.44]} radius={0.014} finish="shell" position={[0.644, 0.05, 0]} />
        </group>
      </ComponentGroup>

      {/* Backrest */}
      <ComponentGroup id="backrest" position={BACKREST_PIVOT} rotation={BACKREST_TILT}>
        <Block size={[0.1, 0.728, 0.54]} radius={0.045} finish="upholstery" position={[0, 0.364, 0]} />
        <Block size={[0.061, 0.656, 0.5]} radius={0.028} finish="shell" position={[-0.064, 0.367, 0]} />
      </ComponentGroup>

      {/* Headrest, mounted at the top of the backrest */}
      <ComponentGroup id="headrest" position={BACKREST_PIVOT} rotation={BACKREST_TILT}>
        <group position={[0, 0.728, 0]}>
          <Block size={[0.022, 0.122, 0.03]} radius={0.01} finish="metal" position={[-0.05, 0.044, 0.08]} />
          <Block size={[0.022, 0.122, 0.03]} radius={0.01} finish="metal" position={[-0.05, 0.044, -0.08]} />
          <Block size={[0.044, 0.156, 0.26]} radius={0.02} finish="shell" position={[-0.061, 0.189, 0]} />
          <Block size={[0.094, 0.194, 0.3]} radius={0.04} finish="upholstery" position={[0.003, 0.192, 0]} />
        </group>
      </ComponentGroup>

      {/* Armrests */}
      <ComponentGroup id="armrests">
        {[0.33, -0.33].map((z) => (
          <group key={z}>
            <Block size={[0.417, 0.044, 0.07]} radius={0.02} finish="upholstery" position={[0.047, 0.744, z]} />
            <Cyl radius={0.014} height={0.111} finish="metal" position={[-0.103, 0.672, z]} />
          </group>
        ))}
      </ComponentGroup>

      {/* Spittoon and water unit (assistant side) */}
      <ComponentGroup id="spittoon">
        <Block size={[0.219, 0.742, 0.18]} radius={0.03} finish="shell" position={[-0.39, 0.41, -0.52]} />
        <Block size={[0.06, 0.03, 0.12]} radius={0.012} finish="shell" position={[-0.367, 0.77, -0.46]} />
        <mesh position={[-0.367, 0.781, -0.4]}>
          <latheGeometry args={[BOWL_PROFILE, 48]} />
          <Finish kind="ceramic" />
        </mesh>
        <Tube points={SPOUT} radius={0.008} finish="metal" />
      </ComponentGroup>

      {/* Operating light on a post above the water unit */}
      <ComponentGroup id="operating-light">
        <Cyl radius={0.016} height={1.17} finish="metal" position={[-0.4875, 1.366, -0.56]} />
        <mesh position={[-0.4875, 1.95, -0.56]}>
          <sphereGeometry args={[0.026, 24, 16]} />
          <Finish kind="shell" />
        </mesh>
        <Tube points={LIGHT_ARM} radius={0.018} finish="shell" />
        <mesh position={[-0.611, 2.03, -0.02]}>
          <sphereGeometry args={[0.024, 24, 16]} />
          <Finish kind="shell" />
        </mesh>
        <Cyl radius={0.012} height={0.16} finish="metal" position={[-0.611, 1.95, 0]} />
        <group position={LIGHT_HEAD_POSITION} rotation={LIGHT_HEAD_TILT}>
          {/* Rectangular 8-LED panel with side handles, as on the Aura-500. */}
          <Block size={[0.3, 0.06, 0.2]} radius={0.025} finish="shell" />
          <Block size={[0.27, 0.012, 0.17]} radius={0.006} finish="glass" position={[0, -0.031, 0]} />
          {[-0.09, -0.03, 0.03, 0.09].flatMap((x) =>
            [-0.04, 0.04].map((z) => (
              <mesh key={`${x}:${z}`} position={[x, -0.038, z]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.018, 0.018, 0.006, 24]} />
                <Finish kind="lens" />
              </mesh>
            )),
          )}
          <Block size={[0.03, 0.05, 0.16]} radius={0.012} finish="dark" position={[-0.17, -0.005, 0]} />
          <Block size={[0.03, 0.05, 0.16]} radius={0.012} finish="dark" position={[0.17, -0.005, 0]} />
        </group>
      </ComponentGroup>

      {/* Delivery unit (clinician side) */}
      <ComponentGroup id="delivery-system">
        <Block size={[0.189, 0.039, 0.24]} radius={0.015} finish="metal" position={[0.667, 0.02, 0.45]} />
        <Block size={[0.044, 0.917, 0.044]} radius={0.02} finish="shell" position={[0.667, 0.486, 0.45]} />
        <mesh position={[0.667, 0.945, 0.45]}>
          <sphereGeometry args={[0.03, 24, 16]} />
          <Finish kind="shell" />
        </mesh>
        <Tube points={DELIVERY_ARM} radius={0.022} finish="shell" />
        <Block size={[0.389, 0.083, 0.24]} radius={0.035} finish="shell" position={[0.306, 0.958, 0.3]} />
        {HOLDER_X.map((x) => (
          <group key={x}>
            <Cyl radius={0.011} height={0.067} finish="dark" position={[x, 1.033, 0.38]} />
            <Cyl radius={0.007} height={0.07} finish="metal" position={[x, 1.1, 0.38]} />
          </group>
        ))}
        {HOSES.map((points, i) => (
          <Tube key={i} points={points} radius={0.0075} finish="dark" />
        ))}
      </ComponentGroup>

      {/* Control panel on the front of the delivery unit */}
      <ComponentGroup id="control-panel">
        <Block size={[0.172, 0.04, 0.012]} radius={0.004} finish="glass" position={[0.369, 0.958, 0.422]} />
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.31 + i * 0.028, 0.958, 0.429]}>
            <sphereGeometry args={[0.0045, 12, 8]} />
            <Finish kind="led" />
          </mesh>
        ))}
      </ComponentGroup>

      {/* Instrument tray */}
      <ComponentGroup id="instrument-tray">
        <Cyl radius={0.008} height={0.035} finish="metal" position={[0.403, 1.016, 0.28]} />
        <Block size={[0.211, 0.017, 0.16]} radius={0.006} finish="metal" position={[0.411, 1.04, 0.28]} />
      </ComponentGroup>

      {/* Foot control */}
      <ComponentGroup id="foot-control">
        <Cyl radius={0.07} radiusBottom={0.09} height={0.05} finish="dark" position={[0.944, 0.025, 0.35]} />
        <Cyl radius={0.055} height={0.012} finish="metal" position={[0.944, 0.056, 0.35]} />
        <Tube points={FOOT_CABLE} radius={0.006} finish="dark" />
      </ComponentGroup>
    </group>
  )
}
