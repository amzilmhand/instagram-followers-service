"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Users } from "lucide-react"
import Link from "next/link"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const closeNav = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InstaBoost</span>
            </div>
          </div>

          <nav className="flex flex-col space-y-4 mt-8">
            <Link
              href="/features"
              className="text-lg text-gray-600 hover:text-blue-600 transition-colors py-2"
              onClick={closeNav}
            >
              Features
            </Link>
            <Link
              href="/packages"
              className="text-lg text-gray-600 hover:text-blue-600 transition-colors py-2"
              onClick={closeNav}
            >
              Packages
            </Link>
            <Link
              href="/reviews"
              className="text-lg text-gray-600 hover:text-blue-600 transition-colors py-2"
              onClick={closeNav}
            >
              Reviews
            </Link>
            <Link
              href="/competition"
              className="text-lg text-gray-600 hover:text-blue-600 transition-colors py-2"
              onClick={closeNav}
            >
              Competition
            </Link>
            <Link
              href="/free-followers"
              className="text-lg text-blue-600 font-medium hover:text-blue-700 transition-colors py-2"
              onClick={closeNav}
            >
              Free Followers
            </Link>
          </nav>

          <div className="mt-auto space-y-3 pt-8 border-t">
            <Link href="/sign-in" onClick={closeNav}>
              <Button variant="outline" className="w-full bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" onClick={closeNav}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
