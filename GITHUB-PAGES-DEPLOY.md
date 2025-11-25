# 🚀 Deploy to GitHub Pages with Supabase Database

## Quick Setup (5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `crypto-earning`
3. Make it **Public** (required for free GitHub Pages)
4. Click "Create repository"

### Step 2: Setup Supabase Database (FREE)

1. Go to https://supabase.com
2. Click "Start your project" (sign in with GitHub)
3. Click "New Project"
   - Name: `crypto-earning`
   - Database Password: (create a strong password)
   - Region: Choose closest to you
   - Click "Create new project" (wait 2 minutes)

4. **Run Database Setup:**
   - In Supabase dashboard, click "SQL Editor" (left sidebar)
   - Click "New Query"
   - Copy ALL content from `SUPABASE-ONE-CLICK-SETUP.sql`
   - Paste and click "Run"
   - You should see "Success. No rows returned"

5. **Get API Keys:**
   - Click "Project Settings" (gear icon, bottom left)
   - Click "API" tab
   - Copy these two values:
     - `Project URL` (looks like: https://xxxxx.supabase.co)
     - `anon public` key (long string under "Project API keys")

### Step 3: Configure Environment Variables

Create a file `.env.production` in the project root:

```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual Supabase values from Step 2.

### Step 4: Update package.json

Edit `package.json` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/crypto-earning",
```

### Step 5: Deploy to GitHub

Run these commands in your terminal:

```bash
cd reward-game-dashboard

# Install gh-pages package
npm install

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Crypto Earning Dashboard"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/crypto-earning.git

# Push to GitHub
git branch -M main
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

### Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" (left sidebar)
4. Under "Source", select branch: `gh-pages`
5. Click "Save"

**Your site will be live at:** `https://YOUR_GITHUB_USERNAME.github.io/crypto-earning`

(Wait 2-3 minutes for first deployment)

---

## 🔄 Update Your Site

Whenever you make changes:

```bash
npm run deploy
```

This builds and deploys automatically!

---

## 🎮 Admin Access

**Admin Login:** `https://YOUR_GITHUB_USERNAME.github.io/crypto-earning/admin-login`

Default admin credentials:
- Email: `admin@cryptoearn.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change admin password immediately after first login!

---

## 🗄️ Database Features

Your Supabase database includes:
- ✅ User accounts and authentication
- ✅ Points and earnings tracking
- ✅ Withdrawal requests management
- ✅ Leaderboards
- ✅ Referral system
- ✅ Admin panel
- ✅ Real-time sync across devices

**Database Dashboard:** https://supabase.com/dashboard/project/YOUR_PROJECT/editor

---

## 🆓 Free Tier Limits

**GitHub Pages:**
- 1 GB storage
- 100 GB bandwidth/month
- Perfect for this app!

**Supabase Free Tier:**
- 500 MB database
- 50,000 monthly active users
- 2 GB bandwidth
- More than enough to start!

---

## 🐛 Troubleshooting

**Site shows 404:**
- Wait 2-3 minutes after first deploy
- Check GitHub Pages settings (Step 6)
- Verify branch is set to `gh-pages`

**Database not working:**
- Check `.env.production` has correct Supabase URL and key
- Verify SQL script ran successfully in Supabase
- Check browser console for errors

**Build fails:**
- Run `npm install` first
- Check Node.js version (need 16+)
- Delete `node_modules` and `package-lock.json`, then `npm install` again

---

## 📱 Share Your Site

Once deployed, share this link:
`https://YOUR_GITHUB_USERNAME.github.io/crypto-earning`

Users can:
- ✅ Sign up and play games
- ✅ Earn points and crypto
- ✅ Refer friends
- ✅ Request withdrawals
- ✅ Compete on leaderboards

---

## 🔐 Security Notes

1. **Never commit `.env.production` to GitHub** (it's in .gitignore)
2. **Change admin password** after first login
3. **Supabase keys are safe** - the anon key is meant to be public
4. **Enable Row Level Security** in Supabase for production

---

## 🎉 You're Live!

Your crypto earning game is now live on the internet with a real database!

Need help? Check the other guide files or open an issue on GitHub.
