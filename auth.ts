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
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURL: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,
      
      // Whitelist only your email
      onBeforeCallback: async (profile) => {
        const allowedEmail = "mahtamunhoquefahim@gmail.com"
        if (profile.email !== allowedEmail) {
          throw new Error(`Only ${allowedEmail} is allowed to sign in with Google`)
        }
        return profile
      },
    },
  },
  
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
})
