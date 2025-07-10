import {useCallback} from 'react'
import {Canvas} from 'fabric/es'
import type {PhotobookTemplate, PageTemplate} from '~/lib/templates'
import {
  createFabricObjectsFromTemplate,
  createImagePlaceholders,
} from '~/lib/templates'

export function useTemplateApplication(
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  setCurrentPageTemplate: (tpl: PageTemplate) => void,
  onCanvasChange: () => void,
  onTemplateApplied?: () => void
) {
  // Apply template to current page
  const applyTemplateToPage = useCallback(
    (pageTemplate: PageTemplate) => {
      if (!canvasInstanceRef.current) return
      const canvas = canvasInstanceRef.current
      canvas.clear()
      canvas.backgroundColor = pageTemplate.backgroundColor
      canvas.renderAll()
      const backgroundObjects = createFabricObjectsFromTemplate(pageTemplate)
      backgroundObjects.forEach((obj) => canvas.add(obj))
      const placeholderObjects = createImagePlaceholders(pageTemplate)
      placeholderObjects.forEach((obj) => canvas.add(obj))
      canvas.renderAll()
      setCurrentPageTemplate(pageTemplate)
      onCanvasChange()
      if (onTemplateApplied) onTemplateApplied()
    },
    [
      canvasInstanceRef,
      setCurrentPageTemplate,
      onCanvasChange,
      onTemplateApplied,
    ]
  )

  // Apply template to specific page index
  const applyTemplateToPageIndex = useCallback(
    (
      selectedTemplate: PhotobookTemplate | null,
      pageIndex: number,
      totalPages: number
    ) => {
      if (!selectedTemplate) return
      let pageTemplate: PageTemplate | null = null
      if (pageIndex === 0) pageTemplate = selectedTemplate.coverTemplate
      else if (pageIndex === totalPages - 1)
        pageTemplate = selectedTemplate.backCoverTemplate
      else {
        const pageTemplateIndex = pageIndex - 1
        if (pageTemplateIndex < selectedTemplate.pages.length) {
          pageTemplate = selectedTemplate.pages[pageTemplateIndex]
        } else return
      }
      if (pageTemplate) applyTemplateToPage(pageTemplate)
    },
    [applyTemplateToPage]
  )

  return {applyTemplateToPageIndex}
}
