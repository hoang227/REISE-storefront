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

export function getNumberOfPagesFromVariant(
  variant: NonNullable<ProductFragment['selectedOrFirstAvailableVariant']>
): number {
  const pagesOption = variant.selectedOptions.find(
    (option) =>
      option.name.toLowerCase().includes('number of pages') ||
      option.name.toLowerCase().includes('pages')
  )

  if (pagesOption) {
    const matches = pagesOption.value.match(/(\d+)/)
    if (matches) {
      return parseInt(matches[1])
    }
  }

  const title = variant.title
  const matches = title.match(/\((\d+) images\)/)
  const numberOfImages = matches ? parseInt(matches[1]) : 0
  return numberOfImages
}
