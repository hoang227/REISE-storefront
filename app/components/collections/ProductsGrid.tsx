import {PaginatedResourceSection} from '../PaginatedResourceSection'
import ProductItem from '../ProductItem'
import type {
  CollectionQuery,
  CollectionItemFragment,
} from 'storefrontapi.generated'

type ProductsGridProps = {
  products: NonNullable<CollectionQuery['collection']>['products']
}

const ProductsGrid = ({products}: ProductsGridProps) => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {products && products.nodes && (
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {({
              node: product,
              index,
            }: {
              node: CollectionItemFragment
              index: number
            }) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        )}
      </div>
    </section>
  )
}

export default ProductsGrid
