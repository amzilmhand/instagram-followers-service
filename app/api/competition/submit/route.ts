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
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { message: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    // Check if user already entered competition
    const existingEntry = await db.collection(collections.competitions).findOne({
      $or: [
        { username: cleanUsername },
        { email: email.toLowerCase() }
      ]
    })

    if (existingEntry) {
      return NextResponse.json(
        { message: 'You have already entered the competition' },
        { status: 400 }
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
    console.error('Error submitting competition entry:', error)
    return NextResponse.json(
      { message: 'Error processing entry' },
      { status: 500 }
    )
  }
}