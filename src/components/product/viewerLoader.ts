import { lazy } from 'react'

/** Loads the 3D viewer chunk (three.js, React Three Fiber, Drei). Safe to call repeatedly. */
export const loadProductViewer3D = () => import('./ProductViewer3D')

export const LazyProductViewer3D = lazy(loadProductViewer3D)

/** Starts downloading the viewer in the background, e.g. when a visitor hovers "Explore the Chair". */
export function prefetchProductViewer3D(): void {
  void loadProductViewer3D()
}
