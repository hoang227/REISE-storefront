import {ProductFragment} from 'storefrontapi.generated'
import {ProductPrice} from '../ProductPrice'

type ProductInfoProps = {
  product: ProductFragment
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant']
}

const ProductInfo = ({product, selectedVariant}: ProductInfoProps) => {
  return (
    <>
      {/** Product Title and Price */}
      <div className="space-y-4 border-b-[1.5px] border-black/30 pb-4">
        <h1 className="font-sans text-2xl font-semibold text-black md:text-3xl lg:text-4xl">
          {product.title}
        </h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
          className="font-sans text-xl text-black"
        />
      </div>

      {/** Product Description */}
      <div className="max-w-none font-sans text-sm text-black">
        <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
      </div>
    </>
  )
}

export default ProductInfo
