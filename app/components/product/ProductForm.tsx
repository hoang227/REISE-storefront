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
      <StartDesigningButton
        selectedVariant={selectedVariant}
        productHandle={product.handle}
      />
    </div>
  )
}
