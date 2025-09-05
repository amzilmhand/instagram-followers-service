"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gift, Search, Shield, CheckCircle, Users, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import LiveNotifications from "@/components/live-notifications"

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

declare global {
  interface Window {
    eJuaF_dOi_WZzLdc: any
    _JF: any
  }
}

export default function FreeFollowersPage() {
  const [currentStep, setCurrentStep] = useState<Step>("input")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Load AdBlueMedia content locker script
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set the configuration
      window.eJuaF_dOi_WZzLdc = { "it": 4500583, "key": "a0bf0" }
      
      // Load the script
      const script = document.createElement('script')
      script.src = 'https://d167xx758yszc9.cloudfront.net/c584292.js'
      script.async = true
      document.head.appendChild(script)
      
      return () => {
        // Cleanup
        document.head.removeChild(script)
      }
    }
  }, [])

  const steps = [
    { id: "input", title: "Enter Details", completed: currentStep !== "input" },
    { id: "verification", title: "Verify Account", completed: ["security", "success"].includes(currentStep) },
    { id: "security", title: "Security Check", completed: currentStep === "success" },
    { id: "success", title: "Complete", completed: false },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[@\s]/g, "").toLowerCase()
    setUsername(value)
  }

  const handleSearchAccount = async () => {
    if (!username || !email) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/instagram/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.replace("@", "") }),
      })

      const data = await response.json()
      console.log("Instagram Profile Response:", data)
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

  const handleVerifyAccount = () => {
    setCurrentStep("security")
  }

  const handleSecurityCheck = () => {
    // Initialize AdBlueMedia content locker
    if (typeof window !== 'undefined' && (window as any)._JF) {
      (window as any)._JF({
        onComplete: () => {
          // Content locker completed successfully
          setCurrentStep("success")
          // Here you could also send the completion to your API
          handleCompleteFollowers()
        },
        onClose: () => {
          // User closed the content locker without completing
          console.log('Content locker closed')
        }
      })
    } else {
      // Fallback if script not loaded
      console.error('AdBlueMedia content locker not available')
      // For development/testing, proceed to success
      setCurrentStep("success")
    }
  }

  const handleCompleteFollowers = async () => {
    try {
      const response = await fetch('/api/user/claim-followers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          instagramUsername: username,
          email: email 
        })
      })
      
      if (response.ok) {
        console.log('Followers claim request sent successfully')
      }
    } catch (error) {
      console.error('Error claiming followers:', error)
    }
  }

  const renderInputStep = () => (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4 px-6 pt-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Get Your Free Followers</CardTitle>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Enter your details to claim 1,000 free Instagram followers</p>
      </CardHeader>
      <CardContent className="space-y-5 px-6 pb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">Email Address</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">Instagram Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-base">@</span>
            <Input
              type="text"
              placeholder="your_username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl pl-10 transition-all"
              maxLength={30}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 px-1">Enter your username without the @ symbol</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSearchAccount}
          disabled={!email || !username || isLoading}
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
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
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4 px-6 pt-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Verify Your Account</CardTitle>
        <p className="text-gray-600 text-sm sm:text-base">Is this your Instagram account?</p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
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
            {userProfile.fullName && <p className="text-gray-600 mb-3 text-sm sm:text-base">{userProfile.fullName}</p>}
            {userProfile.isPrivate && (
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800 px-3 py-1">
                Private Account
              </Badge>
            )}

            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-gray-900">{userProfile.posts.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-blue-600">{userProfile.followers.toLocaleString()}</div>
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
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CheckCircle className="w-5 h-5 mr-3" />
            Yes, This is My Account!
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
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4 px-6 pt-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Security Verification</CardTitle>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Complete this final step to verify you're human</p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 text-sm sm:text-base">Security Check Required</p>
              <p className="text-sm text-blue-700 leading-relaxed mt-1">This helps us prevent spam and ensure real users get their followers</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSecurityCheck} 
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Shield className="w-5 h-5 mr-3" />
          Verify I'm Not a Robot
        </Button>

        <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed px-2">
          By continuing, you agree to complete a short verification process. This will open a new window.
        </p>
      </CardContent>
    </Card>
  )

  const renderSuccessStep = () => (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4 px-6 pt-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-green-600">Congratulations!</CardTitle>
        <p className="text-gray-600 text-sm sm:text-base">Your request has been confirmed successfully</p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-5">
          <div className="text-center">
            <p className="font-semibold text-green-900 mb-2 text-sm sm:text-base">1,000 followers will be sent to</p>
            <p className="text-xl sm:text-2xl font-bold text-green-800">@{userProfile?.username}</p>
            <div className="flex items-center justify-center mt-3 text-green-700">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base font-medium">Within 24 hours</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/sign-up">
            <Button className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="w-5 h-5 mr-3" />
              Create Account to Track Progress
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full h-12 sm:h-14 border-2 border-purple-200 hover:border-purple-300 text-purple-700 font-semibold text-base sm:text-lg rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all"
          >
            Share & Get More Followers
          </Button>
        </div>

        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <p className="text-sm text-gray-700 mb-2 font-medium">Want to get followers faster?</p>
          <Link href="/packages" className="text-blue-600 hover:text-purple-600 font-semibold text-sm sm:text-base transition-colors">
            Check out our premium packages →
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile-First Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors touch-target">
              <ArrowLeft className="w-5 h-5" />
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

      <div className="px-4 py-6 sm:py-8">
        <div className="max-w-lg mx-auto">
          {/* Mobile-Optimized Progress Section */}
          <div className="mb-6 sm:mb-8">
            <div className="text-center mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Get Free Followers</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-3 py-1">
                Step {currentStepIndex + 1} of {steps.length}
              </Badge>
            </div>

            <Progress value={progress} className="h-2 mb-4 bg-gray-200" />

            {/* Mobile-Friendly Step Indicators */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="text-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto mb-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                        : index === currentStepIndex
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium block leading-tight ${
                      step.completed || index === currentStepIndex ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === "input" && renderInputStep()}
            {currentStep === "verification" && renderVerificationStep()}
            {currentStep === "security" && renderSecurityStep()}
            {currentStep === "success" && renderSuccessStep()}
          </div>
        </div>
      </div>

      {/* Live Notifications - Mobile Optimized */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:bottom-8 sm:w-auto z-40">
        <LiveNotifications />
      </div>
    </div>
  )
}
