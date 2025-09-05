interface CompletionRecord {
  offer_id: number
  offer_name: string
  payout: number
  instagram_username: string
  ip_address: string
  device_fingerprint?: string
  country_code: string
  lead_id: number
  click_id: number
  completion_time: Date
  status: string
  created_at: Date
}

interface BlockingResult {
  isBlocked: boolean
  reason?: string
  lastCompletion?: Date
  hoursRemaining?: number
}

// Get user's timezone offset (you can enhance this with geolocation or user input)
function getUserTimezoneOffset(countryCode: string): number {
  // Simple timezone mapping based on country code
  const timezoneMap: { [key: string]: number } = {
    'US': -5, // EST
    'CA': -5, // EST
    'GB': 0,  // GMT
    'DE': 1,  // CET
    'FR': 1,  // CET
    'AU': 11, // AEDT
    'JP': 9,  // JST
    // Add more as needed
  }
  return timezoneMap[countryCode] || 0
}

// Check if it's a new day in user's timezone
function isNewDayInTimezone(lastCompletion: Date, timezoneOffset: number): boolean {
  const now = new Date()
  const userNow = new Date(now.getTime() + (timezoneOffset * 60 * 60 * 1000))
  const userLastCompletion = new Date(lastCompletion.getTime() + (timezoneOffset * 60 * 60 * 1000))
  
  // Get start of day (00:00) for both dates
  const todayStart = new Date(userNow.getFullYear(), userNow.getMonth(), userNow.getDate())
  const lastCompletionDay = new Date(userLastCompletion.getFullYear(), userLastCompletion.getMonth(), userLastCompletion.getDate())
  
  return todayStart > lastCompletionDay
}

// Calculate hours remaining until next day in user's timezone
function hoursUntilNextDay(timezoneOffset: number): number {
  const now = new Date()
  const userNow = new Date(now.getTime() + (timezoneOffset * 60 * 60 * 1000))
  const nextDay = new Date(userNow.getFullYear(), userNow.getMonth(), userNow.getDate() + 1)
  const nextDayUTC = new Date(nextDay.getTime() - (timezoneOffset * 60 * 60 * 1000))
  
  return Math.ceil((nextDayUTC.getTime() - now.getTime()) / (1000 * 60 * 60))
}

// Check if user is blocked from free followers
export async function checkFreeFollowersBlocking(
  instagramUsername: string,
  ipAddress: string,
  deviceFingerprint?: string,
  countryCode: string = 'US'
): Promise<BlockingResult> {
  // TODO: Replace with actual database query
  // This is a placeholder - you need to implement database storage
  
  try {
    // Query database for recent completions
    // Check by Instagram username, IP address, or device fingerprint
    const recentCompletions = await getRecentCompletions(instagramUsername, ipAddress, deviceFingerprint)
    
    if (recentCompletions.length === 0) {
      return { isBlocked: false }
    }

    const timezoneOffset = getUserTimezoneOffset(countryCode)
    const lastCompletion = recentCompletions[0].completion_time

    // Check if it's a new day in user's timezone
    if (isNewDayInTimezone(lastCompletion, timezoneOffset)) {
      return { isBlocked: false }
    }

    // User is blocked - calculate remaining time
    const hoursRemaining = hoursUntilNextDay(timezoneOffset)

    return {
      isBlocked: true,
      reason: 'Daily limit reached',
      lastCompletion,
      hoursRemaining
    }

  } catch (error) {
    console.error('Error checking blocking status:', error)
    return { isBlocked: false }
  }
}

// Check if username is blocked from competition
export async function checkCompetitionBlocking(instagramUsername: string): Promise<BlockingResult> {
  try {
    // Check if this username has completed any offer
    const completions = await getCompletionsByUsername(instagramUsername)
    
    if (completions.length > 0) {
      return {
        isBlocked: true,
        reason: 'Username already completed an offer',
        lastCompletion: completions[0].completion_time
      }
    }

    return { isBlocked: false }

  } catch (error) {
    console.error('Error checking competition blocking:', error)
    return { isBlocked: false }
  }
}

// Save completion record (will be called from API endpoints)
export async function saveCompletionRecord(record: CompletionRecord): Promise<boolean> {
  try {
    // This will be called from server-side API endpoints
    // For now, return true as placeholder
    console.log('Saving completion record:', record)
    return true
  } catch (error) {
    console.error('Error saving completion record:', error)
    return false
  }
}

// Get recent completions by various identifiers
async function getRecentCompletions(
  instagramUsername: string,
  ipAddress: string,
  deviceFingerprint?: string
): Promise<CompletionRecord[]> {
  try {
    // This will be implemented via API calls in server-side endpoints
    // For now, return empty array
    return []
  } catch (error) {
    console.error('Error getting recent completions:', error)
    return []
  }
}

// Get completions by username only (for competition blocking)
async function getCompletionsByUsername(instagramUsername: string): Promise<CompletionRecord[]> {
  try {
    // This will be implemented via API calls in server-side endpoints
    // For now, return empty array
    return []
  } catch (error) {
    console.error('Error getting completions by username:', error)
    return []
  }
}

// Generate device fingerprint on client side
export function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') return ''
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint', 2, 2)
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|')
  
  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}