const HowItWorksSection = () => {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-sans text-3xl font-light">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="relative text-center">
            <div className="mb-4">
              <span className="bg-brand-cream inline-block h-12 w-12 rounded-full text-2xl font-light leading-[48px]">
                1
              </span>
            </div>
            <h3 className="mb-2 font-sans text-lg">Choose Your Design</h3>
            <p className="font-sans font-light">
              Select from our curated collection of layouts.
            </p>
          </div>
          <div className="relative text-center">
            <div className="mb-4">
              <span className="bg-brand-cream inline-block h-12 w-12 rounded-full text-2xl font-light leading-[48px]">
                2
              </span>
            </div>
            <h3 className="mb-2 font-sans text-lg">Upload Photos</h3>
            <p className="font-sans font-light">
              Add your favorite memories to your book.
            </p>
          </div>
          <div className="relative text-center">
            <div className="mb-4">
              <span className="bg-brand-cream inline-block h-12 w-12 rounded-full text-2xl font-light leading-[48px]">
                3
              </span>
            </div>
            <h3 className="mb-2 font-sans text-lg">Customize</h3>
            <p className="font-sans font-light">
              Arrange photos and add personal touches.
            </p>
          </div>
          <div className="relative text-center">
            <div className="mb-4">
              <span className="bg-brand-cream inline-block h-12 w-12 rounded-full text-2xl font-light leading-[48px]">
                4
              </span>
            </div>
            <h3 className="mb-2 font-sans text-lg">Order</h3>
            <p className="font-sans font-light">
              We&apos;ll handle the rest with care.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
