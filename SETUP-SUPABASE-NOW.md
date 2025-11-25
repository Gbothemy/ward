# 🗄️ Set Up Supabase Database (5 Minutes)

## Why Supabase?
GitHub Pages can't host databases. Supabase provides:
- **FREE PostgreSQL database** (500MB storage)
- **50,000 monthly active users** on free tier
- **Real-time updates**
- **Built-in authentication** (we're using custom auth)

---

## Step-by-Step Setup

### 1. Create Supabase Account (1 min)
1. Go to: https://supabase.com
2. Click **Start your project**
3. Sign up with GitHub (easiest) or email

### 2. Create New Project (2 min)
1. Click **New Project**
2. Fill in:
   - **Name**: crypto-earning (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
3. Click **Create new project**
4. Wait ~2 minutes for setup

### 3. Get Your API Credentials (30 sec)
1. In Supabase Dashboard, go to **Settings** (gear icon)
2. Click **API** in left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 4. Update Your .env.production File (30 sec)
Open `reward-game-dashboard/.env.production` and replace:

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Set Up Database Tables (1 min)
1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open file: `SUPABASE-ONE-CLICK-SETUP.sql`
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

### 6. Verify Tables Created (30 sec)
1. Click **Table Editor** in left sidebar
2. You should see these tables:
   - `users`
   - `game_progress`
   - `withdrawal_requests`
   - `referrals`
   - `leaderboard`

---

## ✅ Done! Now Deploy

Your database is ready. Now deploy your app:

```bash
cd reward-game-dashboard
npm run deploy
```

Or double-click: `deploy.bat`

---

## What Happens Next?

1. **Build**: Webpack creates production bundle
2. **Deploy**: Pushes to `gh-pages` branch
3. **Live**: App goes live at https://Gbothemy.github.io/ward

First deployment takes ~2 minutes to go live.

---

## Enable GitHub Pages (First Time Only)

After first deploy:
1. Go to: https://github.com/Gbothemy/ward/settings/pages
2. Under "Source", select: **gh-pages** branch
3. Click **Save**
4. Wait 1-2 minutes

---

## Test Your Deployment

1. Visit: https://Gbothemy.github.io/ward
2. Click **Get Started**
3. Register a new account
4. Play a game
5. Check if points are saved (refresh page)

If points persist after refresh = Database working! 🎉

---

## Troubleshooting

**"Failed to connect to database"**
- Check `.env.production` has correct values
- Verify Supabase project is active
- Check browser console for errors

**Tables not created**
- Re-run the SQL in Supabase SQL Editor
- Check for error messages in SQL Editor

**App shows blank page**
- Check browser console (F12)
- Usually means environment variables missing
- Rebuild and redeploy

---

## Your Credentials Checklist

- [ ] Supabase account created
- [ ] Project created and active
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] `.env.production` updated
- [ ] SQL tables created
- [ ] Tables verified in Table Editor

---

## Security Note

The **anon key** is safe to commit to GitHub. It's meant to be public and has Row Level Security (RLS) protection. Your database password should NEVER be in the code.

---

## Ready to Deploy?

```bash
npm run deploy
```

Your app will be live at: **https://Gbothemy.github.io/ward** 🚀
