"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, XCircle, CreditCard, RotateCcw, Gift, Trophy } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
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
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 sm:w-14 sm:h-14 text-red-600" />
              </div>
              <Badge className="w-fit mx-auto mb-4 bg-red-100 text-red-800 border-red-200 px-4 py-2">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Cancelled
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-red-800 mb-4">
                Payment Not Completed
              </CardTitle>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Your payment was cancelled or didn't complete successfully. No charges have been made to your account.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What Happened?</h3>
                  <div className="space-y-3 text-sm sm:text-base text-gray-700">
                    <p>• Payment was cancelled during the checkout process</p>
                    <p>• PayPal session expired or encountered an error</p>
                    <p>• Browser was closed before completing payment</p>
                    <p>• Payment method was declined</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="text-center">
                  <RotateCcw className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-bold text-blue-800 mb-3">Ready to Try Again?</h4>
                  <p className="text-blue-700 text-sm mb-4">
                    Your cart is still saved. You can complete your purchase or explore our other options.
                  </p>
                  <div className="grid gap-3">
                    <Link href="/packages">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Try Payment Again
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="text-center">
                  <h4 className="font-bold text-purple-800 mb-3">🎁 Free Alternatives</h4>
                  <p className="text-purple-700 text-sm mb-4">
                    Not ready to purchase? Try our free options while you decide
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link href="/free-followers">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Gift className="w-4 h-4 mr-2" />
                        Get Free 1K Followers
                      </Button>
                    </Link>
                    <Link href="/competition">
                      <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                        <Trophy className="w-4 h-4 mr-2" />
                        Win 50K Followers
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Need help? Contact our support team if you continue experiencing issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/packages">
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                      View Packages
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}