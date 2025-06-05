import {type MappedProductOptions} from '@shopify/hydrogen'
import {AddToCartButton} from './AddToCartButton'
import {useAside} from './Aside'
import type {ProductFragment} from 'storefrontapi.generated'

export function ProductForm({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant']
}) {
  const {open} = useAside()

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between font-sans text-xs text-black/50">
        <div>
          {selectedVariant?.availableForSale
            ? 'Ready to ship'
            : 'Currently unavailable'}
        </div>
        {selectedVariant?.sku && <div>SKU: {selectedVariant.sku}</div>}
      </div>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        afterAddToCart={() => {
          open('cart')
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  )
}
