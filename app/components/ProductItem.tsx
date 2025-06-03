import {Link} from 'react-router'
import {Image, Money} from '@shopify/hydrogen'
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated'
import {useVariantUrl} from '~/lib/variants'
import {ArrowRight} from 'lucide-react'
import {cn} from '~/lib/utils'

type ProductItemProps = {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment
  loading?: 'eager' | 'lazy'
  hidePrice?: boolean
}

const ProductItem = ({product, loading, hidePrice}: ProductItemProps) => {
  const variantUrl = useVariantUrl(product.handle)
  const image = product.featuredImage
  const tagline = product.tagline?.value

  return (
    <Link
      className="group relative block overflow-hidden rounded-2xl bg-neutral-100"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/** Image wrapper with overflow hidden */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-white">
        {image && (
          <>
            {/* Image with its own rounded corners */}
            <div className="h-full w-full overflow-hidden rounded-t-2xl">
              <Image
                alt={image.altText || product.title}
                className="h-full w-full rounded-b-none object-cover transition-transform duration-500 group-hover:scale-105"
                data={image}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                loading={loading}
              />
            </div>

            {/** Customize Button */}
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0',
                'translate-y-full transform',
                'transition-transform duration-500 ease-out',
                'group-hover:translate-y-0'
              )}
            >
              <div
                className={cn(
                  'bg-white/90 px-4 py-3 text-center backdrop-blur-sm'
                )}
              >
                <span className="font-sans text-sm font-medium tracking-wide text-black">
                  Customize
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/** Product Information */}
      <div className="relative px-4 py-6">
        <h4
          className={cn(
            'mb-2 font-sans text-lg text-black',
            'transition-colors duration-500',
            'group-hover:text-brand-accent group-hover:underline'
          )}
        >
          {product.title}
        </h4>
        <div className="flex items-center justify-between">
          {!hidePrice ? (
            <div className="flex items-center justify-center font-sans font-light text-gray-600">
              <span>SGD</span>
              <Money
                data={product.priceRange.minVariantPrice}
                withoutCurrency
              />
              <span className="ml-[4px]">-</span>
              <Money
                data={product.priceRange.maxVariantPrice}
                withoutCurrency
              />
            </div>
          ) : (
            <p className="font-sans text-sm font-light text-gray-600">
              {tagline}
            </p>
          )}
          <span
            className={cn(
              'font-source flex text-sm text-black',
              'opacity-0 transition-opacity duration-500',
              'group-hover:opacity-100'
            )}
          >
            <ArrowRight className="ml-2 h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
