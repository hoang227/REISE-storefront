import {useCallback} from 'react'
import {Canvas, FabricImage} from 'fabric/es'
import type {PageTemplate} from '~/lib/templates'

export function useTemplateSpots(
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  currentPageTemplate: PageTemplate | null,
  getImageSpotById: (spotId: string) => any,
  onCanvasChange: () => void
) {
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

  // Add image to specific spot
  const addImageToSpot = useCallback(
    async (spotId: string, imageUrl: string) => {
      if (!canvasInstanceRef.current || !currentPageTemplate) return
      const imageSpot = getImageSpotById(spotId)
      if (!imageSpot) return
      const canvas = canvasInstanceRef.current
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.src = imageUrl
      img.onload = () => {
        const scaleX = imageSpot.width / img.width
        const scaleY = imageSpot.height / img.height
        const scale = Math.min(scaleX, scaleY)
        const fabricImage = new FabricImage(img, {
          left: imageSpot.x,
          top: imageSpot.y,
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          originX: 'center',
          originY: 'center',
        })
        const objects = canvas.getObjects()
        objects.forEach((obj) => {
          if (
            obj.type === 'rect' &&
            obj.left === imageSpot.x &&
            obj.top === imageSpot.y
          )
            canvas.remove(obj)
          if (
            obj.type === 'text' &&
            obj.left === imageSpot.x &&
            obj.top === imageSpot.y + imageSpot.height / 2
          )
            canvas.remove(obj)
        })
        canvas.add(fabricImage)
        canvas.renderAll()
        onCanvasChange()
      }
    },
    [canvasInstanceRef, currentPageTemplate, getImageSpotById, onCanvasChange]
  )

  // Get image spot by ID
  const getImageSpot = useCallback(
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
  const getTextArea = useCallback(
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

  return {canAddImageToSpot, addImageToSpot, getImageSpot, getTextArea}
}
