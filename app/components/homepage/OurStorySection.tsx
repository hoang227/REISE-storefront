import {Link} from 'react-router'
import {Image} from '@shopify/hydrogen'
import {ArrowRight} from 'lucide-react'

const OurStorySection = () => {
  return (
    <section className="bg-white px-4 py-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="max-w-xl">
            <h2 className="mb-6 font-sans text-3xl">
              Born from Love, Miles Apart
            </h2>
            <p className="mb-8 font-sans leading-relaxed text-gray-600">
              Our story began with two friends sharing a common
              experience—navigating the beautiful yet challenging world of
              long-distance relationships. We found ourselves constantly seeking
              meaningful ways to stay connected with our partners, to make the
              distance feel a little shorter.
            </p>
            <p className="mb-8 font-sans leading-relaxed text-gray-600">
              What started as personal projects to create beautiful photobooks
              for our own partners has evolved into something bigger. We
              realized that countless others, whether separated by distance from
              their loved ones, capturing their travel adventures, or preserving
              family moments, share this desire to transform their digital
              memories into tangible treasures.
            </p>
            <Link
              to="/pages/our-story"
              className="hover:text-brand-accent inline-flex items-center font-sans font-medium text-black transition-colors duration-300"
            >
              Read Our Story
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="aspect-square overflow-hidden">
            <Image
              alt="Our Story"
              className="rounded-none object-cover"
              data={{
                url: '/images/Hero Image.jpg',
                width: 800,
                height: 800,
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStorySection
