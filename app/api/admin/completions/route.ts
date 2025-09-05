import { NextResponse } from 'next/server'
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
  completion_time: string
  status: string
  created_at: string
}

// Read completions directly (server-side only)
function getAllCompletions(): CompletionRecord[] {
  const dataDir = path.join(process.cwd(), 'data')
  const storageFile = path.join(dataDir, 'completions.json')
  
  if (!fs.existsSync(storageFile)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(storageFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading completions file:', error)
    return []
  }
}

export async function GET() {
  try {
    const completions = getAllCompletions()
    
    return NextResponse.json({
      completions: completions.sort((a: CompletionRecord, b: CompletionRecord) => 
        new Date(b.completion_time).getTime() - new Date(a.completion_time).getTime()
      )
    })
  } catch (error) {
    console.error('Error fetching completions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch completions' },
      { status: 500 }
    )
  }
}