"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, CreditCard, Shield, CheckCircle, ArrowLeft, Clock, Star, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

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

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [instagramUsername, setInstagramUsername] = useState("")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [orderComplete, setOrderComplete] = useState(false)

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

  const handlePayment = async () => {
    if (!instagramUsername || !email) {
      return
    }

    setIsProcessing(true)

    try {
      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPackage.price,
          packageName: selectedPackage.name
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

  const handlePayPalPayment = handlePayment

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
              <p className="text-gray-600">Your order has been confirmed</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center">
                  <p className="font-medium text-green-900 mb-2">
                    {selectedPackage?.followers.toLocaleString()} followers will be delivered to
                  </p>
                  <p className="text-lg font-bold text-green-800">@{instagramUsername}</p>
                  <div className="flex items-center justify-center mt-3 text-green-700">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">Within {selectedPackage?.deliveryTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Home
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Order confirmation sent to <span className="font-medium">{email}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Back to Dashboard</span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">Secure checkout powered by PayPal</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{selectedPackage.name} Package</h3>
                      <p className="text-sm text-blue-700">{selectedPackage.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                  {selectedPackage.popular && <Badge className="bg-blue-600 text-white">Most Popular</Badge>}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Package Features:</h4>
                  <ul className="space-y-1">
                    {selectedPackage.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Delivery within {selectedPackage.deliveryTime}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Username</label>
                  <Input
                    type="text"
                    placeholder="@your_username"
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll never ask for your password</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">For order confirmation and updates</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{selectedPackage.name} Package</span>
                  <span className="font-medium">${selectedPackage.price}</span>
                </div>

                {selectedPackage.originalPrice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Original Price</span>
                    <span className="text-gray-500 line-through">${selectedPackage.originalPrice}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>
                    -${((selectedPackage.originalPrice || selectedPackage.price) - selectedPackage.price).toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${selectedPackage.price}</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      Limited time offer - Save{" "}
                      {Math.round(
                        (((selectedPackage.originalPrice || selectedPackage.price) - selectedPackage.price) /
                          (selectedPackage.originalPrice || selectedPackage.price)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  onClick={handlePayPalPayment}
                  disabled={!instagramUsername || !email || isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay with PayPal - ${selectedPackage.price}
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

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Money-back guarantee:</strong> If you're not satisfied with your followers within 30 days, we'll
                provide a full refund.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
