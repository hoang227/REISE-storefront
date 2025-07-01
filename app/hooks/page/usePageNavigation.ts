import {useCallback} from 'react'

export function usePageNavigation(
  currentPageIndex: number,
  totalPages: number,
  setCurrentPageIndex: (index: number) => void,
  saveCurrentPageContent: (pageIndex: number) => void,
  restorePageContent: (pageIndex: number) => void,
  hasPageContent: (pageIndex: number) => boolean,
  onCanvasChange: () => void
) {
  // Switch to a specific page
  const switchToPage = useCallback(
    (pageIndex: number) => {
      if (pageIndex >= 0 && pageIndex < totalPages) {
        // Save current page content before switching
        saveCurrentPageContent(currentPageIndex)

        // Update page index
        setCurrentPageIndex(pageIndex)

        // Only restore content if it exists (don't restore empty content for uninitialized pages)
        const hasSavedContent = hasPageContent(pageIndex)
        if (hasSavedContent) {
          setTimeout(() => {
            restorePageContent(pageIndex)
          }, 0)
        }

        onCanvasChange()
      }
    },
    [
      totalPages,
      currentPageIndex,
      setCurrentPageIndex,
      saveCurrentPageContent,
      restorePageContent,
      hasPageContent,
      onCanvasChange,
    ]
  )

  // Get current page number (1-based for display)
  const getCurrentPageNumber = useCallback(() => {
    return currentPageIndex + 1
  }, [currentPageIndex])

  return {
    switchToPage,
    getCurrentPageNumber,
    currentPageNumber: getCurrentPageNumber(),
  }
}
