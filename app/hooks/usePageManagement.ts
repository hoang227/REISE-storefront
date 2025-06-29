import {useState, useCallback, useEffect} from 'react'
import {Canvas} from 'fabric/es'
import {getNumberOfPagesFromVariant} from '~/lib/utils'
import type {ProductFragment} from 'storefrontapi.generated'

export function usePageManagement(
  selectedVariant: NonNullable<
    ProductFragment['selectedOrFirstAvailableVariant']
  >,
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  onCanvasChange: () => void,
  selectedTemplate?: any // Add selectedTemplate parameter
) {
  const [pages, setPages] = useState<string[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [pageContent, setPageContent] = useState<Map<number, any>>(new Map())

  // Calculate number of pages from variant or template
  const calculateNumberOfPages = useCallback(() => {
    // If we have a selected template, use its page count
    if (selectedTemplate && selectedTemplate.pages) {
      console.log(
        `📚 Using template page count: ${selectedTemplate.pages.length} pages`
      )
      return selectedTemplate.pages.length
    }

    // Otherwise, try to get from variant
    const variantPages = getNumberOfPagesFromVariant(selectedVariant)
    console.log(`📚 Using variant page count: ${variantPages} pages`)
    return variantPages
  }, [selectedVariant, selectedTemplate])

  // Save current page content
  const saveCurrentPageContent = useCallback(() => {
    if (!canvasInstanceRef.current) return

    const canvas = canvasInstanceRef.current
    const canvasData = canvas.toJSON()

    setPageContent((prev) => {
      const newMap = new Map(prev)
      newMap.set(currentPageIndex, canvasData)
      return newMap
    })

    console.log(`💾 Saved content for page ${currentPageIndex + 1}`)
  }, [canvasInstanceRef, currentPageIndex])

  // Restore page content
  const restorePageContent = useCallback(
    (pageIndex: number) => {
      if (!canvasInstanceRef.current) return

      const canvas = canvasInstanceRef.current
      const savedContent = pageContent.get(pageIndex)

      if (savedContent) {
        canvas.loadFromJSON(savedContent, () => {
          canvas.renderAll()
          onCanvasChange()

          // Force re-render
          requestAnimationFrame(() => {
            canvas.renderAll()
            canvas.fire('object:added')
          })

          console.log(`📄 Restored content for page ${pageIndex + 1}`)
        })
      } else {
        // No saved content, clear canvas
        canvas.clear()
        canvas.renderAll()
        onCanvasChange()

        // Force re-render
        requestAnimationFrame(() => {
          canvas.renderAll()
          canvas.fire('object:removed')
        })

        console.log(
          `📄 No saved content for page ${pageIndex + 1}, cleared canvas`
        )
      }
    },
    [canvasInstanceRef, pageContent, onCanvasChange]
  )

  // Initialize pages when variant or template changes
  useEffect(() => {
    const numPages = calculateNumberOfPages()

    if (numPages > 0) {
      // Create array of page indices (0-based)
      const pageArray = Array.from({length: numPages}, (_, i) => `page-${i}`)
      console.log(`📄 Initializing ${numPages} pages:`, pageArray)
      setPages(pageArray)
    } else {
      console.warn('⚠️  No pages found, using default 12 pages')
      const defaultPages = Array.from({length: 12}, (_, i) => `page-${i}`)
      setPages(defaultPages)
    }
  }, [selectedVariant, selectedTemplate, calculateNumberOfPages])

  // Handle page index bounds separately
  useEffect(() => {
    if (pages.length > 0 && currentPageIndex >= pages.length) {
      setCurrentPageIndex(0)
    }
  }, [currentPageIndex, pages.length])

  // Switch to a specific page
  const switchToPage = useCallback(
    (pageIndex: number) => {
      if (pageIndex >= 0 && pageIndex < pages.length) {
        console.log(`🔄 Switching to page ${pageIndex + 1} of ${pages.length}`)

        // Save current page content before switching
        saveCurrentPageContent()

        // Update page index
        setCurrentPageIndex(pageIndex)

        // Only restore content if it exists (don't restore empty content for uninitialized pages)
        const hasSavedContent = pageContent.has(pageIndex)
        if (hasSavedContent) {
          setTimeout(() => {
            restorePageContent(pageIndex)
          }, 0)
        } else {
          console.log(
            `📄 Page ${pageIndex + 1} has no saved content, waiting for template application`
          )
        }

        onCanvasChange()
      } else {
        console.warn(
          `⚠️  Invalid page index: ${pageIndex}, max: ${pages.length - 1}`
        )
      }
    },
    [
      pages.length,
      onCanvasChange,
      saveCurrentPageContent,
      restorePageContent,
      pageContent,
    ]
  )

  // Get current page number (1-based for display)
  const getCurrentPageNumber = useCallback(() => {
    return currentPageIndex + 1
  }, [currentPageIndex])

  // Get total number of pages
  const getTotalPages = useCallback(() => {
    return pages.length
  }, [pages.length])

  return {
    pages,
    currentPageIndex,
    currentPageNumber: getCurrentPageNumber(),
    totalPages: getTotalPages(),
    switchToPage,
    saveCurrentPageContent,
    hasNextPage: currentPageIndex < pages.length - 1,
    hasPreviousPage: currentPageIndex > 0,
  }
}
