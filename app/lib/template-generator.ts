import {
  PhotobookTemplate,
  PageTemplate,
  ImageSpot,
  TextArea,
  BackgroundElement,
} from './templates'

// Interface for variant data
export interface VariantData {
  id: string
  title: string
  selectedOptions: Array<{name: string; value: string}>
  productTitle: string
  productHandle: string
}

// --- Constants for default styles ---
const DEFAULT_TEXTAREA_STYLE = {
  fontFamily: 'Poppins',
  fill: '#333333',
  textAlign: 'center' as const,
  isEditable: true,
}

const DEFAULT_IMAGE_SPOT = {
  aspectRatio: 1.33,
  placeholderText: 'Add Image',
  isRequired: false,
}

// --- Helper functions ---
function createTextArea(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize: number,
  overrides: Partial<TextArea> = {}
): TextArea {
  return {
    id,
    x,
    y,
    width,
    height,
    fontSize,
    ...DEFAULT_TEXTAREA_STYLE,
    ...overrides,
    defaultText: overrides.defaultText ?? '',
  }
}

function createImageSpot(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  overrides: Partial<ImageSpot> = {}
): ImageSpot {
  return {
    id,
    x,
    y,
    width,
    height,
    ...DEFAULT_IMAGE_SPOT,
    ...overrides,
  }
}

// --- Template generator class ---
export class TemplateGenerator {
  private variant: VariantData
  private placeholderText: string

  constructor(variant: VariantData) {
    this.variant = variant
    this.placeholderText = 'Add Image'
  }

  // Generate a complete template based on the variant
  generateTemplate(): PhotobookTemplate {
    const templateId = this.generateTemplateId()
    const numPages = this.getNumberOfPages()

    const template: PhotobookTemplate = {
      id: templateId,
      name: this.generateTemplateName(),
      description: this.generateDescription(),
      category: 'family',
      coverTemplate: this.generateCoverTemplate(),
      backCoverTemplate: this.generateBackCoverTemplate(),
      pages: this.generatePageTemplates(numPages),
    }

    // Ensure we have the correct number of pages
    if (template.pages.length !== numPages) {
      // Page count mismatch
    }

    // Ensure every page has content
    template.pages.forEach((page, index) => {
      const pageNum = index + 1
      if (page.imageSpots.length === 0 && page.textAreas.length === 0) {
        // Page has no content
      }
    })

    return template
  }

  // Generate a unique template ID based on variant options
  private generateTemplateId(): string {
    const options = this.variant.selectedOptions
      .map(
        (opt) =>
          `${opt.name.toLowerCase().replace(/\s+/g, '-')}-${opt.value.toLowerCase().replace(/\s+/g, '-')}`
      )
      .sort()
      .join('-')

    return `generated-${options}`
  }

  // Generate template name based on variant options
  private generateTemplateName(): string {
    const size = this.getSize()

    if (size) {
      return `${size} Template`
    }
    return 'Photobook Template'
  }

  // Generate description based on variant characteristics
  private generateDescription(): string {
    const size = this.getSize()

    let description = `Generated photobook template`

    if (size) {
      description += ` in ${size} size`
    }

    return description
  }

  // Get size from variant options
  private getSize(): string | null {
    const sizeOption = this.variant.selectedOptions.find(
      (opt) =>
        opt.name.toLowerCase().includes('size') ||
        opt.name.toLowerCase().includes('dimension')
    )

    return sizeOption?.value || null
  }

  // Get number of pages from variant options
  private getNumberOfPages(): number {
    const pageOption = this.variant.selectedOptions.find(
      (opt) =>
        opt.name.toLowerCase().includes('page') ||
        opt.name.toLowerCase().includes('pages')
    )

    if (pageOption) {
      const pageMatch = pageOption.value.match(/\d+/)
      if (pageMatch) {
        const pages = parseInt(pageMatch[0])
        return pages
      }
    }

    // Default page count
    const defaultPages = 12
    return defaultPages
  }

  // Generate cover template
  private generateCoverTemplate(): PageTemplate {
    return {
      id: `cover-${this.generateTemplateId()}`,
      name: 'Cover Template',
      description: 'Cover template for photobook',
      category: 'cover',
      imageSpots: [],
      textAreas: this.generateCoverTextAreas(),
      backgroundElements: [],
      backgroundColor: '#ffffff',
    }
  }

