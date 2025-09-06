"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, Gift, Clock, Zap, Trophy } from "lucide-react"
import Link from "next/link"

export default function FreeFollowersSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Mobile-First Header */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">BoostGram</span>
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
                <Gift className="w-4 h-4 mr-2" />
                Order Confirmed
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
                Free Followers Confirmed!
              </CardTitle>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Amazing! Your free 1,000 followers are being processed and will be delivered soon.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="text-center">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What's Next?</h3>
                  <div className="space-y-3 text-sm sm:text-base text-gray-700">
                    <div className="flex items-start justify-start gap-2 text-left">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span><strong>1,000 real followers</strong> are being processed</span>
                    </div>
                    <div className="flex items-start justify-start gap-2 text-left">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <span>Delivery within <strong>1-3 hours</strong></span>
                    </div>
                    <div className="flex items-start justify-start gap-2 text-left">
                      <Gift className="w-5 h-5 text-green-600" />
                      <span>Come back in <strong>24 hours</strong> for more free followers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="text-center">
                  <h4 className="font-bold text-purple-800 mb-3">Want More Followers?</h4>
                  <p className="text-purple-700 text-sm mb-4">
                    Don't wait! Get instant followers with our premium packages or enter our weekly competition
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link href="/packages">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        <Zap className="w-4 h-4 mr-2" />
                        Buy More Followers
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
                  Your followers will appear gradually to look natural and avoid detection.
                </p>
                <Link href="/free-followers">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Get More Free Followers
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