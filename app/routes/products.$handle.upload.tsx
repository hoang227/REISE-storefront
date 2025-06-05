import {Image} from '@shopify/hydrogen'
import {
  useNavigate,
  type MetaFunction,
  useOutletContext,
  useBeforeUnload,
  useBlocker,
  Location,
} from 'react-router'
import {useState, useRef, useCallback} from 'react'
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

export const meta: MetaFunction = () => {
  return [
    {title: 'Upload Images'},
    {
      rel: 'canonical',
      href: `/upload`,
    },
  ]
}

type UploadedImage = {
  id: string
  file: File
  preview: string
  status: 'uploading' | 'complete' | 'error'
  progress?: number
  error?: string
}

export default function ProductUpload() {
  const {product, selectedVariant} = useOutletContext<{
    product: ProductFragment
    selectedVariant: NonNullable<
      ProductFragment['selectedOrFirstAvailableVariant']
    >
  }>()
  const navigate = useNavigate()
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxImages = getMaxPagesFromVariant(selectedVariant)

  // Alert user when they refresh pages if there's any images uploaded
  useBeforeUnload(
    useCallback(
      (event) => {
        if (uploadedImages.length > 0) {
          event.preventDefault()
        }
      },
      [uploadedImages]
    )
  )

  // TODO: Blocker for backward nav

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    // Create new image entries
    const newImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: 'complete' as const,
      progress: 100,
    }))

    setUploadedImages((prev) => {
      if (newImages.length + prev.length > maxImages) {
        alert('Maximum images exceeded.')
        return prev
      } else {
        return [...prev, ...newImages]
      }
    })
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

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const handleContinue = () => {
    // Create URL with variant options for the design page
    const searchParams = new URLSearchParams()
    selectedVariant.selectedOptions.forEach((option) => {
      searchParams.append(option.name, option.value)
    })
    const variantSearchParams = searchParams.toString()

    // Save images to session/local storage or your backend
    navigate(
      `/products/${product.handle}/design${variantSearchParams ? `?${variantSearchParams}` : ''}`
    )
  }

  return (
    <div className="pb-12 pt-44 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/** Product Selected */}
        <div className="mb-5 flex items-center justify-start space-x-5 rounded-lg bg-gray-200 p-3">
          <div className="h-20">
            <Image
              alt={'Selected Product'}
              data={
                selectedVariant.image || {url: '/images/Placeholder Image.jpg'}
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

        <div className="mb-5">
          <h1 className="font-sans text-2xl font-semibold text-black md:text-3xl">
            Upload Photos
          </h1>
          <p className="mt-2 font-sans text-sm text-black/60">
            Upload the photos you want to include in your photobook. You can
            rearrange them in the next step.
          </p>
          <p className="mt-2 font-sans text-black">
            ({uploadedImages.length} uploaded)
          </p>
        </div>

        {/* Upload Zone */}
        {uploadedImages.length >= maxImages && (
          <div className="mb-2 font-sans text-sm text-red-500">
            Max images uploaded
          </div>
        )}
        {uploadedImages.length < maxImages && (
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
                ? 'Drop your images here'
                : 'Drag & drop your images here'}
            </p>
            <p className="font-sans text-sm text-black/60">
              or click to select files
            </p>
          </button>
        )}

        {/* Image Preview Grid */}
        <div className="mb-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {uploadedImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-black/10 bg-black/5"
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

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              // Create URL with variant options for the product page
              const searchParams = new URLSearchParams()
              selectedVariant.selectedOptions.forEach((option) => {
                searchParams.append(option.name, option.value)
              })
              const variantSearchParams = searchParams.toString()

              navigate(
                `/products/${product.handle}${variantSearchParams ? `?${variantSearchParams}` : ''}`
              )
            }}
            className="flex items-center gap-2 rounded-full border border-black/30 px-6 py-3 font-sans text-sm hover:border-black"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button
            onClick={handleContinue}
            disabled={uploadedImages.length === 0 || isUploading}
            className="flex items-center gap-2 rounded-full bg-black px-6 py-3 font-sans text-sm text-white transition-colors hover:bg-brand-accent disabled:bg-black/20"
          >
            <span>Continue to Design</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
