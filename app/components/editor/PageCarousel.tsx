import {useRef} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {PageButton} from './PageButton'

interface PageCarouselProps {
  pages: string[]
  currentPageIndex: number
  thumbnails: (string | null)[]
  switchToPage: (pageIndex: number) => void
}

export function PageCarousel({
  pages,
  currentPageIndex,
  thumbnails,
  switchToPage,
}: PageCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  // Scroll carousel to the beginning (Front Cover)
  const scrollToFrontCover = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({left: 0, behavior: 'smooth'})
    }
  }

  // Scroll carousel to the end (Back Cover)
  const scrollToBackCover = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollWidth,
        behavior: 'smooth',
      })
    }
  }

  // Scroll carousel to a specific page
  const scrollToPage = (pageIndex: number) => {
    if (carouselRef.current) {
      // Calculate the position of the page in the carousel
      const pageWidth = 116 // min-w-32 (128px) + space-x-4 (16px) = 144px
      const scrollPosition = pageIndex * pageWidth

      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      })
    }
  }

  const handlePreviousPage = () => {
    const newPageIndex = currentPageIndex - 1
    switchToPage(newPageIndex)
    scrollToPage(newPageIndex)
  }

  const handleNextPage = () => {
    const newPageIndex = currentPageIndex + 1
    switchToPage(newPageIndex)
    scrollToPage(newPageIndex)
  }

  const handleFrontCover = () => {
    switchToPage(0)
    scrollToFrontCover()
  }

  const handleBackCover = () => {
    switchToPage(pages.length - 1)
    scrollToBackCover()
  }

  if (pages.length === 0) return null

  return (
    <div>
      {/* Page Navigation */}
      <div className="flex items-center justify-center border-y bg-white text-black">
        <div className="flex min-w-36 justify-end border-l border-gray-300">
          <button
            onClick={handlePreviousPage}
            disabled={currentPageIndex === 0}
            className="flex items-center px-4 py-2 disabled:cursor-not-allowed disabled:opacity-30"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
            <div className="font-sans text-sm">Previous page</div>
          </button>
        </div>
        <div>
          <button
            className="border-x px-4 py-2 font-sans text-sm"
            onClick={handleFrontCover}
          >
            Front Cover
          </button>

          <button
            className="border-r px-4 py-2 font-sans text-sm"
            onClick={handleBackCover}
          >
            Back Cover
          </button>
        </div>

        <div className="flex min-w-36 justify-start border-r border-gray-300">
          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === pages.length - 1}
            className="flex items-center justify-center rounded-md bg-white/20 px-4 py-2 transition-opacity hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            title="Next Page"
          >
            <div className="font-sans text-sm">Next page</div>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Page Carousel */}
      <div className="flex justify-center bg-gray-100">
        <div
          ref={carouselRef}
          className="m-4 flex max-w-5xl space-x-4 overflow-x-auto [scrollbar-width:none]"
        >
          {pages.map((page, index) => (
            <PageButton
              key={`page-${page}`}
              page={page}
              totalPages={pages.length}
              index={index}
              isCurrentPage={index === currentPageIndex}
              thumbnail={thumbnails[index]}
              switchToPage={switchToPage}
              scrollToPage={scrollToPage}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
