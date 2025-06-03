const TestimonialsSection = () => {
  return (
    <section className="bg-neutral-50 px-4 py-24">
      <div className="container mx-auto">
        <h2 className="mb-4 text-center font-sans text-4xl">Love Notes</h2>
        <p className="mx-auto mb-16 max-w-2xl text-center font-sans font-light text-gray-600">
          Stories from our community of memory keepers
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-8">
            <p className="mb-6 font-sans font-light italic text-gray-600">
              &ldquo;Being miles apart from my partner is tough, but having our
              memories beautifully preserved in The Lover Book makes the
              distance feel a little shorter. It&apos;s like having a piece of
              our story I can hold.&rdquo;
            </p>
            <p className="font-sans font-medium">Sarah K.</p>
            <p className="font-sans text-sm text-gray-600">
              Long-distance couple, NYC - London
            </p>
          </div>

          <div className="rounded-lg bg-white p-8">
            <p className="mb-6 font-sans font-light italic text-gray-600">
              &ldquo;The Travel Book perfectly captures our year-long adventure
              across Asia. The quality is outstanding, and the customization
              options let us tell our story exactly how we wanted.&rdquo;
            </p>
            <p className="font-sans font-medium">Mike & Emma</p>
            <p className="font-sans text-sm text-gray-600">
              Travel enthusiasts
            </p>
          </div>

          <div className="rounded-lg bg-white p-8">
            <p className="mb-6 font-sans font-light italic text-gray-600">
              &ldquo;We create a Family Book every year, and watching our
              collection grow alongside our children is priceless. These books
              have become our most treasured possessions.&rdquo;
            </p>
            <p className="font-sans font-medium">The Patel Family</p>
            <p className="font-sans text-sm text-gray-600">
              Annual memory keepers
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
