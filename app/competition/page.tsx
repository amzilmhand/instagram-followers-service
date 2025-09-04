"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Users, Gift, Clock, Star, Crown, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CompetitionPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const winners = [
    { name: "Jessica M.", username: "@jessica_style", followers: "50,000", prize: "Grand Prize" },
    { name: "Carlos R.", username: "@carlos_fitness", followers: "25,000", prize: "2nd Place" },
    { name: "Amy L.", username: "@amy_travel", followers: "10,000", prize: "3rd Place" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InstaBoost</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="/packages" className="text-gray-600 hover:text-blue-600 transition-colors">
                Packages
              </Link>
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors">
                Reviews
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-amber-100 text-purple-800 border-purple-200">
              <Trophy className="w-4 h-4 mr-1" />
              Monthly Competition
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Win{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-600">
                50,000 Followers
              </span>
              <br />
              Every Month!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Enter our monthly competition for a chance to win 50,000 Instagram followers absolutely free. New winners
              every month!
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <Clock className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-semibold text-gray-700">Next Draw In:</span>
              <div className="flex space-x-2">
                <div className="bg-purple-600 text-white px-3 py-2 rounded-lg font-bold">15</div>
                <span className="text-gray-500">:</span>
                <div className="bg-purple-600 text-white px-3 py-2 rounded-lg font-bold">23</div>
                <span className="text-gray-500">:</span>
                <div className="bg-purple-600 text-white px-3 py-2 rounded-lg font-bold">47</div>
                <span className="text-gray-500">:</span>
                <div className="bg-purple-600 text-white px-3 py-2 rounded-lg font-bold">12</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Form */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isSubmitted ? (
            <Card className="border-0 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Enter the Competition</CardTitle>
                <p className="text-gray-600 mt-2">
                  Fill out the form below to enter this month's 50K followers giveaway
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Instagram Username
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your_instagram_username"
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Gift className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Competition Rules:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Must have an active Instagram account</li>
                          <li>• One entry per person per month</li>
                          <li>• Winner announced on the 1st of each month</li>
                          <li>• Followers delivered within 48 hours of winning</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white py-3 text-lg font-semibold"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Enter Competition
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-2xl text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">You're In!</h2>
                <p className="text-gray-600 mb-6">
                  Congratulations! You've successfully entered the competition for 50,000 free followers. We'll notify
                  you via email if you win!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Entry Confirmed:</strong> @{username}
                    <br />
                    <strong>Draw Date:</strong> 1st of next month
                    <br />
                    <strong>Prize:</strong> 50,000 Instagram Followers
                  </p>
                </div>
                <Link href="/free-followers">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Free Followers While You Wait
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Previous Winners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Previous Winners</h2>
            <p className="text-xl text-gray-600">Congratulations to last month's lucky winners!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {winners.map((winner, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                        : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-400"
                          : "bg-gradient-to-br from-amber-600 to-amber-700"
                    }`}
                  >
                    {index === 0 ? (
                      <Crown className="w-8 h-8 text-white" />
                    ) : index === 1 ? (
                      <Star className="w-8 h-8 text-white" />
                    ) : (
                      <Zap className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{winner.name}</h3>
                  <p className="text-gray-600 mb-2">{winner.username}</p>
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
                  <div className="text-2xl font-bold text-blue-600">{winner.followers}</div>
                  <div className="text-sm text-gray-500">Followers Won</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
