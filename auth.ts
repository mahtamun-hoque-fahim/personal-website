import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/drizzle/db"
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email"

export const auth = betterAuth({
  database: drizzleAdapter(db),
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
      // Send verification email via Resend (optional)
      await sendVerificationEmail(user.email, url)
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
  
  // Password reset email
  forgetPassword: {
    sendResetEmail: async (user, url) => {
      // Send password reset email via Resend
      await sendPasswordResetEmail(user.email, url)
    },
  },
  
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
})

