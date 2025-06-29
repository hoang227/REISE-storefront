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

// Template generator class
export class TemplateGenerator {
  private variant: VariantData
  private placeholderText: string

  constructor(variant: VariantData) {
    this.variant = variant
    this.placeholderText = 'Add Image'
  }

  // Generate a complete template based on the variant
  generateTemplate(): PhotobookTemplate {
    console.log('🎨 Starting template generation for variant:', this.variant)

    const templateId = this.generateTemplateId()
    const numPages = this.getNumberOfPages()

    console.log(`📋 Template details: ID=${templateId}, Pages=${numPages}`)

    const template: PhotobookTemplate = {
      id: templateId,
      name: this.generateTemplateName(),
      description: this.generateDescription(),
      category: 'family',
      coverTemplate: this.generateCoverTemplate(),
      backCoverTemplate: this.generateBackCoverTemplate(),
      pages: this.generatePageTemplates(numPages),
    }

    // Validate template structure
    console.log(`📊 Template validation:`)
    console.log(`   - Cover template: ${template.coverTemplate.name}`)
    console.log(`   - Back cover template: ${template.backCoverTemplate.name}`)
    console.log(`   - Page templates: ${template.pages.length} pages`)

    // Ensure we have the correct number of pages
    if (template.pages.length !== numPages) {
      console.warn(
        `⚠️  Page count mismatch: Expected ${numPages}, got ${template.pages.length}`
      )
    }

    // Ensure every page has content
    template.pages.forEach((page, index) => {
      const pageNum = index + 1
      if (page.imageSpots.length === 0 && page.textAreas.length === 0) {
        console.warn(`⚠️  Page ${pageNum} has no content (no images or text)`)
      }
    })

    console.log(`✅ Template generation complete: ${template.name}`)
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
        console.log(`📄 Found page count in variant: ${pages}`)
        return pages
      }
    }

    // Default page count
    const defaultPages = 12
    console.log(`📄 Using default page count: ${defaultPages}`)
    return defaultPages
  }

  // Generate cover template
  private generateCoverTemplate(): PageTemplate {
    return {
      id: `cover-${this.generateTemplateId()}`,
      name: 'Cover Template',
      description: 'Cover template for photobook',
      category: 'cover',
      imageSpots: this.generateCoverImageSpots(),
      textAreas: this.generateCoverTextAreas(),
      backgroundElements: this.generateCoverBackgroundElements(),
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
      imageSpots: this.generateBackCoverImageSpots(),
      textAreas: this.generateBackCoverTextAreas(),
      backgroundElements: [],
      backgroundColor: '#ffffff',
    }
  }

  // Generate page templates
  private generatePageTemplates(numPages: number): PageTemplate[] {
    const pages: PageTemplate[] = []

    console.log(`📚 Generating ${numPages} page templates`)

    for (let i = 1; i <= numPages; i++) {
      const pageTemplate = {
        id: `page-${this.generateTemplateId()}-${i}`,
        name: `Page ${i}`,
        description: `Page ${i} template for photobook`,
        category: 'spread' as const,
        imageSpots: this.generatePageImageSpots(i),
        textAreas: this.generatePageTextAreas(i),
        backgroundElements: [],
        backgroundColor: '#ffffff',
      }

      console.log(
        `📄 Generated page ${i}: ${pageTemplate.name} with ${pageTemplate.imageSpots.length} image spots and ${pageTemplate.textAreas.length} text areas`
      )

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
      {
        id: 'cover-title',
        x: 375,
        y: 80,
        width: 400,
        height: 60,
        fontSize: 36,
        fontFamily: 'Arial',
        fill: '#333333',
        textAlign: 'center',
        defaultText: designName,
        isEditable: true,
      },
      {
        id: 'cover-subtitle',
        x: 375,
        y: 500,
        width: 400,
        height: 40,
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#666666',
        textAlign: 'center',
        defaultText: 'A beautiful collection of memories',
        isEditable: true,
      },
    ]
  }

  // Generate cover background elements
  private generateCoverBackgroundElements(): BackgroundElement[] {
    return [
      {
        id: 'cover-border',
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 750,
        height: 550,
        fill: 'transparent',
        stroke: '#e5e7eb',
        strokeWidth: 2,
        locked: true,
      },
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
      {
        id: 'back-cover-text',
        x: 375,
        y: 450,
        width: 400,
        height: 80,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#333333',
        textAlign: 'center',
        defaultText: 'Back cover placeholder text',
        isEditable: true,
      },
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
      {
        id: `page${pageNum}-title`,
        x: 375,
        y: 50,
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
        id: `page${pageNum}-description`,
        x: 375,
        y: 500,
        width: 400,
        height: 60,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#666666',
        textAlign: 'center',
        defaultText: 'Add your story here...',
        isEditable: true,
      },
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
