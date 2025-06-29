import {Menu} from 'lucide-react'
import {useAside} from '../Aside'

const HeaderMenuMobileToggle = () => {
  const {open} = useAside()
  return (
    <button
      className="-ml-2 p-2 transition-colors duration-200 hover:text-brand-accent"
      onClick={() => open('mobile')}
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

export default HeaderMenuMobileToggle
