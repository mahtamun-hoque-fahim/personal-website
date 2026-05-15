# Migration Guide: Supabase → Neon + Better Auth

This guide walks you through migrating your personal portfolio from Supabase to **Neon PostgreSQL** + **Better Auth** with email/password authentication + forgot password.

---

## Step 1: Install Dependencies

```bash
npm install better-auth @neondatabase/serverless bcryptjs resend
npm install -D @types/better-auth
```

---

## Step 2: Set Up Neon Database

### 2a. Create a Neon account
1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up or login
3. Create a new project
4. Copy your `DATABASE_URL` (connection string)

### 2b. Create tables in Neon
1. Go to Neon SQL Editor
2. Paste and run the schema from `supabase/schema.sql`

### 2c. Migrate data from Supabase (if you have existing data)

```bash
# Use pg_dump + psql
pg_dump "your_supabase_connection_string" | psql "your_neon_connection_string"
```

---

## Step 3: Update Environment Variables

Create `.env.local`:

```env
# Neon Database
DATABASE_URL="postgresql://user:password@host/dbname"

# Better Auth  
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Resend Email Service
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

Generate secret:
```bash
openssl rand -base64 32
```

### Set up Resend (for password reset emails)

1. Go to [resend.com](https://resend.com) and sign up
2. Create API key → copy to `RESEND_API_KEY`
3. Add verified sender domain → use for `RESEND_FROM_EMAIL`
   - For testing: use Resend's test email `onboarding@resend.dev`
   - For production: verify your domain in Resend dashboard

---

## Step 4: Test Locally

```bash
npm run dev
```

1. Go to `http://localhost:3000/admin/login`
2. Sign up with email + password (min 8 chars)
3. Try signing in
4. Test "Forgot password?" link

---

## Step 5: Deploy to Vercel

1. Add env vars to Vercel dashboard
2. Push to GitHub → auto-deploy

---

## Authentication Features

✅ **Sign Up** - Email + Password  
✅ **Sign In** - Email + Password  
✅ **Forgot Password** - Email reset link + password reset page  
✅ **Sessions** - Better Auth managed cookies  

---

## Troubleshooting

**"Database connection failed"** → Check `DATABASE_URL` is correct

**"Better Auth tables not created"** → Better Auth creates them automatically on first run

**"Admin routes redirecting to login"** → Refresh after login, check cookies

**"Password reset not working"** → Check `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in .env.local

---

Happy shipping! 🚀
