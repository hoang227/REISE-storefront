import {ChevronRight} from 'lucide-react'
import {cn} from '~/lib/utils'
import {Link} from 'react-router'
import {ProductFragment} from 'storefrontapi.generated'

type StartDesigningButtonProps = {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant']
  productHandle: string
  className?: string
}

const buttonBaseStyles = cn(
  // Base styles
  'relative flex w-full items-center justify-center gap-3',
  'font-source text-base tracking-wider',
  'px-8 py-5',

  // Colors
  'bg-black text-white',
  'disabled:bg-brand-gray disabled:cursor-not-allowed',
  'hover:bg-brand-accent',

  // Transition
  'transition-color duration-300'
)

const StartDesigningButton = ({
  selectedVariant,
  productHandle,
  className,
}: StartDesigningButtonProps) => {
  // Convert selected variant options to URL parameters
  const searchParams = new URLSearchParams()
  selectedVariant?.selectedOptions.forEach((option) => {
    searchParams.append(option.name, option.value)
  })
  const variantSearchParams = searchParams.toString()

  return (
    <Link
      to={`/products/${productHandle}/upload${variantSearchParams ? `?${variantSearchParams}` : ''}`}
      className={`${buttonBaseStyles} ${className}`}
    >
      <span>Start Designing</span>
      <ChevronRight className="h-4 w-4" />
    </Link>
  )
}

export default StartDesigningButton
