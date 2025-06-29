import {useState, useCallback, useEffect} from 'react'
import {Canvas} from 'fabric/es'
import {
  PageTemplate,
  createFabricObjectsFromTemplate,
  createImagePlaceholders,
} from '~/lib/templates'

interface UseThumbnailManagementProps {
  canvasInstanceRef: React.MutableRefObject<Canvas | null>
  currentPageIndex: number
  pages: any[]
  selectedTemplate: any
}

export function useThumbnailManagement({
  canvasInstanceRef,
  currentPageIndex,
  pages,
  selectedTemplate,
}: UseThumbnailManagementProps) {
  const [thumbnails, setThumbnails] = useState<(string | null)[]>([])

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

  // Generate initial thumbnails for all pages using templates
  const generateInitialThumbnails = useCallback(() => {
    if (!selectedTemplate || pages.length === 0) return

    const newThumbnails: (string | null)[] = []

    for (let i = 0; i < pages.length; i++) {
      let pageTemplate: PageTemplate | null = null

      // Determine which template to use based on page index
      if (i === 0) {
        // Front cover
        pageTemplate = selectedTemplate.coverTemplate
      } else if (i === pages.length - 1) {
        // Back cover
        pageTemplate = selectedTemplate.backCoverTemplate
      } else {
        // Regular page (subtract 1 for front cover)
        const pageTemplateIndex = i - 1
        if (pageTemplateIndex < selectedTemplate.pages.length) {
          pageTemplate = selectedTemplate.pages[pageTemplateIndex]
        }
      }

      if (pageTemplate) {
        newThumbnails[i] = generateThumbnailFromTemplate(pageTemplate)
      } else {
        // Fallback to empty thumbnail if no template found
        newThumbnails[i] = generateEmptyCanvasSnapshot()
      }
    }

    setThumbnails(newThumbnails)
  }, [
    selectedTemplate,
    pages.length,
    generateThumbnailFromTemplate,
    generateEmptyCanvasSnapshot,
  ])

  // Update current page thumbnail from canvas
  const updateCurrentPageThumbnail = useCallback(() => {
    if (!canvasInstanceRef.current) return

    const canvas = canvasInstanceRef.current

    // Convert current canvas to data URL
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 1,
    })

    // Scale down the image
    const img = new window.Image()
    img.onload = () => {
      const scaledCanvas = document.createElement('canvas')
      const ctx = scaledCanvas.getContext('2d')
      if (ctx) {
        const scale = 0.2 // 20% of original size
        scaledCanvas.width = 750 * scale
        scaledCanvas.height = 550 * scale

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height)

        ctx.drawImage(
          img,
          0,
          0,
          750,
          550,
          0,
          0,
          scaledCanvas.width,
          scaledCanvas.height
        )

        const thumbnailURL = scaledCanvas.toDataURL('image/png', 0.8)

        // Update thumbnails array for current page
        setThumbnails((prev) => {
          const newThumbnails = [...(prev || [])]
          newThumbnails[currentPageIndex] = thumbnailURL
          return newThumbnails
        })
      }
    }
    img.src = dataURL
  }, [canvasInstanceRef, currentPageIndex])

  // Generate initial thumbnails when template is selected and pages are available
  useEffect(() => {
    if (selectedTemplate && pages.length > 0) {
      generateInitialThumbnails()
    }
  }, [selectedTemplate, pages.length, generateInitialThumbnails])

  // Update thumbnails when canvas changes
  useEffect(() => {
    if (!canvasInstanceRef.current) return

    const canvas = canvasInstanceRef.current

    const handleCanvasChange = () => {
      // Update thumbnail for current page when canvas changes
      setTimeout(() => updateCurrentPageThumbnail(), 100)
    }

    // Listen to canvas events
    canvas.on('object:added', handleCanvasChange)
    canvas.on('object:removed', handleCanvasChange)
    canvas.on('object:modified', handleCanvasChange)

    return () => {
      canvas.off('object:added', handleCanvasChange)
      canvas.off('object:removed', handleCanvasChange)
      canvas.off('object:modified', handleCanvasChange)
    }
  }, [updateCurrentPageThumbnail, canvasInstanceRef])

  // Update thumbnail when switching pages
  useEffect(() => {
    // Save thumbnail for the page we're leaving
    if (canvasInstanceRef.current) {
      setTimeout(() => updateCurrentPageThumbnail(), 100)
    }
  }, [currentPageIndex, updateCurrentPageThumbnail, canvasInstanceRef])

  return {
    thumbnails,
    generateThumbnailFromTemplate,
    updateCurrentPageThumbnail,
    generateInitialThumbnails,
  }
}
