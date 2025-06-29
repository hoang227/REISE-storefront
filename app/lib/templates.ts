import {Text, Image as FabricImage, Rect} from 'fabric/es'
import {
  generateTemplateFromVariant,
  type VariantData,
} from './template-generator'

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

// Sample templates
export const sampleTemplates: PhotobookTemplate[] = [
  {
    id: 'classic-family',
    name: 'Classic Family',
    description: 'Traditional family photobook with elegant layouts',
    category: 'family',
    coverTemplate: {
      id: 'classic-family-cover',
      name: 'Classic Family Cover',
      description: 'Elegant cover with title and subtitle',
      category: 'cover',
      imageSpots: [
        {
          id: 'cover-main-image',
          x: 375,
          y: 200,
          width: 300,
          height: 200,
          aspectRatio: 1.5,
          placeholderText: 'Add Cover Photo',
          isRequired: true,
        },
      ],
      textAreas: [
        {
          id: 'cover-title',
          x: 375,
          y: 350,
          width: 400,
          height: 60,
          fontSize: 36,
          fontFamily: 'Arial',
          fill: '#333333',
          textAlign: 'center',
          defaultText: 'Our Family Story',
          isEditable: true,
        },
        {
          id: 'cover-subtitle',
          x: 375,
          y: 420,
          width: 400,
          height: 40,
          fontSize: 18,
          fontFamily: 'Arial',
          fill: '#666666',
          textAlign: 'center',
          defaultText: 'A Collection of Memories',
          isEditable: true,
        },
      ],
      backgroundElements: [
        {
          id: 'cover-border',
          type: 'rectangle',
          x: 0,
          y: 0,
          width: 750,
          height: 550,
          stroke: '#e5e7eb',
          strokeWidth: 2,
          opacity: 0.5,
          locked: true,
        },
      ],
      backgroundColor: '#ffffff',
    },
    backCoverTemplate: {
      id: 'classic-family-back',
      name: 'Classic Family Back Cover',
      description: 'Simple back cover with optional image',
      category: 'cover',
      imageSpots: [
        {
          id: 'back-cover-image',
          x: 375,
          y: 275,
          width: 200,
          height: 150,
          aspectRatio: 1.33,
          placeholderText: 'Add Back Photo (Optional)',
          isRequired: false,
        },
      ],
      textAreas: [
        {
          id: 'back-cover-text',
          x: 375,
          y: 450,
          width: 400,
          height: 40,
          fontSize: 14,
          fontFamily: 'Arial',
          fill: '#666666',
          textAlign: 'center',
          defaultText: 'Made with love',
          isEditable: true,
        },
      ],
      backgroundElements: [],
      backgroundColor: '#ffffff',
    },
    pages: [
      {
        id: 'classic-family-page-1',
        name: 'Classic Family Page 1',
        description: 'Two-column layout with text',
        category: 'spread',
        imageSpots: [
          {
            id: 'page1-image1',
            x: 150,
            y: 150,
            width: 200,
            height: 150,
            aspectRatio: 1.33,
            placeholderText: 'Add Photo 1',
            isRequired: true,
          },
          {
            id: 'page1-image2',
            x: 400,
            y: 150,
            width: 200,
            height: 150,
            aspectRatio: 1.33,
            placeholderText: 'Add Photo 2',
            isRequired: true,
          },
        ],
        textAreas: [
          {
            id: 'page1-title',
            x: 375,
            y: 350,
            width: 400,
            height: 40,
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#333333',
            textAlign: 'center',
            defaultText: 'Page Title',
            isEditable: true,
          },
          {
            id: 'page1-description',
            x: 375,
            y: 400,
            width: 400,
            height: 60,
            fontSize: 14,
            fontFamily: 'Arial',
            fill: '#666666',
            textAlign: 'center',
            defaultText: 'Add your story here...',
            isEditable: true,
          },
        ],
        backgroundElements: [
          {
            id: 'page1-border',
            type: 'rectangle',
            x: 0,
            y: 0,
            width: 750,
            height: 550,
            stroke: '#f3f4f6',
            strokeWidth: 1,
            opacity: 0.3,
            locked: true,
          },
        ],
        backgroundColor: '#ffffff',
      },
      {
        id: 'classic-family-page-2',
        name: 'Classic Family Page 2',
        description: 'Large image with caption',
        category: 'spread',
        imageSpots: [
          {
            id: 'page2-main-image',
            x: 375,
            y: 150,
            width: 400,
            height: 250,
            aspectRatio: 1.6,
            placeholderText: 'Add Main Photo',
            isRequired: true,
          },
        ],
        textAreas: [
          {
            id: 'page2-caption',
            x: 375,
            y: 420,
            width: 400,
            height: 40,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: '#333333',
            textAlign: 'center',
            defaultText: 'Photo caption',
            isEditable: true,
          },
        ],
        backgroundElements: [],
        backgroundColor: '#ffffff',
      },
    ],
  },
  {
    id: 'modern-travel',
    name: 'Modern Travel',
    description: 'Contemporary travel photobook with dynamic layouts',
    category: 'travel',
    coverTemplate: {
      id: 'modern-travel-cover',
      name: 'Modern Travel Cover',
      description: 'Bold travel cover with large image',
      category: 'cover',
      imageSpots: [
        {
          id: 'travel-cover-image',
          x: 375,
          y: 275,
          width: 500,
          height: 300,
          aspectRatio: 1.67,
          placeholderText: 'Add Travel Photo',
          isRequired: true,
        },
      ],
      textAreas: [
        {
          id: 'travel-cover-title',
          x: 375,
          y: 100,
          width: 400,
          height: 60,
          fontSize: 42,
          fontFamily: 'Arial',
          fill: '#ffffff',
          textAlign: 'center',
          defaultText: 'ADVENTURE',
          isEditable: true,
        },
      ],
      backgroundElements: [
        {
          id: 'travel-cover-overlay',
          type: 'rectangle',
          x: 0,
          y: 0,
          width: 750,
          height: 550,
          fill: '#000000',
          opacity: 0.3,
          locked: true,
        },
      ],
      backgroundColor: '#1f2937',
    },
    backCoverTemplate: {
      id: 'modern-travel-back',
      name: 'Modern Travel Back Cover',
      description: 'Minimal back cover',
      category: 'cover',
      imageSpots: [],
      textAreas: [
        {
          id: 'travel-back-text',
          x: 375,
          y: 275,
          width: 400,
          height: 40,
          fontSize: 16,
          fontFamily: 'Arial',
          fill: '#666666',
          textAlign: 'center',
          defaultText: 'Journey continues...',
          isEditable: true,
        },
      ],
      backgroundElements: [],
      backgroundColor: '#ffffff',
    },
    pages: [
      {
        id: 'modern-travel-page-1',
        name: 'Modern Travel Page 1',
        description: 'Grid layout for multiple photos',
        category: 'spread',
        imageSpots: [
          {
            id: 'travel-page1-image1',
            x: 100,
            y: 100,
            width: 150,
            height: 150,
            aspectRatio: 1,
            placeholderText: 'Photo 1',
            isRequired: true,
          },
          {
            id: 'travel-page1-image2',
            x: 300,
            y: 100,
            width: 150,
            height: 150,
            aspectRatio: 1,
            placeholderText: 'Photo 2',
            isRequired: true,
          },
          {
            id: 'travel-page1-image3',
            x: 500,
            y: 100,
            width: 150,
            height: 150,
            aspectRatio: 1,
            placeholderText: 'Photo 3',
            isRequired: true,
          },
          {
            id: 'travel-page1-image4',
            x: 100,
            y: 300,
            width: 150,
            height: 150,
            aspectRatio: 1,
            placeholderText: 'Photo 4',
            isRequired: true,
          },
          {
            id: 'travel-page1-image5',
            x: 300,
            y: 300,
            width: 150,
            height: 150,
            aspectRatio: 1,
            placeholderText: 'Photo 5',
            isRequired: true,
          },
          {
            id: 'travel-page1-image6',
            x: 500,
            y: 300,
            width: 150,
            height: 150,
            aspectRatio: 1,
            placeholderText: 'Photo 6',
            isRequired: true,
          },
        ],
        textAreas: [
          {
            id: 'travel-page1-title',
            x: 375,
            y: 50,
            width: 400,
            height: 40,
            fontSize: 28,
            fontFamily: 'Arial',
            fill: '#333333',
            textAlign: 'center',
            defaultText: 'Destination',
            isEditable: true,
          },
        ],
        backgroundElements: [],
        backgroundColor: '#ffffff',
      },
    ],
  },
]

