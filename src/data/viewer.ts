import type { ViewerConfig } from '../types/product.ts'
import { productPhoto } from './images.ts'

/**
 * 3D viewer setup: which model to load, camera presets and hotspot anchors.
 *
 * To use the real product model:
 *   1. Put the file in public/models/, e.g. public/models/aura-500.glb
 *   2. Change `model` below to:
 *        { kind: 'gltf', url: '/models/aura-500.glb', meshMap: { headrest: ['Headrest'] }, upholsteryMaterials: ['Upholstery'] }
 *   3. Adjust hotspot `position` values to sit on the real model's surfaces.
 *
 * Coordinates are in metres with Y up. The chair's feet point to +X and the
 * clinician (delivery unit) side is +Z.
 */
export const aura500Viewer: ViewerConfig = {
  model: { kind: 'prototype' },
  photo: productPhoto('aura-500-premium-plus-1', 'Aura-500 Premium Plus dental chair with trolley delivery unit, 8-LED light and spittoon'),
  defaultPreset: 'overview',
  minDistance: 1.1,
  maxDistance: 7,
  cameraPresets: [
    { id: 'overview', label: 'Overview', position: [2.6, 1.75, 3.2], target: [0.08, 0.95, 0] },
    { id: 'front', label: 'Front', position: [4.4, 1.35, 0.3], target: [0.05, 0.95, 0] },
    { id: 'side', label: 'Side', position: [0.1, 1.1, 4.5], target: [0.08, 0.95, 0] },
    { id: 'rear', label: 'Rear', position: [-3.8, 1.7, -1.6], target: [0, 0.95, 0] },
    { id: 'top', label: 'Top', position: [0.2, 4.8, 0.9], target: [0.08, 0.7, 0] },
  ],
  hotspots: [
    {
      componentId: 'headrest',
      position: [-0.79, 1.37, 0.17],
      focus: { position: [0.25, 1.8, 1.7], target: [-0.76, 1.3, 0] },
      photo: { x: 27.5, y: 36.5 },
    },
    {
      componentId: 'backrest',
      position: [-0.5, 1.05, 0.29],
      focus: { position: [0.75, 1.45, 2.1], target: [-0.45, 0.95, 0] },
      photo: { x: 32, y: 48 },
    },
    {
      componentId: 'seat',
      position: [0.29, 0.63, 0.3],
      focus: { position: [1.2, 1.35, 1.9], target: [0.2, 0.62, 0] },
      photo: { x: 50, y: 61 },
    },
    {
      componentId: 'armrests',
      position: [0, 0.77, 0.37],
      focus: { position: [0.95, 1.25, 1.75], target: [0.05, 0.74, 0.3] },
      photo: { x: 35.5, y: 58 },
    },
    {
      componentId: 'instrument-tray',
      position: [0.47, 1.07, 0.3],
      focus: { position: [1.25, 1.75, 1.45], target: [0.41, 1.03, 0.28] },
      photo: { x: 72.5, y: 50.5 },
    },
    {
      componentId: 'delivery-system',
      position: [0.2, 0.8, 0.42],
      focus: { position: [1.25, 1.3, 1.8], target: [0.3, 0.9, 0.32] },
      photo: { x: 65, y: 72 },
    },
    {
      componentId: 'control-panel',
      position: [0.37, 0.96, 0.44],
      focus: { position: [0.9, 1.25, 1.55], target: [0.37, 0.95, 0.42] },
      photo: { x: 64.5, y: 53.5 },
    },
    {
      componentId: 'operating-light',
      position: [-0.61, 1.83, 0.16],
      focus: { position: [0.65, 2.3, 2.0], target: [-0.6, 1.75, 0] },
      photo: { x: 45, y: 22.5 },
    },
    {
      componentId: 'spittoon',
      position: [-0.37, 0.9, -0.4],
      focus: { position: [0.35, 1.55, -1.95], target: [-0.37, 0.83, -0.42] },
      photo: { x: 46, y: 42 },
    },
    {
      componentId: 'foot-control',
      position: [0.94, 0.09, 0.35],
      focus: { position: [1.95, 0.8, 1.45], target: [0.94, 0.05, 0.35] },
    },
    {
      componentId: 'chair-base',
      position: [0, 0.26, 0.17],
      focus: { position: [1.25, 0.75, 2.05], target: [0.05, 0.25, 0] },
      photo: { x: 44, y: 80 },
    },
  ],
}
