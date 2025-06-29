import {cn} from '~/lib/utils'

type NoNavHeaderProps = {
  isScrolled: boolean
}

const NoNavHeader = ({isScrolled}: NoNavHeaderProps) => {
  return (
    <div
      className={cn(
        'fixed z-40 w-full translate-y-0',
        'transition-transform duration-500 ease-in-out'
      )}
    >
      {/** Announcement Bar */}
      <div
        className={cn(
          'overflow-hidden bg-black text-white',
          'transition-all duration-500 ease-in-out',
          isScrolled ? 'max-h-0' : 'max-h-12'
        )}
      >
        <div className={cn('container mx-auto px-4 py-2', 'text-center')}>
          <p
            className={cn(
              'font-sans text-[13px] font-light',
              'leading-tight tracking-wider'
            )}
          >
            Free shipping for orders above SGD50
          </p>
        </div>
      </div>

      {/** Main Header */}
      <header
        className={cn(
          'border-b transition-all duration-500 ease-in-out',
          isScrolled
            ? 'border-transparent bg-white/60 shadow-sm backdrop-blur-lg'
            : 'border-gray-100 bg-white'
        )}
      >
        <div className="container mx-auto">
          {/** Desktop Header */}
          <div
            className={cn(
              'transition-all duration-300 ease-in-out sm:px-6',
              isScrolled ? 'py-3 sm:py-4' : 'sm:py- py-4'
            )}
          >
            {/** Mobile Logo */}
            <div className="text-center font-sans text-2xl tracking-normal min-[551px]:hidden">
              <h1 className="my-0 font-medium text-black hover:text-brand-accent">
                REISE
              </h1>
            </div>

            {/** Logo */}
            <div
              className={cn(
                'text-black hover:text-brand-accent',
                'text-center font-sans tracking-wider',
                'transition-all duration-300 ease-in-out max-[550px]:hidden',

                isScrolled ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
              )}
            >
              <h1 className="font-medium">REISE</h1>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default NoNavHeader
