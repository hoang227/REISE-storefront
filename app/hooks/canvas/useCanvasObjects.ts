import {useCallback} from 'react'
import {FabricImage, Textbox} from 'fabric/es'
import {UploadedImage} from '~/contexts/ImageContext'
import {TEXTBOX_LOCKED_PROPS, IMAGE_BORDER_PROPS} from '~/lib/canvas-props'

export function useCanvasObjects(
  canvasInstanceRef: React.MutableRefObject<any>
) {
  // Handle add image to canvas
  const handleAddImageToCanvas = useCallback(
    ({imagePreview, x, y}: {imagePreview: string; x: number; y: number}) => {
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
            ...IMAGE_BORDER_PROPS,
          })

          canvasInstanceRef.current?.add(fabricImage)
          canvasInstanceRef.current?.renderAll()
        }
      }
    },
    [canvasInstanceRef]
  )

  // Handle add text to canvas
  const handleAddTextToCanvas = useCallback(
    ({
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
        const textBox = new Textbox(text, {
          left: x,
          top: y,
          fontSize,
          fontFamily,
          fill,
          ...TEXTBOX_LOCKED_PROPS,
          originX: 'center',
          originY: 'center',
        })

        canvasInstanceRef.current.add(textBox)
        canvasInstanceRef.current.renderAll()
      }
    },
    [canvasInstanceRef]
  )

  // Handle delete object
  const handleDeleteObject = useCallback(
    (focusedObject: any) => {
      if (
        focusedObject &&
        canvasInstanceRef.current &&
        focusedObject.type === 'image'
      ) {
        canvasInstanceRef.current?.remove(focusedObject)
        canvasInstanceRef.current.discardActiveObject()
        canvasInstanceRef.current.renderAll()
      }
    },
    [canvasInstanceRef]
  )

  return {
    handleAddImageToCanvas,
    handleAddTextToCanvas,
    handleDeleteObject,
  }
}
