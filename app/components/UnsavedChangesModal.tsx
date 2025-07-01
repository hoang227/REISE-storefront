import {X} from 'lucide-react'
import {useEffect, useRef} from 'react'

interface UnsavedChangesModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function UnsavedChangesModal({
  isOpen,
  onConfirm,
  onCancel,
}: UnsavedChangesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Prevent closing by clicking backdrop
    e.preventDefault()
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    >
      <div className="mx-4 w-full max-w-md rounded-lg border border-red-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-red-600">
            Unsaved Changes
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 leading-relaxed text-gray-700">
          You have unsaved changes on your canvas. Are you sure you want to
          leave?
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  )
}
