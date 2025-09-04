import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import clientPromise from "@/lib/mongodb"
import type { User, Order, Referral } from "@/lib/models/User"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("instaboost")

    // Get user data
    const user = await db.collection<User>("users").findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate time until next free followers claim (24 hours)
    const now = new Date()
    const lastClaim = user.lastFreeFollowersClaim || new Date(0)
    const nextClaimTime = new Date(lastClaim.getTime() + (24 * 60 * 60 * 1000))
    const timeUntilNextClaim = Math.max(0, Math.floor((nextClaimTime.getTime() - now.getTime()) / (1000 * 60 * 60)))
    const canClaim = timeUntilNextClaim === 0

    // Get recent orders
    const recentOrders = await db.collection<Order>("orders")
      .find({ clerkId: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    // Get referral data
    const referrals = await db.collection<Referral>("referrals")
      .find({ referrerId: userId })
      .sort({ createdAt: -1 })
      .toArray()

    // Get referred users info for display
    const referredUserIds = referrals.map(ref => ref.referredUserId)
    const referredUsers = await db.collection<User>("users")
      .find({ clerkId: { $in: referredUserIds } })
      .toArray()

    // Combine referral data with user info
    const referralsWithUserInfo = referrals.map(ref => {
      const referredUser = referredUsers.find(u => u.clerkId === ref.referredUserId)
      return {
        id: ref._id?.toString(),
        username: referredUser?.username || referredUser?.firstName || 'Unknown',
        joinDate: ref.createdAt.toISOString().split('T')[0],
        status: ref.status,
        earned: ref.followersEarned
      }
    })

    // Calculate current month stats
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyStats = await db.collection<Order>("orders").aggregate([
      {
        $match: {
          clerkId: userId,
          createdAt: { $gte: currentMonth },
          status: "completed"
        }
      },
      {
        $group: {
          _id: "$type",
          totalFollowers: { $sum: "$followersAmount" }
        }
      }
    ]).toArray()

    let freeFollowersThisMonth = 0
    let paidFollowersThisMonth = 0

    monthlyStats.forEach(stat => {
      if (stat._id === "free") {
        freeFollowersThisMonth = stat.totalFollowers
      } else {
        paidFollowersThisMonth += stat.totalFollowers
      }
    })

    const dashboardData = {
      user: {
        firstName: user.firstName,
        username: user.username,
        referralCode: user.referralCode,
        instagramUsername: user.instagramUsername
      },
      stats: {
        totalFollowersReceived: user.totalFollowersReceived || 0,
        freeFollowersThisMonth,
        paidFollowersThisMonth,
        referrals: referrals.length,
        referralEarnings: user.referralEarnings || 0
      },
      freeFollowers: {
        timeRemaining: timeUntilNextClaim,
        canClaim,
        lastClaimDate: user.lastFreeFollowersClaim
      },
      recentOrders: recentOrders.map(order => ({
        id: order._id?.toString(),
        type: order.type,
        amount: order.followersAmount,
        status: order.status,
        date: order.createdAt.toISOString().split('T')[0],
        username: order.instagramUsername
      })),
      referrals: referralsWithUserInfo
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard data fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}