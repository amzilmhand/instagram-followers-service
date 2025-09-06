import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'
import { sendEmail, emailTemplates } from '@/lib/email'

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

    let db
    try {
      db = await getDb()
    } catch (dbError) {
      return NextResponse.json(
        { message: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }


    // Store competition entry
    const competitionData = {
      username: cleanUsername,
      email: email.toLowerCase(),
      status: 'pending',
      completedOffer: false,
      createdAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    }

    const result = await db.collection(collections.competitions).insertOne(competitionData)

    // Send confirmation email
    const template = emailTemplates.competitionJoined(cleanUsername, email.toLowerCase())
    await sendEmail(email.toLowerCase(), template, 'competition_joined')

    return NextResponse.json({
      success: true,
      message: 'Competition entry successful',
      id: result.insertedId,
      username: cleanUsername
    })

  } catch (error) {
    return NextResponse.json(
      { message: 'Error processing entry' },
      { status: 500 }
    )
  }
}