import {Image} from '@shopify/hydrogen'

const HeroSection = () => {
  return (
    <section className="relative h-[50vh] min-h-[400px] bg-gray-50">
      <div className="absolute inset-0">
        <Image
          alt="Our Photobooks Collection"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          sizes="100vw"
          loading="eager"
          data={{
            url: '/images/Collections.jpg',
            height: 1920,
            width: 1080,
          }}
        />
        {/** Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="container relative mx-auto flex h-full items-center px-4 pt-[180px] sm:pt-[105px]">
        <div className="max-w-2xl">
          <h1 className="mb-6 font-sans text-4xl font-light text-white md:text-6xl">
            Our Photobooks
          </h1>
          <p className="mb-8 max-w-xl font-sans text-lg font-light text-gray-100">
            Curate your memories into beautiful, timeless photobooks. Each
            design tells a unique story.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
