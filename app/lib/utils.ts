import {type ClassValue, clsx} from 'clsx'
import {ProductFragment} from 'storefrontapi.generated'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMaxPagesFromVariant(
  variant: NonNullable<ProductFragment['selectedOrFirstAvailableVariant']>
) {
  const title = variant.title
  const matches = title.match(/\((\d+) images\)/)
  const numberOfImages = matches ? parseInt(matches[1]) : 0
  return numberOfImages
}
