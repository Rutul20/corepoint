/**
 * Catalogue data model. Every page is rendered from data matching these
 * types (see src/data/), so adding a chair, a piece of equipment or a service
 * means adding one object rather than changing components.
 */

export type ComponentId =
  | 'headrest'
  | 'backrest'
  | 'seat'
  | 'armrests'
  | 'instrument-tray'
  | 'delivery-system'
  | 'control-panel'
  | 'operating-light'
  | 'spittoon'
  | 'foot-control'
  | 'chair-base'

export type Vec3 = [number, number, number]

/** A point on an image, as a percentage of its width and height. */
export interface ImagePoint {
  x: number
  y: number
}

/**
 * An image slot. Real photos set `src`; anything without one shows a
 * labelled "photo to follow" placeholder.
 */
export interface ProductImageAsset {
  id: string
  /** Path under /public, e.g. '/images/products/aura-400-1-1000.jpeg'. */
  src?: string
  srcSet?: string
  width?: number
  height?: number
  alt: string
  caption?: string
  /** Label for the placeholder shown while `src` is missing. */
  placeholderLabel?: string
  /** Photographed on a plain white background, so it can blend into light page backgrounds. */
  onWhite?: boolean
}

/** A selectable part of the flagship chair in the product explorer. */
export interface ProductComponent {
  id: ComponentId
  name: string
  description: string
  benefits: string[]
  /** Turn off components the product does not have. They disappear from the explorer and 3D model. */
  enabled: boolean
  /** Optional close-up photo shown when the component is selected. Without one, the main photo is zoomed in on the hotspot. */
  closeUp?: ProductImageAsset
}

export interface CameraView {
  position: Vec3
  target: Vec3
}

export type CameraPresetId = 'overview' | 'front' | 'side' | 'rear' | 'top'

export interface CameraPreset extends CameraView {
  id: CameraPresetId
  label: string
}

export interface Hotspot {
  componentId: ComponentId
  /** Anchor point in 3D model space (metres, Y up). */
  position: Vec3
  /** Camera framing used when the component is selected. */
  focus: CameraView
  /** Anchor point on the explorer's product photo. Leave out for parts not visible in the photo. */
  photo?: ImagePoint
}

/**
 * Where the 3D model comes from.
 * - `prototype`: the simplified procedural chair in ChairPrototype.tsx. Always badged as a prototype.
 * - `gltf`: the real product model, e.g. `/models/aura-500.glb`.
 */
export type ModelSource =
  | { kind: 'prototype' }
  | {
      kind: 'gltf'
      url: string
      scale?: number
      position?: Vec3
      rotation?: Vec3
      /** Mesh or node names in the GLB that make up each component, used for click-to-select and highlighting. */
      meshMap: Partial<Record<ComponentId, string[]>>
      /** Material names in the GLB that the colour picker should recolour. */
      upholsteryMaterials: string[]
    }

export interface ViewerConfig {
  model: ModelSource
  /** The photo used for the 2D explorer view and as the 3D poster. */
  photo: ProductImageAsset
  cameraPresets: CameraPreset[]
  defaultPreset: CameraPresetId
  hotspots: Hotspot[]
  minDistance: number
  maxDistance: number
}

export interface ProductFeature {
  id: string
  category: string
  title: string
  description: string
  benefit: string
  components: ComponentId[]
  image: ProductImageAsset
}

export type PendingReason = 'tbc' | 'contact'

export interface SpecItem {
  id: string
  label: string
  /** Verified value, or null while it is not yet confirmed. */
  value: string | null
  /** What to show while `value` is null: "Specification to be confirmed" or "Contact us for details". */
  pending?: PendingReason
  note?: string
}

export interface SpecGroup {
  id: string
  title: string
  items: SpecItem[]
}

export type GalleryCategory = 'aura-500' | 'aura-range' | 'clinic' | 'equipment' | 'service' | 'brochures'

export interface GalleryItem extends ProductImageAsset {
  category: GalleryCategory
  /** Page the photo belongs to, e.g. '/dental-chairs/aura-400'. */
  href?: string
}

export interface UpholsteryColour {
  id: string
  name: string
  hex: string
  /** False for colours not yet confirmed as available to order. */
  confirmed: boolean
  note?: string
}

export type BenefitIcon = 'positioning' | 'instruments' | 'controls' | 'working-positions' | 'appearance' | 'workflow'

export interface PractitionerBenefit {
  id: string
  icon: BenefitIcon
  title: string
  description: string
}

/**
 * A version of a chair with its own photos and specification, such as the
 * Aura-500 Premium Plus (trolley) and Overhanging. Single-version chairs
 * have exactly one variant.
 */
export interface ProductVariant {
  id: string
  /** e.g. 'Premium Plus'. */
  name: string
  /** e.g. 'Mobile trolley delivery unit'. */
  label: string
  description: string
  image: ProductImageAsset
  gallery: ProductImageAsset[]
  /** Key points from the brochure, shown as a checklist. */
  highlights: string[]
  /** Short brochure badges, e.g. 'Save space'. */
  badges?: string[]
  specifications: SpecGroup[]
  /** Brochure pages as images. */
  brochure: ProductImageAsset[]
}

export type EnquiryTypeId = 'product-information' | 'demo' | 'quotation' | 'brochure' | 'dealer' | 'support' | 'other'

export type ChairFactKey =
  | 'operation'
  | 'controls'
  | 'programs'
  | 'delivery'
  | 'light'
  | 'spittoon'
  | 'footControl'
  | 'upholstery'
  | 'stool'

/** Short comparable facts for the Compare page. Missing keys show as "Not stated". */
export type ChairFacts = Partial<Record<ChairFactKey, string>>

/** Interactive flagship content: 3D explorer, feature stories and benefits. */
export interface ProductExperience {
  viewer: ViewerConfig
  components: ProductComponent[]
  features: ProductFeature[]
  benefits: PractitionerBenefit[]
  colours: UpholsteryColour[]
  defaultColourId: string
}

export interface Product {
  id: string
  slug: string
  name: string
  /** 'Aura' for the own-label range, otherwise null. */
  series: string | null
  /** Brand shown on the page. */
  brand: string
  /** True for Corepoint Healthcare's own-label chairs. */
  ownLabel: boolean
  category: string
  /** Positioning line, e.g. 'Our flagship'. */
  tagline: string
  /** One-line summary for cards and meta descriptions (under ~155 characters). */
  summary: string
  description: string
  /** At least one. The first is shown by default. */
  variants: ProductVariant[]
  /** Short comparable facts for the Compare page. */
  facts: ChairFacts
  /** Present only on the flagship chair. */
  experience?: ProductExperience
  /**
   * Only set to true once name, description and images are verified.
   * Product structured data (JSON-LD) is emitted only when true.
   */
  verified: boolean
}

export type EquipmentCategoryId = 'imaging' | 'instruments' | 'clinic' | 'sterilisation'

export interface EquipmentCategory {
  id: EquipmentCategoryId
  name: string
  description: string
}

export interface EquipmentFact {
  label: string
  value: string
}

export interface EquipmentItem {
  id: string
  name: string
  brand: string | null
  categoryId: EquipmentCategoryId
  summary: string
  image: ProductImageAsset
  facts: EquipmentFact[]
}

export interface Service {
  id: string
  name: string
  summary: string
  points: string[]
  image?: ProductImageAsset
  enquiryType: EnquiryTypeId
}
