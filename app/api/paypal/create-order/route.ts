import { NextRequest, NextResponse } from 'next/server'
import paypal from '@paypal/checkout-server-sdk'

// PayPal environment setup
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const environment = process.env.PAYPAL_MODE || 'sandbox'

  if (environment === 'live') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret)
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret)
  }
}

function client() {
  return new paypal.core.PayPalHttpClient(environment())
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'USD', packageName } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const orderRequest = new paypal.orders.OrdersCreateRequest()
    orderRequest.prefer('return=representation')
    orderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString()
          },
          description: `InstaBoost - ${packageName || 'Premium Package'}`
        }
      ],
      application_context: {
        brand_name: 'InstaBoost',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/cancel`
      }
    })

    const order = await client().execute(orderRequest)
    
    return NextResponse.json({
      orderID: order.result.id,
      status: order.result.status,
      links: order.result.links
    })
  } catch (error: any) {
    console.error('PayPal Create Order Error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal order', details: error.message },
      { status: 500 }
    )
  }
}