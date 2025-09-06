import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    
    // Get recent orders, sorted by creation date
    const orders = await db.collection(collections.orders)
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json(orders)

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 })
  }
}