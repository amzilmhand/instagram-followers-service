import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Check, Zap, Crown, Rocket, Star } from "lucide-react"
import Link from "next/link"

export default function PackagesPage() {
  const packages = [
    {
      name: "Starter",
      price: "$9.99",
      followers: "5,000",
      icon: Zap,
      color: "blue",
      features: [
        "5,000 Real Followers",
        "24-48 Hour Delivery",
        "Basic Support",
        "Safe & Secure",
        "No Password Required",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$17.99",
      followers: "10,000",
      icon: Crown,
      color: "purple",
      features: [
        "10,000 Real Followers",
        "12-24 Hour Delivery",
        "Priority Support",
        "Safe & Secure",
        "No Password Required",
        "Growth Analytics",
      ],
      popular: true,
    },
    {
      name: "Business",
      price: "$79.99",
      followers: "50,000",
      icon: Rocket,
      color: "amber",
      features: [
        "50,000 Real Followers",
        "6-12 Hour Delivery",
        "VIP Support",
        "Safe & Secure",
        "No Password Required",
        "Advanced Analytics",
        "Targeted Followers",
        "Engagement Boost",
      ],
      popular: false,
    },
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
              <Link href="/packages" className="text-blue-600 font-medium">
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
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200">
              <Crown className="w-4 h-4 mr-1" />
              Premium Packages
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="text-blue-600">Growth Package</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Accelerate your Instagram growth with our premium follower packages. Fast, safe, and guaranteed results.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => {
              const IconComponent = pkg.icon
              return (
                <Card
                  key={index}
                  className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${pkg.popular ? "ring-2 ring-blue-500 scale-105" : ""}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        pkg.color === "blue" ? "bg-blue-100" : pkg.color === "purple" ? "bg-purple-100" : "bg-amber-100"
                      }`}
                    >
                      <IconComponent
                        className={`w-8 h-8 ${
                          pkg.color === "blue"
                            ? "text-blue-600"
                            : pkg.color === "purple"
                              ? "text-purple-600"
                              : "text-amber-600"
                        }`}
                      />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{pkg.name}</CardTitle>
                    <div className="text-4xl font-bold text-gray-900 mt-2">{pkg.price}</div>
                    <div className="text-lg text-gray-600">{pkg.followers} Followers</div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-600">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full py-3 text-lg ${
                        pkg.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                      size="lg"
                    >
                      Choose {pkg.name}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Free Option Reminder */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto border-2 border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Don't Forget Our Free Option!</h3>
                <p className="text-gray-600 mb-6">
                  Get 1,000 free followers every 24 hours with our completely free service. No payment required!
                </p>
                <Link href="/free-followers">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">Get Free Followers</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our packages</p>
          </div>

          <div className="space-y-6">
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
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
