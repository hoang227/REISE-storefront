import {useEffect} from 'react'

export function useCanvasRotation(
  canvasInstanceRef: React.MutableRefObject<any>
) {
  useEffect(() => {
    const canvas = canvasInstanceRef.current
    if (!canvas) return

    // Add real-time snapping during rotation
    const handleObjectRotating = (e: any) => {
      if (e.target) {
        const currentAngle = e.target.angle || 0
        const normalizedAngle = ((currentAngle % 360) + 360) % 360

        // Define snap angles for horizontal and vertical
        const snapAngles = [0, 90, 180, 270]
        const snapThreshold = 10 // Degrees from snap angle to trigger snapping

        // Find the closest snap angle
        let closestSnapAngle = null
        let minDistance = Infinity

        for (const snapAngle of snapAngles) {
          const distance = Math.min(
            Math.abs(normalizedAngle - snapAngle),
            Math.abs(normalizedAngle - snapAngle + 360),
            Math.abs(normalizedAngle - snapAngle - 360)
          )

          if (distance < minDistance) {
            minDistance = distance
            closestSnapAngle = snapAngle
          }
        }

        // Only snap if we're close to a horizontal or vertical angle
        if (closestSnapAngle !== null && minDistance <= snapThreshold) {
          // Apply snapping to the single object
          e.target.angle = closestSnapAngle
          e.target.setCoords()
          canvas.renderAll()
        }
      }
    }

    canvas.on('object:rotating', handleObjectRotating)

    return () => {
      canvas.off('object:rotating', handleObjectRotating)
    }
  }, [canvasInstanceRef])

  // Snap angle to nearest increment
  const snapAngle = (angle: number, snapIncrement: number = 45): number => {
    // Normalize angle to 0-360 range
    const normalizedAngle = ((angle % 360) + 360) % 360
    return Math.round(normalizedAngle / snapIncrement) * snapIncrement
  }

  // Handle rotate click
  const handleRotateClick = (focusedObject: any) => {
    if (focusedObject && canvasInstanceRef.current) {
      focusedObject.set({originX: 'center', originY: 'center'})

      // Get current angle
      const currentAngle = focusedObject.angle || 0

      // Calculate next angle (90° increments)
      const nextAngle = (currentAngle + 90) % 360

      // Snap to nearest 15° increment for more precise control
      const snappedAngle = Math.round(nextAngle / 15) * 15

      focusedObject.angle = snappedAngle
      focusedObject.setCoords()
      canvasInstanceRef.current.renderAll()
      // Trigger canvas change event for thumbnail updates
      canvasInstanceRef.current.fire('object:modified', {target: focusedObject})
    }
  }

  // Handle reset click
  const handleResetClick = (focusedObject: any) => {
    if (focusedObject && canvasInstanceRef.current) {
      // Reset rotation to 0°
      focusedObject.angle = 0

      // Reset scaling to original size
      focusedObject.scaleX = 0.25
      focusedObject.scaleY = 0.25

      // Update coordinates
      focusedObject.setCoords()
      canvasInstanceRef.current.renderAll()
    }
  }

  // Handle precise rotation with snapping
  const handlePreciseRotate = (
    focusedObject: any,
    snapIncrement: number = 15
  ) => {
    if (focusedObject && canvasInstanceRef.current) {
      focusedObject.set({originX: 'center', originY: 'center'})

      const currentAngle = focusedObject.angle || 0
      const nextAngle = (currentAngle + snapIncrement) % 360
      const snappedAngle = snapAngle(nextAngle, snapIncrement)

      focusedObject.angle = snappedAngle
      focusedObject.setCoords()
      canvasInstanceRef.current.renderAll()
      // Trigger canvas change event for thumbnail updates
      canvasInstanceRef.current.fire('object:modified', {target: focusedObject})
    }
  }

  return {
    handleRotateClick,
    handleResetClick,
    handlePreciseRotate,
  }
}
