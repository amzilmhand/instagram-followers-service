import { NextRequest, NextResponse } from 'next/server'
import { getDb, collections } from '@/lib/database'
import { sendEmail, emailTemplates } from '@/lib/email'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id, type } = await request.json()

    if (!id || !type) {
      return NextResponse.json({ message: 'ID and type are required' }, { status: 400 })
    }

    const db = await getDb()
    const collectionName = type === 'order' ? collections.orders : collections.users

    // Update status to completed
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'completed',
          deliveredAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 })
    }

    // Get updated record to send email
    const record = await db.collection(collectionName).findOne({ _id: new ObjectId(id) })
    
    if (record) {
      if (type === 'order') {
        // Send delivery confirmation email for orders
        const template = emailTemplates.followersDelivered(record.username, record.followers)
        await sendEmail(record.email, template, 'followers_delivered')
      } else {
        // Send delivery confirmation email for free followers
        const template = emailTemplates.followersDelivered(record.username, '1,000')
        await sendEmail(record.email, template, 'free_followers_delivered')
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Marked as delivered and email sent' 
    })

  } catch (error) {
    console.error('Error marking as delivered:', error)
    return NextResponse.json({ message: 'Error updating record' }, { status: 500 })
  }
}