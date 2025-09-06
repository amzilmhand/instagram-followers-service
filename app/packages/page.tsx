import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Check, Zap, Crown, Rocket, Star } from "lucide-react"
import Link from "next/link"

export default function PackagesPage() {
  const packages = [
    {
      name: "Basic",
      price: "$2.00",
      followers: "1,000",
      icon: Users,
      color: "green",
      features: [
        "1,000 Real Followers",
        "24-48 Hour Delivery",
        "Basic Support",
        "Safe & Secure",
        "No Password Required",
      ],
      popular: false,
    },
    {
      name: "Starter",
      price: "$8.00",
      followers: "5,000",
      icon: Zap,
      color: "blue",
      features: [
        "5,000 Real Followers",
        "12-24 Hour Delivery",
        "Basic Support",
        "Safe & Secure",
        "No Password Required",
        "Growth Analytics",
      ],
      popular: false,
    },
    {
      name: "Popular",
      price: "$15.00",
      followers: "10,000",
      icon: Crown,
      color: "purple",
      features: [
        "10,000 Real Followers",
        "6-12 Hour Delivery",
        "Priority Support",
        "Safe & Secure",
        "No Password Required",
        "Advanced Analytics",
        "Engagement Boost",
      ],
      popular: true,
    },
    {
      name: "Pro",
      price: "$35.00",
      followers: "25,000",
      icon: Star,
      color: "amber",
      features: [
        "25,000 Real Followers",
        "3-6 Hour Delivery",
        "VIP Support",
        "Safe & Secure",
        "No Password Required",
        "Advanced Analytics",
        "Targeted Followers",
        "Engagement Boost",
      ],
      popular: false,
    },
    {
      name: "Business",
      price: "$65.00",
      followers: "50,000",
      icon: Rocket,
      color: "red",
      features: [
        "50,000 Real Followers",
        "1-3 Hour Delivery",
        "VIP Support",
        "Safe & Secure",
        "No Password Required",
        "Premium Analytics",
        "Targeted Followers",
        "Engagement Boost",
        "Account Growth Strategy",
      ],
      popular: false,
    },
    {
      name: "Enterprise",
      price: "$120.00",
      followers: "100,000",
      icon: Crown,
      color: "violet",
      features: [
        "100,000 Real Followers",
        "Instant Delivery",
        "24/7 VIP Support",
        "Safe & Secure",
        "No Password Required",
        "Premium Analytics",
        "Highly Targeted Followers",
        "Maximum Engagement Boost",
        "Personal Account Manager",
        "Growth Strategy Consultation",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/packages" className="text-blue-600 font-bold">
                Packages
              </Link>
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Reviews
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile-First Hero Section */}
      <section className="py-8 sm:py-16 lg:py-20">
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 px-4 py-2 text-sm sm:text-base">
              <Crown className="w-4 h-4 mr-2" />
              Premium Packages
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Growth Package</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Accelerate your Instagram growth with our premium follower packages. Fast, safe, and guaranteed results.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile-First Packages Grid */}
      <section className="py-8 sm:py-16">
        <div className="px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {packages.map((pkg, index) => {
                const IconComponent = pkg.icon
                return (
                  <Card
                    key={index}
                    className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 ${
                      pkg.popular ? "ring-2 ring-blue-500 lg:scale-110" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4 px-4 sm:px-6 pt-6">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          pkg.color === "green" 
                            ? "bg-gradient-to-r from-green-100 to-emerald-200" 
                            : pkg.color === "blue" 
                              ? "bg-gradient-to-r from-blue-100 to-blue-200" 
                              : pkg.color === "purple" 
                                ? "bg-gradient-to-r from-purple-100 to-purple-200" 
                                : pkg.color === "amber"
                                  ? "bg-gradient-to-r from-amber-100 to-orange-200"
                                  : pkg.color === "red"
                                    ? "bg-gradient-to-r from-red-100 to-rose-200"
                                    : "bg-gradient-to-r from-violet-100 to-purple-200"
                        }`}
                      >
                        <IconComponent
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${
                            pkg.color === "green"
                              ? "text-green-600"
                              : pkg.color === "blue"
                                ? "text-blue-600"
                                : pkg.color === "purple"
                                  ? "text-purple-600"
                                  : pkg.color === "amber"
                                    ? "text-amber-600"
                                    : pkg.color === "red"
                                      ? "text-red-600"
                                      : "text-violet-600"
                          }`}
                        />
                      </div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">{pkg.name}</CardTitle>
                      <div className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{pkg.price}</div>
                      <div className="text-base sm:text-lg text-gray-600 font-medium">{pkg.followers} Followers</div>
                    </CardHeader>

                    <CardContent className="pt-0 px-4 sm:px-6 pb-6">
                      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                        {pkg.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm sm:text-base text-gray-600">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link href={`/checkout?package=${pkg.name.toLowerCase()}`}>
                        <Button
                          className={`w-full h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 ${
                            pkg.popular
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                              : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white shadow-lg hover:shadow-xl"
                          }`}
                        >
                          Choose {pkg.name}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
          </div>

            {/* Mobile-First Free Option Reminder */}
            <div className="mt-8 sm:mt-12">
              <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Don't Forget Our Free Option!</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed max-w-lg mx-auto">
                    Get 1,000 free followers every 24 hours with our completely free service. No payment required!
                  </p>
                  <Link href="/free-followers">
                    <Button className="h-12 sm:h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">Get Free Followers</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
        </div>
      </section>

      {/* Mobile-First FAQ Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Frequently Asked Questions</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">Everything you need to know about our packages</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  question: "Are the followers real?",
                  answer:
                    "Yes, all our followers are 100% real and active Instagram users. We never use bots or fake accounts.",
                },
                {
                  question: "How long does delivery take?",
                  answer:
                    "Delivery times vary by package: Starter (24-48h), Professional (12-24h), Business (6-12h). We guarantee delivery within the specified timeframe.",
                },
                {
                  question: "Is it safe for my account?",
                  answer:
                    "We use safe, organic methods that comply with Instagram's terms of service. Your account will never be at risk.",
                },
                {
                  question: "Do you need my password?",
                  answer:
                    "No, we never ask for your password. We only need your Instagram username to deliver followers safely.",
                },
              ].map((faq, index) => (
                <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-5 sm:p-6">
                    <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">{faq.question}</h4>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
