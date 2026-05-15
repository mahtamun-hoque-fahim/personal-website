# 🚀 ENV VARS TO-DO LIST

Your project is ready to deploy! Here's exactly what env vars you need to configure, where, and how.

---

## ✅ Current Stack (Stable & Production-Ready)

- **Next.js:** 14.2.29 ✓
- **React:** 18.3.1 ✓  
- **TypeScript:** 5.x ✓
- **Tailwind CSS:** 3.4.1 ✓
- **Database:** Neon PostgreSQL ✓
- **Auth:** Better Auth (email/password + forgot password) ✓
- **Email:** Resend (transactional emails) ✓

---

## 📋 REQUIRED ENV VARS (6 Total)

### 1. `DATABASE_URL` ⭐ CRITICAL
- **What it is:** PostgreSQL connection string to Neon
- **Format:** `postgresql://user:password@host/database`
- **Where to get:**
  - Go to [console.neon.tech](https://console.neon.tech)
  - Create/select a project
  - Copy connection string from "Connection" section
- **Where to add:**
  - Local: `.env.local`
  - Vercel: Settings → Environment Variables
  - Cloudflare: Workers → Variables → Secrets
- **Status:** 🔴 MUST HAVE - Without this, database won't work

### 2. `BETTER_AUTH_SECRET` ⭐ CRITICAL
- **What it is:** Session encryption secret (cryptographic key)
- **How to generate:**
  ```bash
  openssl rand -base64 32
  ```
- **Length:** Should be at least 32 characters
- **Where to add:**
  - Local: `.env.local`
  - Vercel: Settings → Environment Variables
  - Cloudflare: Workers → Variables → Secrets
- **Status:** 🔴 MUST HAVE - Without this, sessions won't work

### 3. `BETTER_AUTH_URL` ⭐ CRITICAL
- **What it is:** Your app's full URL (used for auth callbacks)
- **Local development:** `http://localhost:3000`
- **Production (Vercel):** `https://mahtamunhoquefahim.vercel.app`
- **Production (Custom):** `https://yourdomain.com`
- **Where to add:**
  - Local: `.env.local`
  - Vercel: Settings → Environment Variables
- **Status:** 🔴 MUST HAVE - Wrong URL breaks password reset links

### 4. `NEXT_PUBLIC_APP_URL` ⭐ CRITICAL
- **What it is:** Public app URL (visible to client)
- **Same as:** `BETTER_AUTH_URL`
- **Local development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com`
- **Why "NEXT_PUBLIC":** Makes it available in browser (passwords are hashed server-side, so safe)
- **Where to add:**
  - Local: `.env.local`
  - Vercel: Settings → Environment Variables
- **Status:** 🔴 MUST HAVE

### 5. `RESEND_API_KEY` ⭐ CRITICAL (for password reset emails)
- **What it is:** API key from Resend email service
- **Format:** `re_xxxxxxxxxxxxx` (starts with `re_`)
- **Where to get:**
  - Go to [resend.com](https://resend.com)
  - Sign up (free tier available)
  - Go to "API Keys" section
  - Create new key
  - Copy the key
- **Where to add:**
  - Local: `.env.local`
  - Vercel: Settings → Environment Variables
- **Status:** 🟡 IMPORTANT - Without this, password reset emails won't send

### 6. `RESEND_FROM_EMAIL` ⭐ IMPORTANT
- **What it is:** Email address that password reset emails come from
- **Local testing:** Use `onboarding@resend.dev` (Resend's test email, no setup needed)
- **Production:** Must be a verified domain with Resend
  - Example: `noreply@yourdomain.com`
  - How to verify: In Resend dashboard → Domains → Add Domain
- **Where to add:**
  - Local: `.env.local`
  - Vercel: Settings → Environment Variables
- **Status:** 🟡 IMPORTANT - Forgotpassword emails won't work without it

---

## 📝 Setting Up `.env.local` Locally

Create `.env.local` in your project root with all 6 vars:

```env
# Database
DATABASE_URL=postgresql://your_user:your_password@your_host/your_db

# Better Auth
BETTER_AUTH_SECRET=your_generated_secret_here_min_32_chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend Email
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Then test locally:
```bash
npm run dev
# Go to http://localhost:3000/admin/login
# Sign up, try forgot password flow
```

---

## 🚀 Deploying to Vercel

### Pre-Deployment Checklist

- [ ] You have Neon account with database created
- [ ] You have Resend account with API key
- [ ] You generated `BETTER_AUTH_SECRET` with `openssl rand -base64 32`
- [ ] You have your production domain (or will use vercel.app domain)
- [ ] Tested locally with `.env.local`

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Click "Add New" → "Project"
   - Import your GitHub repo
   - Click "Import"

3. **Add Environment Variables**
   - In Vercel, go to Project → Settings → Environment Variables
   - Add all 6 vars from list above
   - Use production URLs for `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`
   - Click "Save"

4. **Deploy**
   - Vercel auto-deploys, or click "Redeploy" button
   - Wait for build to complete (watch the logs)

5. **Update Resend**
   - If using custom domain, verify it in Resend
   - Update `RESEND_FROM_EMAIL` to your domain

6. **Update Google OAuth** (if you enable it later)
   - Go to Google Cloud Console
   - Add production URL to authorized redirect URIs

---

## 🌍 Deploying to Cloudflare Pages

### Steps

1. **Same GitHub push as above**

2. **Go to [dash.cloudflare.com](https://dash.cloudflare.com)**
   - Pages → Create application → Connect to Git → Select repo
   - Build settings:
     - Framework: Next.js
     - Build command: `npx @cloudflare/next-on-pages`
     - Build output: `.vercel/output/static`
   - Click "Save and Deploy"

3. **Add Secrets**
   - Go to Settings → Integrations → Environment Variables
   - Add env vars (especially BETTER_AUTH_SECRET and DATABASE_URL as "Secrets")
   - Mark `NEXT_PUBLIC_APP_URL` as non-secret since it's public
   - Click "Save"

4. **Add RESEND vars**
   - Add `RESEND_API_KEY` (as Secret)
   - Add `RESEND_FROM_EMAIL` (as non-Secret)

5. **Redeploy**
   - Pages → Select your project → Deployments → Retry latest

---

## ✨ Testing After Deployment

After deploying, test these flows:

1. **Sign Up**
   - Go to `/admin/login` on your live domain
   - Click "Sign up"
   - Enter email + password
   - Should redirect to `/admin` dashboard

2. **Sign In**
   - Go to `/admin/login`
   - Sign in with same email/password
   - Should see dashboard

3. **Forgot Password** (tests Resend integration)
   - Go to `/admin/login`
   - Click "Forgot password?"
   - Enter your email
   - Check email for reset link (might be spam folder)
   - Click link → reset password page
   - Enter new password
   - Should redirect to login
   - Sign in with new password

4. **Admin Features**
   - Go to `/admin/projects`
   - Toggle featured status on projects
   - Reorder projects
   - Changes should be saved immediately

---

## 🔒 Security Notes

- ✅ `BETTER_AUTH_SECRET` must be truly random (use openssl)
- ✅ Never commit `.env.local` to GitHub (already in `.gitignore`)
- ✅ All sensitive keys go in Vercel/Cloudflare "Secrets" not "Variables"
- ✅ `NEXT_PUBLIC_*` vars are visible to browser (that's intentional, safe for URLs)
- ✅ Passwords are hashed with bcryptjs before storage (never stored plaintext)
- ✅ Sessions use HTTP-only cookies (can't be stolen by XSS)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Database connection failed" | Check `DATABASE_URL` is correct, IP whitelist is open |
| "Can't sign up" | Check `DATABASE_URL` and `BETTER_AUTH_SECRET` are set |
| "Password reset email not sent" | Check `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set |
| "Forgot password link doesn't work" | Check `BETTER_AUTH_URL` matches your domain exactly |
| "Admin routes redirect to login" | Sign in again (refresh page) - session takes ~1 sec to establish |
| "500 error on `/admin`" | Check all 6 env vars are set - one is probably missing |

---

## 📚 Quick Reference

```bash
# Generate a new secret (paste output into BETTER_AUTH_SECRET)
openssl rand -base64 32

# Test database connection locally
npx sqlc vet --database-url "$DATABASE_URL"

# View what's set locally
cat .env.local

# Run dev server (uses .env.local)
npm run dev

# Build for production
npm run build

# Check for missing env vars
grep -r "process.env\." --include="*.ts" --include="*.tsx" app lib
```

---

**Status:** 🟢 Ready to deploy! Follow this guide step-by-step and you'll be live within 30 minutes.

Any env var questions? Check the "Troubleshooting" section above or re-read the var's explanation.

