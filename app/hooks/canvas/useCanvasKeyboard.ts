import {useEffect, useCallback} from 'react'

export function useCanvasKeyboard(
  focusedObject: any,
  onDelete: (focusedObject: any) => void,
  onClearSelection: () => void
) {
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        // If editing a textbox, allow normal Backspace behavior
        if (
          focusedObject &&
          focusedObject.type === 'textbox' &&
          (focusedObject as any).isEditing
        ) {
          return
        }
        // Otherwise, handle image deletion
        if (focusedObject && focusedObject.type === 'image') {
          e.preventDefault()
          onDelete(focusedObject)
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        onClearSelection()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusedObject, onDelete, onClearSelection])
}
