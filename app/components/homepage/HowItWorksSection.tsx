const HowItWorksSection = () => {
  return (
    <section className="bg-neutral-50 px-4 py-24">
      <div className="container mx-auto">
        <h2 className="mb-4 text-center font-sans text-4xl">How It Works</h2>
        <p className="mx-auto mb-16 max-w-2xl text-center font-sans font-light text-gray-600">
          Create your perfect photobook in three simple steps
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-brand-accent mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-white">
              <span className="font-sans text-2xl">1</span>
            </div>
            <h3 className="mb-3 font-sans text-xl">Choose Your Design</h3>
            <p className="font-sans font-light text-gray-600">
              Select from our curated collection of themes designed for every
              occasion
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-accent mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-white">
              <span className="font-sans text-2xl">2</span>
            </div>
            <h3 className="mb-3 font-sans text-xl">Upload & Customize</h3>
            <p className="font-sans font-light text-gray-600">
              Add your photos, personalize layouts, and make it uniquely yours
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-accent mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-white">
              <span className="font-sans text-2xl">3</span>
            </div>
            <h3 className="mb-3 font-sans text-xl">Order & Share</h3>
            <p className="font-sans font-light text-gray-600">
              We&apos;ll carefully craft your photobook and deliver it to your
              doorstep
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
