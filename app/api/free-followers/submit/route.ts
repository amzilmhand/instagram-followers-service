import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: NextRequest) {
   try {
    // Safely parse JSON and log it
    let body = null
    try {
      body = await request.json()
    } catch (e) {
      console.error('Failed to parse JSON body:', e)
    }
    console.log('DEBUG /api/free-followers/submit received body:', body)

    const username = body?.username?.toString().trim()
    const email = body?.email?.toString().trim()

    if (!username || !email) {
      return NextResponse.json(
        { message: 'Username and email are required', received: body },
        { status: 400 }
      )
    }
 

    // Clean username (remove @ if present)
    const cleanUsername = username.replace('@', '').trim()

    let db
    try {
      db = await getDb()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { message: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

  

    // Store user data
    const userData = {
      username: cleanUsername,
      email: email.toLowerCase(),
      type: 'free',
      status: 'pending',
      completedOffer: false,
      createdAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    }

    const result = await db.collection(collections.users).insertOne(userData)

    // Send initial email (not offer completed yet)
    const template = emailTemplates.competitionJoined(cleanUsername, email.toLowerCase())
    template.subject = '📧 Free Followers Registration Confirmed'
    template.html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Registration Confirmed!</h2>
        <p>Hi ${cleanUsername}!</p>
        <p>Your free followers request has been registered. To receive your <strong>1,000 free followers</strong>, please complete the offer that will be shown next.</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af;">Next Steps:</h3>
          <ul>
            <li>Complete the offer shown on the next page</li>
            <li>Your followers will be delivered within 24-48 hours after completion</li>
            <li>You'll receive another email when followers are delivered</li>
          </ul>
        </div>
        <p>Thank you for choosing InstaBoost!</p>
        <p>Best regards,<br>The InstaBoost Team</p>
      </div>
    `
    template.text = `Registration Confirmed! Hi ${cleanUsername}! Your free followers request has been registered. Complete the offer to receive your 1,000 free followers.`
    
    await sendEmail(email.toLowerCase(), template, 'free_registration')

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      id: result.insertedId,
      username: cleanUsername
    })

  } catch (error) {
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 500 }
    )
  }
}