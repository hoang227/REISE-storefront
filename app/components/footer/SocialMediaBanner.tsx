import Facebook from './socials-icon/Facebook'
import Instagram from './socials-icon/Instagram'
import Tiktok from './socials-icon/Tiktok'
import X from './socials-icon/X'
import Youtube from './socials-icon/Youtube'

const SocialMediaBanner = () => {
  const socialMediaBaseClass =
    'h-6 w-6 fill-black transition-transform duration-200 hover:scale-110 hover:fill-black/90'
  const socialLinks = [
    {
      icon: Tiktok,
      href: 'https://tiktok.com/@reise',
      label: 'Follow us on TikTok',
    },
    {
      icon: Instagram,
      href: 'https://instagram.com/reise',
      label: 'Follow us on Instagram',
    },
    {
      icon: Youtube,
      href: 'https://youtube.com/@reise',
      label: 'Subscribe to our YouTube',
    },
    {
      icon: Facebook,
      href: 'https://facebook.com/reise',
      label: 'Like us on Facebook',
    },
    {icon: X, href: 'https://x.com/reise', label: 'Follow us on X'},
  ]

  return (
    <section className="py-87 bg-white px-8 py-8 text-center font-sans text-black md:py-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-2 text-lg font-medium tracking-wide">
          Connect with Us
        </h2>
        <p className="mb-6 text-sm text-black/40">
          Follow our journey and share your stories
        </p>
        <div className="flex items-center justify-center space-x-8">
          {socialLinks.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label={social.label}
            >
              <social.icon className={socialMediaBaseClass} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SocialMediaBanner
