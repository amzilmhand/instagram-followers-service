import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star, TrendingUp, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ReviewsPage() {
  const reviews = [
    {
      name: "Sarah Johnson",
      username: "@sarahj_lifestyle",
      rating: 5,
      text: "Incredible service! I've been using InstaBoost for 3 months and my follower count has grown from 2K to 15K. The free daily followers really work, and when I needed a quick boost for a campaign, their premium packages delivered exactly as promised.",
      followers: "15.2K",
      verified: true,
      date: "2 days ago",
    },
    {
      name: "Mike Chen",
      username: "@mikec_photography",
      rating: 5,
      text: "As a photographer, having a strong Instagram presence is crucial for my business. InstaBoost helped me reach 10K followers in just 2 months. The followers are real and actually engage with my content. Highly recommend!",
      followers: "12.8K",
      verified: true,
      date: "1 week ago",
    },
    {
      name: "Emma Rodriguez",
      username: "@emma_fitness",
      rating: 5,
      text: "I was skeptical at first, but InstaBoost proved me wrong. The free followers service is amazing - 1000 real followers every day! I also bought the Professional package and got 10K followers in less than 24 hours. Customer support is excellent too.",
      followers: "28.5K",
      verified: true,
      date: "3 days ago",
    },
    {
      name: "David Thompson",
      username: "@davidthompson_art",
      rating: 5,
      text: "Game changer for my art business! Started with the free service and was so impressed that I upgraded to premium packages. My engagement rate has increased by 300% and I'm getting more commission requests than ever.",
      followers: "8.9K",
      verified: false,
      date: "5 days ago",
    },
    {
      name: "Lisa Park",
      username: "@lisapark_travel",
      rating: 5,
      text: "Best Instagram growth service I've ever used! The delivery is always on time, followers are genuine, and the dashboard makes it easy to track everything. I've recommended InstaBoost to all my influencer friends.",
      followers: "22.1K",
      verified: true,
      date: "1 day ago",
    },
    {
      name: "Alex Martinez",
      username: "@alexm_tech",
      rating: 5,
      text: "Outstanding results! I run a tech review channel and needed to grow my Instagram to match my YouTube success. InstaBoost delivered 50K followers through their Business package in just 8 hours. Incredible!",
      followers: "67.3K",
      verified: true,
      date: "4 days ago",
    },
  ]

  const stats = [
    { label: "Total Reviews", value: "50,000+", icon: MessageCircle },
    { label: "Average Rating", value: "4.9/5", icon: Star },
    { label: "Happy Customers", value: "500K+", icon: Heart },
    { label: "Success Rate", value: "99.8%", icon: TrendingUp },
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
              <Link href="/reviews" className="text-blue-600 font-medium">
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
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
              <Star className="w-4 h-4 mr-1" />
              4.9/5 Rating
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="text-blue-600">Customers Say</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read real reviews from over 500,000 satisfied customers who have grown their Instagram with InstaBoost
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="border-0 shadow-md text-center">
                  <CardContent className="p-6">
                    <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 mb-6 leading-relaxed">"{review.text}"</p>

                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-lg">
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900">{review.name}</span>
                          {review.verified && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{review.username}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{review.followers}</div>
                      <div className="text-xs text-gray-500">followers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              Load More Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Join Our Happy Customers</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your Instagram growth journey today and see why 500,000+ users trust InstaBoost
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-followers">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Get Free Followers
              </Button>
            </Link>
            <Link href="/packages">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent"
              >
                View Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
