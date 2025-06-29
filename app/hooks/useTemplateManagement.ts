import {useState, useCallback} from 'react'
import {Canvas, Image as FabricImage, Text} from 'fabric/es'
import {
  PhotobookTemplate,
  PageTemplate,
  getTemplateById,
  getAllTemplates,
  getTemplatesByCategory,
  createFabricObjectsFromTemplate,
  createImagePlaceholders,
  getTemplateForVariant,
} from '~/lib/templates'
import {
  generateTemplateFromVariant,
  type VariantData,
} from '~/lib/template-generator'

export function useTemplateManagement(
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  onCanvasChange: () => void,
  preSelectedTemplate?: PhotobookTemplate,
  selectedVariant?: any, // Add selectedVariant parameter
  onTemplateApplied?: () => void // Add callback for when template is applied
) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<PhotobookTemplate | null>(preSelectedTemplate || null)
  const [currentPageTemplate, setCurrentPageTemplate] =
    useState<PageTemplate | null>(null)

  // Initialize with pre-selected template if provided, or generate from variant
  const initializeTemplate = useCallback(
    (template?: PhotobookTemplate, variant?: any) => {
      if (template) {
        console.log('📋 Using pre-selected template:', template.name)
        setSelectedTemplate(template)
      } else if (variant) {
        console.log('🔧 Generating template from variant data:', variant)
        // Generate template from variant data
        const variantData: VariantData = {
          id: variant.id,
          title: variant.title,
          selectedOptions: variant.selectedOptions,
          productTitle: variant.product?.title || 'Photobook',
          productHandle: variant.product?.handle || 'photobook',
        }
        const generatedTemplate = generateTemplateFromVariant(variantData)
        console.log(
          '✅ Generated template:',
          generatedTemplate.name,
          'with',
          generatedTemplate.pages.length,
          'pages'
        )
        setSelectedTemplate(generatedTemplate)
      }
    },
    []
  )

  // Initialize template when component mounts or variant changes
  const initializeTemplateFromVariant = useCallback(
    (variant: any) => {
      if (variant && !selectedTemplate) {
        console.log('🎯 Initializing template from variant:', variant)
        initializeTemplate(undefined, variant)
      }
    },
    [selectedTemplate, initializeTemplate]
  )

  // Get all available templates (for reference only, not for selection)
  const getAllAvailableTemplates = useCallback(() => {
    return getAllTemplates()
  }, [])

  // Get templates by category (for reference only, not for selection)
  const getTemplatesByCategoryFiltered = useCallback((category: string) => {
    return getTemplatesByCategory(category)
  }, [])

  // Apply template to current page
  const applyTemplateToPage = useCallback(
    (pageTemplate: PageTemplate) => {
      if (!canvasInstanceRef.current) return

      const canvas = canvasInstanceRef.current

      // Clear current canvas
      canvas.clear()

      // Set background color
      canvas.backgroundColor = pageTemplate.backgroundColor
      canvas.renderAll()

      // Create and add background elements
      const backgroundObjects = createFabricObjectsFromTemplate(pageTemplate)
      backgroundObjects.forEach((obj) => {
        canvas.add(obj)
      })

      // Create and add image placeholders
      const placeholderObjects = createImagePlaceholders(pageTemplate)
      placeholderObjects.forEach((obj) => {
        canvas.add(obj)
      })

      // Render the canvas
      canvas.renderAll()

      // Update current page template
      setCurrentPageTemplate(pageTemplate)

      // Notify parent of canvas change
      onCanvasChange()

      // Notify that template was applied
      if (onTemplateApplied) {
        onTemplateApplied()
      }
    },
    [canvasInstanceRef, onCanvasChange, onTemplateApplied]
  )

  // Apply template to specific page index
  const applyTemplateToPageIndex = useCallback(
    (pageIndex: number, totalPages: number) => {
      if (!selectedTemplate) {
        console.log('⚠️  No selected template to apply')
        return
      }

      console.log(
        `📄 Applying template to page ${pageIndex + 1} of ${totalPages}`
      )
      console.log(
        `📋 Template: ${selectedTemplate.name} with ${selectedTemplate.pages.length} pages`
      )

      let pageTemplate: PageTemplate | null = null

      // Determine which template to use based on page index
      if (pageIndex === 0) {
        // Front cover
        pageTemplate = selectedTemplate.coverTemplate
        console.log('📖 Using cover template')
      } else if (pageIndex === totalPages - 1) {
        // Back cover - last page in the array
        pageTemplate = selectedTemplate.backCoverTemplate
        console.log('📖 Using back cover template')
      } else {
        // Regular page (subtract 1 for front cover)
        const pageTemplateIndex = pageIndex - 1
        if (pageTemplateIndex < selectedTemplate.pages.length) {
          pageTemplate = selectedTemplate.pages[pageTemplateIndex]
          console.log(
            `📖 Using page template ${pageTemplateIndex + 1}: ${pageTemplate.name}`
          )
        } else {
          console.warn(
            `⚠️  Page template index ${pageTemplateIndex} out of bounds (max: ${selectedTemplate.pages.length - 1})`
          )
        }
      }

      if (pageTemplate) {
        console.log(`✅ Applying page template: ${pageTemplate.name}`)
        applyTemplateToPage(pageTemplate)
      } else {
        console.warn(`⚠️  No page template found for index ${pageIndex}`)
      }
    },
    [selectedTemplate, applyTemplateToPage]
  )

  // Get current page template
  const getCurrentPageTemplate = useCallback(() => {
    return currentPageTemplate
  }, [currentPageTemplate])

  // Check if image can be added to a specific spot
  const canAddImageToSpot = useCallback(
    (spotId: string) => {
      if (!currentPageTemplate) return false

      const imageSpot = currentPageTemplate.imageSpots.find(
        (spot) => spot.id === spotId
      )
      return imageSpot !== undefined
    },
    [currentPageTemplate]
  )

  // Get image spot by ID
  const getImageSpotById = useCallback(
    (spotId: string) => {
      if (!currentPageTemplate) return null

      return (
        currentPageTemplate.imageSpots.find((spot) => spot.id === spotId) ||
        null
      )
    },
    [currentPageTemplate]
  )

  // Get text area by ID
  const getTextAreaById = useCallback(
    (textAreaId: string) => {
      if (!currentPageTemplate) return null

      return (
        currentPageTemplate.textAreas.find(
          (textArea) => textArea.id === textAreaId
        ) || null
      )
    },
    [currentPageTemplate]
  )

  // Add image to specific spot
  const addImageToSpot = useCallback(
    async (spotId: string, imageUrl: string) => {
      if (!canvasInstanceRef.current || !currentPageTemplate) return

      const imageSpot = getImageSpotById(spotId)
      if (!imageSpot) return

      const canvas = canvasInstanceRef.current

      // Create image element
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.src = imageUrl

      img.onload = () => {
        // Calculate scale to fit the spot while maintaining aspect ratio
        const scaleX = imageSpot.width / img.width
        const scaleY = imageSpot.height / img.height
        const scale = Math.min(scaleX, scaleY)

        // Create fabric image
        const fabricImage = new FabricImage(img, {
          left: imageSpot.x,
          top: imageSpot.y,
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          originX: 'center',
          originY: 'center',
        })

        // Remove placeholder if it exists
        const objects = canvas.getObjects()
        objects.forEach((obj) => {
          if (
            obj.type === 'rect' &&
            obj.left === imageSpot.x &&
            obj.top === imageSpot.y
          ) {
            canvas.remove(obj)
          }
          if (
            obj.type === 'text' &&
            obj.left === imageSpot.x &&
            obj.top === imageSpot.y + imageSpot.height / 2
          ) {
            canvas.remove(obj)
          }
        })

        // Add the image
        canvas.add(fabricImage)
        canvas.renderAll()
        onCanvasChange()
      }
    },
    [canvasInstanceRef, currentPageTemplate, getImageSpotById, onCanvasChange]
  )

  // Update text in specific text area
  const updateTextInArea = useCallback(
    (textAreaId: string, newText: string) => {
      if (!canvasInstanceRef.current || !currentPageTemplate) return

      const textArea = getTextAreaById(textAreaId)
      if (!textArea) return

      const canvas = canvasInstanceRef.current
      const objects = canvas.getObjects()

      // Find the text object by checking multiple properties
      const textObject = objects.find((obj) => {
        if (obj.type !== 'text') return false

        // Check if this text object matches the text area position and properties
        const isAtCorrectPosition =
          Math.abs(obj.left - textArea.x) < 5 &&
          Math.abs(obj.top - textArea.y) < 5

        // Type assertion for text object properties
        const textObj = obj as any
        const hasCorrectFontSize = textObj.fontSize === textArea.fontSize
        const hasCorrectFontFamily = textObj.fontFamily === textArea.fontFamily

        return isAtCorrectPosition && hasCorrectFontSize && hasCorrectFontFamily
      })

      if (textObject && textObject.type === 'text') {
        // Update the text content
        textObject.set('text', newText)

        // Ensure the text object maintains its properties
        textObject.set({
          fontSize: textArea.fontSize,
          fontFamily: textArea.fontFamily,
          fill: textArea.fill,
          textAlign: textArea.textAlign,
          width: textArea.width,
          height: textArea.height,
          selectable: false,
          editable: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
        })

        canvas.renderAll()

        // Explicitly fire the modified event to ensure thumbnails update
        canvas.fire('object:modified', {target: textObject})
        onCanvasChange()
      } else {
        // If text object not found, create a new one
        const newTextObject = new Text(newText, {
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

        canvas.add(newTextObject)
        canvas.renderAll()

        // Explicitly fire the added event to ensure thumbnails update
        canvas.fire('object:added', {target: newTextObject})
        onCanvasChange()
      }
    },
    [canvasInstanceRef, currentPageTemplate, getTextAreaById, onCanvasChange]
  )

  // Get current text content from a text area
  const getTextFromArea = useCallback(
    (textAreaId: string) => {
      if (!canvasInstanceRef.current || !currentPageTemplate) return ''

      const textArea = getTextAreaById(textAreaId)
      if (!textArea) return ''

      const canvas = canvasInstanceRef.current
      const objects = canvas.getObjects()

      // Find the text object by checking multiple properties
      const textObject = objects.find((obj) => {
        if (obj.type !== 'text') return false

        // Check if this text object matches the text area position and properties
        const isAtCorrectPosition =
          Math.abs(obj.left - textArea.x) < 5 &&
          Math.abs(obj.top - textArea.y) < 5

        // Type assertion for text object properties
        const textObj = obj as any
        const hasCorrectFontSize = textObj.fontSize === textArea.fontSize
        const hasCorrectFontFamily = textObj.fontFamily === textArea.fontFamily

        return isAtCorrectPosition && hasCorrectFontSize && hasCorrectFontFamily
      })

      if (textObject && textObject.type === 'text') {
        const textObj = textObject as any
        return textObj.text || ''
      }

      return textArea.defaultText || ''
    },
    [canvasInstanceRef, currentPageTemplate, getTextAreaById]
  )

  return {
    selectedTemplate,
    currentPageTemplate,
    getAllAvailableTemplates,
    getTemplatesByCategoryFiltered,
    initializeTemplate,
    initializeTemplateFromVariant,
    applyTemplateToPage,
    applyTemplateToPageIndex,
    getCurrentPageTemplate,
    canAddImageToSpot,
    getImageSpotById,
    getTextAreaById,
    addImageToSpot,
    updateTextInArea,
    getTextFromArea,
  }
}
