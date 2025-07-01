import {useCallback} from 'react'
import {Canvas} from 'fabric/es'
import {
  PageTemplate,
  createFabricObjectsFromTemplate,
  createImagePlaceholders,
} from '~/lib/templates'

export function useThumbnailGeneration() {
  // Generate thumbnail from a page template
  const generateThumbnailFromTemplate = useCallback(
    (pageTemplate: PageTemplate) => {
      // Create a temporary canvas for thumbnail generation
      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')
      if (!ctx) return null

      // Set canvas size (scaled down like thumbnails)
      const scale = 0.2
      tempCanvas.width = 750 * scale
      tempCanvas.height = 550 * scale

      // Fill with background color
      ctx.fillStyle = pageTemplate.backgroundColor || '#ffffff'
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

      // Add subtle border
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      ctx.strokeRect(0.5, 0.5, tempCanvas.width - 1, tempCanvas.height - 1)

      // Create a temporary Fabric.js canvas to render template elements
      const fabricCanvas = new Canvas(tempCanvas, {
        width: tempCanvas.width,
        height: tempCanvas.height,
        selection: false,
      })

      // Set background
      fabricCanvas.backgroundColor = pageTemplate.backgroundColor || '#ffffff'

      // Add background elements
      const backgroundObjects = createFabricObjectsFromTemplate(pageTemplate)
      backgroundObjects.forEach((obj) => {
        // Scale objects to thumbnail size
        obj.scaleX = scale
        obj.scaleY = scale
        obj.left = obj.left * scale
        obj.top = obj.top * scale
        fabricCanvas.add(obj)
      })

      // Add image placeholders
      const placeholderObjects = createImagePlaceholders(pageTemplate)
      placeholderObjects.forEach((obj) => {
        // Scale objects to thumbnail size
        obj.scaleX = scale
        obj.scaleY = scale
        obj.left = obj.left * scale
        obj.top = obj.top * scale
        fabricCanvas.add(obj)
      })

      // Render the canvas
      fabricCanvas.renderAll()

      // Convert to data URL
      const thumbnailURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 1,
      })

      // Clean up
      fabricCanvas.dispose()

      return thumbnailURL
    },
    []
  )

  // Generate default empty canvas snapshot
  const generateEmptyCanvasSnapshot = useCallback(() => {
    // Create a temporary canvas for empty snapshot
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return null

    // Set canvas size (scaled down like thumbnails)
    const scale = 0.2
    tempCanvas.width = 750 * scale
    tempCanvas.height = 550 * scale

    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

    // Add subtle border
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, tempCanvas.width - 1, tempCanvas.height - 1)

    // Convert to data URL
    return tempCanvas.toDataURL('image/png', 0.8)
  }, [])

  return {
    generateThumbnailFromTemplate,
    generateEmptyCanvasSnapshot,
  }
}
