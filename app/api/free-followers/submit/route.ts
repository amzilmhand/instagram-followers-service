import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'
import { sendEmail, emailTemplates } from '@/lib/email'
import { validateEmail } from '@/lib/email-validation'

export async function POST(request: NextRequest) {
  try {
    const { username, email } = await request.json()

    if (!username || !email) {
      return NextResponse.json(
        { message: 'Username and email are required' },
        { status: 400 }
      )
    }

 

    // Clean username (remove @ if present)
    const cleanUsername = username.replace('@', '').trim()

    const db = await getDb()

    // Check if user already exists (within last 24 hours to prevent spam)
    const existingUser = await db.collection(collections.users).findOne({
      $or: [
        { username: cleanUsername },
        { email: email.toLowerCase() }
      ],
      type: 'free',
      createdAt: { 
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'You can only claim free followers once every 24 hours' },
        { status: 400 }
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
    console.error('Error submitting free followers request:', error)
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 500 }
    )
  }
}