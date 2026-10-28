export interface WebGLCapability {
  /** A WebGL context can be created at all. */
  supported: boolean
  /**
   * The device looks constrained: software rendering, very few CPU cores or
   * the user's data-saver setting. The 3D view then waits for an explicit click.
   */
  constrained: boolean
}

let cached: WebGLCapability | null = null

interface NavigatorWithConnection extends Navigator {
  connection?: { saveData?: boolean }
}

export function getWebGLCapability(): WebGLCapability {
  if (cached) return cached
  if (typeof document === 'undefined') return { supported: false, constrained: true }

  let supported: boolean
  let softwareOnly = false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    supported = gl !== null
    if (supported) {
      const strict = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
      softwareOnly = strict === null
      strict?.getExtension('WEBGL_lose_context')?.loseContext()
    }
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    supported = false
  }

  const nav = navigator as NavigatorWithConnection
  const saveData = nav.connection?.saveData === true
  const fewCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 2

  cached = { supported, constrained: softwareOnly || saveData || fewCores }
  return cached
}
