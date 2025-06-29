import {ProductFragment} from 'storefrontapi.generated'
import {ProductImage, GalleryImage} from './ProductImage'

type ProductImageCarouselProps = {
  product: ProductFragment
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant']
}

const ProductImageCarousel = ({
  product,
  selectedVariant,
}: ProductImageCarouselProps) => {
  return (
    <div className="space-y-8">
      <ProductImage
        images={product.images.nodes.map(
          (node) =>
            ({
              id: node.id,
              url: node.url,
              altText: node.altText,
              width: node.width,
              height: node.height,
            }) as GalleryImage
        )}
        selectedVariantImage={selectedVariant!.image}
      />
    </div>
  )
}

export default ProductImageCarousel
