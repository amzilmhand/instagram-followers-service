import bcrypt from 'bcryptjs'

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('Admin credentials not configured')
  }

  // Check email match (case insensitive)
  const emailMatch = email.toLowerCase() === adminEmail.toLowerCase()
  
  // Check password - support both plain text and hashed
  let passwordMatch = false
  if (adminPassword.startsWith('$2')) {
    // Hashed password
    passwordMatch = await bcrypt.compare(password, adminPassword)
  } else {
    // Plain text password (less secure but for development)
    passwordMatch = password === adminPassword
  }

  return emailMatch && passwordMatch
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}