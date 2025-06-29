import {type LoaderFunctionArgs} from '@shopify/remix-oxygen'
import {useLoaderData, type MetaFunction} from 'react-router'
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen'
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection'
import ProductItem from '~/components/product/ProductItem'
import {Link} from 'react-router'
import HeroSection from '~/components/collections/HeroSection'
import CollectionNavigationSection from '~/components/collections/CollectionNavigationSection'
import ProductsGrid from '~/components/collections/ProductsGrid'

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `REISE | All Photobooks`}]
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
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  })

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ])
  return {products}
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {}
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>()
  const productsLength = products?.nodes?.length || 0

  return (
    <div className="collection">
      <HeroSection />
      <CollectionNavigationSection productsLength={productsLength} />
      <ProductsGrid products={products} />
    </div>
  )
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }    
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    # metafields
    tagline: metafield(namespace: "product", key: "tag_line") {
      value
    }
  }
` as const

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const
