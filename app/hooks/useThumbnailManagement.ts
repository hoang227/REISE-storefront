import {useEffect} from 'react'
import {Canvas} from 'fabric/es'
import {useThumbnailGeneration} from './thumbnail/useThumbnailGeneration'
import {useThumbnailState} from './thumbnail/useThumbnailState'
import {useCanvasThumbnailSync} from './thumbnail/useCanvasThumbnailSync'

interface UseThumbnailManagementProps {
  canvasInstanceRef: React.MutableRefObject<Canvas | null>
  currentPageIndex: number
  pages: any[]
  selectedTemplate: any
}

export function useThumbnailManagement({
  canvasInstanceRef,
  currentPageIndex,
  pages,
  selectedTemplate,
}: UseThumbnailManagementProps) {
  // Thumbnail generation utilities
  const {generateThumbnailFromTemplate, generateEmptyCanvasSnapshot} =
    useThumbnailGeneration()

  // Thumbnail state management
  const {thumbnails, generateInitialThumbnails, updateThumbnailForPage} =
    useThumbnailState({
      selectedTemplate,
      pages,
      generateThumbnailFromTemplate,
      generateEmptyCanvasSnapshot,
    })

  // Canvas thumbnail synchronization
  const {updateCurrentPageThumbnail} = useCanvasThumbnailSync({
    canvasInstanceRef,
    currentPageIndex,
    updateThumbnailForPage,
  })

  // Generate initial thumbnails when template is selected and pages are available
  useEffect(() => {
    if (selectedTemplate && pages.length > 0) {
      generateInitialThumbnails()
    }
  }, [selectedTemplate, pages.length, generateInitialThumbnails])

  return {
    thumbnails,
    generateThumbnailFromTemplate,
    updateCurrentPageThumbnail,
    generateInitialThumbnails,
  }
}
