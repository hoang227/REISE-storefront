import {useRef, useEffect, useState} from 'react'
import {Canvas, Image as FabricImage, Text} from 'fabric/es'
import {UploadedImage} from '~/contexts/ImageContext'

export function useCanvasManagement(
  handleImageUnfocus: () => void,
  onCanvasChange: () => void,
  saveCurrentPage?: () => void
) {
  const [focusedObjects, setFocusedObjects] = useState<FabricImage[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasInstanceRef = useRef<Canvas | null>(null)

  // Create canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      height: 550,
      width: 750,
      selection: true,
    })

    canvasInstanceRef.current = canvas

    // Add event listeners for selection
    canvas.on('selection:created', (e) => {
      setFocusedObjects(e.selected as FabricImage[])
    })

    canvas.on('selection:updated', (e) => {
      if (e.e?.shiftKey) {
        setFocusedObjects((prevObjects) => [
          ...prevObjects,
          ...(e.selected as FabricImage[]),
        ])
      } else {
        setFocusedObjects(e.selected as FabricImage[])
      }
    })

    canvas.on('selection:cleared', () => {
      setFocusedObjects([])
    })

    // Add event listeners for canvas changes
    canvas.on('object:added', () => {
      const hasContent = canvas.getObjects().length > 0
      onCanvasChange()
      // Auto-save current page
      if (saveCurrentPage) {
        setTimeout(() => saveCurrentPage(), 100)
      }
    })

    canvas.on('object:removed', () => {
      const hasContent = canvas.getObjects().length > 0
      onCanvasChange()
      // Auto-save current page
      if (saveCurrentPage) {
        setTimeout(() => saveCurrentPage(), 100)
      }
    })

    canvas.on('object:modified', () => {
      const hasContent = canvas.getObjects().length > 0
      onCanvasChange()
      // Auto-save current page
      if (saveCurrentPage) {
        setTimeout(() => saveCurrentPage(), 100)
      }
    })

    return () => {
      canvas.dispose()
    }
  }, [onCanvasChange, saveCurrentPage])

  // Reset canvas state when images change
  useEffect(() => {
    if (canvasInstanceRef.current) {
      // Clear all objects from canvas
      canvasInstanceRef.current.clear()
      canvasInstanceRef.current.renderAll()
      setFocusedObjects([])
      // Notify parent that canvas is now empty
      onCanvasChange()
    }
  }, [onCanvasChange])

  // Handle trash click
  const handleTrashClick = () => {
    if (focusedObjects.length > 0 && canvasInstanceRef.current) {
      focusedObjects.forEach((obj) => {
        canvasInstanceRef.current?.remove(obj)
      })
      canvasInstanceRef.current.discardActiveObject()
      canvasInstanceRef.current.renderAll()
      setFocusedObjects([])
    }
  }

  // Handle rotate click
  const handleRotateClick = () => {
    if (focusedObjects.length > 0 && canvasInstanceRef.current) {
      focusedObjects.forEach((obj) => {
        obj.set({originX: 'center', originY: 'center'})
        obj.angle = ((obj.angle || 0) + 90) % 360
        obj.setCoords()
      })
      canvasInstanceRef.current.renderAll()
    }
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Handle click to add image
  const handleClickToAddImage = (
    e: React.MouseEvent<HTMLDivElement>,
    selectedImage: UploadedImage | null
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (!selectedImage) return

    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const imagePreview = selectedImage.preview

    handleImageUnfocus()
    handleAddImageToCanvas({imagePreview, x, y})
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!e.dataTransfer) return

    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const imagePreview = e.dataTransfer.getData('imagePreview')

    handleImageUnfocus()
    handleAddImageToCanvas({imagePreview, x, y})
  }

  // Handle add image to canvas
  const handleAddImageToCanvas = ({
    imagePreview,
    x,
    y,
  }: {
    imagePreview: string
    x: number
    y: number
  }) => {
    if (imagePreview && canvasInstanceRef.current) {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.src = imagePreview

      img.onload = () => {
        const fabricImage = new FabricImage(img, {
          left: x,
          top: y,
          scaleX: 0.25,
          scaleY: 0.25,
          selectable: true,
          originX: 'center',
          originY: 'center',
        })

        canvasInstanceRef.current?.add(fabricImage)
        canvasInstanceRef.current?.renderAll()
      }
    }
  }

  // Handle add text to canvas
  const handleAddTextToCanvas = ({
    text,
    x,
    y,
    fontSize = 48,
    fontFamily = 'Arial',
    fill = '#000000',
  }: {
    text: string
    x: number
    y: number
    fontSize?: number
    fontFamily?: string
    fill?: string
  }) => {
    if (canvasInstanceRef.current) {
      const fabricText = new Text(text, {
        left: x,
        top: y,
        fontSize,
        fontFamily,
        fill,
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

      canvasInstanceRef.current.add(fabricText)
      canvasInstanceRef.current.renderAll()
    }
  }

  return {
    canvasRef,
    canvasInstanceRef,
    focusedObjects,
    setFocusedObjects,
    handleTrashClick,
    handleRotateClick,
    handleDragOver,
    handleClickToAddImage,
    handleDrop,
    handleAddImageToCanvas,
    handleAddTextToCanvas,
  }
}
