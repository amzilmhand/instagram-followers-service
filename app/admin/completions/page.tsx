'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

export default function AdminCompletions() {
  const [completions, setCompletions] = useState<CompletionRecord[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCompletions = async () => {
    try {
      const response = await fetch('/api/admin/completions')
      if (response.ok) {
        const data = await response.json()
        setCompletions(data.completions || [])
      }
    } catch (error) {
      console.error('Error fetching completions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompletions()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offer Completions</h1>
        <Button onClick={fetchCompletions}>Refresh</Button>
      </div>

      {completions.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-center">No completions recorded yet.</p>
            <p className="text-sm text-gray-400 text-center mt-2">
              Complete an offer to see tracking data here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {completions.map((completion, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between">
                  <span>@{completion.instagram_username}</span>
                  <span className="text-sm font-normal text-gray-500">
                    ${completion.payout}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Offer:</strong> {completion.offer_name}
                  </div>
                  <div>
                    <strong>IP:</strong> {completion.ip_address}
                  </div>
                  <div>
                    <strong>Country:</strong> {completion.country_code}
                  </div>
                  <div>
                    <strong>Completed:</strong> {formatDate(completion.completion_time)}
                  </div>
                  <div>
                    <strong>Lead ID:</strong> {completion.lead_id}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {completion.status}
                    </span>
                  </div>
                  {completion.device_fingerprint && (
                    <div className="col-span-full">
                      <strong>Device:</strong> 
                      <code className="ml-1 text-xs bg-gray-100 px-1 rounded">
                        {completion.device_fingerprint.substring(0, 20)}...
                      </code>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}