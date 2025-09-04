import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import clientPromise from "@/lib/mongodb"
import type { User, Referral } from "@/lib/models/User"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("instaboost")

    // Get all referrals made by this user
    const referrals = await db.collection<Referral>("referrals")
      .find({ referrerId: userId })
      .sort({ createdAt: -1 })
      .toArray()

    // Get details of referred users
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
        email: referredUser?.email,
        joinDate: ref.createdAt.toISOString().split('T')[0],
        status: ref.status,
        followersEarned: ref.followersEarned
      }
    })

    return NextResponse.json({
      referrals: referralsWithUserInfo,
      totalReferrals: referrals.length,
      totalEarnings: referrals.reduce((sum, ref) => sum + ref.followersEarned, 0)
    })
  } catch (error) {
    console.error("Referrals fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { referredUserId, action } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("instaboost")

    if (action === "complete") {
      // Complete a referral (when referred user claims their first free followers)
      const result = await db.collection<Referral>("referrals").updateOne(
        { referrerId: userId, referredUserId, status: "pending" },
        {
          $set: {
            status: "completed",
            followersEarned: 10
          }
        }
      )

      if (result.matchedCount > 0) {
        // Update referrer's earnings
        await db.collection<User>("users").updateOne(
          { clerkId: userId },
          {
            $inc: { referralEarnings: 10 }
          }
        )

        return NextResponse.json({ success: true, earned: 10 })
      }
    }

    return NextResponse.json({ error: "Referral not found or already completed" }, { status: 404 })
  } catch (error) {
    console.error("Referral update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}