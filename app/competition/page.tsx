"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Clock, Users, Gift, CheckCircle, ArrowRight, Lock, Crown, Star, Zap, Search, ArrowLeft, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { generateDeviceFingerprint } from "@/lib/blocking"
import Image from "next/image"

type Step = "input" | "verification" | "security" | "success"

interface UserProfile {
  username: string
  profileImage: string
  followers: number
  following: number
  posts: number
  fullName: string
  isPrivate: boolean
}

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
  const daysUntilSaturday = (7 - now.getDay()) % 7 || 7
  nextSaturday.setDate(now.getDate() + daysUntilSaturday)
  nextSaturday.setHours(0, 0, 0, 0)
  return nextSaturday
}

export default function CompetitionPage() {
  const [currentStep, setCurrentStep] = useState<Step>("input")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockingReason, setBlockingReason] = useState("")
  const [deviceFingerprint, setDeviceFingerprint] = useState("")
  
  const nextSaturday = getNextSaturday()

  // Generate device fingerprint on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fingerprint = generateDeviceFingerprint()
      setDeviceFingerprint(fingerprint)
    }
  }, [])

  // Load content locker script with user tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && currentStep === "security" && username && deviceFingerprint) {
      // Set up postback parameters with username and device fingerprint
      const script1 = document.createElement('script')
      script1.innerHTML = `var PAqPm_DTV_NtFssc={
        "it":4500583,
        "key":"a0bf0",
        "s1":"${username}",
        "s2":"${deviceFingerprint}",
        "postback_url":"${window.location.origin}/api/postback"
      };`
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.src = 'https://d3qr4eoze2yrp4.cloudfront.net/1bfe787.js'
      script2.async = true
      document.head.appendChild(script2)

      // Override completion handler to just close locker
      ;(window as any).contentLockerComplete = () => {
        // Close the content locker instead of redirecting
        if (typeof (window as any)._Xy_close === 'function') {
          (window as any)._Xy_close()
        }
        // The postback will handle the completion tracking
        setCurrentStep("success")
      }

      return () => {
        document.head.removeChild(script1)
        document.head.removeChild(script2)
        delete (window as any).contentLockerComplete
      }
    }
  }, [currentStep, username, deviceFingerprint])

  const steps = [
    { id: "input", title: "Enter Details", completed: currentStep !== "input" },
    { id: "verification", title: "Verify Account", completed: ["security", "success"].includes(currentStep) },
    { id: "security", title: "Complete Offer", completed: currentStep === "success" },
    { id: "success", title: "Complete", completed: false },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[@\\s]/g, "").toLowerCase()
    setUsername(value)
  }

  const handleSearchAccount = async () => {
    if (!username || !email) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Check if username is blocked from competition
      const blockingResponse = await fetch('/api/check-blocking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'competition',
          instagramUsername: username,
          deviceFingerprint: deviceFingerprint
        })
      })

      const blockingData = await blockingResponse.json()
      
      if (blockingData.isBlocked) {
        setIsBlocked(true)
        setBlockingReason(blockingData.reason || 'This username has already entered the competition')
        setIsLoading(false)
        return
      }

      // If not blocked, proceed with Instagram profile fetch
      const response = await fetch("/api/instagram/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.replace("@", "") }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile")
      }

      setUserProfile(data.profile)
      setCurrentStep("verification")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find Instagram account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyAccount = async () => {
    setIsLoading(true)
    try {
      // Submit to database when user verifies their account
      const response = await fetch('/api/competition/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to enter competition')
        return
      }

      // Success - proceed to security step
      setCurrentStep("security")
    } catch (err) {
      setError('Failed to enter competition. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecurityCheck = () => {
    if (typeof (window as any)._Xy === 'function') {
      (window as any)._Xy()
    } else {
      // Redirect to success page
      window.location.href = '/competition/success'
    }
  }

  const renderInputStep = () => (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Enter Giveaway</CardTitle>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Enter your details to join the weekly Giveaway for 50K followers</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base mt-2"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Label htmlFor="username" className="text-sm font-medium text-gray-700">
            Instagram Username *
          </Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">@</span>
            <Input
              id="username"
              type="text"
              placeholder="yourusername"
              value={username}
              onChange={handleUsernameChange}
              className="h-12 text-base pl-8"
              maxLength={30}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 px-1">Enter your username without the @ symbol</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {isBlocked && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Entry Not Allowed</strong><br />
              {blockingReason}. Try with a different Instagram username.
              <div className="mt-2 text-sm text-red-700">
                Each username can only enter the giveaway once.
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSearchAccount}
          disabled={!email || !username || isLoading || isBlocked}
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Searching Account...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-3" />
              Find My Account
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const renderVerificationStep = () => (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Verify Your Account</CardTitle>
        <p className="text-gray-600 text-sm sm:text-base">Is this your Instagram account?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {userProfile && (
          <div className="text-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4">
              <Image
                src={userProfile?.profileImage || "/placeholder.jpg"}
                alt="Profile"
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">@{userProfile.username}</h3>
            {userProfile.fullName && <p className="text-gray-600 mb-4 text-sm sm:text-base">{userProfile.fullName}</p>}
            
            <div className="grid grid-cols-3 gap-4 mt-6 p-5 bg-gradient-to-r from-purple-50 to-amber-50 rounded-xl border border-purple-100">
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-gray-900">{userProfile.posts.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-purple-600">{userProfile.followers.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-gray-900">{userProfile.following.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Following</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 mt-6">
          <Button 
            onClick={handleVerifyAccount}
            disabled={isLoading}
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Entering giveaway...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-3" />
                Yes, This is My Account!
              </>
            )}
          </Button>
          <Button 
            onClick={() => setCurrentStep("input")} 
            variant="outline" 
            className="w-full h-12 sm:h-14 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-base sm:text-lg rounded-xl transition-all"
          >
            No, Try Different Username
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderSecurityStep = () => (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Complete Offer</CardTitle>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Complete one offer to enter the giveaway</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 rounded-xl p-5">
          <div className="text-center">
            <h4 className="font-bold text-purple-800 mb-3">🏆 Almost There!</h4>
            <p className="text-purple-700 text-sm mb-4">
              Complete a quick offer to verify you're human and enter the giveaway for 50K followers
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSecurityCheck} 
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Lock className="w-5 h-5 mr-3" />
          Complete Offer
        </Button>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-center">
            <p className="text-amber-700 text-sm">
              💡 <strong>Pro Tip:</strong> After completing the offer, you'll be entered into this week's giveaway for @{userProfile?.username}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const [winners, setWinners] = useState([
    { name: "Jessica M.", username: "@jessica_style", followers: "50,000", prize: "Grand Prize" },
    { name: "Carlos R.", username: "@carlos_fitness", followers: "25,000", prize: "2nd Place" },
    { name: "Amy L.", username: "@amy_travel", followers: "10,000", prize: "3rd Place" },
  ])

  // Load winners from database
  useEffect(() => {
    const loadWinners = async () => {
      try {
        const response = await fetch('/api/admin/winners')
        if (response.ok) {
          const dbWinners = await response.json()
          if (dbWinners.length > 0) {
            // Map database winners to display format
            const formattedWinners = dbWinners.map((winner: any) => ({
              name: winner.username,
              username: `@${winner.username}`,
              followers: winner.followers,
              prize: winner.prize
            }))
            setWinners(formattedWinners)
          }
        }
      } catch (error) {
        console.error('Error loading winners:', error)
        // Keep default winners if there's an error
      }
    }

    loadWinners()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-blue-50">
      {/* Mobile-First Header */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">InstaBoost</span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          {/* Progress Section */}
          <div className="mb-6 sm:mb-8">
            <div className="text-center mb-6">
              <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Weekly giveaway
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Win 50K Followers</h1>
              <p className="text-sm sm:text-base text-gray-600">Enter the weekly giveaway for 50,000 followers</p>
              
              {/* Countdown Timer */}
              <div className="mt-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">Next Draw In:</span>
                </div>
                <CountdownTimer targetDate={nextSaturday} />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">Step {currentStepIndex + 1} of {steps.length}</span>
              </div>
              <Progress value={progress} className="h-3 mb-4 bg-gray-200" />
              
              <div className="grid grid-cols-4 gap-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="text-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto mb-2 transition-all duration-300 ${
                        step.completed
                          ? "bg-purple-500 text-white shadow-lg"
                          : index === currentStepIndex
                            ? "bg-gradient-to-r from-purple-500 to-amber-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span
                      className={`text-xs font-medium block leading-tight ${
                        step.completed || index === currentStepIndex ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === "input" && renderInputStep()}
            {currentStep === "verification" && renderVerificationStep()}
            {currentStep === "security" && renderSecurityStep()}
          </div>

          {/* Additional Options */}
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="text-center">
                <h4 className="font-bold text-blue-800 mb-2">Want More Followers?</h4>
                <p className="text-blue-700 text-sm mb-4">
                  Check out our free daily followers or premium packages
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href="/free-followers">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Gift className="w-4 h-4 mr-2" />
                      Free Followers
                    </Button>
                  </Link>
                  <Link href="/packages">
                    <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                      <Star className="w-4 h-4 mr-2" />
                      Premium Packages
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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