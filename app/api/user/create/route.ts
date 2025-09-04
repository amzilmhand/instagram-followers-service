import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/models/User"

function generateReferralCode(): string {
  return "INSTA-" + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { referredBy } = body

    const client = await clientPromise
    const db = client.db("instaboost")

    // Check if user already exists
    const existingUser = await db.collection<User>("users").findOne({ clerkId: userId })

    if (existingUser) {
      return NextResponse.json({ user: existingUser })
    }

    // Create new user
    const newUser: User = {
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      profileImage: user.imageUrl || "",
      createdAt: new Date(),
      updatedAt: new Date(),

      totalFollowersReceived: 0,
      freeFollowersThisMonth: 0,
      paidFollowersThisMonth: 0,

      referralCode: generateReferralCode(),
      referredBy: referredBy || undefined,
      referrals: [],
      referralEarnings: 0,

      isActive: true,
      subscriptionTier: "free",
    }

    const result = await db.collection<User>("users").insertOne(newUser)

    // If user was referred, update referrer
    if (referredBy) {
      await db.collection<User>("users").updateOne(
        { referralCode: referredBy },
        {
          $push: { referrals: userId },
          $inc: { referralEarnings: 10 },
        },
      )
    }

    return NextResponse.json({ user: { ...newUser, _id: result.insertedId } })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
