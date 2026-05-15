import { betterAuth } from "better-auth"
import { neonAdapter } from "better-auth/adapters/neon"
import { neon } from "@neondatabase/serverless"

// Initialize Neon client
const client = neon(process.env.DATABASE_URL!)

export const auth = betterAuth({
  database: neonAdapter(client),
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignUpOnSignIn: false, // Require explicit signup
  },
  
  // Email verification and password reset
  emailVerification: {
    sendVerificationEmail: async (user, url) => {
      // In production, send real email via Resend/SendGrid
      console.log(`Verify email for ${user.email}: ${url}`)
    },
    autoSignInAfterVerification: true,
  },
  
  password: {
    hash: async (password) => {
      const bcrypt = await import("bcryptjs")
      return bcrypt.hash(password, 10)
    },
    verify: async (data, hash) => {
      const bcrypt = await import("bcryptjs")
      return bcrypt.compare(data, hash)
    },
  },
  
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
})

