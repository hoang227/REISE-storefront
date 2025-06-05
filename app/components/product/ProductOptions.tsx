import {MappedProductOptions} from '@shopify/hydrogen'
import {ChevronDown} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router'

type ProductOptionsProps = {
  productOptions: MappedProductOptions[]
}

const ProductOptions = ({productOptions}: ProductOptionsProps) => {
  const navigate = useNavigate()
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
            <div>
              <div className="mb-1 ml-2 font-medium">{option.name}</div>
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
                        className="block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-200 disabled:opacity-50"
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
                      className="block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-200 disabled:opacity-50"
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
  )
}

export default ProductOptions
