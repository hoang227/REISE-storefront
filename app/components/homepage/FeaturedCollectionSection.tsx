import {Suspense} from 'react'
import {Await} from 'react-router'
import ProductItem from '../ProductItem'
import type {
  RecommendedProductsQuery,
  FeaturedCollectionFragment,
} from 'storefrontapi.generated'

type LoaderData = {
  recommendedProducts: Promise<RecommendedProductsQuery | null>
  featuredCollection: FeaturedCollectionFragment
}

type FeaturedCollectionProps = {
  data: LoaderData
}

const FeaturedCollectionSection = ({data}: FeaturedCollectionProps) => {
  return (
    <section className="bg-white px-4 py-20">
      <div className="container mx-auto">
        <h2 className="mb-4 text-center font-sans text-4xl">
          Perfect for Every Story
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center font-sans font-light text-gray-600">
          Thoughtfully curated themes, each crafted for different moments in
          life.
        </p>
        <div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {Array.from({length: 3}).map((_, i) => (
                  <div
                    key={`featured-collection-skeleton-${crypto.randomUUID()}`}
                    className="h-40 w-40 animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            }
          >
            <Await resolve={data.recommendedProducts}>
              {(response) => (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {response?.products.nodes.map((product) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      loading="lazy"
                      hidePrice
                    />
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollectionSection
