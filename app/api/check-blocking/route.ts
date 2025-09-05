import { NextRequest, NextResponse } from 'next/server'
import { getRecentCompletions, getCompletionsByUsername } from '@/lib/server-storage'

export async function POST(request: NextRequest) {
  try {
    const { 
      type, 
      instagramUsername, 
      ipAddress, 
      deviceFingerprint, 
      countryCode = 'US' 
    } = await request.json()

    if (!type || !instagramUsername) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 })
    }

    let blockingResult

    if (type === 'free-followers') {
      // Check for recent completions (within 24 hours)
      const clientIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      ipAddress || 'unknown'
      
      const recentCompletions = getRecentCompletions(
        instagramUsername,
        clientIp,
        deviceFingerprint
      )

      if (recentCompletions.length > 0) {
        // User is blocked - calculate hours remaining
        const lastCompletion = recentCompletions[0].completion_time
        const now = new Date()
        const timeDiff = now.getTime() - lastCompletion.getTime()
        const hoursElapsed = Math.floor(timeDiff / (1000 * 60 * 60))
        const hoursRemaining = Math.max(0, 24 - hoursElapsed)

        blockingResult = {
          isBlocked: true,
          reason: 'Daily limit reached',
          lastCompletion,
          hoursRemaining
        }
      } else {
        blockingResult = { isBlocked: false }
      }

    } else if (type === 'competition') {
      // Check if username has already completed any offer
      const completions = getCompletionsByUsername(instagramUsername)
      
      if (completions.length > 0) {
        blockingResult = {
          isBlocked: true,
          reason: 'Username already completed an offer',
          lastCompletion: completions[0].completion_time
        }
      } else {
        blockingResult = { isBlocked: false }
      }

    } else {
      return NextResponse.json({ 
        error: 'Invalid type. Must be "free-followers" or "competition"' 
      }, { status: 400 })
    }

    return NextResponse.json(blockingResult)

  } catch (error) {
    console.error('Error checking blocking status:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}