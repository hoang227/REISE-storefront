import {useRef, useEffect} from 'react'
import {Canvas} from 'fabric/es'

export function useCanvas(
  onCanvasChange: () => void,
  saveCurrentPage?: () => void
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasInstanceRef = useRef<Canvas | null>(null)

  // Create canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      height: 550,
      width: 750,
      selection: false, // Disable group selection
    })

    canvasInstanceRef.current = canvas

    // Add event listeners for canvas changes
    canvas.on('object:added', () => {
      onCanvasChange()
      // Auto-save current page
      if (saveCurrentPage) {
        setTimeout(() => saveCurrentPage(), 100)
      }
    })

    canvas.on('object:removed', () => {
      onCanvasChange()
      // Auto-save current page
      if (saveCurrentPage) {
        setTimeout(() => saveCurrentPage(), 100)
      }
    })

    canvas.on('object:modified', (e) => {
      if (e.target) {
        onCanvasChange()
        // Auto-save current page
        if (saveCurrentPage) {
          setTimeout(() => saveCurrentPage(), 100)
        }
      }
    })

    return () => {
      canvas.dispose()
    }
  }, [onCanvasChange, saveCurrentPage])

  // Reset canvas state
  const resetCanvas = () => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.clear()
      canvasInstanceRef.current.renderAll()
      onCanvasChange()
    }
  }

  return {
    canvasRef,
    canvasInstanceRef,
    resetCanvas,
  }
}
