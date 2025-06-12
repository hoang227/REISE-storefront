import {NavLink} from 'react-router'
import {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated'

import {useAside} from '~/components/Aside'
import {cn} from '~/lib/utils'
import {Search, User} from 'lucide-react'
import {HeaderProps} from './Header'

type HeaderMenuProps = {
  menu: HeaderProps['header']['menu']
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url']
  viewport: Viewport
  publicStoreDomain: HeaderProps['publicStoreDomain']
}

type Viewport = 'desktop' | 'mobile'

const HeaderMenu = ({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: HeaderMenuProps) => {
  const {close} = useAside()

  const baseClassName = cn(
    'relative font-sans transition-all duration-200 hover:text-brand-accent',
    'whitespace-nowrap',
    'after:content-[""]',
    'after:absolute after:bottom-0 after:left-0',
    'after:h-[3px] after:w-0 after:bg-brand-accent',
    'after:transition-all after:duration-300',
    'hover:after:w-full'
  )

  const disabledClassName = cn(
    'relative font-sans opacity-0',
    'whitespace-nowrap',
    'cursor-default'
  )

  const desktopClassName = cn(
    'flex items-center justify-center',
    'lg:space-x-8 xl:space-x-12',
    'text-sm uppercase tracking-wider'
  )

  const mobileClassName = 'flex flex-col px-6'

  return (
    <nav
      className={viewport === 'desktop' ? desktopClassName : mobileClassName}
      role="navigation"
    >
      {/** Desktop Menu */}
      {viewport === 'desktop' &&
        menu?.items.map((item) => {
          if (!item.url) return null
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) || // reise.com/collections
            item.url.includes(primaryDomainUrl) // store.reise.com/collections
              ? new URL(item.url).pathname // --> collections
              : item.url // google.com ?

          return (
            <NavLink
              className={({isActive}) =>
                cn(baseClassName, isActive ? 'text-brand-accent' : 'text-black')
              }
              end
              onClick={close}
              prefetch="intent"
              key={item.id}
              to={url}
            >
              {item.title}
            </NavLink>
          )
        })}

      {/** Mobile Menu */}
      {viewport === 'mobile' && (
        <>
          {/** Mobile Navigation Links */}
          <div className="space-y-6 py-4">
            {menu?.items.map((item) => {
              if (!item.url) return null
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) || // reise.com/collections
                item.url.includes(primaryDomainUrl) // store.reise.com/collections
                  ? new URL(item.url).pathname // --> collections
                  : item.url // google.com ?

              return (
                <NavLink
                  className={({isActive}) =>
                    cn(
                      'block py-2 text-lg',
                      baseClassName,
                      isActive ? 'text-brand-accent' : 'text-black'
                    )
                  }
                  end
                  onClick={close}
                  prefetch="intent"
                  key={item.id}
                  to={url}
                >
                  {item.title}
                </NavLink>
              )
            })}
          </div>

          {/** Mobile Footer Links */}
          <div className="mt-auto border-t border-gray-100 py-6">
            <div className="space-y-4">
              <NavLink
                to="/account"
                className={cn(
                  'flex items-center space-x-2',
                  'text-black hover:text-brand-accent'
                )}
              >
                <User className="h-5 w-5" />
                <span className="font-sans text-base">Account</span>
              </NavLink>

              <button
                onClick={() => {
                  close()

                  // TODO: Search logic
                }}
                className={cn(
                  'flex w-full items-center space-x-2 text-left',
                  'text-black hover:text-brand-accent'
                )}
              >
                <Search className="h-5 w-5" />
                <span className="font-sans text-base">Search</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default HeaderMenu
