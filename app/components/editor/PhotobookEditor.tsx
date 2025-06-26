'use client'

import {useRef, useEffect, useState, useCallback} from 'react'
import {Canvas, Image as FabricImage} from 'fabric/es'
import {cn, getNumberOfPagesFromVariant} from '~/lib/utils'
import {
  Image,
  Layout,
  RotateCw,
  Trash,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react'
import {UploadedImage, useImages} from '~/contexts/ImageContext'
import type {ProductFragment} from 'storefrontapi.generated'
import {usePageManagement} from '~/hooks/usePageManagement'
import {useCanvasManagement} from '~/hooks/useCanvasManagement'

// Define the structure of a single page
interface PageState {
  id: string
  pageNumber: number
  canvasData: string | null // JSON serialized canvas state
  lastModified: number
}

interface PhotobookEditorProps {
  className?: string
  selectedVariant: NonNullable<
    ProductFragment['selectedOrFirstAvailableVariant']
  >
  onCanvasChange: () => void
}

type TabType = 'images' | 'templates' | 'elements' | 'settings'

export default function PhotobookEditor({
  className,
  selectedVariant,
  onCanvasChange,
}: PhotobookEditorProps) {
  const {images, addImages} = useImages()
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('images')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [thumbnails, setThumbnails] = useState<(string | null)[]>([])

  const handleImageUnfocus = () => {
    setSelectedImage(null)
  }

  // Generate default empty canvas snapshot
  const generateEmptyCanvasSnapshot = useCallback(() => {
    // Create a temporary canvas for empty snapshot
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return null

    // Set canvas size (scaled down like thumbnails)
    const scale = 0.2
    tempCanvas.width = 750 * scale
    tempCanvas.height = 550 * scale

    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

    // Add subtle border
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, tempCanvas.width - 1, tempCanvas.height - 1)

    // Convert to data URL
    return tempCanvas.toDataURL('image/png', 0.8)
  }, [])

  // Generate thumbnail with default content for covers
  const generateCoverThumbnail = useCallback(
    (pageIndex: number, isFrontCover: boolean) => {
      // Create a temporary canvas for cover thumbnail
      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')
      if (!ctx) return null

      // Set canvas size (scaled down like thumbnails)
      const scale = 0.2
      tempCanvas.width = 750 * scale
      tempCanvas.height = 550 * scale

      // Fill with white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

      // Add subtle border
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      ctx.strokeRect(0.5, 0.5, tempCanvas.width - 1, tempCanvas.height - 1)

      // Add text
      const text = isFrontCover ? 'Front Cover' : 'Back Cover'
      ctx.fillStyle = '#333333'
      ctx.font = `${48 * scale}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2)

      // Convert to data URL
      return tempCanvas.toDataURL('image/png', 0.8)
    },
    []
  )

  // Use the new hooks
  const {
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
  } = useCanvasManagement(handleImageUnfocus, onCanvasChange)

  const {
    pages,
    currentPageIndex,
    numberOfPages,
    saveCurrentPage,
    switchToPage,
  } = usePageManagement(selectedVariant, canvasInstanceRef, onCanvasChange)

  // Auto-save when canvas changes
  const handleCanvasChangeWithSave = (hasContent: boolean) => {
    onCanvasChange()
    setTimeout(() => saveCurrentPage(), 100)
  }

  const handleImageClick = (image: UploadedImage) => {
    setSelectedImage(image.id === selectedImage?.id ? null : {...image})
  }

  const handleImageFocus = (image: UploadedImage) => {
    setSelectedImage({...image})
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    addImages(files)
  }

  // Update thumbnail for current page when canvas changes
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
        setThumbnails((prev) => {
          const newThumbnails = [...(prev || [])]
          newThumbnails[currentPageIndex] = thumbnailURL
          return newThumbnails
        })
      }
    }
    img.src = dataURL
  }, [canvasInstanceRef, currentPageIndex])

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

  // Initialize thumbnails for covers when pages are created
  useEffect(() => {
    if (pages.length > 0) {
      setThumbnails((prev) => {
        const newThumbnails = [...(prev || [])]

        // Ensure array is long enough
        while (newThumbnails.length < pages.length) {
          newThumbnails.push(null)
        }

        // Set default thumbnails for covers
        if (pages.length > 0) {
          // Front cover (index 0)
          if (!newThumbnails[0]) {
            newThumbnails[0] = generateCoverThumbnail(0, true)
          }

          // Back cover (last index)
          const backCoverIndex = pages.length - 1
          if (!newThumbnails[backCoverIndex]) {
            newThumbnails[backCoverIndex] = generateCoverThumbnail(
              backCoverIndex,
              false
            )
          }
        }

        return newThumbnails
      })
    }
  }, [pages.length, generateCoverThumbnail])

  const tabs = [
    {id: 'images' as TabType, label: 'Images', icon: Image},
    {id: 'templates' as TabType, label: 'Templates', icon: Layout},
    {id: 'elements' as TabType, label: 'Text', icon: ImageIcon},
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
      case 'elements':
        return (
          <div className="flex flex-col items-center space-y-4 p-4">
            <h3 className="text-gray-900">Add Text Elements</h3>
            <button
              onClick={() =>
                handleAddTextToCanvas({
                  text: 'Sample Text',
                  x: 375,
                  y: 275,
                  fontSize: 48,
                  fontFamily: 'Arial',
                  fill: '#333333',
                })
              }
              className="flex w-full items-center justify-center rounded-full border border-gray-300 py-2 text-sm hover:bg-gray-50"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Add Text
            </button>
            <div className="font-sans text-xs text-gray-500">
              Click to add text to the center of the canvas
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-full overflow-x-auto">
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
        {/* Canvas area */}
        <div className="flex flex-1 items-center justify-center p-4">
          {/* Toolbar */}
          <div className="flex">
            <div className="w-full transition-all duration-300">
              <div className="grid grid-cols-1 space-y-4">
                <button
                  onClick={handleRotateClick}
                  className={`${focusedObjects.length <= 0 ? 'cursor-default bg-gray-200 text-gray-300' : 'cursor-pointer bg-white text-gray-500 hover:bg-brand-accent hover:text-white'} rounded-l p-3 shadow-md transition-colors`}
                  title="Rotate"
                  disabled={focusedObjects.length <= 0}
                >
                  <RotateCw className="h-5 w-5" />
                </button>
                <button
                  onClick={handleTrashClick}
                  className={`${focusedObjects.length <= 0 ? 'cursor-default bg-gray-200 text-gray-300' : 'cursor-pointer bg-white text-gray-500 hover:bg-red-500 hover:text-white'} rounded-l p-3 shadow-md transition-colors`}
                  title="Delete"
                  disabled={focusedObjects.length <= 0}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div
              onClick={(e) => handleClickToAddImage(e, selectedImage)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClickToAddImage(e as any, selectedImage)
                }
              }}
              role="button"
              tabIndex={0}
              className="cursor-pointer bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] focus:outline-none"
            >
              <canvas ref={canvasRef} className="h-full w-full" />
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        <div>
          {pages.length > 0 && (
            <div className="flex items-center justify-center space-x-2 border-y bg-white text-black">
              <div className="flex min-w-36 justify-end border-l border-gray-300 px-4 py-2">
                <button
                  onClick={() => switchToPage(currentPageIndex - 1)}
                  disabled={currentPageIndex === 0}
                  className="flex items-center disabled:cursor-not-allowed disabled:opacity-30"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <div className="font-sans text-sm">Previous page</div>
                </button>
              </div>

              <div className="border-x px-4 py-2 font-sans text-sm">Cover</div>

              <div className="flex min-w-36 justify-start border-r border-gray-300 px-4 py-2">
                <button
                  onClick={() => switchToPage(currentPageIndex + 1)}
                  disabled={currentPageIndex === pages.length - 1}
                  className="flex items-center justify-center rounded-md bg-white/20 transition-opacity hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Next Page"
                >
                  <div className="font-sans text-sm">Next page</div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mx-auto">
            <div className="m-4 flex max-w-4xl space-x-4 overflow-x-auto [scrollbar-width:none]">
              {pages.map((page, index) => {
                const thumbnail = thumbnails[index]
                const emptySnapshot = generateEmptyCanvasSnapshot()
                const isCurrentPage = index === currentPageIndex

                // Front cover
                if (index === 0) {
                  return (
                    <div
                      key={page.id}
                      className="flex flex-col items-center justify-center space-y-2 font-sans"
                    >
                      <button
                        className={`${isCurrentPage ? 'rounded border-[3px] border-brand-accent' : ''} min-w-32 bg-gray-100 p-2 transition-all hover:bg-gray-200`}
                        onClick={() => switchToPage(index)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            switchToPage(index)
                          }
                        }}
                        title="Front Cover"
                      >
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt="Front Cover preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          emptySnapshot && (
                            <img
                              src={emptySnapshot}
                              alt={`Empty page ${page.pageNumber}`}
                              className="h-full w-full object-cover"
                            />
                          )
                        )}
                      </button>
                      <div className="text-xs">Front Cover</div>
                    </div>
                  )
                }

                // Back cover
                if (index === pages.length - 1) {
                  return (
                    <div
                      key={page.id}
                      className="flex flex-col items-center justify-center space-y-2 font-sans"
                    >
                      <button
                        className={`${isCurrentPage ? 'rounded border-[3px] border-brand-accent' : ''} min-w-32 bg-gray-100 p-2 transition-all hover:bg-gray-200`}
                        onClick={() => switchToPage(index)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            switchToPage(index)
                          }
                        }}
                        title="Back Cover"
                      >
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt="Back Cover preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          emptySnapshot && (
                            <img
                              src={emptySnapshot}
                              alt={`Empty page ${page.pageNumber}`}
                              className="h-full w-full object-cover"
                            />
                          )
                        )}
                      </button>
                      <div className="text-xs">Back Cover</div>
                    </div>
                  )
                }

                // Regular pages
                return (
                  <div
                    key={page.id}
                    className="flex flex-col items-center justify-center space-y-2 font-sans"
                  >
                    <button
                      className={`${isCurrentPage ? 'rounded border-[3px] border-brand-accent' : ''} min-w-32 bg-gray-100 p-2 transition-all hover:bg-gray-200`}
                      onClick={() => switchToPage(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          switchToPage(index)
                        }
                      }}
                      title={`Page ${page.pageNumber}`}
                    >
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={`Page ${page.pageNumber} preview`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        emptySnapshot && (
                          <img
                            src={emptySnapshot}
                            alt={`Empty page ${page.pageNumber}`}
                            className="h-full w-full object-cover"
                          />
                        )
                      )}
                    </button>
                    <div className="text-xs">Page {page.pageNumber}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
