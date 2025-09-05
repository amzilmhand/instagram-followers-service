"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Clock, Users, Gift, CheckCircle, ArrowRight, Lock, Crown, Star, Zap } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4">
      {[
        { label: "Days", value: timeLeft.days.toString().padStart(2, '0') },
        { label: "Hours", value: timeLeft.hours.toString().padStart(2, '0') },
        { label: "Minutes", value: timeLeft.minutes.toString().padStart(2, '0') },
        { label: "Seconds", value: timeLeft.seconds.toString().padStart(2, '0') }
      ].map((item) => (
        <div key={item.label} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg px-3 py-4 sm:px-4 sm:py-6 min-w-[60px] sm:min-w-[80px]">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">{item.value}</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

// Function to get next Saturday at 00:00
function getNextSaturday(): Date {
  const now = new Date()
  const nextSaturday = new Date()
  const daysUntilSaturday = (6 - now.getDay()) % 7 || 7
  nextSaturday.setDate(now.getDate() + daysUntilSaturday)
  nextSaturday.setHours(0, 0, 0, 0)
  return nextSaturday
}

export default function CompetitionPage() {
  const [instagramUsername, setInstagramUsername] = useState('')
  const [email, setEmail] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const nextSaturday = getNextSaturday()

  const handleSubmitUsername = async () => {
    if (!instagramUsername.trim()) {
      setError('Please enter an Instagram username')
      return
    }
    
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/instagram/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: instagramUsername })
      })

      const data = await response.json()

      if (response.ok && data.profile) {
        setProfileData(data.profile)
        setCurrentStep(2)
      } else {
        setError(data.error || 'Profile not found')
      }
    } catch (err) {
      setError('Failed to fetch profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentLockerComplete = () => {
    setCurrentStep(3)
  }

  // Initialize content locker script
  useEffect(() => {
    if (typeof window !== 'undefined' && currentStep === 2) {
      // Add AdBlueMedia content locker script
      const script1 = document.createElement('script')
      script1.innerHTML = 'var PAqPm_DTV_NtFssc={"it":4500583,"key":"a0bf0"};'
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.src = 'https://d3qr4eoze2yrp4.cloudfront.net/1bfe787.js'
      script2.async = true
      document.head.appendChild(script2)

      // Create global function to handle locker completion
      ;(window as any).handleLockerComplete = () => {
        handleContentLockerComplete()
      }

      return () => {
        document.head.removeChild(script1)
        document.head.removeChild(script2)
        delete (window as any).handleLockerComplete
      }
    }
  }, [currentStep])

  const winners = [
    { name: "Jessica M.", username: "@jessica_style", followers: "50,000", prize: "Grand Prize" },
    { name: "Carlos R.", username: "@carlos_fitness", followers: "25,000", prize: "2nd Place" },
    { name: "Amy L.", username: "@amy_travel", followers: "10,000", prize: "3rd Place" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Header */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">InstaBoost</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/packages" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Packages
              </Link>
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Reviews
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile-First Hero Section */}
      <section className="py-8 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-amber-50">
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-purple-100 to-amber-100 text-purple-800 border-purple-200 px-4 py-2 text-sm sm:text-base">
              <Trophy className="w-4 h-4 mr-2" />
              Weekly Competition
            </Badge>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Win <span className="bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">50K Followers</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Every Week!
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Enter our weekly competition for a chance to win 50K Instagram followers absolutely free
            </p>

            {/* Countdown Timer */}
            <div className="mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  <span className="text-base sm:text-lg font-semibold text-gray-700">Next Draw In:</span>
                </div>
              </div>
              <CountdownTimer targetDate={nextSaturday} />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">How to Enter</h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Follow these simple steps to enter the competition
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              {[
                {
                  step: 1,
                  title: "Enter Your Instagram",
                  description: "Provide your Instagram username to get started",
                  icon: Users,
                  completed: currentStep > 1
                },
                {
                  step: 2,
                  title: "Open Content Locker",
                  description: "Complete the content locker verification",
                  icon: Lock,
                  completed: currentStep > 2
                },
                {
                  step: 3,
                  title: "Win 50K Followers",
                  description: "Wait for the draw and win amazing prizes!",
                  icon: Trophy,
                  completed: currentStep > 3
                }
              ].map((step) => (
                <Card key={step.step} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  step.completed ? 'bg-green-50 border-green-200' : 
                  currentStep === step.step ? 'bg-purple-50 border-purple-200' : 'bg-white/80'
                } backdrop-blur-sm`}>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${
                      step.completed ? 'bg-green-100' : 
                      currentStep === step.step ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                      ) : (
                        <step.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${
                          currentStep === step.step ? 'text-purple-600' : 'text-gray-400'
                        }`} />
                      )}
                    </div>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto mb-2 sm:mb-3 ${
                      step.completed ? 'bg-green-600 text-white' :
                      currentStep === step.step ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.step}
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Entry Form */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl">
          {currentStep === 1 && (
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Enter Competition</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Enter your Instagram username to join the weekly competition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="h-12 text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                      Instagram Username *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">@</span>
                      <Input
                        id="instagram"
                        placeholder="yourusername"
                        className="h-12 text-base pl-8"
                        value={instagramUsername}
                        onChange={(e) => setInstagramUsername(e.target.value.replace('@', ''))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-base"
                  onClick={handleSubmitUsername}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Users className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Checking Profile...' : 'Continue'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && profileData && (
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Complete Verification</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Profile found! Complete the content locker to enter the competition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={profileData.profileImage} 
                    alt={profileData.username}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">@{profileData.username}</h3>
                    <p className="text-sm text-gray-600">{profileData.fullName}</p>
                    <p className="text-xs text-gray-500">{profileData.followers.toLocaleString()} followers</p>
                  </div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Locker Verification</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete the verification below to unlock your competition entry
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={() => {
                      if (typeof (window as any)._Xy === 'function') {
                        (window as any)._Xy()
                      } else {
                        alert('Content locker is loading... Please try again in a moment.')
                      }
                    }}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Open Locker
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="border-0 shadow-2xl bg-green-50 backdrop-blur-sm border-green-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl font-bold text-green-800">Successfully Entered!</CardTitle>
                <CardDescription className="text-base text-green-600">
                  Congratulations! You've successfully entered the weekly competition
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">You're In the Draw!</h3>
                <p className="text-gray-600 mb-4">
                  Your entry for @{profileData?.username} has been confirmed. We'll notify you at {email} if you win! The winner will be announced every Saturday at midnight.
                </p>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  Entry Confirmed
                </Badge>
              </CardContent>
              <CardFooter>
                <Link href="/free-followers" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Gift className="w-4 h-4 mr-2" />
                    Get Free Followers While You Wait
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>
      </section>

      {/* Previous Winners */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Previous Winners</h2>
              <p className="text-base sm:text-lg text-gray-600">Congratulations to last week's lucky winners!</p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              {winners.map((winner, index) => (
                <Card key={index} className="border-0 shadow-lg text-center bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 sm:p-8">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                          : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-400"
                            : "bg-gradient-to-br from-amber-600 to-amber-700"
                      }`}
                    >
                      {index === 0 ? (
                        <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      ) : index === 1 ? (
                        <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      ) : (
                        <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{winner.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">{winner.username}</p>
                    <Badge
                      className={`mb-4 ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {winner.prize}
                    </Badge>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{winner.followers}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Followers Won</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}