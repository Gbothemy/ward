# 🚀 Creating "Crypto Earning" - New Repository Setup

## Overview
This guide helps you create a clean new repository named "crypto-earning" with updated branding and only essential files.

---

## 📋 Step-by-Step Guide

### **Step 1: Create New GitHub Repository**

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name:** `crypto-earning`
   - **Description:** "Crypto Earning - Play games and earn cryptocurrency rewards"
   - **Visibility:** Public
   - **DO NOT** check any initialization options
3. Click **"Create repository"**
4. **Copy the repository URL** (e.g., `https://github.com/yourusername/crypto-earning.git`)

---

### **Step 2: Create Clean Project Folder**

```bash
# Navigate to parent directory
cd C:\Users\HP\Desktop\iskey

# Create new clean folder
mkdir crypto-earning
cd crypto-earning

# Initialize git
git init
```

---

### **Step 3: Copy Essential Files Only**

Copy these files/folders from `reward-game-dashboard` to `crypto-earning`:

**Essential Folders:**
```
src/
  ├── components/
  ├── games/
  ├── pages/
  ├── utils/
  ├── db/
  ├── App.js
  ├── App.css
  ├── index.js
  └── index.css

public/
  └── index.html
```

**Essential Config Files:**
```
package.json
package-lock.json
.gitignore
.env.example
.env.production
webpack.config.js
.babelrc
```

**Essential Documentation:**
```
README.md
SUPABASE-SETUP-GUIDE.md
ADMIN-GUIDE.md
```

**DO NOT COPY (Unnecessary):**
```
❌ node_modules/
❌ .git/
❌ All the extra .md documentation files
❌ convert-to-nextjs scripts
❌ NEXTJS-MIGRATION.md
❌ Multiple deployment guides
❌ .env.local (create fresh)
```

---

### **Step 4: Update Branding to "Crypto Earning"**

Update these files with new name:

**1. package.json:**
```json
{
  "name": "crypto-earning",
  "version": "1.0.0",
  "description": "Crypto Earning - Play games and earn cryptocurrency rewards",
  ...
}
```

**2. public/index.html:**
```html
<title>Crypto Earning - Play & Earn Crypto</title>
<meta name="description" content="Play games and earn cryptocurrency rewards" />
```

**3. src/pages/LandingPage.js:**
```javascript
<span className="logo-text">Crypto Earning</span>
```

**4. All other references:**
- Search for "Reward Game" and replace with "Crypto Earning"
- Search for "reward-game" and replace with "crypto-earning"

---

### **Step 5: Create New Supabase Project**

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name:** `crypto-earning-db`
   - **Database Password:** (create strong password)
   - **Region:** Choose closest to users
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning
6. **Copy credentials:**
   - Project URL
   - anon public key

---

### **Step 6: Configure Environment Variables**

Create `.env.local`:
```env
REACT_APP_SUPABASE_URL=https://your-new-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-new-anon-key
```

Create `.env.production`:
```env
REACT_APP_SUPABASE_URL=https://your-new-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-new-anon-key
```

---

### **Step 7: Run Database Schema**

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `src/db/SUPABASE-ONE-CLICK-SETUP.sql`
3. Paste and run
4. Verify 6 tables created

---

### **Step 8: Test Locally**

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Test in browser
# http://localhost:3000
```

---

### **Step 9: Push to New Repository**

```bash
# Add remote
git remote add origin https://github.com/yourusername/crypto-earning.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Crypto Earning platform"

# Push
git push -u origin main
```

---

### **Step 10: Deploy to Vercel**

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your new `crypto-earning` repository
4. Configure:
   - **Project Name:** `crypto-earning`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Add **Environment Variables:**
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)
8. Your site will be live at: `https://crypto-earning.vercel.app`

---

## 🎯 Files to Keep (Essential Only)

### **Source Code (src/):**
- ✅ All component files
- ✅ All page files
- ✅ All game files
- ✅ Database files (supabase.js, schema.sql)
- ✅ Utility files

### **Configuration:**
- ✅ package.json
- ✅ webpack.config.js
- ✅ .babelrc
- ✅ .gitignore
- ✅ .env.example
- ✅ .env.production

### **Documentation:**
- ✅ README.md (updated)
- ✅ SUPABASE-SETUP-GUIDE.md
- ✅ ADMIN-GUIDE.md

### **Remove:**
- ❌ All extra documentation files (20+ .md files)
- ❌ Migration scripts
- ❌ Multiple deployment guides
- ❌ Old database files (database.js for Vercel Postgres)
- ❌ Duplicate guides

---

## 📝 Updated README.md

Create a clean README.md:

```markdown
# 🎮 Crypto Earning

Play games and earn cryptocurrency rewards!

## Features

- 🎮 5 Interactive Games
- 💰 Multi-Currency Support (TON, CATI, USDT)
- 🏆 Leaderboards
- 👥 Referral System
- 🛡️ Admin Panel
- 📊 Real-time Analytics

## Tech Stack

- React 18
- Supabase (PostgreSQL)
- Vercel Deployment

## Quick Start

```bash
npm install
npm start
```

## Environment Variables

```env
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment

Deploy to Vercel with one click!

## License

MIT
```

---

## ✅ Checklist

- [ ] Create new GitHub repository `crypto-earning`
- [ ] Create clean project folder
- [ ] Copy only essential files
- [ ] Update all branding to "Crypto Earning"
- [ ] Create new Supabase project
- [ ] Configure environment variables
- [ ] Run database schema
- [ ] Test locally
- [ ] Push to new repository
- [ ] Deploy to Vercel
- [ ] Verify everything works

---

## 🎉 Result

You'll have:
- ✅ Clean new repository
- ✅ Updated branding ("Crypto Earning")
- ✅ Only essential files
- ✅ New Supabase database
- ✅ Deployed to Vercel
- ✅ Production-ready

---

**Time Required:** 30-45 minutes  
**Difficulty:** Intermediate  
**Status:** Ready to Execute
