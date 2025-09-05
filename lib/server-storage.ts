// Server-side storage functions (Node.js only)
import fs from 'fs'
import path from 'path'

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

const STORAGE_FILE = path.join(process.cwd(), 'data', 'completions.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read completions from file
function readCompletions(): CompletionRecord[] {
  ensureDataDirectory()
  
  if (!fs.existsSync(STORAGE_FILE)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(STORAGE_FILE, 'utf8')
    const completions = JSON.parse(data)
    
    // Convert date strings back to Date objects
    return completions.map((record: any) => ({
      ...record,
      completion_time: new Date(record.completion_time),
      created_at: new Date(record.created_at)
    }))
  } catch (error) {
    console.error('Error reading completions file:', error)
    return []
  }
}

// Write completions to file
function writeCompletions(completions: CompletionRecord[]) {
  ensureDataDirectory()
  
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(completions, null, 2))
  } catch (error) {
    console.error('Error writing completions file:', error)
  }
}

// Save a new completion record
export function saveCompletionRecord(record: CompletionRecord): boolean {
  try {
    const completions = readCompletions()
    completions.push(record)
    writeCompletions(completions)
    return true
  } catch (error) {
    console.error('Error saving completion record:', error)
    return false
  }
}

// Get recent completions by various identifiers (for free followers blocking)
export function getRecentCompletions(
  instagramUsername: string,
  ipAddress: string,
  deviceFingerprint?: string
): CompletionRecord[] {
  const completions = readCompletions()
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000))
  
  return completions.filter(record => {
    // Check if completion is within the last 24 hours
    if (record.completion_time < twentyFourHoursAgo) {
      return false
    }
    
    // Check if any identifier matches
    return (
      record.instagram_username === instagramUsername ||
      record.ip_address === ipAddress ||
      (deviceFingerprint && record.device_fingerprint === deviceFingerprint)
    )
  })
}

// Get completions by username only (for competition blocking)
export function getCompletionsByUsername(instagramUsername: string): CompletionRecord[] {
  const completions = readCompletions()
  
  return completions.filter(record => 
    record.instagram_username === instagramUsername
  )
}

// Get all completions (for admin purposes)
export function getAllCompletions(): CompletionRecord[] {
  return readCompletions()
}