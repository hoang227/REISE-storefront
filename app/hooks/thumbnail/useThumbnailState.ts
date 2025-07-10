import {useState, useCallback} from 'react'
import {PageTemplate} from '~/lib/templates'

interface UseThumbnailStateProps {
  selectedTemplate: any
  pages: any[]
  generateThumbnailFromTemplate: (template: PageTemplate) => string | null
  generateEmptyCanvasSnapshot: () => string | null
}

export function useThumbnailState({
  selectedTemplate,
  pages,
  generateThumbnailFromTemplate,
  generateEmptyCanvasSnapshot,
}: UseThumbnailStateProps) {
  const [thumbnails, setThumbnails] = useState<(string | null)[]>([])

  // Generate initial thumbnails for all pages using templates
  const generateInitialThumbnails = useCallback(() => {
    if (!selectedTemplate || pages.length === 0) return

    const newThumbnails: (string | null)[] = []

    for (let i = 0; i < pages.length; i++) {
      let pageTemplate: PageTemplate | null = null

      // Determine which template to use based on page index
      if (i === 0) {
        // Front cover
        pageTemplate = selectedTemplate.coverTemplate
      } else if (i === pages.length - 1) {
        // Back cover
        pageTemplate = selectedTemplate.backCoverTemplate
      } else {
        // Regular page (subtract 1 for front cover)
        const pageTemplateIndex = i - 1
        if (pageTemplateIndex < selectedTemplate.pages.length) {
          pageTemplate = selectedTemplate.pages[pageTemplateIndex]
        }
      }

      if (pageTemplate) {
        newThumbnails[i] = generateThumbnailFromTemplate(pageTemplate)
      } else {
        // Fallback to empty thumbnail if no template found
        newThumbnails[i] = generateEmptyCanvasSnapshot()
      }
    }

    setThumbnails(newThumbnails)
  }, [
    selectedTemplate,
    pages.length,
    generateThumbnailFromTemplate,
    generateEmptyCanvasSnapshot,
  ])

  // Update thumbnail for a specific page
  const updateThumbnailForPage = useCallback(
    (pageIndex: number, thumbnailURL: string) => {
      setThumbnails((prev) => {
        const newThumbnails = [...(prev || [])]
        newThumbnails[pageIndex] = thumbnailURL
        return newThumbnails
      })
    },
    []
  )

  return {
    thumbnails,
    generateInitialThumbnails,
    updateThumbnailForPage,
  }
}
