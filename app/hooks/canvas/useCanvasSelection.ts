import {useState, useEffect} from 'react'
import {FabricImage} from 'fabric/es'
import {TEXTBOX_LOCKED_PROPS} from '~/lib/canvas-props'

export function useCanvasSelection(
  canvasInstanceRef: React.MutableRefObject<any>
) {
  const [focusedObject, setFocusedObject] = useState<FabricImage | null>(null)

  useEffect(() => {
    const canvas = canvasInstanceRef.current
    if (!canvas) return

    // Add event listeners for selection (single object only)
    const handleSelectionCreated = (e: any) => {
      setFocusedObject(e.selected[0] as FabricImage)
      const obj = e.selected[0]
      if (obj && obj.type === 'textbox') {
        obj.set(TEXTBOX_LOCKED_PROPS)
        canvas.renderAll()
      }
    }

    const handleSelectionUpdated = (e: any) => {
      setFocusedObject(e.selected[0] as FabricImage)
    }

    const handleSelectionCleared = () => {
      setFocusedObject(null)
    }

    canvas.on('selection:created', handleSelectionCreated)
    canvas.on('selection:updated', handleSelectionUpdated)
    canvas.on('selection:cleared', handleSelectionCleared)

    return () => {
      canvas.off('selection:created', handleSelectionCreated)
      canvas.off('selection:updated', handleSelectionUpdated)
      canvas.off('selection:cleared', handleSelectionCleared)
    }
  }, [canvasInstanceRef])

  const clearSelection = () => {
    setFocusedObject(null)
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.discardActiveObject()
      canvasInstanceRef.current.renderAll()
    }
  }

  return {
    focusedObject,
    setFocusedObject,
    clearSelection,
  }
}
