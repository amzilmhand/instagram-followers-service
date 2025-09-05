"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, CreditCard, Shield, CheckCircle, ArrowLeft, Clock, Star, Lock, AlertCircle, Search, Zap } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

type Step = "input" | "verification" | "checkout" | "success"

interface UserProfile {
  username: string
  profileImage: string
  followers: number
  following: number
  posts: number
  fullName: string
  isPrivate: boolean
}

interface Package {
  id: string
  name: string
  followers: number
  price: number
  originalPrice?: number
  popular: boolean
  features: string[]
  deliveryTime: string
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package") || "professional"

  const [currentStep, setCurrentStep] = useState<Step>("input")
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("paypal")

  const packages: Package[] = [
    {
      id: "starter",
      name: "Starter",
      followers: 5000,
      price: 9.99,
      originalPrice: 19.99,
      popular: false,
      features: ["Real followers", "24h delivery", "No password required", "24/7 support"],
      deliveryTime: "24 hours",
    },
    {
      id: "professional",
      name: "Professional",
      followers: 10000,
      price: 17.99,
      originalPrice: 34.99,
      popular: true,
      features: ["Real followers", "12h delivery", "No password required", "24/7 support", "Engagement boost"],
      deliveryTime: "12 hours",
    },
    {
      id: "business",
      name: "Business",
      followers: 50000,
      price: 79.99,
      originalPrice: 149.99,
      popular: false,
      features: [
        "Real followers",
        "6h delivery",
        "No password required",
        "24/7 support",
        "Engagement boost",
        "Priority support",
      ],
      deliveryTime: "6 hours",
    },
  ]

  useEffect(() => {
    const pkg = packages.find((p) => p.id === packageId)
    if (pkg) {
      setSelectedPackage(pkg)
    }
  }, [packageId])

  const steps = [
    { id: "input", title: "Enter Details", completed: currentStep !== "input" },
    { id: "verification", title: "Verify Account", completed: ["checkout", "success"].includes(currentStep) },
    { id: "checkout", title: "Payment", completed: currentStep === "success" },
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

  const handleVerifyAccount = () => {
    setCurrentStep("checkout")
  }

  const handlePayment = async () => {
    if (!username || !email) {
      return
    }

    setIsProcessing(true)

    try {
      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPackage?.price,
          packageName: selectedPackage?.name
        })
      })

      const data = await response.json()
      
      if (response.ok && data.orderID) {
        // Redirect to PayPal for payment
        const approvalUrl = data.links.find((link: any) => link.rel === 'approve')?.href
        if (approvalUrl) {
          window.location.href = approvalUrl
        }
      } else {
        throw new Error(data.error || 'Failed to create order')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      alert('Payment failed: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderInputStep = () => (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Account Details</CardTitle>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Enter your details to start your order</p>
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
            
            <div className="grid grid-cols-3 gap-4 mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
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

            {/* Package Preview */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="text-center">
                <h4 className="font-bold text-blue-800 mb-2">Selected Package</h4>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-bold text-blue-900">{selectedPackage?.name}</span>
                </div>
                <p className="text-blue-700 text-sm">
                  +{selectedPackage?.followers.toLocaleString()} followers • ${selectedPackage?.price}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 mt-6">
          <Button 
            onClick={handleVerifyAccount} 
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Package not found</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile-First Header */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/packages" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
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
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                {selectedPackage?.name} Package
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
              <p className="text-sm sm:text-base text-gray-600">Get {selectedPackage?.followers.toLocaleString()} followers for ${selectedPackage?.price}</p>
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
                          ? "bg-blue-500 text-white shadow-lg"
                          : index === currentStepIndex
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
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
            {currentStep === "checkout" && (
              // Original checkout content but condensed
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Payment</CardTitle>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Complete your secure payment</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">{selectedPackage?.name} Package</span>
                      </div>
                      {selectedPackage?.popular && <Badge className="bg-blue-600 text-white">Most Popular</Badge>}
                    </div>
                    <div className="text-sm text-blue-700 mb-3">
                      {selectedPackage?.followers.toLocaleString()} followers for @{userProfile?.username}
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold text-blue-900">
                      <span>Total:</span>
                      <span>${selectedPackage?.price}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                      <input
                        type="radio"
                        id="paypal"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-600"
                      />
                      <label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-blue-900">PayPal</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={!username || !email || isProcessing}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating Order...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-3" />
                        Pay with PayPal - ${selectedPackage?.price}
                      </>
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <p className="text-xs text-gray-500">Your payment information is secure and encrypted</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Options */}
          <div className="mt-8 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="text-center">
                <h4 className="font-bold text-green-800 mb-2">Need More Followers?</h4>
                <p className="text-green-700 text-sm mb-4">
                  Check out our free daily followers while you wait
                </p>
                <Link href="/free-followers">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Star className="w-4 h-4 mr-2" />
                    Get Free Followers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
