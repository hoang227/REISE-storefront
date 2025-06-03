import {Link} from 'react-router'
import {Image} from '@shopify/hydrogen'
import {cn} from '~/lib/utils'

const buttonBaseStyles =
  'rounded border-2 border-white px-10 py-4 font-sans transition-colors duration-200'

const aboutButtonStyles = cn(
  buttonBaseStyles,
  'text-white hover:bg-white hover:text-black'
)
const shopButtonStyles = cn(
  buttonBaseStyles,
  'flex items-center bg-white hover:border-black hover:bg-black hover:text-white'
)

const HeroSection = () => {
  return (
    <section className="relative h-[100vh] min-h-[600px] bg-black">
      <Image
        alt="Hero Image"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="eager"
        data={{
          url: '/images/Photo1.jpg',
          width: 1920,
          height: 1080,
        }}
      />
      <div className="container relative mx-auto flex h-full items-center justify-center px-4">
        <div className="flex max-w-2xl flex-col items-center justify-center space-y-6">
          <h1 className="font-sans text-4xl font-bold uppercase text-white md:text-6xl">
            Curate the Chaos
          </h1>
          <p className="text-md font-sans font-light text-white md:text-lg">
            Turning life&apos;s beautiful mess into something meaningful
          </p>
          <div className="flex justify-center space-x-6">
            <div className={aboutButtonStyles}>
              <Link to="/pages/about-us">About Us</Link>
            </div>

            <div className={shopButtonStyles}>
              <Link to="/collections/all">Shop Now</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
