# 🚀 GitHub Pages Deployment Guide

## Quick Deploy (3 Steps)

### Step 1: Set Up Supabase Database (Free)
Since GitHub Pages is static hosting only, you need Supabase for the database:

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (takes ~2 minutes)
3. Go to **Project Settings > API** and copy:
   - Project URL
   - Anon/Public Key

### Step 2: Configure Environment Variables

Create `.env.production` file with your Supabase credentials:

```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Deploy to GitHub Pages

Run these commands:

```bash
cd reward-game-dashboard
npm run build
npm run deploy
```

That's it! Your app will be live at: **https://Gbothemy.github.io/ward**

---

## Database Setup (One-Time)

After deploying, set up your database tables in Supabase:

1. Go to Supabase Dashboard > **SQL Editor**
2. Run the SQL from `SUPABASE-ONE-CLICK-SETUP.sql`
3. Click **Run**

This creates all necessary tables for:
- User accounts
- Game progress
- Leaderboards
- Withdrawal requests
- Referrals

---

## Enable GitHub Pages

After first deployment:

1. Go to your GitHub repo: https://github.com/Gbothemy/ward
2. Click **Settings** > **Pages**
3. Under "Source", select branch: **gh-pages**
4. Click **Save**

Your site will be live in 1-2 minutes!

---

## Update Your App

Whenever you make changes:

```bash
npm run deploy
```

This builds and deploys automatically.

---

## Architecture

- **Frontend**: GitHub Pages (free static hosting)
- **Database**: Supabase (free PostgreSQL database)
- **Storage**: Dual system (Supabase + localStorage fallback)

---

## Troubleshooting

### Issue: Blank page after deployment
**Solution**: Check browser console. Usually missing environment variables.

### Issue: Database not working
**Solution**: Verify `.env.production` has correct Supabase credentials.

### Issue: 404 on refresh
**Solution**: Already handled with 404.html redirect.

---

## Admin Access

After deployment, create admin account:

1. Go to **Admin Portal** button on landing page
2. Register with email ending in `@admin.com` OR username starting with `ADMIN-`
3. You'll have full admin access

---

## Your Live URLs

- **Main App**: https://Gbothemy.github.io/ward
- **Admin Portal**: https://Gbothemy.github.io/ward/#/admin-login
- **GitHub Repo**: https://github.com/Gbothemy/ward

---

## Cost

- GitHub Pages: **FREE** (unlimited bandwidth)
- Supabase: **FREE** (500MB database, 50,000 monthly active users)
- Total: **$0/month** 🎉
