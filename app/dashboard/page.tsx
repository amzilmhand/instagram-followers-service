"use client"

import { useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Gift,
  Clock,
  Star,
  Share2,
  CreditCard,
  History,
  Settings,
  LogOut,
  Bell,
  CheckCircle,
  AlertCircle,
  Zap,
  Copy,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  const [activeTab, setActiveTab] = useState("overview")
  const [timeRemaining, setTimeRemaining] = useState(18) // hours until next free claim
  const [referralCode] = useState(`INSTA-${user?.username?.toUpperCase() || "USER"}`)
  const [copiedReferral, setCopiedReferral] = useState(false)

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    window.location.href = "/sign-in"
    return null
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://instaboost.com/ref/${referralCode}`)
    setCopiedReferral(true)
    setTimeout(() => setCopiedReferral(false), 2000)
  }

  const userStats = {
    totalFollowersReceived: 15000,
    freeFollowersThisMonth: 8000,
    paidFollowersThisMonth: 7000,
    referrals: 12,
    referralEarnings: 120,
  }

  const recentOrders = [
    { id: "1", type: "Free", amount: 1000, status: "completed", date: "2024-01-15", username: "@john_doe" },
    { id: "2", type: "Premium", amount: 5000, status: "processing", date: "2024-01-14", username: "@john_doe" },
    { id: "3", type: "Free", amount: 1000, status: "completed", date: "2024-01-14", username: "@john_doe" },
    { id: "4", type: "Business", amount: 10000, status: "completed", date: "2024-01-13", username: "@john_doe" },
  ]

  const referrals = [
    { id: "1", username: "sarah_m", joinDate: "2024-01-10", status: "active", earned: 10 },
    { id: "2", username: "mike_photo", joinDate: "2024-01-08", status: "active", earned: 10 },
    { id: "3", username: "lisa_art", joinDate: "2024-01-05", status: "active", earned: 10 },
    { id: "4", username: "david_biz", joinDate: "2024-01-03", status: "active", earned: 10 },
  ]

  const packages = [
    {
      id: "starter",
      name: "Starter",
      followers: 5000,
      price: 9.99,
      popular: false,
      features: ["Real followers", "24h delivery", "No password required", "24/7 support"],
    },
    {
      id: "professional",
      name: "Professional",
      followers: 10000,
      price: 17.99,
      popular: true,
      features: ["Real followers", "12h delivery", "No password required", "24/7 support", "Engagement boost"],
    },
    {
      id: "business",
      name: "Business",
      followers: 50000,
      price: 79.99,
      popular: false,
      features: [
        "Real followers",
        "6h delivery",
        "No password required",
        "24/7 support",
        "Engagement boost",
        "Priority support",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InstaBoost</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName || user.username || "User"}!
          </h1>
          <p className="text-gray-600">Manage your Instagram growth and track your progress</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 text-xs sm:text-sm">
            <TabsTrigger value="overview" className="px-2 sm:px-4">
              Overview
            </TabsTrigger>
            <TabsTrigger value="free-followers" className="px-2 sm:px-4">
              Free
            </TabsTrigger>
            <TabsTrigger value="packages" className="px-2 sm:px-4">
              Packages
            </TabsTrigger>
            <TabsTrigger value="referrals" className="px-2 sm:px-4">
              Referrals
            </TabsTrigger>
            <TabsTrigger value="orders" className="px-2 sm:px-4">
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Followers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userStats.totalFollowersReceived.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Free This Month</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userStats.freeFollowersThisMonth.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Gift className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Referrals</p>
                      <p className="text-2xl font-bold text-gray-900">{userStats.referrals}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Referral Earnings</p>
                      <p className="text-2xl font-bold text-gray-900">{userStats.referralEarnings}</p>
                      <p className="text-xs text-gray-500">free followers</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-green-600" />
                    <span>Next Free Followers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{timeRemaining}h</div>
                    <p className="text-gray-600">until your next 1,000 free followers</p>
                  </div>
                  <Progress value={((24 - timeRemaining) / 24) * 100} className="h-2" />
                  <Button className="w-full" disabled={timeRemaining > 0}>
                    {timeRemaining > 0 ? `Wait ${timeRemaining}h` : "Claim Now"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span>Boost Your Growth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Get followers faster with our premium packages</p>
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("packages")}>
                      View Premium Packages
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setActiveTab("referrals")}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Invite Friends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div
                          className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center ${
                            order.status === "completed" ? "bg-green-100" : "bg-yellow-100"
                          }`}
                        >
                          {order.status === "completed" ? (
                            <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                          ) : (
                            <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {order.amount.toLocaleString()} followers ({order.type})
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Free Followers Tab */}
          <TabsContent value="free-followers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  <span>Free Followers Program</span>
                </CardTitle>
                <p className="text-gray-600">Get 1,000 free followers every 24 hours</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {timeRemaining > 0 ? `${timeRemaining} hours remaining` : "Ready to claim!"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {timeRemaining > 0
                      ? "Your next free followers will be available soon"
                      : "Click below to get your 1,000 free followers"}
                  </p>
                  <Progress value={((24 - timeRemaining) / 24) * 100} className="h-3 mb-6" />
                  <Button size="lg" className="bg-green-600 hover:bg-green-700" disabled={timeRemaining > 0}>
                    {timeRemaining > 0 ? `Wait ${timeRemaining}h` : "Claim 1,000 Free Followers"}
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {userStats.freeFollowersThisMonth.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <div className="text-sm text-gray-600">Claims This Month</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">24h</div>
                    <div className="text-sm text-gray-600">Next Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Packages</h2>
              <p className="text-gray-600">Get followers faster with our premium packages</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card key={index} className={`relative ${pkg.popular ? "border-blue-500 border-2" : ""}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-gray-900">${pkg.price}</div>
                    <p className="text-gray-600">{pkg.followers.toLocaleString()} followers</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/checkout?package=${pkg.id}`}>
                      <Button
                        className={`w-full ${pkg.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        variant={pkg.popular ? "default" : "outline"}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Purchase Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-purple-600" />
                  <span>Referral Program</span>
                </CardTitle>
                <p className="text-gray-600">Earn 10 free followers for each friend you refer</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-2">Your Referral Link</h3>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white border border-purple-200 rounded px-3 py-2 text-sm">
                      https://instaboost.com/ref/{referralCode}
                    </code>
                    <Button
                      onClick={copyReferralCode}
                      variant="outline"
                      size="sm"
                      className="border-purple-300 bg-transparent"
                    >
                      {copiedReferral ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{userStats.referrals}</div>
                    <div className="text-sm text-gray-600">Total Referrals</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{userStats.referralEarnings}</div>
                    <div className="text-sm text-gray-600">Followers Earned</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">10</div>
                    <div className="text-sm text-gray-600">Per Referral</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">@{referral.username}</p>
                          <p className="text-sm text-gray-500">Joined {referral.joinDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">+{referral.earned} followers</p>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {referral.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-gray-600" />
                  <span>Order History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            order.status === "completed"
                              ? "bg-green-100"
                              : order.status === "processing"
                                ? "bg-yellow-100"
                                : "bg-gray-100"
                          }`}
                        >
                          {order.status === "completed" ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : order.status === "processing" ? (
                            <Clock className="w-6 h-6 text-yellow-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.amount.toLocaleString()} followers</p>
                          <p className="text-sm text-gray-500">
                            {order.type} Package • {order.username} • {order.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "processing"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
