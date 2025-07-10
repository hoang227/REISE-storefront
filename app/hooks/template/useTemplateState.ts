import {useState, useCallback} from 'react'
import type {PhotobookTemplate, PageTemplate} from '~/lib/templates'

export function useTemplateState(preSelectedTemplate?: PhotobookTemplate) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<PhotobookTemplate | null>(preSelectedTemplate || null)
  const [currentPageTemplate, setCurrentPageTemplate] =
    useState<PageTemplate | null>(null)

  return {
    selectedTemplate,
    setSelectedTemplate,
    currentPageTemplate,
    setCurrentPageTemplate,
  }
}