// Helper function to get template by ID
export function getTemplateById(id: string): PhotobookTemplate | undefined {
  return sampleTemplates.find((template) => template.id === id)
}

// Helper function to get all templates
export function getAllTemplates(): PhotobookTemplate[] {
  return sampleTemplates
}

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): PhotobookTemplate[] {
  return sampleTemplates.filter((template) => template.category === category)
}

// Helper function to map product variant to template
export function getTemplateForVariant(
  selectedOptions: Array<{name: string; value: string}>
): PhotobookTemplate {
  // Create a variant data object for the template generator
  const variantData: VariantData = {
    id: 'generated-variant',
    title: 'Generated Variant',
    selectedOptions,
    productTitle: 'Photobook',
    productHandle: 'photobook',
  }

  // Generate template based on the variant options
  return generateTemplateFromVariant(variantData)
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
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
      })
      objects.push(rect)
    }
  })

  // Add text areas
  template.textAreas.forEach((textArea) => {
    const text = new Text(textArea.defaultText, {
      left: textArea.x,
      top: textArea.y,
      width: textArea.width,
      height: textArea.height,
      fontSize: textArea.fontSize,
      fontFamily: textArea.fontFamily,
      fill: textArea.fill,
      textAlign: textArea.textAlign,
      selectable: false,
      editable: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      originX: 'center',
      originY: 'center',
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
      selectable: false,
      evented: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
    })

    // Add placeholder text
    const placeholderText = new Text(spot.placeholderText, {
      left: spot.x + spot.width / 2,
      top: spot.y + spot.height / 2,
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#9ca3af',
      textAlign: 'center',
      selectable: false,
      evented: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      originX: 'center',
      originY: 'center',
    })

    placeholders.push(placeholder, placeholderText)
  })

  return placeholders
}
