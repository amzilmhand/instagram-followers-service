"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X } from "lucide-react"

interface Notification {
  id: string
  name: string
  followers: number
  timeAgo: string
}

const sampleNotifications: Notification[] = [
  { id: "1", name: "Alex M.", followers: 1000, timeAgo: "2 minutes ago" },
  { id: "2", name: "Sarah K.", followers: 5000, timeAgo: "5 minutes ago" },
  { id: "3", name: "Mike R.", followers: 2500, timeAgo: "8 minutes ago" },
  { id: "4", name: "Emma L.", followers: 1000, timeAgo: "12 minutes ago" },
  { id: "5", name: "David P.", followers: 10000, timeAgo: "15 minutes ago" },
  { id: "6", name: "Lisa W.", followers: 1000, timeAgo: "18 minutes ago" },
  { id: "7", name: "John D.", followers: 3000, timeAgo: "22 minutes ago" },
  { id: "8", name: "Anna S.", followers: 1000, timeAgo: "25 minutes ago" },
]

export default function LiveNotifications() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const showRandomNotification = () => {
      const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)]
      setCurrentNotification(randomNotification)
      setIsVisible(true)

      // Hide notification after 4 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 4000)
    }

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showRandomNotification, 3000)

    // Then show notifications every 8-15 seconds
    const interval = setInterval(
      () => {
        showRandomNotification()
      },
      Math.random() * 7000 + 8000,
    ) // Random between 8-15 seconds

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!currentNotification || !isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{currentNotification.name}</span> just received{" "}
                <span className="font-semibold text-blue-600">
                  {currentNotification.followers.toLocaleString()} followers
                </span>
                !
              </p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                {currentNotification.timeAgo}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
