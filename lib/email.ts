import nodemailer from 'nodemailer'
import { getDb, collections } from './database'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Email templates
export const emailTemplates = {
  offerCompleted: (username: string): EmailTemplate => ({
    subject: '🎉 Your Free 1K Followers are on the way!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Congratulations ${username}!</h2>
        <p>Great news! You've successfully completed the offer and your <strong>1,000 free followers</strong> are being processed.</p>
        <p>Your followers will be delivered to your Instagram account within 24-48 hours.</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af;">What happens next?</h3>
          <ul>
            <li>We'll start delivering your followers within the next few hours</li>
            <li>You'll see your follower count increase gradually</li>
            <li>All followers are real and active accounts</li>
          </ul>
        </div>
        <p>Thank you for choosing BoostGram!</p>
        <p>Best regards,<br>The BoostGram Team</p>
      </div>
    `,
    text: `Congratulations ${username}! You've successfully completed the offer and your 1,000 free followers are being processed. Your followers will be delivered within 24-48 hours.`
  }),

  competitionJoined: (username: string, email: string): EmailTemplate => ({
    subject: '🏆 You\'re entered in the 50K Followers Competition!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Welcome to the Competition ${username}!</h2>
        <p>Exciting news! You've successfully entered our <strong>50,000 Followers Competition</strong>.</p>
        <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6b21a8;">Competition Details:</h3>
          <ul>
            <li><strong>Prize:</strong> 50,000 Instagram Followers</li>
            <li><strong>Your Entry:</strong> @${username}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
        </div>
        <p>We'll notify you if you win! Make sure to complete offers to increase your chances.</p>
        <p>Good luck!</p>
        <p>Best regards,<br>The BoostGram Team</p>
      </div>
    `,
    text: `Welcome to the Competition ${username}! You've entered our 50,000 Followers Competition. We'll notify you if you win!`
  }),

  orderReceived: (username: string, packageName: string, followers: string): EmailTemplate => ({
    subject: `📦 Order Confirmed: ${packageName} Package`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Order Confirmed!</h2>
        <p>Thank you for your purchase ${username}!</p>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #047857;">Order Details:</h3>
          <ul>
            <li><strong>Package:</strong> ${packageName}</li>
            <li><strong>Followers:</strong> ${followers}</li>
            <li><strong>Instagram:</strong> @${username}</li>
          </ul>
        </div>
        <p>Your followers will be delivered according to your package timeline. You'll receive another email when delivery begins.</p>
        <p>Thank you for choosing BoostGram!</p>
        <p>Best regards,<br>The BoostGram Team</p>
      </div>
    `,
    text: `Order Confirmed! Thank you for purchasing the ${packageName} package (${followers} followers) for @${username}.`
  }),

  followersDelivered: (username: string, followers: string): EmailTemplate => ({
    subject: '✅ Your Followers Have Been Delivered!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Delivery Complete!</h2>
        <p>Great news ${username}!</p>
        <p>We've successfully delivered <strong>${followers} followers</strong> to your Instagram account @${username}.</p>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #b91c1c;">What's Next?</h3>
          <ul>
            <li>Check your Instagram follower count</li>
            <li>Engage with your new audience</li>
            <li>Consider our premium packages for more growth</li>
          </ul>
        </div>
        <p>Thank you for trusting BoostGram with your Instagram growth!</p>
        <p>Best regards,<br>The BoostGram Team</p>
      </div>
    `,
    text: `Delivery Complete! We've successfully delivered ${followers} followers to @${username}.`
  })
}

export async function sendEmail(to: string, template: EmailTemplate, type: string) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }

    const result = await transporter.sendMail(mailOptions)
    
    // Log email in database
    const db = await getDb()
    await db.collection(collections.emails).insertOne({
      to,
      subject: template.subject,
      type,
      messageId: result.messageId,
      sentAt: new Date(),
      status: 'sent'
    })

    console.log('Email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    
    // Log failed email
    const db = await getDb()
    await db.collection(collections.emails).insertOne({
      to,
      subject: template.subject,
      type,
      error: error instanceof Error ? error.message : 'Unknown error',
      sentAt: new Date(),
      status: 'failed'
    })

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
