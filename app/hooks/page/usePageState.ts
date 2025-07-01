import {useState, useCallback, useEffect} from 'react'
import type {ProductFragment} from 'storefrontapi.generated'
import {getNumberOfPagesFromVariant} from '~/lib/utils'

export function usePageState(
  selectedVariant: NonNullable<
    ProductFragment['selectedOrFirstAvailableVariant']
  >,
  selectedTemplate?: any
) {
  const [pages, setPages] = useState<string[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [pageContent, setPageContent] = useState<Map<number, any>>(new Map())

  // Calculate number of pages from variant or template
  const calculateNumberOfPages = useCallback(() => {
    // If we have a selected template, use its page count
    if (selectedTemplate && selectedTemplate.pages) {
      return selectedTemplate.pages.length + 2 // Account for front and back cover
    }

    // Otherwise, try to get from variant
    const variantPages = getNumberOfPagesFromVariant(selectedVariant)
    return variantPages
  }, [selectedVariant, selectedTemplate])

  // Initialize pages when variant or template changes
  useEffect(() => {
    const numPages = calculateNumberOfPages()

    if (numPages > 0) {
      // Create array of page indices (0-based)
      const pageArray = Array.from({length: numPages}, (_, i) => `page-${i}`)
      setPages(pageArray)
    } else {
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

  // Save current page content
  const saveCurrentPageContent = useCallback(() => {
    setPageContent((prev) => {
      const newMap = new Map(prev)
      newMap.set(currentPageIndex, null) // Placeholder for canvas data
      return newMap
    })
  }, [currentPageIndex])

  // Update page content with actual canvas data
  const updatePageContent = useCallback(
    (pageIndex: number, canvasData: any) => {
      setPageContent((prev) => {
        const newMap = new Map(prev)
        newMap.set(pageIndex, canvasData)
        return newMap
      })
    },
    []
  )

  // Get page content
  const getPageContent = useCallback(
    (pageIndex: number) => {
      return pageContent.get(pageIndex)
    },
    [pageContent]
  )

  // Check if page has content
  const hasPageContent = useCallback(
    (pageIndex: number) => {
      return pageContent.has(pageIndex)
    },
    [pageContent]
  )

  return {
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    saveCurrentPageContent,
    updatePageContent,
    getPageContent,
    hasPageContent,
    totalPages: pages.length,
    hasNextPage: currentPageIndex < pages.length - 1,
    hasPreviousPage: currentPageIndex > 0,
  }
}
