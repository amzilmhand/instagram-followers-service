import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'
import { sendEmail, emailTemplates } from '@/lib/email'

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

    const db = await getDb()

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

    // Save completion record
    await db.collection(collections.completions).insertOne(completionRecord)

    // Update user records to mark offers as completed and send emails
    const updates = await Promise.all([
      // Update free users
      db.collection(collections.users).updateMany(
        { 
          username: instagramUsername,
          type: 'free',
          completedOffer: false
        },
        { 
          $set: { 
            completedOffer: true,
            offerCompletedAt: completionTime
          }
        }
      ),
      // Update competition entries
      db.collection(collections.competitions).updateMany(
        { 
          username: instagramUsername,
          completedOffer: false
        },
        { 
          $set: { 
            completedOffer: true,
            offerCompletedAt: completionTime
          }
        }
      )
    ])

    // Send notification emails for completed offers
    try {
      // Check for free users who completed offers
      const freeUsers = await db.collection(collections.users).find({
        username: instagramUsername,
        type: 'free',
        completedOffer: true,
        emailSent: { $ne: true }
      }).toArray()

      // Check for competition entries who completed offers  
      const competitionEntries = await db.collection(collections.competitions).find({
        username: instagramUsername,
        completedOffer: true,
        emailSent: { $ne: true }
      }).toArray()

      // Send emails for free followers
      for (const user of freeUsers) {
        const template = emailTemplates.offerCompleted(user.username)
        await sendEmail(user.email, template, 'offer_completed_free')
        // Mark email as sent
        await db.collection(collections.users).updateOne(
          { _id: user._id },
          { $set: { emailSent: true } }
        )
      }

      // Send emails for competition entries (different message)
      for (const entry of competitionEntries) {
        const template = emailTemplates.competitionJoined(entry.username, entry.email)
        template.subject = '🏆 Offer Completed - You\'re in the Competition!'
        template.html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Offer Completed Successfully!</h2>
            <p>Great news ${entry.username}!</p>
            <p>You've successfully completed the offer and you're now entered in this week's <strong>50,000 Followers Competition</strong>!</p>
            <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #6b21a8;">Competition Details:</h3>
              <ul>
                <li><strong>Prize:</strong> 50,000 Instagram Followers</li>
                <li><strong>Your Entry:</strong> @${entry.username}</li>
                <li><strong>Status:</strong> ✅ Confirmed</li>
              </ul>
            </div>
            <p>Winner will be announced this Saturday! Good luck!</p>
            <p>Best regards,<br>The InstaBoost Team</p>
          </div>
        `
        template.text = `Offer Completed! ${entry.username}, you're now entered in the 50K followers competition. Winner announced Saturday!`
        
        await sendEmail(entry.email, template, 'offer_completed_competition')
        // Mark email as sent
        await db.collection(collections.competitions).updateOne(
          { _id: entry._id },
          { $set: { emailSent: true } }
        )
      }
    } catch (emailError) {
      console.error('Error sending completion emails:', emailError)
      // Don't fail the postback if email fails
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