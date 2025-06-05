import {Link, useNavigate} from 'react-router'
import {RichText, type MappedProductOptions} from '@shopify/hydrogen'
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types'
import {AddToCartButton} from './AddToCartButton'
import {useAside} from './Aside'
import type {ProductFragment} from 'storefrontapi.generated'
import {useState, useEffect, useRef} from 'react'
import {ChevronDown} from 'lucide-react'

export function ProductForm({
  product,
  productOptions,
  selectedVariant,
  className,
}: {
  product: ProductFragment
  productOptions: MappedProductOptions[]
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant']
  className?: string
}) {
  const navigate = useNavigate()
  const {open} = useAside()
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>(
    {}
  )
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({})

  const toggleDropdown = (optionName: string) => {
    setOpenDropdowns((prev) => {
      const newState = {
        ...prev,
        [optionName]: !prev[optionName],
      }
      // Close all other dropdowns when opening a new one
      if (newState[optionName]) {
        Object.keys(newState).forEach((key) => {
          if (key !== optionName) newState[key] = false
        })
      }
      return newState
    })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(dropdownRefs.current).forEach(([optionName, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdowns((prev) => ({
            ...prev,
            [optionName]: false,
          }))
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="space-y-8">
        {/** Variant Options */}
        <div className="flex flex-col gap-4">
          {productOptions.map((option) => {
            if (option.optionValues.length === 1) return null

            // Find the selected value for this option
            const selectedValue = option.optionValues.find(
              (value) => value.selected
            )

            return (
              <div
                key={option.name}
                className="relative"
                ref={(el) => (dropdownRefs.current[option.name] = el)}
              >
                <div className="">
                  <div className="font-medium">{option.name}</div>
                  <button
                    onClick={() => toggleDropdown(option.name)}
                    className="flex w-full items-center justify-between gap-2 rounded-full border border-black/30 px-4 py-2 font-sans text-sm hover:border-black"
                  >
                    <span>{selectedValue?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {openDropdowns[option.name] && (
                  <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-black/10 bg-white p-2 shadow-lg">
                    {option.optionValues.map((value) => {
                      const {
                        name,
                        handle,
                        variantUriQuery,
                        selected,
                        available,
                        exists,
                        isDifferentProduct,
                      } = value

                      if (isDifferentProduct) {
                        return (
                          <Link
                            className="block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50"
                            key={option.name + name}
                            prefetch="intent"
                            preventScrollReset
                            replace
                            to={`/products/${handle}?${variantUriQuery}`}
                          >
                            {name}
                          </Link>
                        )
                      }

                      return (
                        <button
                          key={option.name + name}
                          className="block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50"
                          disabled={!exists}
                          onClick={() => {
                            if (!selected) {
                              navigate(`?${variantUriQuery}`, {
                                replace: true,
                                preventScrollReset: true,
                              })
                              toggleDropdown(option.name)
                            }
                          }}
                        >
                          {name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/** Add to Cart Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-source text-brand-navy/60 text-sm">
              {selectedVariant?.availableForSale
                ? 'Ready to ship'
                : 'Currently unavailable'}
            </div>
            {selectedVariant?.sku && (
              <div className="font-source text-brand-navy/60 text-sm">
                SKU: {selectedVariant.sku}
              </div>
            )}
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
        {/** Materials Section */}
        {product.material?.value && (
          <details className="group px-4 py-2">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <h3 className="font-sans text-sm font-medium text-black">
                Materials
              </h3>
              <span className="relative ml-4 h-4 w-4 flex-shrink-0">
                <svg
                  className="absolute inset-0 h-4 w-4 transition duration-300 group-open:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>
            <div className="prose pt-4 font-sans text-sm text-black">
              <RichText data={product.material.value} />
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined
  name: string
}) {
  const image = swatch?.image?.previewImage?.url
  const color = swatch?.color

  if (!image && !color) return name

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  )
}
