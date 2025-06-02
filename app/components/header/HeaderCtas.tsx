import {Suspense} from 'react'
import {Await, NavLink, useAsyncValue} from 'react-router'

import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated'
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen'
import {useAside} from '~/components/Aside'
import {HeaderProps} from './Header'
import {Search, ShoppingBag, User} from 'lucide-react'
import {cn} from '~/lib/utils'

type HeaderCtasProps = Pick<HeaderProps, 'isLoggedIn' | 'cart'>

const underlineAnimation = cn(
  // Base styles
  'relative p-2',
  'transition-colors duration-200',

  // Hover text color
  'hover:text-brand-accent',

  // Underline animation setup
  'after:absolute after:bottom-0',
  'after:left-1/2 after:-translate-x-1/2',
  'after:h-[1px] after:w-0',
  'after:bg-brand-accent',

  // Underline animation behavior
  'after:transition-all after:duration-300',
  'after:content-[""]',
  'hover:after:w-full'
)

const HeaderCtas = ({isLoggedIn, cart}: HeaderCtasProps) => {
  return (
    <nav
      className="flex items-center space-x-2 sm:space-x-3 lg:space-x-8"
      role="navigation"
    >
      <SearchToggle />
      <NavLink prefetch="intent" to="/account" className={underlineAnimation}>
        <span className="sr-only">Account</span>
        <User className="h-5 w-5" />
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  )
}

function SearchToggle() {
  const {open} = useAside()
  return (
    <button className={underlineAnimation} onClick={() => open('search')}>
      <Search className="h-5 w-5" />
    </button>
  )
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside()
  const {publish, shop, cart, prevCart} = useAnalytics()

  return (
    <button className={cn(underlineAnimation, 'relative')}>
      <ShoppingBag className="h-5 w-5" />
      {count !== null && count > 0 && (
        <span
          className={cn(
            'absolute right-1 top-1 h-4 w-4',
            'flex items-center justify-center',
            'bg-brand-accent rounded-full',
            'text-[10px] font-medium text-white'
          )}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  )
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null
  const cart = useOptimisticCart(originalCart)
  return <CartBadge count={cart?.totalQuantity ?? 0} />
}

export default HeaderCtas
