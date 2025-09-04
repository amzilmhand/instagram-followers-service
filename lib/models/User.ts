export interface User {
  _id?: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  username?: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date

  // Instagram related
  instagramUsername?: string
  totalFollowersReceived: number
  freeFollowersThisMonth: number
  paidFollowersThisMonth: number
  lastFreeFollowersClaim?: Date

  // Referrals
  referralCode: string
  referredBy?: string
  referrals: string[]
  referralEarnings: number

  // Subscription
  isActive: boolean
  subscriptionTier?: "free" | "premium" | "business"
}

export interface Order {
  _id?: string
  userId: string
  clerkId: string
  type: "free" | "premium" | "business"
  packageName: string
  followersAmount: number
  price: number
  status: "pending" | "processing" | "completed" | "failed"
  instagramUsername: string
  paymentId?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface Referral {
  _id?: string
  referrerId: string
  referredUserId: string
  referralCode: string
  status: "pending" | "active" | "completed"
  followersEarned: number
  createdAt: Date
}
