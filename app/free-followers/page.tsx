"use client"

import type React from "react"

import { useState } from "react"
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

export default function FreeFollowersPage() {
  const [currentStep, setCurrentStep] = useState<Step>("input")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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
    // This would integrate with adbluemedia content locker
    // For demo purposes, we'll simulate the process
    window.open("https://example.com/content-locker", "_blank")
    setCurrentStep("success")
  }

  const renderInputStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Get Your Free Followers</CardTitle>
        <p className="text-gray-600">Enter your details to claim 1,000 free Instagram followers</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">@</span>
            <Input
              type="text"
              placeholder="your_username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full pl-8"
              maxLength={30}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter your username without the @ symbol</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSearchAccount}
          disabled={!email || !username || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching Account...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Find My Account
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const renderVerificationStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verify Your Account</CardTitle>
        <p className="text-gray-600">Is this your Instagram account?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {userProfile && (
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src={userProfile?.profileImage || "/placeholder.jpg"}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">@{userProfile.username}</h3>
            {userProfile.fullName && <p className="text-gray-600 mb-2">{userProfile.fullName}</p>}
            {userProfile.isPrivate && (
              <Badge variant="secondary" className="mb-4">
                Private Account
              </Badge>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="font-bold text-lg">{userProfile.posts.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{userProfile.followers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{userProfile.following.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={handleVerifyAccount} className="w-full bg-green-600 hover:bg-green-700" size="lg">
            <CheckCircle className="w-4 h-4 mr-2" />
            Yes, This is My Account!
          </Button>
          <Button onClick={() => setCurrentStep("input")} variant="outline" className="w-full" size="lg">
            No, Try Different Username
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderSecurityStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Security Verification</CardTitle>
        <p className="text-gray-600">Complete this final step to verify you're human</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Security Check Required</p>
              <p className="text-sm text-blue-700">This helps us prevent spam and ensure real users</p>
            </div>
          </div>
        </div>

        <Button onClick={handleSecurityCheck} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          <Shield className="w-4 h-4 mr-2" />
          Verify I'm Not a Robot
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to complete a short verification process. This will open a new window.
        </p>
      </CardContent>
    </Card>
  )

  const renderSuccessStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-600">Congratulations!</CardTitle>
        <p className="text-gray-600">Your request has been confirmed successfully</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-center">
            <p className="font-medium text-green-900 mb-2">1,000 followers will be sent to</p>
            <p className="text-lg font-bold text-green-800">@{userProfile?.username}</p>
            <div className="flex items-center justify-center mt-3 text-green-700">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">Within 24 hours</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/sign-up">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <Users className="w-4 h-4 mr-2" />
              Create Account to Track Progress
            </Button>
          </Link>
          <Button variant="outline" className="w-full bg-transparent" size="lg">
            Share & Get More Followers
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Want to get followers faster?</p>
          <Link href="/packages" className="text-blue-600 hover:text-blue-700 font-medium">
            Check out our premium packages
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InstaBoost</span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Get Free Followers</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Step {currentStepIndex + 1} of {steps.length}
              </Badge>
            </div>

            <Progress value={progress} className="h-2 mb-4" />

            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed
                        ? "bg-green-600 text-white"
                        : index === currentStepIndex
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      step.completed || index === currentStepIndex ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === "input" && renderInputStep()}
          {currentStep === "verification" && renderVerificationStep()}
          {currentStep === "security" && renderSecurityStep()}
          {currentStep === "success" && renderSuccessStep()}
        </div>
      </div>

      {/* Live Notifications */}
      <LiveNotifications />
    </div>
  )
}
