"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, CreditCard, Clock, Zap, Trophy, Gift } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const orderID = searchParams.get('order') || 'ORDER123'
  const username = searchParams.get('username') || 'your_account'
  const packageName = searchParams.get('package') || 'Professional'

  // Package details based on name
  const getPackageDetails = (name: string) => {
    const packages: { [key: string]: { followers: string, delivery: string, price: string } } = {
      'Starter': { followers: '5,000', delivery: '24-48 hours', price: '$9.99' },
      'Professional': { followers: '10,000', delivery: '12-24 hours', price: '$17.99' },
      'Business': { followers: '50,000', delivery: '6-12 hours', price: '$79.99' }
    }
    return packages[name] || packages['Professional']
  }

  const packageDetails = getPackageDetails(packageName)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
          </div>
        </div>
      </header>

      <div className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-green-600" />
              </div>
              <Badge className="w-fit mx-auto mb-4 bg-green-100 text-green-800 border-green-200 px-4 py-2">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Successful
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
                🎉 Order Confirmed!
              </CardTitle>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Thank you for your purchase! Your {packageDetails.followers} followers are being processed.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Details</h3>
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-semibold">{packageName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Instagram:</span>
                      <span className="font-semibold">@{username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Followers:</span>
                      <span className="font-semibold text-blue-600">{packageDetails.followers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-semibold text-green-600">{packageDetails.delivery}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-semibold text-purple-600">{packageDetails.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{orderID}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-bold text-green-800 mb-3">What Happens Next?</h4>
                  <div className="space-y-2 text-sm sm:text-base text-green-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Followers will be delivered within <strong>{packageDetails.delivery}</strong></span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>All followers are <strong>real and active</strong> accounts</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Delivery is <strong>100% safe</strong> for your account</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="text-center">
                  <h4 className="font-bold text-amber-800 mb-3">💡 Keep Growing!</h4>
                  <p className="text-amber-700 text-sm mb-4">
                    Continue building your Instagram presence with our other services
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link href="/free-followers">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Gift className="w-4 h-4 mr-2" />
                        Free 1K Followers
                      </Button>
                    </Link>
                    <Link href="/competition">
                      <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-100">
                        <Trophy className="w-4 h-4 mr-2" />
                        Win 50K Followers
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}