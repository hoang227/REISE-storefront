import {RotateCw, Trash2, RefreshCw} from 'lucide-react'
import {cn} from '~/lib/utils'

interface CanvasToolbarProps {
  focusedObject: any | null
  onRotate: () => void
  onReset: () => void
  onDelete: () => void
}

export function CanvasToolbar({
  focusedObject,
  onRotate,
  onReset,
  onDelete,
}: CanvasToolbarProps) {
  const toolTipCss = cn(
    'absolute right-full top-2 z-50 mr-2 whitespace-nowrap rounded-full bg-gray-500 px-2 py-1 font-sans text-xs font-light text-white opacity-0 peer-hover:opacity-100'
  )

  const baseButtonStyle =
    'peer rounded-l border-y border-l border-gray-100 p-3 shadow-md transition-colors duration-200'

  const isImageSelected = focusedObject && focusedObject.type === 'image'

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <button
          onClick={onRotate}
          className={cn(
            baseButtonStyle,
            isImageSelected
              ? 'cursor-pointer bg-white text-gray-500 hover:bg-brand-accent hover:text-white'
              : 'cursor-default border-gray-200 bg-gray-200 text-gray-300 shadow-sm'
          )}
          title="Rotate"
          disabled={!isImageSelected}
        >
          <RotateCw className="h-4 w-4" />
        </button>
        <div className={toolTipCss}>Rotate 90°</div>
      </div>
      <div className="relative">
        <button
          onClick={onReset}
          className={cn(
            baseButtonStyle,
            isImageSelected
              ? 'cursor-pointer bg-white text-gray-500 hover:bg-blue-500 hover:text-white'
              : 'cursor-default border-gray-200 bg-gray-200 text-gray-300 shadow-sm'
          )}
          title="Reset"
          disabled={!isImageSelected}
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <div className={toolTipCss}>Reset</div>
      </div>
      <div className="relative">
        <button
          onClick={onDelete}
          className={cn(
            baseButtonStyle,
            isImageSelected
              ? 'cursor-pointer bg-white text-gray-500 hover:bg-red-500 hover:text-white'
              : 'cursor-default border-gray-200 bg-gray-200 text-gray-300 shadow-sm'
          )}
          title="Delete"
          disabled={!isImageSelected}
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <div className={toolTipCss}>Delete</div>
      </div>
    </div>
  )
}
