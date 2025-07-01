import {Textbox, FabricImage, Rect} from 'fabric/es'
import {TEXTBOX_LOCKED_PROPS, IMAGE_PLACEHOLDER_PROPS} from '~/lib/canvas-props'

const FONT_SANS = 'Poppins'

// Define the structure for image spots in templates
export interface ImageSpot {
  id: string
  x: number
  y: number
  width: number
  height: number
  aspectRatio: number
  placeholderText: string
  isRequired: boolean
}

// Define the structure for text areas in templates
export interface TextArea {
  id: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  fontFamily: string
  fill: string
  textAlign: 'left' | 'center' | 'right'
  defaultText: string
  maxLength?: number
  isEditable: boolean
}

// Define the structure for background elements
export interface BackgroundElement {
  id: string
  type: 'rectangle' | 'circle' | 'line' | 'image'
  x: number
  y: number
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  locked: boolean // Cannot be modified by user
}

// Define a complete page template
export interface PageTemplate {
  id: string
  name: string
  description: string
  category: 'cover' | 'spread' | 'single'
  imageSpots: ImageSpot[]
  textAreas: TextArea[]
  backgroundElements: BackgroundElement[]
  backgroundColor: string
  previewImage?: string
}

// Define a complete photobook template
export interface PhotobookTemplate {
  id: string
  name: string
  description: string
  category: 'family' | 'travel' | 'love' | 'professional'
  pages: PageTemplate[]
  coverTemplate: PageTemplate
  backCoverTemplate: PageTemplate
}

// Helper function to create Fabric.js objects from template
export function createFabricObjectsFromTemplate(template: PageTemplate) {
  const objects: any[] = []

  // Add background elements
  template.backgroundElements.forEach((element) => {
    if (element.type === 'rectangle') {
      const rect = new Rect({
        left: element.x,
        top: element.y,
        width: element.width || 0,
        height: element.height || 0,
        fill: element.fill || 'transparent',
        stroke: element.stroke || 'transparent',
        strokeWidth: element.strokeWidth || 0,
        opacity: element.opacity || 1,
        ...IMAGE_PLACEHOLDER_PROPS,
      })
      objects.push(rect)
    }
  })

  // Add text areas
  template.textAreas.forEach((textArea) => {
    const text = new Textbox(textArea.defaultText, {
      left: textArea.x,
      top: textArea.y,
      width: textArea.width,
      height: textArea.height,
      fontSize: textArea.fontSize,
      fontFamily: FONT_SANS,
      fill: textArea.fill,
      textAlign: textArea.textAlign,
      evented: true,
      originX: 'center',
      originY: 'center',
      ...TEXTBOX_LOCKED_PROPS,
    })
    objects.push(text)
  })

  return objects
}

// Helper function to create image placeholders
export function createImagePlaceholders(template: PageTemplate) {
  const placeholders: any[] = []

  template.imageSpots.forEach((spot) => {
    const placeholder = new Rect({
      left: spot.x,
      top: spot.y,
      width: spot.width,
      height: spot.height,
      fill: '#f3f4f6',
      stroke: '#d1d5db',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      ...IMAGE_PLACEHOLDER_PROPS,
    })

    // Add placeholder text
    const placeholderText = new Textbox(spot.placeholderText, {
      left: spot.x + spot.width / 2,
      top: spot.y + spot.height / 2,
      fontSize: 12,
      fontFamily: FONT_SANS,
      fill: '#9ca3af',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      ...IMAGE_PLACEHOLDER_PROPS,
    })

    placeholders.push(placeholder, placeholderText)
  })

  return placeholders
}
