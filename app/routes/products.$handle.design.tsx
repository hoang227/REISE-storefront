import {Image} from '@shopify/hydrogen'
import {
  useNavigate,
  type MetaFunction,
  useOutletContext,
  useBeforeUnload,
} from 'react-router'
import {useState, useEffect, useCallback} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {cn} from '~/lib/utils'
import {ProductFragment} from 'storefrontapi.generated'
import PhotobookEditor from '~/components/editor/PhotobookEditor'

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

  interface UploadedImage {
    id: string
    preview: string
    status: 'uploading' | 'complete' | 'error'
    progress?: number
    error?: string
  }

  // State for uploaded images
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  // Load images from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('uploadedImages')
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages) as Array<{
          id: string
          preview: string
          status: 'uploading' | 'complete' | 'error'
          progress?: number
          error?: string
        }>
        if (Array.isArray(parsedImages)) {
          setUploadedImages(parsedImages)
        }
      } catch (error) {
        console.error('Error parsing saved images:', error)
        navigate(
          `/products/${product.handle}/upload${variantSearchParams ? `?${variantSearchParams}` : ''}`
        )
      }
    } else {
      // If no images found, redirect back to upload
      navigate(
        `/products/${product.handle}/upload${variantSearchParams ? `?${variantSearchParams}` : ''}`
      )
    }
  }, [])

  // Search params
  const searchParams = new URLSearchParams()
  selectedVariant.selectedOptions.forEach((option) => {
    searchParams.append(option.name, option.value)
  })
  const variantSearchParams = searchParams.toString()

  // Handle back navigation
  const handleBack = () => {
    navigate(
      `/products/${product.handle}/upload${variantSearchParams ? `?${variantSearchParams}` : ''}`
    )
  }

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
          {uploadedImages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="font-sans text-lg text-black/60">
                  No images found. Please go back and upload some images.
                </p>
              </div>
            </div>
          ) : (
            <PhotobookEditor images={uploadedImages} />
          )}
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
    </>
  )
}
