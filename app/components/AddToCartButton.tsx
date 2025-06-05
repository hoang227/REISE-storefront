import {type FetcherWithComponents} from 'react-router'
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen'
import {useEffect, useState} from 'react'
import {Check, Loader2, ShoppingBag} from 'lucide-react'
import {cn} from '~/lib/utils'

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  afterAddToCart,
}: {
  analytics?: unknown
  children: React.ReactNode
  disabled?: boolean
  lines: Array<OptimisticCartLineInput>
  onClick?: () => void
  afterAddToCart: () => void
}) {
  const [addedToCart, setAddedToCart] = useState<boolean>(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (addedToCart) {
      timeout = setTimeout(() => {
        setAddedToCart(false)
      }, 2500)
    }
    return () => clearTimeout(timeout)
  }, [addedToCart])

  const buttonBaseStyles = cn(
    // Base styles
    'relative flex w-full items-center justify-center gap-3',
    'font-source text-base tracking-wider',
    'px-8 py-5',

    // Colors
    'bg-black text-white',
    'disabled:bg-brand-gray disabled:cursor-not-allowed',
    'hover:bg-brand-accent',

    // Animation setup
    'overflow-hidden transition-all duration-300 ease-in-out',

    // Shine effect
    'before:absolute before:left-0 before:top-0',
    'before:h-full before:w-full',
    'before:translate-x-[-100%]',
    'before:bg-white/10',
    'before:transition-transform before:duration-700',
    'before:content-[""]',
    'hover:before:translate-x-[100%]',
    'disabled:before:hidden'
  )

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => {
        const isLoading = fetcher.state !== 'idle'

        useEffect(() => {
          if (
            fetcher.state === 'idle' &&
            fetcher.data &&
            !fetcher.data.errors
          ) {
            setAddedToCart(true)
            if (afterAddToCart) {
              afterAddToCart()
            }
          }
        }, [fetcher.state, fetcher.data])

        return (
          <div className="relative">
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled || isLoading}
              className={buttonBaseStyles}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Adding to Cart</span>
                </>
              ) : addedToCart ? (
                <>
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span className="font-medium">{children}</span>
                </>
              )}
            </button>

            {/** Premium Loading Indicator */}
            {isLoading && (
              <div
                className={cn(
                  'absolute bottom-0 left-0 h-0.5 w-full',
                  'bg-brand-cream'
                )}
              >
                <div
                  className={cn(
                    'h-full animate-progress',
                    'from-brand-gold to-brand-navy bg-gradient-to-r'
                  )}
                />
              </div>
            )}
          </div>
        )
      }}
    </CartForm>
  )
}
