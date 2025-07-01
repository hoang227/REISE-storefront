import {TextboxProps, ImageProps, RectProps} from 'fabric/es'

export const TEXTBOX_LOCKED_PROPS: Partial<TextboxProps> = {
  lockMovementX: true,
  lockMovementY: true,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
  hasControls: false,
  hasBorders: true,
  selectable: true,
  borderColor: '#7C3AED',
  borderScaleFactor: 1,
  hoverCursor: 'text',
}

export const IMAGE_BORDER_PROPS: Partial<ImageProps> = {
  borderColor: '#7C3AED',
  borderScaleFactor: 1,
  cornerColor: '#ffffff',
  cornerStrokeColor: '#6b7280',
  cornerSize: 10,
  cornerStyle: 'circle' as const,
  transparentCorners: false,
}

export const IMAGE_PLACEHOLDER_PROPS: Partial<RectProps> = {
  selectable: false,
  evented: false,
  lockMovementX: true,
  lockMovementY: true,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
}
