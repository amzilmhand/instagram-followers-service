import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    
    // Get recent free users, sorted by creation date
    const freeUsers = await db.collection(collections.users)
      .find({ type: 'free' })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(freeUsers)

  } catch (error) {
    console.error('Error fetching free users:', error)
    return NextResponse.json({ message: 'Error fetching free users' }, { status: 500 })
  }
}