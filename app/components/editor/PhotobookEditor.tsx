'use client'

import {useRef, useEffect, useState} from 'react'
import {UploadedImage, useImages} from '~/contexts/ImageContext'
import type {ProductFragment} from 'storefrontapi.generated'
import {usePageManagement} from '~/hooks/usePageManagement'
import {useCanvasManagement} from '~/hooks/useCanvasManagement'
import {useTemplateManagement} from '~/hooks/useTemplateManagement'
import {PhotobookTemplate} from '~/lib/templates'
import {useThumbnailManagement} from '~/hooks/useThumbnailManagement'
import {SidebarTabs, TabType} from './SidebarTabs'
import {CanvasToolbar} from './CanvasToolbar'
import {MainCanvas} from './MainCanvas'
import {PageCarousel} from './PageCarousel'

type PhotobookEditorProps = {
  className?: string
  selectedVariant: NonNullable<
    ProductFragment['selectedOrFirstAvailableVariant']
  >
  onCanvasChange: () => void
  preSelectedTemplate?: PhotobookTemplate
}

export default function PhotobookEditor({
  className,
  selectedVariant,
  onCanvasChange,
  preSelectedTemplate,
}: PhotobookEditorProps) {
  const {images, addImages} = useImages()
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('images')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedInput, setSelectedInput] = useState<string | null>(null)
  const [initializedPages, setInitializedPages] = useState<Set<number>>(
    new Set()
  )

  const handleImageUnfocus = () => setSelectedImage(null)

  // Canvas management hook
  const {
    canvasRef,
    canvasInstanceRef,
    focusedObjects,
    handleTrashClick,
    handleRotateClick,
    handleDragOver,
    handleClickToAddImage,
    handleDrop,
  } = useCanvasManagement(handleImageUnfocus, onCanvasChange)

  // Template management hook
  const {
    selectedTemplate,
    currentPageTemplate,
    getAllAvailableTemplates,
    getTemplatesByCategoryFiltered,
    initializeTemplate,
    initializeTemplateFromVariant,
    applyTemplateToPage,
    applyTemplateToPageIndex,
    getCurrentPageTemplate,
    canAddImageToSpot,
    getImageSpotById,
    getTextAreaById,
    addImageToSpot,
    updateTextInArea,
    getTextFromArea,
  } = useTemplateManagement(
    canvasInstanceRef,
    onCanvasChange,
    undefined,
    selectedVariant,
    () => {
      // Save content immediately after template is applied
      console.log(
        `💾 Template applied, saving content for page ${currentPageIndex + 1}`
      )
      saveCurrentPageContent()
    }
  )

  // Page management hook (after template management)
  const {pages, currentPageIndex, switchToPage, saveCurrentPageContent} =
    usePageManagement(
      selectedVariant,
      canvasInstanceRef,
      onCanvasChange,
      selectedTemplate
    )

  // Thumbnail management
  const {thumbnails} = useThumbnailManagement({
    canvasInstanceRef,
    currentPageIndex,
    pages,
    selectedTemplate,
  })

  // Handlers for sidebar
  const handleImageClick = (image: UploadedImage) => {
    setSelectedImage(image.id === selectedImage?.id ? null : {...image})
  }
  const handleImageFocus = (image: UploadedImage) =>
    setSelectedImage({...image})
  const handleFiles = (files: FileList | null) => {
    if (!files) return
    addImages(files)
  }
  const handleImageSpotClick = (spotId: string) => {
    if (selectedImage && canAddImageToSpot(spotId)) {
      addImageToSpot(spotId, selectedImage.preview)
      setSelectedImage(null)
    }
  }
  const handleInputClick = (inputId: string) => setSelectedInput(inputId)

  // Text update handler (if needed)
  const handleInputUpdate = (inputId: string, newText: string) => {
    updateTextInArea(inputId, newText)
    setSelectedInput(null)
  }

  // Template initialization
  useEffect(() => {
    if (preSelectedTemplate && !selectedTemplate) {
      initializeTemplate(preSelectedTemplate)
    } else if (selectedVariant && !selectedTemplate) {
      // Generate template from variant if no pre-selected template
      initializeTemplateFromVariant(selectedVariant)
    }
  }, [
    preSelectedTemplate,
    selectedTemplate,
    selectedVariant,
    initializeTemplate,
    initializeTemplateFromVariant,
  ])

  // Apply template to current page if not already initialized
  useEffect(() => {
    if (
      selectedTemplate &&
      pages.length > 0 &&
      !initializedPages.has(currentPageIndex)
    ) {
      console.log(
        `📄 Applying template to page ${currentPageIndex + 1} (first visit)`
      )

      // Apply template first
      applyTemplateToPageIndex(currentPageIndex, pages.length)

      // Mark as initialized
      setInitializedPages((prev) => new Set([...prev, currentPageIndex]))
    }
  }, [
    selectedTemplate,
    pages.length,
    currentPageIndex,
    initializedPages,
    applyTemplateToPageIndex,
  ])

  return (
    <div className="flex h-full overflow-x-auto">
      {/* Sidebar */}
      <SidebarTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        images={images}
        selectedImage={selectedImage}
        handleImageClick={handleImageClick}
        handleImageFocus={handleImageFocus}
        handleFiles={handleFiles}
        fileInputRef={fileInputRef}
        currentPageTemplate={currentPageTemplate}
        selectedInput={selectedInput}
        handleInputClick={handleInputClick}
        handleInputUpdate={handleInputUpdate}
        getTextFromInput={getTextFromArea}
      />

      {/* Main canvas area */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center p-4">
          {/* Toolbar */}
          <CanvasToolbar
            focusedObjects={focusedObjects}
            handleRotateClick={handleRotateClick}
            handleTrashClick={handleTrashClick}
          />
          <MainCanvas
            canvasRef={canvasRef}
            currentPageTemplate={currentPageTemplate}
            selectedImage={selectedImage}
            handleImageSpotClick={handleImageSpotClick}
            handleClickToAddImage={handleClickToAddImage}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
        </div>
        {/* Page Carousel & Navigation */}
        <PageCarousel
          pages={pages}
          currentPageIndex={currentPageIndex}
          thumbnails={thumbnails}
          switchToPage={switchToPage}
        />
      </div>
    </div>
  )
}
