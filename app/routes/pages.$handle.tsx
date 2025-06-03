import {Link} from 'react-router'
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen'
import {useLoaderData, type MetaFunction} from 'react-router'
import {Image} from '@shopify/hydrogen'
import {redirectIfHandleIsLocalized} from '~/lib/redirect'

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}]
}

// Function to get hero image URL based on page handle
const getHeroImage = (handle: string) => {
  const images = {
    'about-us': '/images/Hands.jpg',
    faq: '/images/FAQ.jpg',
  }
  return images[handle as keyof typeof images] || '/images/Hero Image.jpg'
}

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args)

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args)

  return {...deferredData, ...criticalData}
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle')
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ])

  if (!page) {
    throw new Response('Not Found', {status: 404})
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page})

  return {
    page,
  }
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {}
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>()

  // Get the hero image URL based on the current page handle
  const heroImage = getHeroImage(page.handle)

  return (
    <div className="">
      {/** Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] bg-gray-50">
        <div className="absolute inset-0">
          <Image
            alt="Our Photobooks Collection"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
            sizes="100vw"
            loading="eager"
            data={{
              url: heroImage,
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
              {page.title}
            </h1>
            <p className="mb-8 max-w-xl font-sans text-lg font-light text-gray-100">
              {page.subtitle?.value}
            </p>
          </div>
        </div>
      </div>

      {/** Page Section */}
      <section className="bg-white px-4">
        <div className="container mx-auto max-w-3xl">
          <div
            className="font-sans text-black"
            dangerouslySetInnerHTML={{
              __html: page.body
                .replaceAll(/<h2>/g, '<h2 class="text-2xl text-black mt-16">')
                .replaceAll(/<h3>/g, '<h3 class=" text-lg text-black mt-8">')
                .replaceAll(
                  /<p>/g,
                  '<p class=" text-md font-light text-black mt-8">'
                )
                .replaceAll(
                  /<li>/g,
                  '<li class=" text-md font-light text-black mt-4">'
                ),
            }}
          />
        </div>
      </section>

      {/** CTA Section */}
      {page.ctaContent?.value && (
        <section className="mt-12 bg-neutral-50 px-4 py-16">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl">
              <div
                className="font-sans text-black/80"
                dangerouslySetInnerHTML={{
                  __html: page.ctaContent.value.replaceAll(
                    /<h2>/g,
                    '<h2 class=" text-2xl text-black">'
                  ),
                }}
              />

              <Link
                to="/collections/all"
                prefetch="intent"
                className="font-source hover:bg-brand-accent mt-8 inline-flex items-center bg-black px-8 py-4 tracking-wide text-white transition-colors duration-300"
              >
                {page.ctaButton?.value}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      subtitle: metafield(namespace: "pages", key: "subtitle") {
        value
      }
      introText: metafield(namespace: "pages", key: "intro_text") {
        value
      }
      ctaContent: metafield(namespace: "pages", key: "cta_content") {
        value
      }
      ctaButton: metafield(namespace: "pages", key: "cta_button") {
        value
      }
      seo {
        description
        title
      }
    }
  }
` as const
