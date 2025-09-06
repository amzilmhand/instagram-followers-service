import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    
    // Get current winners
    const winners = await db.collection(collections.winners)
      .find({})
      .sort({ position: 1 })
      .toArray()

    return NextResponse.json(winners)

  } catch (error) {
    console.error('Error fetching winners:', error)
    return NextResponse.json({ message: 'Error fetching winners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { userId, position, prize } = await request.json()

    if (!userId || !position || !prize) {
      return NextResponse.json({ message: 'User ID, position, and prize are required' }, { status: 400 })
    }

    const db = await getDb()

    // Get user details from competition collection
    const user = await db.collection(collections.competitions).findOne({ 
      _id: new ObjectId(userId) 
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if position already exists
    const existingWinner = await db.collection(collections.winners).findOne({ position })
    
    if (existingWinner) {
      // Update existing winner
      await db.collection(collections.winners).updateOne(
        { position },
        {
          $set: {
            username: user.username,
            email: user.email,
            prize,
            followers: position === 1 ? '50,000' : position === 2 ? '25,000' : '10,000',
            updatedAt: new Date()
          }
        }
      )
    } else {
      // Create new winner
      await db.collection(collections.winners).insertOne({
        userId: user._id,
        username: user.username,
        email: user.email,
        position,
        prize,
        followers: position === 1 ? '50,000' : position === 2 ? '25,000' : '10,000',
        createdAt: new Date()
      })
    }

    return NextResponse.json({ success: true, message: 'Winner updated successfully' })

  } catch (error) {
    console.error('Error updating winner:', error)
    return NextResponse.json({ message: 'Error updating winner' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { position } = await request.json()

    if (!position) {
      return NextResponse.json({ message: 'Position is required' }, { status: 400 })
    }

    const db = await getDb()
    
    await db.collection(collections.winners).deleteOne({ position })

    return NextResponse.json({ success: true, message: 'Winner removed successfully' })

  } catch (error) {
    console.error('Error removing winner:', error)
    return NextResponse.json({ message: 'Error removing winner' }, { status: 500 })
  }
}