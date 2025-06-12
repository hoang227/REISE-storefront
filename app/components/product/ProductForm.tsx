import type {ProductFragment} from 'storefrontapi.generated'
import StartDesigningButton from './StartDesigningButton'

export function ProductForm({
  selectedVariant,
  product,
}: {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant']
  product: ProductFragment
}) {
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
      <div>
        <StartDesigningButton
          selectedVariant={selectedVariant}
          productHandle={product.handle}
        />
        <h1 className="mt-2 text-center font-sans text-sm font-medium text-black">
          20+ bought in past week
        </h1>
      </div>
    </div>
  )
}
