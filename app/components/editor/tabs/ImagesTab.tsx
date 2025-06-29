import {ArrowUp, Image as ImageIcon, Upload} from 'lucide-react'
import {cn} from '~/lib/utils'
import {UploadedImage} from '~/contexts/ImageContext'

interface ImagesTabProps {
  images: UploadedImage[]
  selectedImage: UploadedImage | null
  handleImageClick: (image: UploadedImage) => void
  handleImageFocus: (image: UploadedImage) => void
  handleFiles: (files: FileList | null) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export function ImagesTab({
  images,
  selectedImage,
  handleImageClick,
  handleImageFocus,
  handleFiles,
  fileInputRef,
}: ImagesTabProps) {
  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/10">
            <ImageIcon className="h-4 w-4 text-brand-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Image Library
            </h3>
            <p className="text-xs text-gray-500">Manage your uploaded images</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Upload Section */}
        <div className="mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group w-full rounded-full border border-gray-300 bg-white p-3 transition-all duration-200 hover:border-brand-accent hover:bg-brand-accent/5"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center justify-center rounded-full">
                <Upload className="h-5 w-5 text-gray-400 transition-colors group-hover:text-brand-accent" />
              </div>
              <div className="text-center">
                <p className="font-sans text-xs font-light text-gray-900">
                  Click to upload more images
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </button>
        </div>

        {/* Image Count */}
        {images.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {images.length} image{images.length !== 1 ? 's' : ''} uploaded
              </span>
            </div>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {images.map((image) => {
              const isSelected = image.id === selectedImage?.id
              return (
                <button
                  key={image.id}
                  onClick={() => handleImageClick(image)}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-xl transition-all duration-200 focus:outline-none',
                    isSelected
                      ? 'border-[2px] border-brand-accent shadow-lg'
                      : 'hover:shadow-md'
                  )}
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'copy'
                    e.dataTransfer.setData('imagePreview', image.preview)
                    handleImageFocus(image)
                  }}
                >
                  <img
                    src={image.preview}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    alt={`Photobook content ${image.id}`}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </button>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-sm font-medium text-gray-900">
              No Images Uploaded
            </h3>
            <p className="max-w-xs text-xs text-gray-500">
              Upload some images to get started with your photobook design.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
