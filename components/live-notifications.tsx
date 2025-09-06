"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X } from "lucide-react"

interface Notification {
  id: string
  name: string
  followers: number
  timeAgo: string
}

const sampleNotifications: Notification[] = [
  {"id":"1","name":"@alex.k.","followers":1000,"timeAgo":"just now"},
  {"id":"2","name":"@sarah.m.","followers":1000,"timeAgo":"just now"},
  {"id":"3","name":"@mike.r.","followers":1000,"timeAgo":"just now"},
  {"id":"4","name":"@emma.l.","followers":1000,"timeAgo":"just now"},
  {"id":"5","name":"@david.p.","followers":1000,"timeAgo":"just now"},
  {"id":"6","name":"@lisa.w.","followers":1000,"timeAgo":"just now"},
  {"id":"7","name":"@john.d.","followers":1000,"timeAgo":"just now"},
  {"id":"8","name":"@anna.s.","followers":1000,"timeAgo":"just now"},
  {"id":"9","name":"@chris.t.","followers":1000,"timeAgo":"just now"},
  {"id":"10","name":"@jessica.b.","followers":1000,"timeAgo":"just now"},
  {"id":"11","name":"@ryan.g.","followers":1000,"timeAgo":"just now"},
  {"id":"12","name":"@kate.n.","followers":1000,"timeAgo":"just now"},
  {"id":"13","name":"@tom.h.","followers":1000,"timeAgo":"just now"},
  {"id":"14","name":"@lucy.v.","followers":1000,"timeAgo":"just now"},
  {"id":"15","name":"@matt.c.","followers":1000,"timeAgo":"just now"},
  {"id":"16","name":"@ella.f.","followers":1000,"timeAgo":"just now"},
  {"id":"17","name":"@nora.q.","followers":1000,"timeAgo":"just now"},
  {"id":"18","name":"@sam.y.","followers":1000,"timeAgo":"just now"},
  {"id":"19","name":"@laura.j.","followers":1000,"timeAgo":"just now"},
  {"id":"20","name":"@ben.k.","followers":1000,"timeAgo":"just now"},
  {"id":"21","name":"@mia.r.","followers":1000,"timeAgo":"just now"},
  {"id":"22","name":"@noah.s.","followers":1000,"timeAgo":"just now"},
  {"id":"23","name":"@ava.m.","followers":1000,"timeAgo":"just now"},
  {"id":"24","name":"@ethan.p.","followers":1000,"timeAgo":"just now"},
  {"id":"25","name":"@zoe.l.","followers":1000,"timeAgo":"just now"},
  {"id":"26","name":"@luke.d.","followers":1000,"timeAgo":"just now"},
  {"id":"27","name":"@clara.t.","followers":1000,"timeAgo":"just now"},
  {"id":"28","name":"@daniel.w.","followers":1000,"timeAgo":"just now"},
  {"id":"29","name":"@ivy.s.","followers":1000,"timeAgo":"just now"},
  {"id":"30","name":"@leo.b.","followers":1000,"timeAgo":"just now"},
  {"id":"31","name":"@isla.n.","followers":1000,"timeAgo":"just now"},
  {"id":"32","name":"@harry.g.","followers":1000,"timeAgo":"just now"},
  {"id":"33","name":"@oliver.c.","followers":1000,"timeAgo":"just now"},
  {"id":"34","name":"@sophia.v.","followers":1000,"timeAgo":"just now"},
  {"id":"35","name":"@liam.h.","followers":1000,"timeAgo":"just now"},
  {"id":"36","name":"@grace.m.","followers":1000,"timeAgo":"just now"},
  {"id":"37","name":"@oscar.p.","followers":1000,"timeAgo":"just now"},
  {"id":"38","name":"@ruby.k.","followers":1000,"timeAgo":"just now"},
  {"id":"39","name":"@max.r.","followers":1000,"timeAgo":"just now"},
  {"id":"40","name":"@chloe.s.","followers":1000,"timeAgo":"just now"},
  {"id":"41","name":"@adam.l.","followers":1000,"timeAgo":"just now"},
  {"id":"42","name":"@maya.j.","followers":1000,"timeAgo":"just now"},
  {"id":"43","name":"@aaron.t.","followers":1000,"timeAgo":"just now"},
  {"id":"44","name":"@lily.b.","followers":1000,"timeAgo":"just now"},
  {"id":"45","name":"@jacob.f.","followers":1000,"timeAgo":"just now"},
  {"id":"46","name":"@holly.v.","followers":1000,"timeAgo":"just now"},
  {"id":"47","name":"@tyler.n.","followers":1000,"timeAgo":"just now"},
  {"id":"48","name":"@sofia.g.","followers":1000,"timeAgo":"just now"},
  {"id":"49","name":"@sebastian.p.","followers":1000,"timeAgo":"just now"},
  {"id":"50","name":"@hugo.k.","followers":1000,"timeAgo":"just now"},
  {"id":"51","name":"@victoria.r.","followers":1000,"timeAgo":"just now"},
  {"id":"52","name":"@charles.m.","followers":1000,"timeAgo":"just now"},
  {"id":"53","name":"@alice.s.","followers":1000,"timeAgo":"just now"},
  {"id":"54","name":"@marcus.t.","followers":1000,"timeAgo":"just now"},
  {"id":"55","name":"@nicole.b.","followers":1000,"timeAgo":"just now"},
  {"id":"56","name":"@bella.l.","followers":1000,"timeAgo":"just now"},
  {"id":"57","name":"@richard.d.","followers":1000,"timeAgo":"just now"},
  {"id":"58","name":"@fiona.w.","followers":1000,"timeAgo":"just now"},
  {"id":"59","name":"@gavin.k.","followers":1000,"timeAgo":"just now"},
  {"id":"60","name":"@iris.m.","followers":1000,"timeAgo":"just now"},
  {"id":"61","name":"@julian.p.","followers":1000,"timeAgo":"just now"},
  {"id":"62","name":"@peyton.s.","followers":1000,"timeAgo":"just now"},
  {"id":"63","name":"@kelsey.j.","followers":1000,"timeAgo":"just now"},
  {"id":"64","name":"@diego.r.","followers":1000,"timeAgo":"just now"},
  {"id":"65","name":"@maria.v.","followers":1000,"timeAgo":"just now"},
  {"id":"66","name":"@pedro.l.","followers":1000,"timeAgo":"just now"},
  {"id":"67","name":"@marco.g.","followers":1000,"timeAgo":"just now"},
  {"id":"68","name":"@yara.h.","followers":1000,"timeAgo":"just now"},
  {"id":"69","name":"@karim.s.","followers":1000,"timeAgo":"just now"},
  {"id":"70","name":"@hicham.r.","followers":1000,"timeAgo":"just now"},
  {"id":"71","name":"@samir.m.","followers":1000,"timeAgo":"just now"},
  {"id":"72","name":"@oussama.k.","followers":1000,"timeAgo":"just now"},
  {"id":"73","name":"@rachid.p.","followers":1000,"timeAgo":"just now"},
  {"id":"74","name":"@amine.l.","followers":1000,"timeAgo":"just now"},
  {"id":"75","name":"@fatima.b.","followers":1000,"timeAgo":"just now"},
  {"id":"76","name":"@khadija.s.","followers":1000,"timeAgo":"just now"},
  {"id":"77","name":"@youssef.n.","followers":1000,"timeAgo":"just now"},
  {"id":"78","name":"@samira.t.","followers":1000,"timeAgo":"just now"},
  {"id":"79","name":"@imad.v.","followers":1000,"timeAgo":"just now"},
  {"id":"80","name":"@nabil.c.","followers":1000,"timeAgo":"just now"},
  {"id":"81","name":"@sana.k.","followers":1000,"timeAgo":"just now"},
  {"id":"82","name":"@adil.m.","followers":1000,"timeAgo":"just now"},
  {"id":"83","name":"@mina.r.","followers":1000,"timeAgo":"just now"},
  {"id":"84","name":"@reda.s.","followers":1000,"timeAgo":"just now"},
  {"id":"85","name":"@nawal.t.","followers":1000,"timeAgo":"just now"},
  {"id":"86","name":"@yassine.b.","followers":1000,"timeAgo":"just now"},
  {"id":"87","name":"@ouss.e.","followers":1000,"timeAgo":"just now"},
  {"id":"88","name":"@loubna.k.","followers":1000,"timeAgo":"just now"},
  {"id":"89","name":"@badr.h.","followers":1000,"timeAgo":"just now"},
  {"id":"90","name":"@sara.m.","followers":1000,"timeAgo":"just now"},
  {"id":"91","name":"@hajar.l.","followers":1000,"timeAgo":"just now"},
  {"id":"92","name":"@mouna.r.","followers":1000,"timeAgo":"just now"},
  {"id":"93","name":"@imane.s.","followers":1000,"timeAgo":"just now"},
  {"id":"94","name":"@driss.k.","followers":1000,"timeAgo":"just now"},
  {"id":"95","name":"@oussama.a.","followers":1000,"timeAgo":"just now"},
  {"id":"96","name":"@oussama.b.","followers":1000,"timeAgo":"just now"},
  {"id":"97","name":"@younes.c.","followers":1000,"timeAgo":"just now"},
  {"id":"98","name":"@rabia.d.","followers":1000,"timeAgo":"just now"},
  {"id":"99","name":"@sylvie.e.","followers":1000,"timeAgo":"just now"},
  {"id":"100","name":"@marie.f.","followers":1000,"timeAgo":"just now"}
]

export default function LiveNotifications() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const showRandomNotification = () => {
      const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)]
      setCurrentNotification(randomNotification)
      setIsVisible(true)

      // Hide notification after 4 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 4000)
    }

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showRandomNotification, 3000)

    // Then show notifications every 8-15 seconds
    const interval = setInterval(
      () => {
        showRandomNotification()
      },
      Math.random() * 7000 + 8000,
    ) // Random between 8-15 seconds

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!currentNotification || !isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 text-left">
                <span className="font-semibold text-gray-900">{currentNotification.name}</span> just received{" "}
                <span className="font-semibold text-blue-600">
                  {currentNotification.followers.toLocaleString()} followers
                </span>
                !
              </p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                {currentNotification.timeAgo}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
