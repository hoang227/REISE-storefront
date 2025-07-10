import {Canvas} from 'fabric/es'
import type {ProductFragment} from 'storefrontapi.generated'
import {usePageState} from './page/usePageState'
import {usePageCanvasPersistence} from './page/usePageCanvasPersistence'
import {usePageNavigation} from './page/usePageNavigation'

export function usePageManagement(
  selectedVariant: NonNullable<
    ProductFragment['selectedOrFirstAvailableVariant']
  >,
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  onCanvasChange: () => void,
  selectedTemplate?: any
) {
  // Page state management
  const {
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    updatePageContent,
    getPageContent,
    hasPageContent,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = usePageState(selectedVariant, selectedTemplate)

  // Canvas persistence
  const {saveCurrentPageContent, restorePageContent} = usePageCanvasPersistence(
    canvasInstanceRef,
    onCanvasChange,
    updatePageContent,
    getPageContent,
    hasPageContent
  )

  // Page navigation
  const {switchToPage, currentPageNumber} = usePageNavigation(
    currentPageIndex,
    totalPages,
    setCurrentPageIndex,
    saveCurrentPageContent,
    restorePageContent,
    hasPageContent,
    onCanvasChange
  )

  return {
    pages,
    currentPageIndex,
    currentPageNumber,
    totalPages,
    switchToPage,
    saveCurrentPageContent: () => saveCurrentPageContent(currentPageIndex),
    hasNextPage,
    hasPreviousPage,
  }
}
