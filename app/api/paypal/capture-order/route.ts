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
    const { orderID } = body

    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID)
    captureRequest.requestBody({})

    const capture = await client().execute(captureRequest)
    
    if (capture.result.status === 'COMPLETED') {
      // Here you can add logic to:
      // 1. Store the payment in your database
      // 2. Process the Instagram followers delivery
      // 3. Send confirmation emails
      
      return NextResponse.json({
        orderID: capture.result.id,
        status: capture.result.status,
        payerEmail: capture.result.payer?.email_address,
        amount: capture.result.purchase_units[0]?.payments?.captures[0]?.amount,
        captureID: capture.result.purchase_units[0]?.payments?.captures[0]?.id
      })
    } else {
      return NextResponse.json(
        { error: 'Payment not completed', status: capture.result.status },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('PayPal Capture Order Error:', error)
    return NextResponse.json(
      { error: 'Failed to capture PayPal order', details: error.message },
      { status: 500 }
    )
  }
}