  // Generate back cover template
  private generateBackCoverTemplate(): PageTemplate {
    return {
      id: `back-cover-${this.generateTemplateId()}`,
      name: 'Back Cover Template',
      description: 'Back cover template for photobook',
      category: 'cover',
      imageSpots: [],
      textAreas: this.generateBackCoverTextAreas(),
      backgroundElements: [],
      backgroundColor: '#ffffff',
    }
  }

  // Generate page templates
  private generatePageTemplates(numPages: number): PageTemplate[] {
    const pages: PageTemplate[] = []

    for (let i = 1; i <= numPages; i++) {
      const pageTemplate = {
        id: `page-${this.generateTemplateId()}-${i}`,
        name: `Page ${i}`,
        description: `Page ${i} template for photobook`,
        category: 'spread' as const,
        imageSpots: [],
        textAreas: this.generatePageTextAreas(i),
        backgroundElements: [],
        backgroundColor: '#ffffff',
      }

      pages.push(pageTemplate)
    }

    return pages
  }

  // Generate cover image spots
  private generateCoverImageSpots(): ImageSpot[] {
    return [
      {
        id: 'cover-main-image',
        x: 175,
        y: 200,
        width: 400,
        height: 250,
        aspectRatio: 1.6,
        placeholderText: this.placeholderText,
        isRequired: true,
      },
    ]
  }

  // Generate cover text areas
  private generateCoverTextAreas(): TextArea[] {
    const designName = this.getDesignName()

    return [
      createTextArea('cover-title', 375, 80, 400, 60, 36, {
        defaultText: designName,
      }),
      createTextArea('cover-subtitle', 375, 500, 400, 40, 20, {
        defaultText: 'A beautiful collection of memories',
        fill: '#666666',
      }),
    ]
  }

  // Generate back cover image spots
  private generateBackCoverImageSpots(): ImageSpot[] {
    return [
      {
        id: 'back-cover-image',
        x: 225,
        y: 200,
        width: 300,
        height: 200,
        aspectRatio: 1.5,
        placeholderText: this.placeholderText,
        isRequired: false,
      },
    ]
  }

  // Generate back cover text areas
  private generateBackCoverTextAreas(): TextArea[] {
    return [
      createTextArea('back-cover-text', 375, 450, 400, 80, 16, {
        defaultText: 'Back cover placeholder text',
      }),
    ]
  }

  // Generate page image spots
  private generatePageImageSpots(pageNum: number): ImageSpot[] {
    return [
      {
        id: `page${pageNum}-img1`,
        x: 150,
        y: 100,
        width: 200,
        height: 150,
        aspectRatio: 1.33,
        placeholderText: this.placeholderText,
        isRequired: true,
      },
      {
        id: `page${pageNum}-img2`,
        x: 400,
        y: 100,
        width: 200,
        height: 150,
        aspectRatio: 1.33,
        placeholderText: this.placeholderText,
        isRequired: true,
      },
      {
        id: `page${pageNum}-img3`,
        x: 150,
        y: 300,
        width: 200,
        height: 150,
        aspectRatio: 1.33,
        placeholderText: this.placeholderText,
        isRequired: false,
      },
      {
        id: `page${pageNum}-img4`,
        x: 400,
        y: 300,
        width: 200,
        height: 150,
        aspectRatio: 1.33,
        placeholderText: this.placeholderText,
        isRequired: false,
      },
    ]
  }

  // Generate page text areas
  private generatePageTextAreas(pageNum: number): TextArea[] {
    return [
      createTextArea(`page${pageNum}-title`, 375, 50, 400, 40, 24, {
        defaultText: 'Page Title',
      }),
      createTextArea(`page${pageNum}-description`, 375, 500, 400, 60, 16, {
        defaultText: 'Add your story here...',
        fill: '#666666',
      }),
    ]
  }

  // Get design name from variant options
  private getDesignName(): string {
    const designOption = this.variant.selectedOptions.find(
      (opt) =>
        opt.name.toLowerCase().includes('design') ||
        opt.name.toLowerCase().includes('template') ||
        opt.name.toLowerCase().includes('style') ||
        opt.name.toLowerCase().includes('layout')
    )

    return designOption?.value || 'Photobook'
  }
}

// Helper function to generate template from variant
export function generateTemplateFromVariant(
  variant: VariantData
): PhotobookTemplate {
  const generator = new TemplateGenerator(variant)
  return generator.generateTemplate()
}
