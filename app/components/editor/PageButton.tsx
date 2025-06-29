interface PageButtonProps {
  page: any
  index: number
  isCurrentPage: boolean
  thumbnail: string | null
  switchToPage: (pageIndex: number) => void
  scrollToPage: (pageIndex: number) => void
}

export function PageButton({
  page,
  index,
  isCurrentPage,
  thumbnail,
  switchToPage,
  scrollToPage,
}: PageButtonProps) {
  const getPageLabel = (
    index: number,
    totalPages: number,
    pageNumber: number
  ) => {
    if (index === 0) return 'Front Cover'
    if (index === totalPages - 1) return 'Back Cover'
    return `Page ${pageNumber}`
  }

  const handleClick = () => {
    // Don't switch if we're already on this page
    if (isCurrentPage) {
      return
    }

    switchToPage(index)
    scrollToPage(index)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }

  const imageSrc = thumbnail
  const pageLabel = getPageLabel(index, page.totalPages || 0, page.pageNumber)

  return (
    <div className="flex flex-col items-center justify-center space-y-2 font-sans">
      <button
        className={`${
          isCurrentPage ? 'rounded border-[3px] border-brand-accent' : ''
        } min-w-[105px] bg-gray-100 p-2 transition-all hover:bg-gray-200`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={pageLabel}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={`${pageLabel} preview`}
            className="h-full w-full object-cover"
          />
        )}
      </button>
      <div className="text-xs">{pageLabel}</div>
    </div>
  )
}
