// Temporary mock data for development until Firestore rules are configured
export const getMockDashboardData = (userId: string) => {
  return {
    user: {
      firstName: "Demo User",
      username: "demo_user",
      referralCode: "INSTA-DEMO123",
      instagramUsername: ""
    },
    stats: {
      totalFollowersReceived: 5000,
      freeFollowersThisMonth: 3000,
      paidFollowersThisMonth: 2000,
      referrals: 5,
      referralEarnings: 500
    },
    freeFollowers: {
      timeRemaining: 0,
      canClaim: true,
      lastClaimDate: null
    },
    recentOrders: [
      {
        id: "demo1",
        type: "free",
        amount: 1000,
        status: "completed",
        date: new Date().toISOString().split('T')[0],
        username: "demo_account"
      },
      {
        id: "demo2", 
        type: "premium",
        amount: 5000,
        status: "processing",
        date: new Date().toISOString().split('T')[0],
        username: "demo_account"
      }
    ],
    referrals: [
      {
        id: "ref1",
        username: "Friend1",
        joinDate: "2024-01-15",
        status: "completed",
        earned: 100
      },
      {
        id: "ref2",
        username: "Friend2", 
        joinDate: "2024-01-10",
        status: "completed",
        earned: 100
      }
    ]
  }
}

export const mockCreateUser = async (userData: any) => {
  console.log('Mock: Creating user with data:', userData)
  return {
    id: 'mock-user-' + Date.now(),
    ...userData
  }
}

export const mockClaimFollowers = async (instagramUsername: string) => {
  console.log('Mock: Claiming followers for:', instagramUsername)
  return {
    success: true,
    message: "Free followers claimed successfully! (Demo mode - check Firebase rules)",
    order: {
      id: 'mock-order-' + Date.now(),
      followersAmount: 1000,
      status: "processing"
    }
  }
}