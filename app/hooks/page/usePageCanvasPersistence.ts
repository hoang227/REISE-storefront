import {useCallback} from 'react'
import {Canvas} from 'fabric/es'
import {TEXTBOX_LOCKED_PROPS, IMAGE_BORDER_PROPS} from '~/lib/canvas-props'

export function usePageCanvasPersistence(
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  onCanvasChange: () => void,
  updatePageContent: (pageIndex: number, canvasData: any) => void,
  getPageContent: (pageIndex: number) => any,
  hasPageContent: (pageIndex: number) => boolean
) {
  // Save current page content
  const saveCurrentPageContent = useCallback(
    (pageIndex: number) => {
      if (!canvasInstanceRef.current) return

      const canvas = canvasInstanceRef.current
      const canvasData = canvas.toJSON()
      updatePageContent(pageIndex, canvasData)
    },
    [canvasInstanceRef, updatePageContent]
  )

  // Restore page content
  const restorePageContent = useCallback(
    (pageIndex: number) => {
      if (!canvasInstanceRef.current) return

      const canvas = canvasInstanceRef.current
      const savedContent = getPageContent(pageIndex)

      if (savedContent) {
        canvas.loadFromJSON(savedContent, () => {
          // Wait for the next tick to ensure all objects are fully initialized
          setTimeout(() => {
            canvas.getObjects().forEach((obj) => {
              if (obj.type === 'textbox') {
                obj.set(TEXTBOX_LOCKED_PROPS)
                obj.setCoords()
              }
              if (obj.type === 'image') {
                obj.set({IMAGE_BORDER_PROPS})
                obj.setCoords()
              }
            })
            canvas.renderAll()
            onCanvasChange()
          }, 0)

          // Force re-render
          requestAnimationFrame(() => {
            canvas.renderAll()
            canvas.fire('object:added')
          })
        })
      } else {
        // No saved content, clear canvas
        canvas.clear()
        canvas.renderAll()
        onCanvasChange()

        // Force re-render
        requestAnimationFrame(() => {
          canvas.renderAll()
          canvas.fire('object:removed')
        })
      }
    },
    [canvasInstanceRef, getPageContent, onCanvasChange]
  )

  return {
    saveCurrentPageContent,
    restorePageContent,
  }
}
