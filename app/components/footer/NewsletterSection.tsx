import {Form} from 'react-router'

const NewsletterSection = () => {
  return (
    <section className="bg-brand-accent px-4 py-24 text-white">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-sans text-4xl">Join Our Community</h2>
          <p className="mb-8 font-sans font-light">
            Get inspiration, special offers, and first access to new designs
          </p>
          <Form className="flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-md border border-white/20 bg-white/100 px-4 py-3 font-sans font-light text-white placeholder:text-gray-400"
              required
            />
            <button
              type="submit"
              className="rounded bg-black px-8 py-3 font-sans font-normal text-white transition-colors hover:bg-gray-800"
            >
              Subscribe
            </button>
          </Form>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
