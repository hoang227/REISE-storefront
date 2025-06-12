import {Suspense} from 'react'
import {Await, NavLink} from 'react-router'
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated'
import NewsletterSection from './NewsletterSection'
import SocialMediaBanner from './SocialMediaBanner'

interface FooterProps {
  footer: Promise<FooterQuery | null>
  header: HeaderQuery
  publicStoreDomain: string
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </footer>
        )}
      </Await>
    </Suspense>
  )
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu']
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url']
  publicStoreDomain: string
}) {
  return (
    <>
      <SocialMediaBanner />
      <NewsletterSection />
    </>
  )
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean
  isPending: boolean
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  }
}
