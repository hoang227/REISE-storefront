import {type ActionFunctionArgs} from '@shopify/remix-oxygen'

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get('email')

  // Validate email
  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({error: 'Email is required'}), {
      status: 400,
      headers: {'Content-Type': 'application/json'},
    })
  }

  try {
    // Here you would typically:
    // 1. Add the email to your newsletter service (e.g., Klaviyo, Mailchimp)
    // 2. Add the customer to your Shopify customer list
    // 3. Send a welcome email

    // For now, we'll just return a success response
    return new Response(JSON.stringify({success: true}), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    })
  } catch (error) {
    return new Response(
      JSON.stringify({error: 'Failed to subscribe to newsletter'}),
      {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      }
    )
  }
}
