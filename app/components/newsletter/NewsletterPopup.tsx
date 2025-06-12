import {useState, useEffect} from 'react'
import {X} from 'lucide-react'
import {Form} from 'react-router'
import {cn} from '~/lib/utils'

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if user has already interacted with the popup
    const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup')
    if (!hasSeenPopup) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setHasInteracted(true)
    localStorage.setItem('hasSeenNewsletterPopup', 'true')
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center px-4',
        'animate-in fade-in duration-300'
      )}
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close newsletter popup"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl',
          'animate-in slide-in-from-bottom-4 duration-500'
        )}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            'absolute right-4 top-4 p-2',
            'rounded-full text-black/40 transition-colors',
            'hover:bg-black/5 hover:text-black'
          )}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="mb-2 font-sans text-2xl font-medium">
            Join Our Community
          </h2>
          <p className="mb-6 text-black/60">
            Subscribe to our newsletter and be the first to know about new
            products, special offers, and creative inspiration.
          </p>

          {isSuccess ? (
            <div className="mx-auto max-w-sm text-center">
              <p className="text-lg font-medium text-brand-accent">
                Thanks for subscribing!
              </p>
            </div>
          ) : (
            <Form
              method="post"
              action=""
              className="mx-auto max-w-sm space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setIsSuccess(true)
                // Auto close after 2 seconds
                setTimeout(() => {
                  handleClose()
                }, 2000)
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className={cn(
                  'w-full rounded-lg border border-black/10 px-4 py-3',
                  'font-sans text-sm placeholder:text-black/40',
                  'focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent'
                )}
              />
              <button
                type="submit"
                className={cn(
                  'w-full rounded-lg bg-brand-accent px-8 py-3',
                  'font-sans text-sm font-medium text-white',
                  'transition-colors duration-200',
                  'hover:bg-brand-accent/90'
                )}
              >
                Subscribe
              </button>
            </Form>
          )}

          <p className="mt-4 text-xs text-black/40">
            By subscribing, you agree to receive marketing communications from
            us. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
