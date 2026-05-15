# Migration Guide: Supabase → Neon + Better Auth

This guide walks you through migrating your personal portfolio from Supabase to **Neon PostgreSQL** + **Better Auth**.

---

## Step 1: Install Dependencies

```bash
npm install better-auth @neondatabase/serverless zod
npm install -D @types/better-auth
```

---

## Step 2: Set Up Neon Database

### 2a. Create a Neon account
1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up or login
3. Create a new project
4. Copy your `DATABASE_URL` (connection string)

### 2b. Export data from Supabase
1. In Supabase, go to **SQL Editor**
2. Run this to export your data:

```bash
# Option A: Use Supabase CLI (recommended)
supabase db pull

# Option B: Manual export
# Export blog_posts table, contact_messages, projects
```

### 2c. Create tables in Neon
1. Go to Neon SQL Editor
2. Paste and run the schema from `supabase/schema.sql`

```sql
-- Copy the entire schema.sql and run in Neon
```

### 2d. Migrate data (if you have existing data)

```bash
# Use pg_dump + psql
pg_dump "your_supabase_connection_string" | psql "your_neon_connection_string"
```

---

## Step 3: Set Up Google OAuth

### 3a. Create Google OAuth credentials
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Choose **Web Application**
5. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
6. Copy `Client ID` and `Client Secret`

---

## Step 4: Update Environment Variables

Create `.env.local` in your project root:

```env
# Neon Database
DATABASE_URL="postgresql://user:password@host/dbname"

# Better Auth
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"  # or your production URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

Generate a secret:
```bash
openssl rand -base64 32
```

---

## Step 5: Test Locally

```bash
npm run dev
```

1. Go to `http://localhost:3000/admin/login`
2. Try signing in with:
   - **Google** (will redirect, only your email works)
   - **Email/Password** (sign up first, then sign in)

---

## Step 6: Deploy to Vercel

### 6a. Update Vercel environment variables
1. Go to [vercel.com](https://vercel.com) → Your Project → **Settings** → **Environment Variables**
2. Add all variables from `.env.local`:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (set to your production domain)
   - `NEXT_PUBLIC_APP_URL` (set to your production domain)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### 6b. Update Google OAuth redirect URI
1. Go back to [console.cloud.google.com](https://console.cloud.google.com)
2. Update authorized redirect URIs to include: `https://yourdomain.com/api/auth/callback/google`

### 6c. Deploy
```bash
git push
```

Vercel will auto-deploy with your environment variables.

---

## Step 7: Remove Supabase References

You can now remove old Supabase code:

```bash
# Remove these files if no longer needed
rm lib/supabase.ts  # Now using Neon directly
```

---

## Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is correct
- Verify IP whitelist in Neon console (should be wide open or your server IP)
- Test connection: `psql $DATABASE_URL`

### "Google signin not working"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check authorized redirect URIs match your domain
- Check `BETTER_AUTH_URL` matches your domain

### "Better Auth tables not created"
- Better Auth automatically creates tables on first run
- Check `/api/auth/` works by visiting `http://localhost:3000/api/auth/healthz`

### "Admin routes redirecting to login"
- Better Auth cookie handling takes ~1 second
- Refresh the page after login
- Check browser cookies (should see `better-auth.session_token`)

---

## What's Changed

| Old | New |
|-----|-----|
| Supabase SDK | Neon + direct SQL |
| Cookie auth (password) | Better Auth (OAuth + Email/Password) |
| Supabase RLS | Neon (manual SQL)  |
| Admin login form | Google + Email/Password options |

---

##  Rollback (if needed)

If you need to revert:
1. Your Supabase data is still there (doesn't get deleted)
2. Revert to the previous commit: `git revert HEAD`
3. Redeploy with old env vars

---

## Next Steps

✅ Data is migrated  
✅ Auth is set up  
✅ Admin dashboard works  

Now you can:
- Manage projects via `/admin/projects`
- Add blog posts via `/admin/posts`
- Update projects dynamically (no code changes needed!)

Happy shipping! 🚀
