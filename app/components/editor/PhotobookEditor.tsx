'use client'

import {useRef, useEffect, useState} from 'react'
import {Canvas, Image as FabricImage} from 'fabric/es'
import {cn} from '~/lib/utils'
import {Menu, RotateCw, Trash, X} from 'lucide-react'

type ImageData = {
  id: string
  preview: string
}

interface PhotobookEditorProps {
  images: Array<ImageData>
  className?: string
}

export default function PhotobookEditor({
  images,
  className,
}: PhotobookEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const canvasInstanceRef = useRef<Canvas | null>(null)
  const [focusedObjects, setFocusedObjects] = useState<FabricImage[]>([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)

  // Create canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      height: 600,
      width: 1000,
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

    return () => {
      canvas.dispose()
    }
  }, [])

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image.id === selectedImage?.id ? null : {...image})
  }

  const handleImageUnfocus = () => {
    setSelectedImage(null)
  }

  const handleImageFocus = (image: ImageData) => {
    setSelectedImage({...image})
  }

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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleClickToAddImage = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!selectedImage) return

    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const imagePreview = selectedImage.preview

    handleAddImageToCanvas({imagePreview, x, y})
    handleImageUnfocus()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!e.dataTransfer) return

    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const imagePreview = e.dataTransfer.getData('imagePreview')

    handleAddImageToCanvas({imagePreview, x, y})
    handleImageUnfocus()
  }

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

  return (
    <>
      <div className="bg-gradient-to-r from-brand-accent/90 via-brand-accent/80 to-brand-accent p-3 shadow-md">
        <div className="flex w-full items-center justify-between transition-all duration-300">
          <div className="relative flex items-center">
            <button
              className="text-center transition-opacity hover:opacity-80"
              onClick={() => {
                setShowSidebar((prev) => !prev)
                setShowTooltip(false)
              }}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
            {showTooltip && (
              <div
                className={cn(
                  'pointer-events-auto absolute bottom-full left-4 z-50 mt-2',
                  'whitespace-nowrap rounded-lg bg-white px-3 py-2',
                  'text-sm text-gray-800 shadow-lg',
                  'animate-in slide-in-from-top-2 duration-200'
                )}
              >
                <div className="flex items-center gap-2">
                  <span>Click to show uploaded images</span>
                  <button
                    onClick={() => setShowTooltip(false)}
                    className="rounded-full p-1 transition-colors hover:bg-gray-100"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
          {focusedObjects.length > 0 && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRotateClick}
                className="transition-opacity hover:opacity-80"
              >
                <RotateCw className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={handleTrashClick}
                className="text-white transition-colors hover:text-red-500"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="relative flex">
        {/* Slide-over sidebar for uploaded images */}
        <div
          className={`absolute left-6 top-8 z-30 w-[300px] rounded-2xl bg-white shadow-2xl transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-[340px]'} max-h-[60vh] overflow-y-auto`}
          role="complementary"
          aria-label="Uploaded images sidebar"
        >
          <button
            className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-gray-100"
            onClick={() => setShowSidebar(false)}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="p-4">
            <h1 className="text-md mb-4 text-center font-sans font-medium">
              Uploaded Images
            </h1>
            <div className="overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-2">
                {images.map((image) => {
                  const isSelected = image.id === selectedImage?.id
                  return (
                    <button
                      key={image.id}
                      onClick={() => handleImageClick(image)}
                      className={cn(
                        'relative aspect-square overflow-hidden rounded-lg border transition-all',
                        isSelected
                          ? 'border-[3px] border-brand-accent shadow-lg'
                          : 'border-gray-100 hover:border-gray-300'
                      )}
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'copy'
                        e.dataTransfer.setData('imagePreview', image.preview)
                        handleImageFocus(image)
                      }}
                    >
                      <img
                        src={image.preview}
                        className="h-full w-full object-cover"
                        alt={`Photobook content ${image.id}`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area, remove left margin so slide-over floats above */}
        <div className="mx-auto mt-12 p-4">
          <div
            onClick={handleClickToAddImage}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="h-full w-full rounded-lg bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)]"
          >
            <canvas ref={canvasRef} className="h-full" />
          </div>
        </div>
      </div>
    </>
  )
}
