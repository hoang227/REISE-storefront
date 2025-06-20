import {Await} from 'react-router'
import {Suspense} from 'react'
import type {CartApiQueryFragment} from 'storefrontapi.generated'
import Aside from '~/components/Aside'
import {CartMain} from '~/components/CartMain'

interface EditorLayoutProps {
  cart: Promise<CartApiQueryFragment | null>
  children?: React.ReactNode
}

export function EditorLayout({cart, children}: EditorLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <main className="flex h-screen flex-col bg-white pt-12">{children}</main>
    </Aside.Provider>
  )
}

function CartAside({cart}: {cart: EditorLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />
          }}
        </Await>
      </Suspense>
    </Aside>
  )
}
