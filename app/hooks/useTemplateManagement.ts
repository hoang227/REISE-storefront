import {useCallback, useEffect} from 'react'
import {Canvas} from 'fabric/es'
import type {PhotobookTemplate} from '~/lib/templates'
import {
  generateTemplateFromVariant,
  type VariantData,
} from '~/lib/template-generator'
import {useTemplateState} from './template/useTemplateState'
import {useTemplateApplication} from './template/useTemplateApplication'
import {useTemplateSpots} from './template/useTemplateSpots'
import {useTemplateText} from './template/useTemplateText'

export function useTemplateManagement(
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  onCanvasChange: () => void,
  preSelectedTemplate?: PhotobookTemplate,
  selectedVariant?: any,
  onTemplateApplied?: () => void
) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const font = new FontFace(
      'Poppins',
      'url(/fonts/poppins/Poppins-Regular.ttf)'
    )
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont)
      // Optionally, trigger a canvas re-render here
    })
  }, [])

  // State management
  const {
    selectedTemplate,
    setSelectedTemplate,
    currentPageTemplate,
    setCurrentPageTemplate,
  } = useTemplateState(preSelectedTemplate)

  // Template application
  const {applyTemplateToPageIndex} = useTemplateApplication(
    canvasInstanceRef,
    setCurrentPageTemplate,
    onCanvasChange,
    onTemplateApplied
  )

  // Spot and text area helpers (define getImageSpot/getTextArea first)
  const getImageSpot = (spotId: string) => {
    if (!currentPageTemplate) return null
    return (
      currentPageTemplate.imageSpots.find((spot) => spot.id === spotId) || null
    )
  }
  const getTextArea = (textAreaId: string) => {
    if (!currentPageTemplate) return null
    return (
      currentPageTemplate.textAreas.find(
        (textArea) => textArea.id === textAreaId
      ) || null
    )
  }

  const {canAddImageToSpot, addImageToSpot} = useTemplateSpots(
    canvasInstanceRef,
    currentPageTemplate,
    getImageSpot,
    onCanvasChange
  )
  const {updateTextInArea, getTextFromArea} = useTemplateText(
    canvasInstanceRef,
    currentPageTemplate,
    getTextArea,
    onCanvasChange
  )

  // Initialize with pre-selected template or generate from variant
  const initializeTemplate = useCallback(
    (template?: PhotobookTemplate, variant?: any) => {
      if (template) {
        setSelectedTemplate(template)
      } else if (variant) {
        const variantData: VariantData = {
          id: variant.id,
          title: variant.title,
          selectedOptions: variant.selectedOptions,
          productTitle: variant.product?.title || 'Photobook',
          productHandle: variant.product?.handle || 'photobook',
        }
        const generatedTemplate = generateTemplateFromVariant(variantData)
        setSelectedTemplate(generatedTemplate)
      }
    },
    [setSelectedTemplate]
  )

  // Initialize template from variant
  const initializeTemplateFromVariant = useCallback(
    (variant: any) => {
      if (variant && !selectedTemplate) {
        initializeTemplate(undefined, variant)
      }
    },
    [selectedTemplate, initializeTemplate]
  )

  // Expose API
  return {
    selectedTemplate,
    currentPageTemplate,
    initializeTemplate,
    initializeTemplateFromVariant,
    applyTemplateToPageIndex: (pageIndex: number, totalPages: number) =>
      applyTemplateToPageIndex(selectedTemplate, pageIndex, totalPages),
    canAddImageToSpot,
    addImageToSpot,
    updateTextInArea,
    getTextFromArea,
  }
}
