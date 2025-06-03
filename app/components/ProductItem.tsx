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
      className="group relative block"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/** Image container with hover effect */}
      <div className="group relative aspect-[4/5] overflow-hidden bg-white">
        {image && (
          <>
            <Image
              alt={image.altText || product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              data={image}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              loading={loading}
            />

            {/** View Button */}
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
      <div className="relative pt-6">
        <h4
          className={cn(
            'mb-2 font-sans text-lg text-black',
            'transition-colors duration-500',
            'group-hover:text-brand-accent'
          )}
        >
          {product.title}
        </h4>
        <div className="flex items-center justify-between">
          {!hidePrice ? (
            <Money
              data={product.priceRange.minVariantPrice}
              className="font-sans text-gray-600"
            />
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
