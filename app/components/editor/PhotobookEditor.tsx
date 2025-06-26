'use client'

import {useRef, useEffect, useState} from 'react'
import {Canvas, Image as FabricImage} from 'fabric/es'
import {cn} from '~/lib/utils'
import {Image, Layout, RotateCw, Trash, ArrowUp} from 'lucide-react'
import {UploadedImage, useImages} from '~/contexts/ImageContext'

interface PhotobookEditorProps {
  className?: string
  onCanvasChange?: (hasContent: boolean) => void
}

type TabType = 'images' | 'templates' | 'elements' | 'settings'

export default function PhotobookEditor({
  className,
  onCanvasChange,
}: PhotobookEditorProps) {
  const {images, addImages} = useImages()
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
  const [focusedObjects, setFocusedObjects] = useState<FabricImage[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('images')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasInstanceRef = useRef<Canvas | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      onCanvasChange?.(hasContent)
    })

    canvas.on('object:removed', () => {
      const hasContent = canvas.getObjects().length > 0
      onCanvasChange?.(hasContent)
    })

    canvas.on('object:modified', () => {
      const hasContent = canvas.getObjects().length > 0
      onCanvasChange?.(hasContent)
    })

    return () => {
      canvas.dispose()
    }
  }, [images.length, onCanvasChange])

  // Reset canvas state when images change
  useEffect(() => {
    if (canvasInstanceRef.current) {
      // Clear all objects from canvas
      canvasInstanceRef.current.clear()
      canvasInstanceRef.current.renderAll()
      setFocusedObjects([])
      setSelectedImage(null)
      // Notify parent that canvas is now empty
      onCanvasChange?.(false)
    }
  }, [images.length, onCanvasChange])

  const handleImageClick = (image: UploadedImage) => {
    setSelectedImage(image.id === selectedImage?.id ? null : {...image})
  }

  const handleImageUnfocus = () => {
    setSelectedImage(null)
  }

  const handleImageFocus = (image: UploadedImage) => {
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

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    addImages(files)
  }

  const tabs = [
    {id: 'images' as TabType, label: 'Images', icon: Image},
    {id: 'templates' as TabType, label: 'Templates', icon: Layout},
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'images':
        return (
          <div className="flex flex-col items-center space-y-4 p-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center rounded-full border border-gray-300 py-2 text-sm"
            >
              <h1>Upload More Images</h1>
              <ArrowUp className="ml-2 h-4 w-4" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </button>
            <div className="font-sans text-xs text-gray-500">
              {images.length} images uploaded
            </div>
            <div className="grid grid-cols-2 gap-2">
              {images.map((image) => {
                const isSelected = image.id === selectedImage?.id
                return (
                  <button
                    key={image.id}
                    onClick={() => handleImageClick(image)}
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-lg transition-all focus:outline-none',
                      isSelected
                        ? 'border-[2.5px] border-brand-accent shadow-lg'
                        : 'shadow-sm'
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
        )
      case 'templates':
        return (
          <div className="p-4">
            <h3 className="mb-4 text-gray-900">Layout Templates</h3>
            <div className="space-y-3">
              <div className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:border-gray-300">
                <div className="mb-2 aspect-[4/3] rounded bg-gray-100"></div>
                <p className="text-sm font-medium">Classic Layout</p>
                <p className="text-xs text-gray-500">
                  Traditional photo arrangement
                </p>
              </div>
              <div className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:border-gray-300">
                <div className="mb-2 aspect-[4/3] rounded bg-gray-100"></div>
                <p className="text-sm font-medium">Modern Grid</p>
                <p className="text-xs text-gray-500">Clean grid-based design</p>
              </div>
              <div className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:border-gray-300">
                <div className="mb-2 aspect-[4/3] rounded bg-gray-100"></div>
                <p className="text-sm font-medium">Storybook</p>
                <p className="text-xs text-gray-500">
                  Narrative-focused layout
                </p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar with tabs */}
      <div className="flex w-[380px] border-r border-gray-200 bg-white">
        {/* Tab navigation - vertical on the left */}
        <div className="w-[80px] border-r border-gray-200 bg-gray-50 font-sans">
          <div className="flex flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex flex-col items-center px-2 py-4 text-xs transition-colors',
                    activeTab === tab.id
                      ? 'border-r-2 border-brand-accent bg-white text-brand-accent'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  )}
                  title={tab.label}
                >
                  <Icon className="mb-1 h-5 w-5" />
                  <span className="text-center leading-tight">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content - fixed width */}
        <div className="w-[300px] overflow-y-auto">{renderTabContent()}</div>
      </div>

      {/* Main canvas area */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="bg-gradient-to-r from-brand-accent/90 via-brand-accent/80 to-brand-accent p-3 shadow-md">
          <div className="flex w-full items-center justify-between transition-all duration-300">
            <div className="flex items-center space-x-4">
              <h2 className="font-sans font-medium text-white">
                Photobook Editor
              </h2>
            </div>
            {focusedObjects.length > 0 && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRotateClick}
                  className="text-white transition-opacity hover:opacity-80"
                  title="Rotate"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
                <button
                  onClick={handleTrashClick}
                  className="text-white transition-colors hover:text-red-500"
                  title="Delete"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex flex-1 items-center justify-center p-4">
          <div
            onClick={handleClickToAddImage}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClickToAddImage(e as any)
              }
            }}
            role="button"
            tabIndex={0}
            className="cursor-pointer bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] focus:outline-none"
            style={{width: '750px', height: '550px'}}
          >
            <canvas ref={canvasRef} className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
