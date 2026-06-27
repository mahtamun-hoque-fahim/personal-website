import { Resend } from 'resend'

// Lazy: instantiating Resend at module load with a missing API key throws,
// which kills `next build` during "collect page data" because lib/auth.ts
// imports this file. Defer until actually sending.
let resendClient: Resend | null = null
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY missing — email send skipped')
    return null
  }
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY)
  return resendClient
}

/**
 * Send password reset email via Resend
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  try {
    const resend = getResend(); if (!resend) return false; const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@mahtamunhoquefahim.com',
      to: email,
      subject: 'Reset your password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #f0ede6; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { border-bottom: 1px solid #1f1f1f; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; }
              .logo .accent { color: #00e676; }
              .content { line-height: 1.6; }
              .button { display: inline-block; background: #00e676; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
              .footer { border-top: 1px solid #1f1f1f; padding-top: 20px; margin-top: 40px; font-size: 12px; color: #8a8a8a; }
              .code { background: #141414; padding: 20px; border-radius: 8px; border: 1px solid #1f1f1f; margin: 20px 0; word-break: break-all; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">mahtamun<span class="accent">.</span></div>
              </div>
              
              <div class="content">
                <h2>Reset your password</h2>
                <p>Hi there,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                
                <a href="${resetUrl}" class="button">Reset Password</a>
                
                <p>Or copy this link:</p>
                <div class="code">${resetUrl}</div>
                
                <p><strong>This link expires in 24 hours.</strong></p>
                
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                
                <p>Best,<br>Mahtamun</p>
              </div>
              
              <div class="footer">
                <p>© 2026 Mahtamun Hoque Fahim. All rights reserved.</p>
                <p>This is an automated email, please don't reply to it.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      console.error('Failed to send password reset email:', result.error)
      return false
    }

    console.log(`Password reset email sent to ${email}`)
    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return false
  }
}

/**
 * Send email verification email via Resend (optional)
 */
export async function sendVerificationEmail(email: string, verifyUrl: string) {
  try {
    const resend = getResend(); if (!resend) return false; const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@mahtamunhoquefahim.com',
      to: email,
      subject: 'Verify your email',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #f0ede6; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { border-bottom: 1px solid #1f1f1f; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; }
              .logo .accent { color: #00e676; }
              .content { line-height: 1.6; }
              .button { display: inline-block; background: #00e676; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
              .footer { border-top: 1px solid #1f1f1f; padding-top: 20px; margin-top: 40px; font-size: 12px; color: #8a8a8a; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">mahtamun<span class="accent">.</span></div>
              </div>
              
              <div class="content">
                <h2>Verify your email</h2>
                <p>Welcome! Click the button below to verify your email address:</p>
                
                <a href="${verifyUrl}" class="button">Verify Email</a>
                
                <p><strong>This link expires in 24 hours.</strong></p>
              </div>
              
              <div class="footer">
                <p>© 2026 Mahtamun Hoque Fahim. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      console.error('Failed to send verification email:', result.error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}
