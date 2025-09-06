'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  ShoppingCart, 
  Trophy, 
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  LogOut,
  RefreshCw
} from 'lucide-react'

interface Order {
  _id: string
  username: string
  email: string
  packageName: string
  followers: string
  price: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedOffer: boolean
}

interface Competition {
  _id: string
  username: string
  email: string
  status: 'pending' | 'completed'
  createdAt: string
  completedOffer: boolean
}

interface FreeUser {
  _id: string
  username: string
  email: string
  status: 'pending' | 'completed'
  createdAt: string
  completedOffer: boolean
}

interface Winner {
  _id: string
  username: string
  email: string
  position: number
  prize: string
  followers: string
  createdAt: string
}

interface Stats {
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalCompetitions: number
  completedCompetitions: number
  totalFreeUsers: number
  completedFreeUsers: number
  emailsSent: number
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [freeUsers, setFreeUsers] = useState<FreeUser[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    
    setAuthenticated(true)
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const [statsRes, ordersRes, competitionsRes, freeUsersRes, winnersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/competitions', { headers }),
        fetch('/api/admin/free-users', { headers }),
        fetch('/api/admin/winners', { headers })
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (ordersRes.ok) setOrders(await ordersRes.json())
      if (competitionsRes.ok) setCompetitions(await competitionsRes.json())
      if (freeUsersRes.ok) setFreeUsers(await freeUsersRes.json())
      if (winnersRes.ok) setWinners(await winnersRes.json())
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const markAsDelivered = async (id: string, type: 'order' | 'free') => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/mark-delivered`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, type })
      })

      if (response.ok) {
        loadDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error marking as delivered:', error)
    }
  }

  const setWinner = async (userId: string, position: number) => {
    try {
      const token = localStorage.getItem('adminToken')
      const prizeName = position === 1 ? 'Grand Prize' : position === 2 ? '2nd Place' : '3rd Place'
      
      const response = await fetch('/api/admin/winners', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId, 
          position, 
          prize: prizeName
        })
      })

      if (response.ok) {
        loadDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error setting winner:', error)
    }
  }

  const removeWinner = async (position: number) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/winners', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ position })
      })

      if (response.ok) {
        loadDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error removing winner:', error)
    }
  }

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile-First Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Competitions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCompetitions}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Free Claims</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFreeUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}</p>
                  </div>
                  <Mail className="w-8 h-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
          {[
            { key: 'overview', label: 'Overview', icon: Eye },
            { key: 'orders', label: 'Orders', icon: ShoppingCart },
            { key: 'competitions', label: 'Competitions', icon: Trophy },
            { key: 'free-users', label: 'Free Users', icon: Users },
            { key: 'winners', label: 'Winners', icon: Trophy }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">@{order.username}</span>
                        <Badge variant={order.completedOffer ? 'default' : 'secondary'}>
                          {order.completedOffer ? 'Offer Complete' : 'No Offer'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.email}</p>
                      <p className="text-sm font-medium">{order.packageName} - {order.followers} followers</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>
                        {order.status}
                      </Badge>
                      {order.completedOffer && order.status !== 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => markAsDelivered(order._id, 'order')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'competitions' && (
          <Card>
            <CardHeader>
              <CardTitle>Competition Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitions.map(comp => (
                  <div key={comp._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">@{comp.username}</span>
                        <Badge variant={comp.completedOffer ? 'default' : 'secondary'}>
                          {comp.completedOffer ? 'Offer Complete' : 'No Offer'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{comp.email}</p>
                      <p className="text-xs text-gray-500">{new Date(comp.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={comp.status === 'completed' ? 'default' : 'outline'}>
                      {comp.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'free-users' && (
          <Card>
            <CardHeader>
              <CardTitle>Free Followers Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {freeUsers.map(user => (
                  <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">@{user.username}</span>
                        <Badge variant={user.completedOffer ? 'default' : 'secondary'}>
                          {user.completedOffer ? 'Offer Complete' : 'No Offer'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Badge variant={user.status === 'completed' ? 'default' : 'outline'}>
                        {user.status}
                      </Badge>
                      {user.completedOffer && user.status !== 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => markAsDelivered(user._id, 'free')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Send Followers
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'winners' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Previous Winners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map(position => {
                    const winner = winners.find(w => w.position === position)
                    const positionName = position === 1 ? '1st Place' : position === 2 ? '2nd Place' : '3rd Place'
                    const followersCount = position === 1 ? '50,000' : position === 2 ? '25,000' : '10,000'
                    
                    return (
                      <div key={position} className="border rounded-lg p-4">
                        <div className="text-center mb-4">
                          <div
                            className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              position === 1
                                ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                                : position === 2
                                  ? "bg-gradient-to-br from-gray-300 to-gray-400"
                                  : "bg-gradient-to-br from-amber-600 to-amber-700"
                            }`}
                          >
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-bold text-lg">{positionName}</h3>
                          <p className="text-sm text-gray-600">{followersCount} followers</p>
                        </div>

                        {winner ? (
                          <div className="space-y-2">
                            <div className="text-center">
                              <p className="font-semibold">@{winner.username}</p>
                              <p className="text-sm text-gray-600">{winner.email}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeWinner(position)}
                              className="w-full"
                            >
                              Remove Winner
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            <p className="text-sm mb-2">No winner selected</p>
                            <p className="text-xs">Select from competition entries below</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Winners from Competition Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitions.filter(comp => comp.completedOffer).map(comp => (
                    <div key={comp._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">@{comp.username}</span>
                          <Badge variant="default">Offer Complete</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{comp.email}</p>
                        <p className="text-xs text-gray-500">{new Date(comp.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <div className="flex gap-1">
                          {[1, 2, 3].map(position => {
                            const isCurrentWinner = winners.find(w => w.position === position && w.username === comp.username)
                            return (
                              <Button
                                key={position}
                                size="sm"
                                variant={isCurrentWinner ? "default" : "outline"}
                                onClick={() => setWinner(comp._id, position)}
                                className={`${
                                  position === 1 ? 'border-yellow-400 text-yellow-600' : 
                                  position === 2 ? 'border-gray-400 text-gray-600' : 
                                  'border-amber-600 text-amber-600'
                                }`}
                              >
                                {position === 1 ? '1st' : position === 2 ? '2nd' : '3rd'}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}