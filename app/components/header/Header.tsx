import {useEffect, useState} from 'react'
import {NavLink} from 'react-router'

import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated'
import {useAside} from '~/components/Aside'
import HeaderMenu from './HeaderMenu'
import HeaderCtas from './HeaderCtas'
import {cn} from '~/lib/utils'
import {Menu} from 'lucide-react'

export interface HeaderProps {
  header: HeaderQuery
  cart: Promise<CartApiQueryFragment | null>
  isLoggedIn: Promise<boolean>
  publicStoreDomain: string
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header

  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingUp, setIsScrollingUp] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const {type: asideType} = useAside()

  useEffect(() => {
    const root = document.documentElement

    // Set the announcement banner height CSS variable
    root.style.setProperty('--announcement-height', isScrolled ? '0px' : '40px')

    // Set the main header height CSS variable
    root.style.setProperty('--header-height', isScrolled ? '64px' : '80px')

    const handleScroll = () => {
      // Don't process scroll events if aside/cart is open
      if (asideType !== 'closed') return

      const currScrollY = window.scrollY

      // Update scroll direction state
      setIsScrollingUp(currScrollY < lastScrollY)

      // Store current scroll position for next comparison
      setLastScrollY(currScrollY)

      // Update scrolled state based on scroll position
      setIsScrolled(currScrollY > 0)
    }

    // Add scroll event listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, {passive: true})

    // Cleanup function to remove event listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isScrolled, asideType])

  return (
    <div
      className={cn(
        'fixed z-40 w-full translate-y-0',
        'transition-transform duration-500 ease-in-out'
      )}
    >
      {/** Announcement Bar */}
      <div
        className={cn(
          'overflow-hidden bg-black text-white',
          'transition-all duration-500 ease-in-out',
          isScrolled ? 'max-h-0' : 'max-h-12'
        )}
      >
        <div className={cn('container mx-auto px-4 py-2', 'text-center')}>
          <p
            className={cn(
              'font-sans text-[13px] font-light',
              'leading-tight tracking-wider'
            )}
          >
            Free shipping for orders above SGD50
          </p>
        </div>
      </div>

      {/** Main Header */}
      <header
        className={cn(
          'border-b transition-all duration-500 ease-in-out',
          isScrolled
            ? 'border-transparent bg-white/60 shadow-sm backdrop-blur-lg'
            : 'border-gray-100 bg-white'
        )}
      >
        <div className="container mx-auto">
          {/** Mobile Logo (550px and below) */}
          <div
            className={cn(
              'hidden border-b border-gray-100 text-center',
              'transition-all duration-500 ease-in-out max-[550px]:block',
              isScrolled ? 'py-1' : 'py-2'
            )}
          >
            <NavLink
              prefetch="intent"
              to="/"
              className="inline-block font-sans text-2xl tracking-normal"
            >
              <h1 className="hover:text-brand-accent my-0 font-medium text-black">
                REISE
              </h1>
            </NavLink>
          </div>

          {/** Header Content */}
          <div
            className={cn(
              'grid grid-cols-3 px-4',
              'transition-all duration-300 ease-in-out sm:px-6',
              isScrolled ? 'py-3 sm:py-4' : 'sm:py- py-4'
            )}
          >
            {/** Mobile Menu Toggle */}
            <div className="lg:hidden">
              <HeaderMenuMobileToggle />
            </div>

            {/** Desktop Navigation */}
            <div className="my-auto hidden px-12 lg:block">
              <HeaderMenu
                menu={menu}
                viewport="desktop"
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </div>

            {/** Logo (Above 550px) */}
            <div className="mx-auto">
              <NavLink
                prefetch="intent"
                to="/"
                className={cn(
                  'hover:text-brand-accent text-black',
                  'text-center font-sans tracking-wider',
                  'transition-all duration-300 ease-in-out max-[550px]:hidden',

                  isScrolled ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
                )}
              >
                <h1 className="font-medium">REISE</h1>
              </NavLink>
            </div>

            {/** CTAS */}
            <div className="flex items-center justify-self-end">
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

function HeaderMenuMobileToggle() {
  const {open} = useAside()
  return (
    <button
      className="hover:text-brand-accent -ml-2 p-2 transition-colors duration-200"
      onClick={() => open('mobile')}
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}
