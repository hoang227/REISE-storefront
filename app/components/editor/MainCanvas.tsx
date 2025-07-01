import React from 'react'

interface MainCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  currentPageTemplate: any
  selectedImage: any
  handleImageSpotClick: (spotId: string) => void
  handleClickToAddImage: (
    e: React.MouseEvent<HTMLDivElement>,
    selectedImage: any
  ) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
}

export function MainCanvas({
  canvasRef,
  currentPageTemplate,
  selectedImage,
  handleImageSpotClick,
  handleClickToAddImage,
  handleDragOver,
  handleDrop,
}: MainCanvasProps) {
  return (
    <div
      onClick={(e) => {
        // Handle image spot clicks if template is active
        if (currentPageTemplate && selectedImage) {
          const rect = canvasRef.current!.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          // Find which image spot was clicked
          const clickedSpot = currentPageTemplate.imageSpots.find(
            (spot: any) => {
              const spotLeft = spot.x - spot.width / 2
              const spotRight = spot.x + spot.width / 2
              const spotTop = spot.y - spot.height / 2
              const spotBottom = spot.y + spot.height / 2

              return (
                x >= spotLeft &&
                x <= spotRight &&
                y >= spotTop &&
                y <= spotBottom
              )
            }
          )

          if (clickedSpot) {
            handleImageSpotClick(clickedSpot.id)
            return
          }
        }

        // Fallback to original click handler
        handleClickToAddImage(e, selectedImage)
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          // Simple keyboard support - just prevent default for accessibility
        }
      }}
      role="button"
      tabIndex={0}
      className="cursor-pointer bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] focus:outline-none"
    >
      <canvas ref={canvasRef} className="h-full w-full" tabIndex={0} />
    </div>
  )
}
