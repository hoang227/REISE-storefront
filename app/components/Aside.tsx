import {X} from 'lucide-react'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import {cn} from '~/lib/utils'

type AsideType = 'search' | 'cart' | 'mobile' | 'closed'

type AsideContextValue = {
  type: AsideType
  open: (mode: AsideType) => void
  close: () => void
}

type AsideProps = {
  children?: React.ReactNode
  type: AsideType
  heading: React.ReactNode
}

const Aside = ({children, heading, type}: AsideProps) => {
  const {type: activeType, close} = useAside()
  // Check if this aside instance should be expanded
  const expanded = type === activeType

  // Handle body scroll locking when aside is expanded
  useEffect(() => {
    if (!expanded) return

    // Store current scroll position
    const scrollY = window.scrollY

    // Save original body styles before modification
    const originalStyles = {
      overflow: document.body.style.overflow,
      height: document.body.style.height,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
    }

    // Lock body scroll and fix position
    document.body.style.overflow = 'hidden' // Prevent scrolling
    document.body.style.height = '100vh' // Full viewport height
    document.body.style.position = 'fixed' // Fix body in place
    document.body.style.width = '100%' // Ensure full width
    document.body.style.top = `-${scrollY}` // Maintain scroll position visually

    // Cleanup function to restore original body styles
    return () => {
      document.body.style.overflow = originalStyles.overflow
      document.body.style.height = originalStyles.height
      document.body.style.position = originalStyles.position
      document.body.style.width = originalStyles.width
      document.body.style.top = originalStyles.top

      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [expanded]) // Only re-run when expanded state changes

  // Handle escape key press to close aside
  useEffect(() => {
    if (!expanded) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    // Add event listener when effect runs
    document.addEventListener('keydown', handleEscape)
    // Cleanup: remove event listener when component unmounts or aside closes
    return () => document.removeEventListener('keydown', handleEscape)
  }, [expanded, close]) // Re-run if expanded state or close function changes

  return (
    <div
      aria-modal
      className={cn(
        'fixed inset-0 z-50',
        'transition-opacity duration-300 ease-in-out',
        expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      {/** Overlay */}
      <button
        onClick={close}
        aria-label="Close panel"
        className="absolute inset-0 bg-black/30"
      />

      {/** Aside Panel */}
      <aside
        className={cn(
          // Position and dimensions
          'absolute right-0 top-0',
          'h-[100dvh] w-full max-w-md',
          // Layout
          'flex flex-col',
          // Visual styling
          'bg-white shadow-xl',
          // Animation
          'transform transition-transform duration-300 ease-in-out',
          // Slide states
          expanded ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/** Header */}
        <header
          className={cn(
            'flex items-center justify-between',
            'border-b border-gray-100',
            'px-6 py-4'
          )}
        >
          <h3 className="font-sans text-xl font-medium text-black">
            {heading}
          </h3>
          <button
            onClick={close}
            className={cn(
              '-mr-2 p-2',
              'text-gray-400',
              'transition-colors duration-300',
              'hover:text-gray-500'
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/** Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </aside>
    </div>
  )
}

export default Aside

const AsideContext = createContext<AsideContextValue | null>(null)

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed')

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  )
}

export function useAside() {
  const aside = useContext(AsideContext)
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider')
  }
  return aside
}
