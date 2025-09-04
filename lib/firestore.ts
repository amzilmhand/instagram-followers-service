import { db } from './firebase'
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  serverTimestamp,
  increment 
} from 'firebase/firestore'

export interface User {
  id: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  username?: string
  instagramUsername?: string
  referralCode: string
  totalFollowersReceived: number
  freeFollowersThisMonth: number
  paidFollowersThisMonth: number
  referrals: number
  referralEarnings: number
  lastFreeFollowersClaimDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  type: 'free' | 'premium'
  amount: number
  instagramUsername: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  packageId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Referral {
  id: string
  referrerId: string
  referredUserId: string
  referralCode: string
  earned: number
  status: 'pending' | 'completed'
  createdAt: Date
}

// User operations
export async function createUser(userData: Partial<User>): Promise<string> {
  const userRef = doc(collection(db, 'users'))
  const user: Omit<User, 'id'> = {
    clerkId: userData.clerkId!,
    email: userData.email!,
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    username: userData.username || '',
    instagramUsername: userData.instagramUsername || '',
    referralCode: userData.referralCode || generateReferralCode(),
    totalFollowersReceived: 0,
    freeFollowersThisMonth: 0,
    paidFollowersThisMonth: 0,
    referrals: 0,
    referralEarnings: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  await setDoc(userRef, user)
  return userRef.id
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const q = query(collection(db, 'users'), where('clerkId', '==', clerkId))
  const querySnapshot = await getDocs(q)
  
  if (querySnapshot.empty) return null
  
  const doc = querySnapshot.docs[0]
  return { id: doc.id, ...doc.data() } as User
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date()
  })
}

// Order operations
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const orderRef = doc(collection(db, 'orders'))
  const order: Omit<Order, 'id'> = {
    ...orderData,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  await setDoc(orderRef, order)
  return orderRef.id
}

export async function getUserOrders(userId: string, limitCount: number = 10): Promise<Order[]> {
  const q = query(
    collection(db, 'orders'), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Order))
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
  const orderRef = doc(db, 'orders', orderId)
  await updateDoc(orderRef, {
    ...updates,
    updatedAt: new Date()
  })
}

// Referral operations
export async function createReferral(referralData: Omit<Referral, 'id' | 'createdAt'>): Promise<string> {
  const referralRef = doc(collection(db, 'referrals'))
  const referral: Omit<Referral, 'id'> = {
    ...referralData,
    createdAt: new Date()
  }
  
  await setDoc(referralRef, referral)
  return referralRef.id
}

export async function getUserReferrals(referrerId: string): Promise<Referral[]> {
  const q = query(
    collection(db, 'referrals'), 
    where('referrerId', '==', referrerId),
    orderBy('createdAt', 'desc')
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Referral))
}

// Helper functions
function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function canClaimFreeFollowers(lastClaimDate?: Date): boolean {
  if (!lastClaimDate) return true
  
  const now = new Date()
  const timeDiff = now.getTime() - lastClaimDate.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)
  
  return hoursDiff >= 24
}

export function getTimeUntilNextClaim(lastClaimDate?: Date): number {
  if (!lastClaimDate) return 0
  
  const now = new Date()
  const timeDiff = now.getTime() - lastClaimDate.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)
  
  return Math.max(0, 24 - Math.floor(hoursDiff))
}