import {useCallback} from 'react'
import {UploadedImage} from '~/contexts/ImageContext'
import {useCanvas} from './canvas/useCanvas'
import {useCanvasSelection} from './canvas/useCanvasSelection'
import {useCanvasRotation} from './canvas/useCanvasRotation'
import {useCanvasKeyboard} from './canvas/useCanvasKeyboard'
import {useCanvasObjects} from './canvas/useCanvasObjects'

export function useCanvasManagement(
  handleImageUnfocus: () => void,
  onCanvasChange: () => void,
  saveCurrentPage?: () => void
) {
  // Core canvas functionality
  const {canvasRef, canvasInstanceRef, resetCanvas} = useCanvas(
    onCanvasChange,
    saveCurrentPage
  )

  // Object selection and focus management
  const {focusedObject, setFocusedObject, clearSelection} =
    useCanvasSelection(canvasInstanceRef)

  // Rotation functionality
  const {handleRotateClick, handleResetClick, handlePreciseRotate} =
    useCanvasRotation(canvasInstanceRef)

  // Object management (add/delete images and text)
  const {handleAddImageToCanvas, handleAddTextToCanvas, handleDeleteObject} =
    useCanvasObjects(canvasInstanceRef)

  // Keyboard event handling
  useCanvasKeyboard(focusedObject, handleDeleteObject, clearSelection)

  // Reset canvas state when images change
  const handleCanvasReset = useCallback(() => {
    resetCanvas()
    setFocusedObject(null)
  }, [resetCanvas, setFocusedObject])

  // Handle trash click
  const handleTrashClick = useCallback(() => {
    handleDeleteObject(focusedObject)
    setFocusedObject(null)
  }, [focusedObject, handleDeleteObject, setFocusedObject])

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // Handle click to add image
  const handleClickToAddImage = useCallback(
    (
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
    },
    [canvasRef, handleImageUnfocus, handleAddImageToCanvas]
  )

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (!e.dataTransfer) return

      const rect = canvasRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const imagePreview = e.dataTransfer.getData('imagePreview')

      handleImageUnfocus()
      handleAddImageToCanvas({imagePreview, x, y})
    },
    [canvasRef, handleImageUnfocus, handleAddImageToCanvas]
  )

  // Wrapper functions for rotation handlers
  const handleRotate = useCallback(() => {
    handleRotateClick(focusedObject)
  }, [focusedObject, handleRotateClick])

  const handleReset = useCallback(() => {
    handleResetClick(focusedObject)
  }, [focusedObject, handleResetClick])

  const handlePreciseRotateWrapper = useCallback(
    (snapIncrement: number = 15) => {
      handlePreciseRotate(focusedObject, snapIncrement)
    },
    [focusedObject, handlePreciseRotate]
  )

  return {
    // Canvas refs
    canvasRef,
    canvasInstanceRef,

    // State
    focusedObject,
    setFocusedObject,

    // Event handlers
    handleTrashClick,
    handleRotateClick: handleRotate,
    handleResetClick: handleReset,
    handlePreciseRotate: handlePreciseRotateWrapper,
    handleDragOver,
    handleClickToAddImage,
    handleDrop,
    handleAddImageToCanvas,
    handleAddTextToCanvas,

    // Utility functions
    resetCanvas: handleCanvasReset,
  }
}
