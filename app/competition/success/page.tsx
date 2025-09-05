"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, Trophy, Gift, Clock, Star } from "lucide-react"
import Link from "next/link"

export default function CompetitionSuccessPage() {
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
                <Trophy className="w-4 h-4 mr-2" />
                Entry Confirmed
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
                🎉 You're In the Competition!
              </CardTitle>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Congratulations! You've successfully entered the weekly competition for 50K Instagram followers.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What Happens Next?</h3>
                  <div className="space-y-3 text-sm sm:text-base text-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>Draw takes place every <strong>Saturday at midnight</strong></span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      <span>Winner gets <strong>50,000 real followers</strong></span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      <span>Followers delivered within <strong>24 hours</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="text-center">
                  <h4 className="font-bold text-amber-800 mb-3">💡 Pro Tip: Boost Your Chances!</h4>
                  <p className="text-amber-700 text-sm mb-4">
                    While you wait for the draw, grow your account with our guaranteed services
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link href="/free-followers">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Gift className="w-4 h-4 mr-2" />
                        Get Free 1K Followers
                      </Button>
                    </Link>
                    <Link href="/packages">
                      <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-100">
                        <Trophy className="w-4 h-4 mr-2" />
                        Premium Packages
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Good luck! We'll announce the winner on our social media channels.
                </p>
                <Link href="/competition">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Enter Another Account
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