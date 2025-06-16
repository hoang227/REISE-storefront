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
    // TODO: Add to cart functionality
    console.log('Adding to cart...')
  }

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gray-100 px-4 pb-8 pt-36 md:px-8">
          <h1 className="font-sans text-2xl font-semibold text-black md:text-3xl">
            Design Your Photobook
          </h1>
          <p className="mt-2 font-sans text-sm text-black/60">
            Arrange your photos and customize your photobook layout.
          </p>
        </div>

        {/* Design Area */}
        <div className="mb-8">
          {uploadedImages.length === 0 ? (
            <div className="min-h-[400px] rounded-lg border-2 border-black/20 p-8">
              <p className="text-center font-sans text-lg text-black/60">
                No images found. Please go back and upload some images.
              </p>
            </div>
          ) : (
            <PhotobookEditor images={uploadedImages} />
          )}
        </div>

        <div className="px-4 md:px-8">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 rounded-full border border-black/30 px-6 py-3 font-sans text-sm hover:border-black"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Upload</span>
            </button>
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 rounded-full bg-black px-6 py-3 font-sans text-sm text-white transition-colors hover:bg-brand-accent"
            >
              <span>Add to Cart</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
