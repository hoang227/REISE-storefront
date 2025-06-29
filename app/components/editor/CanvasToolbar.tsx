import {RotateCw, Trash} from 'lucide-react'

interface CanvasToolbarProps {
  focusedObjects: any[]
  handleRotateClick: () => void
  handleTrashClick: () => void
}

export function CanvasToolbar({
  focusedObjects,
  handleRotateClick,
  handleTrashClick,
}: CanvasToolbarProps) {
  return (
    <div className="w-12 transition-all duration-300">
      <div className="grid grid-cols-1 space-y-4">
        <button
          onClick={handleRotateClick}
          className={`${focusedObjects.length <= 0 ? 'cursor-default bg-gray-200 text-gray-300' : 'cursor-pointer bg-white text-gray-500 transition-colors duration-200 hover:bg-brand-accent hover:text-white'} rounded-l p-3 shadow-md`}
          title="Rotate"
          disabled={focusedObjects.length <= 0}
        >
          <RotateCw className="h-5 w-5" />
        </button>
        <button
          onClick={handleTrashClick}
          className={`${focusedObjects.length <= 0 ? 'cursor-default bg-gray-200 text-gray-300' : 'cursor-pointer bg-white text-gray-500 transition-colors duration-200 hover:bg-red-500 hover:text-white'} rounded-l p-3 shadow-md`}
          title="Delete"
          disabled={focusedObjects.length <= 0}
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
