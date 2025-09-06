import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Clock, Headphones, Users, Star, Zap, Trophy } from "lucide-react"
import Link from "next/link"
import LiveNotifications from "@/components/live-notifications"
import MobileNav from "@/components/mobile-nav"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Header */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">InstaBoost</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/packages" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Packages
              </Link>
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Reviews
              </Link>
              
            </nav>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Mobile-First Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-16 lg:py-24">
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 px-4 py-2 text-sm sm:text-base">
              <Gift className="w-4 h-4 mr-2" />
              Free Service - No Hidden Fees
            </Badge>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Get <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1K Free Followers</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Every 24 Hours
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Boost your Instagram account with new followers effortlessly - 100% free service with no hassle
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 max-w-3xl mx-auto">
              <Link href="/free-followers" className="flex-1 sm:flex-none">
                <Button
                  className="w-full sm:w-auto h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Gift className="w-5 h-5 mr-3" />
                  Get Free 1K Followers Daily
                </Button>
              </Link>
              <Link href="/packages" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 sm:h-14 border-2 border-amber-400 text-amber-700 hover:bg-amber-50 px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-xl transition-all"
                >
                  <Zap className="w-5 h-5 mr-3" />
                  Premium Packages
                </Button>
              </Link>
              <Link href="/competition" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 sm:h-14 border-2 border-purple-400 text-purple-700 hover:bg-purple-50 px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-xl transition-all"
                >
                  <Trophy className="w-5 h-5 mr-3" />
                  50K Followers Giveaway
                </Button>
              </Link>
            </div>

            {/* Live Notifications */}
            <div className="relative">
              <LiveNotifications />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-First Features Section */}
      <section id="features" className="py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose InstaBoost?</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                The most trusted platform for Instagram growth with thousands of satisfied users
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Completely Free Service</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Get 1K followers every 24 hours without paying a single penny. No hidden costs or subscriptions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">24-Hour Delivery</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Fast and reliable delivery within 24 hours. Watch your follower count grow consistently every day.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Headphones className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">24/7 Support</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Our dedicated support team is available around the clock to help you with any questions or issues.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-First Stats Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700">
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">500K+</div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium">Happy Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">50M+</div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium">Followers Delivered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">99.9%</div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium">Uptime</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-First Testimonials */}
      <section id="testimonials" className="py-8 sm:py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What Our Users Say</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                Join thousands of satisfied Instagram users who trust InstaBoost
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {[
                {
                  name: "Alex Johnson",
                  username: "@alexj_photo",
                  text: "Amazing service! I've been getting 1K followers every day for the past month. My engagement has increased dramatically!",
                  rating: 5,
                },
                {
                  name: "Maria Garcia",
                  username: "@maria_lifestyle",
                  text: "Finally found a service that actually works. The followers are real and the delivery is always on time. Highly recommended!",
                  rating: 5,
                },
                {
                  name: "David Chen",
                  username: "@davidc_business",
                  text: "This has transformed my business Instagram. The free followers helped me reach 10K and now I'm getting organic growth too!",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 leading-relaxed italic">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">{testimonial.username}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-First CTA Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700">
        <div className="px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Ready to Boost Your Instagram?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
              Join over 500,000 users who are already growing their Instagram accounts with InstaBoost
            </p>
            <Link href="/free-followers">
              <Button
                className="h-12 sm:h-14 bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Gift className="w-5 h-5 mr-3" />
                Start Getting Free Followers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile-First Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-10">
        <div className="px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">InstaBoost</span>
                </div>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  The most trusted platform for Instagram growth with real followers and engagement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Services</h3>
                <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                  <li>
                    <Link href="/features" className="hover:text-white transition-colors">
                      Free Followers
                    </Link>
                  </li>
                  <li>
                    <Link href="/packages" className="hover:text-white transition-colors">
                      Premium Packages
                    </Link>
                  </li>
                  <li>
                    <Link href="/competition" className="hover:text-white transition-colors">
                      Giveaway
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Support</h3>
                <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Live Chat
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Legal</h3>
                <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-gray-400 text-sm sm:text-base">
              <p>&copy; 2024 InstaBoost. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
