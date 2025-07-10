import {useCallback, useEffect} from 'react'
import {Canvas} from 'fabric/es'

interface UseCanvasThumbnailSyncProps {
  canvasInstanceRef: React.MutableRefObject<Canvas | null>
  currentPageIndex: number
  updateThumbnailForPage: (pageIndex: number, thumbnailURL: string) => void
}

export function useCanvasThumbnailSync({
  canvasInstanceRef,
  currentPageIndex,
  updateThumbnailForPage,
}: UseCanvasThumbnailSyncProps) {
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
        updateThumbnailForPage(currentPageIndex, thumbnailURL)
      }
    }
    img.src = dataURL
  }, [canvasInstanceRef, currentPageIndex, updateThumbnailForPage])

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
    updateCurrentPageThumbnail,
  }
}
