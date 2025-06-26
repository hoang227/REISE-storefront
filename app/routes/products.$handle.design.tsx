import {Image} from '@shopify/hydrogen'
import {
  useNavigate,
  type MetaFunction,
  useOutletContext,
  useBeforeUnload,
} from 'react-router'
import {useEffect, useState, useCallback} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {cn} from '~/lib/utils'
import {ProductFragment} from 'storefrontapi.generated'
import PhotobookEditor from '~/components/editor/PhotobookEditor'
import {UnsavedChangesModal} from '~/components/UnsavedChangesModal'
import {useImages} from '~/contexts/ImageContext'

export const meta: MetaFunction = () => {
  return [
    {title: 'Design Your Photobook'},
    {
      rel: 'canonical',
      href: `/design`,
    },
  ]
}

export default function ProductDesign() {
  const {product, selectedVariant} = useOutletContext<{
    product: ProductFragment
    selectedVariant: NonNullable<
      ProductFragment['selectedOrFirstAvailableVariant']
    >
  }>()
  const navigate = useNavigate()
  const {images, clearImages} = useImages()
  const [hasCanvasContent, setHasCanvasContent] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  )

  // Search params
  const searchParams = new URLSearchParams()
  selectedVariant.selectedOptions.forEach((option) => {
    searchParams.append(option.name, option.value)
  })
  const variantSearchParams = searchParams.toString()

  // Show alert on refresh if canvas has content
  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasCanvasContent) {
          event.preventDefault()
        }
      },
      [hasCanvasContent]
    )
  )

  // Handle canvas content changes
  const handleCanvasChange = useCallback((hasContent: boolean) => {
    setHasCanvasContent(hasContent)
  }, [])

  // Handle back navigation with confirmation
  const handleBack = () => {
    if (hasCanvasContent) {
      setShowUnsavedModal(true)
      setPendingNavigation(
        `/products/${product.handle}/upload${variantSearchParams ? `?${variantSearchParams}` : ''}`
      )
    } else {
      navigate(
        `/products/${product.handle}/upload${variantSearchParams ? `?${variantSearchParams}` : ''}`
      )
    }
  }

  // Handle modal confirmation
  const handleConfirmNavigation = () => {
    setShowUnsavedModal(false)
    if (pendingNavigation) {
      navigate(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  // Handle modal cancellation
  const handleCancelNavigation = () => {
    setShowUnsavedModal(false)
    setPendingNavigation(null)
  }

  // Handle browser back/forward navigation with aggressive prevention
  useEffect(() => {
    let isPreventingNavigation = false

    const handlePopState = (event: PopStateEvent) => {
      if (hasCanvasContent && !isPreventingNavigation) {
        isPreventingNavigation = true

        // Immediately push state back to prevent navigation
        window.history.pushState(null, '', window.location.href)

        // Show modal for confirmation
        setShowUnsavedModal(true)
        setPendingNavigation(
          `/products/${product.handle}/upload${variantSearchParams ? `?${variantSearchParams}` : ''}`
        )

        // Reset flag after delay
        setTimeout(() => {
          isPreventingNavigation = false
        }, 1000)
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasCanvasContent) {
        const message =
          'You have unsaved changes on your canvas. Are you sure you want to leave? Your changes will be lost.'
        event.preventDefault()
        event.returnValue = message
        return message
      }
    }

    // Add multiple history states to make navigation harder
    // This creates a "buffer" that makes it harder for trackpad swipes to navigate away
    window.history.pushState({page: 'design'}, '', window.location.href)
    window.history.pushState({page: 'design'}, '', window.location.href)
    window.history.pushState({page: 'design'}, '', window.location.href)

    // Add event listeners
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasCanvasContent, product.handle, variantSearchParams])

  // Handle continue to cart
  const handleContinue = () => {
    // TODO: Review Design
    console.log('Review Design...')
  }

  return (
    <>
      {/* Simple header for upload/design pages */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-black"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-sans font-normal">Back to Upload</span>
            </button>
          </div>
        </div>
      </header>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-hidden">
          <PhotobookEditor
            images={images}
            onCanvasChange={handleCanvasChange}
          />
        </div>

        {/* Fixed Navigation at Bottom */}
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-end">
              <button
                onClick={handleContinue}
                className="flex items-center gap-2 rounded-full bg-black px-6 py-3 font-sans text-sm text-white transition-colors hover:bg-brand-accent disabled:bg-black/20"
              >
                <span>Review Design</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </>
  )
}
