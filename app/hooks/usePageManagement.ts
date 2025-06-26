import {useState, useEffect, useRef, useCallback} from 'react'
import {Canvas, Text} from 'fabric/es'
import type {ProductFragment} from 'storefrontapi.generated'
import {getNumberOfPagesFromVariant} from '~/lib/utils'

// Define the structure of a single page
export interface PageState {
  id: string
  pageNumber: number
  canvasData: string | null // JSON serialized canvas state
  lastModified: number
}

export function usePageManagement(
  selectedVariant: NonNullable<
    ProductFragment['selectedOrFirstAvailableVariant']
  >,
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  onCanvasChange: () => void
) {
  const [pages, setPages] = useState<PageState[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  // Calculate number of pages from variant
  const numberOfPages = getNumberOfPagesFromVariant(selectedVariant)

  // Initialize pages based on product variant
  useEffect(() => {
    if (pages.length === 0 && numberOfPages > 0) {
      const initialPages: PageState[] = []

      initialPages.push({
        id: 'front-cover',
        pageNumber: 0,
        canvasData: null,
        lastModified: Date.now(),
      })

      for (let i = 1; i <= numberOfPages; i++) {
        initialPages.push({
          id: `page-${i}`,
          pageNumber: i,
          canvasData: null,
          lastModified: Date.now(),
        })
      }

      initialPages.push({
        id: 'back-cover',
        pageNumber: numberOfPages + 1,
        canvasData: null,
        lastModified: Date.now(),
      })

      setPages(initialPages)
      setCurrentPageIndex(0) // Start on first page
    }
  }, [pages.length, numberOfPages])

  // Function to load page data into canvas
  const loadPageIntoCanvas = useCallback(
    (pageIndex: number) => {
      if (
        !canvasInstanceRef.current ||
        pageIndex < 0 ||
        pageIndex >= pages.length
      ) {
        return
      }

      const page = pages[pageIndex]

      // Clear current canvas
      canvasInstanceRef.current.clear()

      // Load page data if it exists
      if (page.canvasData) {
        try {
          const canvasData = JSON.parse(page.canvasData) as Record<string, any>
          canvasInstanceRef.current.loadFromJSON(canvasData, () => {
            if (canvasInstanceRef.current) {
              // Force a complete re-render
              canvasInstanceRef.current.renderAll()
              canvasInstanceRef.current.requestRenderAll()

              // Update canvas change state
              const hasContent =
                canvasInstanceRef.current.getObjects().length > 0
              onCanvasChange()
            }
          })
        } catch (error) {
          console.error('Error loading page data:', error)
          // If loading fails, just render empty canvas
          canvasInstanceRef.current.renderAll()
          onCanvasChange()
        }
      } else {
        // Empty page - add default text for covers
        if (pageIndex === 0) {
          // Front cover
          const frontCoverText = new Text('Front Cover', {
            left: 375, // Center of 750px width
            top: 275, // Center of 550px height
            fontSize: 48,
            fontFamily: 'Arial',
            fill: '#333333',
            selectable: true,
            originX: 'center',
            originY: 'center',
          })
          canvasInstanceRef.current.add(frontCoverText)
        } else if (pageIndex === pages.length - 1) {
          // Back cover
          const backCoverText = new Text('Back Cover', {
            left: 375, // Center of 750px width
            top: 275, // Center of 550px height
            fontSize: 48,
            fontFamily: 'Arial',
            fill: '#333333',
            selectable: true,
            originX: 'center',
            originY: 'center',
          })
          canvasInstanceRef.current.add(backCoverText)
        }

        canvasInstanceRef.current.renderAll()
        onCanvasChange()
      }

      // Clear selection state after a short delay to ensure rendering is complete
      setTimeout(() => {
        if (canvasInstanceRef.current) {
          canvasInstanceRef.current.discardActiveObject()
          canvasInstanceRef.current.renderAll()
        }
      }, 50)
    },
    [canvasInstanceRef, pages, onCanvasChange]
  )

  // Load page data when current page changes
  useEffect(() => {
    if (pages.length > 0 && canvasInstanceRef.current) {
      loadPageIntoCanvas(currentPageIndex)
    }
  }, [currentPageIndex, pages.length, canvasInstanceRef, loadPageIntoCanvas])

  // Function to save current page state
  const saveCurrentPage = () => {
    if (!canvasInstanceRef.current || pages.length === 0) return

    const canvasData = JSON.stringify(canvasInstanceRef.current.toJSON())
    const updatedPages = [...pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      canvasData,
      lastModified: Date.now(),
    }
    setPages(updatedPages)
  }

  // Function to switch to a different page
  const switchToPage = (newPageIndex: number) => {
    if (
      newPageIndex === currentPageIndex ||
      newPageIndex < 0 ||
      newPageIndex >= pages.length
    ) {
      return
    }

    // Save current page before switching
    saveCurrentPage()

    // Switch to new page
    setCurrentPageIndex(newPageIndex)
  }

  return {
    pages,
    currentPageIndex,
    numberOfPages,
    saveCurrentPage,
    switchToPage,
    loadPageIntoCanvas,
  }
}
