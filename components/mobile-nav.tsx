"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Users, Gift, Trophy } from "lucide-react"
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
              <span className="text-xl font-bold text-gray-900">BoostGram</span>
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
              href="/free-followers"
              onClick={closeNav}
            >
              <Button
                  className="w-full sm:w-auto h-12 justify-start sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Gift className="w-5 h-5 mr-3" />
                  Get Free 1K Followers 
                </Button>
            </Link>
             <Link href="/competition" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 justify-start sm:h-14 border-2 border-purple-400 text-purple-700 hover:bg-purple-50 px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-xl transition-all"
                >
                  <Trophy className="w-5 h-5 mr-3" />
                  Win 50K Followers
                </Button>
              </Link>
          </nav>

        
        </div>
      </SheetContent>
    </Sheet>
  )
}
