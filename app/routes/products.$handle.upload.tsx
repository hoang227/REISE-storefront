import {Image} from '@shopify/hydrogen'
import {useNavigate, type MetaFunction, useOutletContext} from 'react-router'
import {useState, useRef, useEffect} from 'react'
import {
  Upload,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import {cn, getMaxPagesFromVariant} from '~/lib/utils'
import {ProductFragment} from 'storefrontapi.generated'
import {useImages} from '~/contexts/ImageContext'

export const meta: MetaFunction = () => {
  return [
    {title: 'Upload Images'},
    {
      rel: 'canonical',
      href: `/upload`,
    },
  ]
}

export default function ProductUpload() {
  const {product, selectedVariant} = useOutletContext<{
    product: ProductFragment
    selectedVariant: NonNullable<
      ProductFragment['selectedOrFirstAvailableVariant']
    >
  }>()
  const navigate = useNavigate()
  const {images, addImages, removeImage, clearImages} = useImages()
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Search params
  const searchParams = new URLSearchParams()
  selectedVariant.selectedOptions.forEach((option) => {
    searchParams.append(option.name, option.value)
  })
  const variantSearchParams = searchParams.toString()

  // Handle browser navigation (back/forward buttons, swipe gestures)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If there are uploaded images, block all backward navigation
      if (images.length > 0) {
        // Block the navigation and redirect to product page
        event.preventDefault()
        navigate(
          `/products/${product.handle}${variantSearchParams ? `?${variantSearchParams}` : ''}`
        )
        return
      }

      // No images, allow navigation but clear any remaining state
      clearImages()
    }

    // Add event listener
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [
    images.length,
    clearImages,
    navigate,
    product.handle,
    variantSearchParams,
  ])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    addImages(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleContinue = () => {
    navigate(
      `/products/${product.handle}/design${variantSearchParams ? `?${variantSearchParams}` : ''}`
    )
  }

  // Handle back navigation with confirmation
  const handleBack = () => {
    if (images.length > 0) {
      clearImages()
    }
    navigate(
      `/products/${product.handle}${variantSearchParams ? `?${variantSearchParams}` : ''}`
    )
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
              <span className="font-sans font-normal">Back to Store</span>
            </button>
          </div>
        </div>
      </header>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto">
            {/** Product Selected */}
            <div className="shadow-smn mb-8 flex items-center justify-start space-x-5 border-b bg-gray-100 px-3 py-6">
              <div className="h-20">
                <Image
                  alt={'Selected Product'}
                  data={
                    selectedVariant.image || {
                      url: '/images/Placeholder Image.jpg',
                    }
                  }
                  sizes="80px"
                  className="aspect-square h-full object-cover"
                />
              </div>
              <div className="font-sans">
                <h1 className="text-[22px] font-medium">{product.title}</h1>
                {selectedVariant.selectedOptions.map((option) => {
                  return (
                    <p className="text-sm" key={option.name}>
                      <span className="font-medium">{option.name}</span> :{' '}
                      <span className="font-light">{option.value}</span>
                    </p>
                  )
                })}
              </div>
            </div>

            <div className="px-4 md:px-8">
              <div className="mb-5">
                <h1 className="font-sans text-2xl font-semibold text-black md:text-3xl">
                  Upload Photos
                </h1>
                <p className="mt-2 font-sans text-sm text-black/60">
                  Upload the photos you want to include in your photobook. You
                  can rearrange them in the next step.
                </p>
                <p className="mt-2 font-sans text-black">
                  ({images.length} uploaded)
                </p>
              </div>

              {/* Upload Zone */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click()
                  }
                }}
                className={cn(
                  'relative mb-8 w-full cursor-pointer rounded-lg border-2 border-dashed p-8 text-center',
                  isDragging
                    ? 'border-black/60 bg-black/5'
                    : 'border-black/20 hover:border-black/40'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <Upload className="mx-auto mb-4 h-8 w-8 text-black/40" />
                <p className="text-md mb-1 font-sans font-medium text-black">
                  {isDragging
                    ? 'Drop your photos here'
                    : 'Drag & drop your photos here'}
                </p>
                <p className="font-sans text-sm text-black/60">
                  or click to select files
                </p>
              </button>

              {/* Image Preview Grid */}
              <div className="mb-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-black/5 shadow-sm"
                  >
                    <img
                      src={image.preview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(image.id)
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {image.status === 'uploading' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    {image.status === 'error' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Navigation at Bottom */}
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-end">
              <button
                onClick={handleContinue}
                disabled={images.length === 0 || isUploading}
                className="flex items-center gap-2 rounded-full bg-black px-6 py-3 font-sans text-sm text-white transition-colors hover:bg-brand-accent disabled:bg-black/20"
              >
                <span>Continue to Design</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
