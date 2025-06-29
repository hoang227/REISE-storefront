import {useEffect, useState} from 'react'

interface LoadingPageProps {
  onComplete: () => void
}

export function LoadingPage({onComplete}: LoadingPageProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 1500 // 1.5 seconds
    const interval = 16 // ~60fps
    const steps = duration / interval
    const increment = 100 / steps

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 100) // Small delay for smooth transition
          return 100
        }
        return newProgress
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white font-sans">
      <div className="text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900">REISE</h1>
          <p className="mt-2 text-sm text-gray-500">Photobook Creator</p>
        </div>

        {/* Three Dots with Color Changes and Pulse */}
        <div className="mb-6">
          <div className="flex justify-center space-x-3">
            <div
              className={`h-4 w-4 animate-pulse rounded-full transition-colors duration-300 ${
                progress > 33 ? 'bg-brand-accent' : 'bg-gray-300'
              }`}
            ></div>
            <div
              className={`h-4 w-4 animate-pulse rounded-full transition-colors duration-300 ${
                progress > 66 ? 'bg-brand-accent' : 'bg-gray-300'
              }`}
              style={{animationDelay: '0.2s'}}
            ></div>
            <div
              className={`h-4 w-4 animate-pulse rounded-full transition-colors duration-300 ${
                progress > 99 ? 'bg-brand-accent' : 'bg-gray-300'
              }`}
              style={{animationDelay: '0.4s'}}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
