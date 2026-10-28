import type { CameraPresetId, ComponentId, ProductComponent, ViewerConfig } from '../../types/product'

/** Imperative camera commands the explorer toolbar sends to the 3D viewer. */
export interface ViewerController {
  goToPreset: (id: CameraPresetId) => void
  /** Orbits horizontally around the current target by `degrees`. */
  orbit: (degrees: number) => void
  /** Multiplies the camera distance by `factor` (< 1 zooms in). */
  zoom: (factor: number) => void
}

export interface ProductViewer3DProps {
  viewer: ViewerConfig
  /** Enabled components only. */
  components: ProductComponent[]
  selectedId: ComponentId | null
  onSelect: (id: ComponentId) => void
  upholstery: string
  controllerRef: { current: ViewerController | null }
  reducedMotion: boolean
  /** Called once the model has loaded and the first frame is drawn. */
  onReady: () => void
  /** Loading progress of the model file, 0–100. */
  onProgress: (progress: number) => void
  /** Called when WebGL fails (for example the GPU context is lost). */
  onError: (error: Error) => void
  /** Called when the visitor starts dragging or zooming the camera. */
  onUserInteract: () => void
}
