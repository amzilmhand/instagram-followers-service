import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()

    // Get statistics from all collections
    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      totalCompetitions,
      completedCompetitions,
      totalFreeUsers,
      completedFreeUsers,
      emailsSent
    ] = await Promise.all([
      db.collection(collections.orders).countDocuments(),
      db.collection(collections.orders).countDocuments({ status: 'completed' }),
      db.collection(collections.orders).countDocuments({ status: 'pending' }),
      db.collection(collections.competitions).countDocuments(),
      db.collection(collections.competitions).countDocuments({ status: 'completed' }),
      db.collection(collections.users).countDocuments({ type: 'free' }),
      db.collection(collections.users).countDocuments({ type: 'free', status: 'completed' }),
      db.collection(collections.emails).countDocuments({ status: 'sent' })
    ])

    return NextResponse.json({
      totalOrders,
      completedOrders,
      pendingOrders,
      totalCompetitions,
      completedCompetitions,
      totalFreeUsers,
      completedFreeUsers,
      emailsSent
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 })
  }
}