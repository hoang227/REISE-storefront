import {useCallback} from 'react'
import {Canvas, Textbox} from 'fabric/es'
import type {PageTemplate} from '~/lib/templates'

export function useTemplateText(
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  currentPageTemplate: PageTemplate | null,
  getTextArea: (textAreaId: string) => any,
  onCanvasChange: () => void
) {
  // Update text in specific text area
  const updateTextInArea = useCallback(
    (textAreaId: string, newText: string) => {
      if (!canvasInstanceRef.current || !currentPageTemplate) return
      const textArea = getTextArea(textAreaId)
      if (!textArea) return
      const canvas = canvasInstanceRef.current
      const objects = canvas.getObjects()
      const textObject = objects.find((obj) => {
        if (obj.type !== 'text') return false
        const isAtCorrectPosition =
          Math.abs(obj.left - textArea.x) < 5 &&
          Math.abs(obj.top - textArea.y) < 5
        const textObj = obj as any
        const hasCorrectFontSize = textObj.fontSize === textArea.fontSize
        const hasCorrectFontFamily = textObj.fontFamily === textArea.fontFamily
        return isAtCorrectPosition && hasCorrectFontSize && hasCorrectFontFamily
      })
      if (textObject && textObject.type === 'text') {
        textObject.set('text', newText)
        textObject.set({
          fontSize: textArea.fontSize,
          fontFamily: textArea.fontFamily,
          fill: textArea.fill,
          textAlign: textArea.textAlign,
          width: textArea.width,
          height: textArea.height,
          selectable: true,
          editable: true,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
        })
        canvas.renderAll()
        canvas.fire('object:modified', {target: textObject})
        onCanvasChange()
      } else {
        const newTextObject = new Textbox(newText, {
          left: textArea.x,
          top: textArea.y,
          width: textArea.width,
          height: textArea.height,
          fontSize: textArea.fontSize,
          fontFamily: textArea.fontFamily,
          fill: textArea.fill,
          textAlign: textArea.textAlign,
          selectable: true,
          editable: true,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          originX: 'center',
          originY: 'center',
        })
        canvas.add(newTextObject)
        canvas.renderAll()
        canvas.fire('object:added', {target: newTextObject})
        onCanvasChange()
      }
    },
    [canvasInstanceRef, currentPageTemplate, getTextArea, onCanvasChange]
  )

  // Get current text content from a text area
  const getTextFromArea = useCallback(
    (textAreaId: string) => {
      if (!canvasInstanceRef.current || !currentPageTemplate) return ''
      const textArea = getTextArea(textAreaId)
      if (!textArea) return ''
      const canvas = canvasInstanceRef.current
      const objects = canvas.getObjects()
      const textObject = objects.find((obj) => {
        if (obj.type !== 'text') return false
        const isAtCorrectPosition =
          Math.abs(obj.left - textArea.x) < 5 &&
          Math.abs(obj.top - textArea.y) < 5
        const textObj = obj as any
        const hasCorrectFontSize = textObj.fontSize === textArea.fontSize
        const hasCorrectFontFamily = textObj.fontFamily === textArea.fontFamily
        return isAtCorrectPosition && hasCorrectFontSize && hasCorrectFontFamily
      })
      if (textObject && textObject.type === 'text') {
        const textObj = textObject as any
        return textObj.text || ''
      }
      return textArea.defaultText || ''
    },
    [canvasInstanceRef, currentPageTemplate, getTextArea]
  )

  return {updateTextInArea, getTextFromArea}
}
