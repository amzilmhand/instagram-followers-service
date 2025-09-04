import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import clientPromise from "@/lib/mongodb"
import type { User, Order } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { instagramUsername } = await request.json()

    if (!instagramUsername) {
      return NextResponse.json({ error: "Instagram username is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("instaboost")

    // Get user data
    const user = await db.collection<User>("users").findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user can claim (24 hours since last claim)
    const now = new Date()
    const lastClaim = user.lastFreeFollowersClaim || new Date(0)
    const timeSinceLastClaim = now.getTime() - lastClaim.getTime()
    const twentyFourHours = 24 * 60 * 60 * 1000

    if (timeSinceLastClaim < twentyFourHours) {
      const timeUntilNextClaim = Math.ceil((twentyFourHours - timeSinceLastClaim) / (1000 * 60 * 60))
      return NextResponse.json({ 
        error: "You must wait 24 hours between claims", 
        timeRemaining: timeUntilNextClaim 
      }, { status: 400 })
    }

    // Create order for free followers
    const newOrder: Order = {
      userId: user._id?.toString() || "",
      clerkId: userId,
      type: "free",
      packageName: "Free Daily Followers",
      followersAmount: 1000,
      price: 0,
      status: "processing",
      instagramUsername: instagramUsername.replace("@", ""),
      createdAt: now,
      updatedAt: now
    }

    const orderResult = await db.collection<Order>("orders").insertOne(newOrder)

    // Update user's last claim time and stats
    const updateResult = await db.collection<User>("users").updateOne(
      { clerkId: userId },
      {
        $set: {
          lastFreeFollowersClaim: now,
          instagramUsername: instagramUsername.replace("@", ""),
          updatedAt: now
        },
        $inc: {
          totalFollowersReceived: 1000,
          freeFollowersThisMonth: 1000
        }
      }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
    }

    // In a real app, you would trigger the actual follower delivery process here
    // For now, we'll simulate it by marking the order as completed after a delay
    setTimeout(async () => {
      try {
        await db.collection<Order>("orders").updateOne(
          { _id: orderResult.insertedId },
          {
            $set: {
              status: "completed",
              completedAt: new Date(),
              updatedAt: new Date()
            }
          }
        )
      } catch (error) {
        console.error("Failed to update order status:", error)
      }
    }, 5000) // Complete after 5 seconds for demo

    return NextResponse.json({
      success: true,
      message: "Free followers claimed successfully! They will be delivered within 24 hours.",
      order: {
        id: orderResult.insertedId,
        followersAmount: 1000,
        status: "processing"
      }
    })
  } catch (error) {
    console.error("Claim followers error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}