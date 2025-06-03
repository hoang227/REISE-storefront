type CollectionNavigationSectionProps = {
  productsLength: number
}

const CollectionNavigationSection = ({
  productsLength,
}: CollectionNavigationSectionProps) => {
  return (
    <section className="bg-brand-cream border-y border-black/10">
      <div className="container mx-auto">
        <div className="flex flex-col items-start justify-between gap-4 px-4 py-8 md:flex-row md:items-center">
          <div className="space-y-2">
            <h2 className="font-sans text-2xl text-black">
              Customizable Photobooks
            </h2>
            <p className="font-sans font-light text-black">
              Showing {productsLength} products
            </p>
          </div>
          {/* <div className="flex items-center gap-6">
          <button className="text-brand-navy/60 hover:text-brand-navy font-sans text-sm transition-colors">
            Filter
          </button>
          <button className="text-brand-navy/60 hover:text-brand-navy font-sans text-sm transition-colors">
            Sort
          </button>
        </div> */}
        </div>
      </div>
    </section>
  )
}

export default CollectionNavigationSection
