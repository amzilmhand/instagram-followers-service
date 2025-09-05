import { NextRequest, NextResponse } from 'next/server'
import { saveCompletionRecord } from '@/lib/server-storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract postback parameters from AdBlueMedia
    const {
      offer_id,
      offer_name,
      payout,
      payout_cents,
      ip,
      status,
      unix,
      s1, // We'll use this for Instagram username
      s2, // We'll use this for user session/device info
      lead_id,
      click_id,
      country_code
    } = body

    // Only process successful conversions
    if (status !== '1') {
      return NextResponse.json({ message: 'Conversion not successful' }, { status: 200 })
    }

    // Extract user data from sub parameters
    const instagramUsername = s1
    const deviceFingerprint = s2
    const completionTime = new Date(parseInt(unix) * 1000) // Convert unix timestamp to Date

    if (!instagramUsername) {
      return NextResponse.json({ message: 'Missing Instagram username' }, { status: 400 })
    }

    // Store completion record in database
    const completionRecord = {
      offer_id: parseInt(offer_id),
      offer_name,
      payout: parseFloat(payout),
      instagram_username: instagramUsername,
      ip_address: ip,
      device_fingerprint: deviceFingerprint,
      country_code,
      lead_id: parseInt(lead_id),
      click_id: parseInt(click_id),
      completion_time: completionTime,
      status: 'completed',
      created_at: new Date()
    }

    console.log('Offer completion recorded:', completionRecord)

    // Save to storage
    const saved = saveCompletionRecord(completionRecord)
    
    if (!saved) {
      throw new Error('Failed to save completion record')
    }

    return NextResponse.json({ 
      message: 'Postback processed successfully',
      recorded: true 
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing postback:', error)
    return NextResponse.json({ 
      message: 'Error processing postback',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests for testing
  const searchParams = request.nextUrl.searchParams
  
  const postbackData = {
    offer_id: searchParams.get('offer_id'),
    offer_name: searchParams.get('offer_name'),
    payout: searchParams.get('payout'),
    ip: searchParams.get('ip'),
    status: searchParams.get('status'),
    unix: searchParams.get('unix'),
    s1: searchParams.get('s1'), // Instagram username
    s2: searchParams.get('s2'), // Device fingerprint
    lead_id: searchParams.get('lead_id'),
    click_id: searchParams.get('click_id'),
    country_code: searchParams.get('country_code')
  }

  // Process the same way as POST
  return POST(new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify(postbackData),
    headers: { 'Content-Type': 'application/json' }
  }))
}