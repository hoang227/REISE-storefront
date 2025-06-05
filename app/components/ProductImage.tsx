import type {ProductVariantFragment} from 'storefrontapi.generated'
import {Image} from '@shopify/hydrogen'
import {useState} from 'react'
import {ChevronLeft, ChevronRight, X} from 'lucide-react'
import {cn} from '~/lib/utils'

export type GalleryImage = {
  id: string | null
  url: string
  altText?: string | null
  width?: number | null
  height: number | null
}

type ProductImageProps = {
  selectedVariantImage: ProductVariantFragment['image']
  images: GalleryImage[]
}

export function ProductImage({
  images,
  selectedVariantImage,
}: ProductImageProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalIndex, setModalIndex] = useState<number>(0)

  const [touchStart, setTouchStart] = useState<number>(0)
  const [dragOffset, setDragOffset] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const allImages = selectedVariantImage
    ? [
        selectedVariantImage,
        ...images.filter((img) => img.id !== selectedVariantImage.id),
      ]
    : images

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!isDragging) return

    const currentTouch = e.targetTouches[0].clientX
    const offset = currentTouch - touchStart
    setDragOffset(offset)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const minSwipeDistance = 50
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1)
        if (modalOpen) setModalIndex((prev) => prev - 1)
      } else if (dragOffset < 0 && selectedIndex < allImages.length - 1) {
        setSelectedIndex((prev) => prev + 1)
        if (modalOpen) setModalIndex((prev) => prev + 1)
      }
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  const getImagePosition = (index: number) => {
    const baseTransform = isDragging ? dragOffset : 0
    const diff = index - (modalOpen ? modalIndex : selectedIndex)
    return `translate3d(calc(${diff * 100}%  + ${baseTransform}px), 0, 0)`
  }

  const openModal = (index: number) => {
    setModalIndex(index)
    setModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setModalOpen(false)
    document.body.style.overflow = ''
  }

  if (allImages.length < 1) {
    return <div className="aspect-square animate-pulse rounded-lg bg-white" />
  }
  return (
    <>
      {/** Image Carousel */}
      <div className="space-y-4">
        {/** Main Image Container */}
        <div
          className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-white"
          onClick={() => !isDragging && openModal(selectedIndex)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/** Image Container */}
          <div className="absolute inset-0">
            {allImages.map((image, index) => (
              <div
                key={`image-${image.id || `no-id-${image.url}`}`}
                className={cn(
                  'absolute inset-0 h-full w-full',
                  !isDragging
                    ? 'transition-transform duration-300'
                    : 'transition-none'
                )}
                style={{transform: getImagePosition(index)}}
              >
                <Image
                  alt={image.altText || 'Product Image'}
                  data={image}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/** Navigation Arrows - Desktop */}
          <div className="absolute inset-0 hidden items-center justify-between px-4 opacity-0 transition-opacity hover:opacity-100 md:flex">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (selectedIndex > 0) {
                  setSelectedIndex((prev) => prev - 1)
                }
              }}
              className="rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
              disabled={selectedIndex === 0}
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (selectedIndex < allImages.length - 1) {
                  setSelectedIndex((prev) => prev + 1)
                }
              }}
              className="rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
              disabled={selectedIndex === allImages.length - 1}
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>

        {/** Thumbnail Strip */}
        <div className="hidden grid-cols-[repeat(auto-fill,_5rem)] gap-4 px-1 py-2 md:grid">
          {allImages.map((image, index) => (
            <button
              key={`thumbnail-${image.id || `no-id-${image.url}`}`}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative aspect-square w-20 overflow-hidden rounded-md transition-all duration-300 ease-out',
                selectedIndex === index
                  ? 'ring-2 ring-black/60 ring-offset-2'
                  : 'opacity-70 hover:opacity-100 hover:ring-2 hover:ring-black/10 hover:ring-offset-2'
              )}
            >
              <Image
                alt={image.altText || 'Product Thumbnail'}
                data={image}
                sizes="80px"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        {/** Dot Indicators */}
        <div className="mt-4 flex justify-center space-x-2 md:hidden">
          {allImages.map((image, index) => (
            <button
              key={`dot-${image.id || `no-id-${image.url}`}`}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'rounded-full transition-all duration-300',
                selectedIndex === index
                  ? 'w-4 bg-black/60'
                  : 'h-2 w-2 bg-black/20 hover:bg-black/40'
              )}
            ></button>
          ))}
        </div>
      </div>

      {/** Modal / Popup */}
      {modalOpen && (
        <div className="fixed inset-0 left-0 top-0 z-50 !my-0 bg-black/95 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-hidden">
            {/** Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-50 p-2 text-white/80 transition-colors hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            {/** Image Counter */}
            <div className="absolute left-4 top-4 z-50">
              <p className="font-source text-sm text-white/80">
                {modalIndex + 1} / {allImages.length}
              </p>
            </div>

            {/** Modal Image */}
            <div
              className="flex h-full w-full items-center justify-center p-0 md:p-8"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative h-full w-full">
                {allImages.map((image, index) => (
                  <div
                    key={`modal-${image.id || `no-id-${image.url}`}`}
                    className={`absolute inset-0 h-full w-full transition-transform duration-300 ease-out ${!isDragging ? 'transition-transform duration-300' : 'transition-none'} `}
                    style={{transform: getImagePosition(index)}}
                  >
                    <div className="relative flex h-full w-full items-center justify-center">
                      <Image
                        alt={image.altText || 'Product Image'}
                        data={image}
                        sizes="90vw"
                        className="max-h-[85vh] max-w-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/** Modal Navigation Arrow */}
            <div className="absolute inset-0 hidden items-center justify-between px-4 md:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (modalIndex > 0) {
                    setModalIndex((prev) => prev - 1)
                  }
                }}
                className="rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
                disabled={modalIndex === 0}
              >
                <ChevronLeft className="h-8 w-8 text-black" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (modalIndex < allImages.length - 1) {
                    setModalIndex((prev) => prev + 1)
                  }
                }}
                className="rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
                disabled={modalIndex === allImages.length - 1}
              >
                <ChevronRight className="h-8 w-8 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
