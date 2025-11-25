# 🚀 Supabase Database Setup Guide

## Why Supabase?

- ✅ **Completely Free** - 500MB database, unlimited API requests
- ✅ **Easy Setup** - 5 minutes to get started
- ✅ **Real-time** - Live data synchronization
- ✅ **PostgreSQL** - Powerful relational database
- ✅ **No Credit Card** - Free tier doesn't require payment info
- ✅ **Auto-scaling** - Handles traffic automatically

---

## 📋 Step-by-Step Setup

### **Step 1: Create Supabase Account** (2 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or Email
4. Verify your email

### **Step 2: Create New Project** (3 minutes)

1. Click "New Project"
2. Fill in details:
   - **Name:** `reward-game-db`
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free (default)
3. Click "Create new project"
4. Wait 2-3 minutes for database to be provisioned

### **Step 3: Get API Credentials** (1 minute)

1. Go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### **Step 4: Create .env.local File** (1 minute)

In your project root (`reward-game-dashboard/`), create `.env.local`:

```env
REACT_APP_SUPABASE_URL="https://your-project-id.supabase.co"
REACT_APP_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Replace with your actual values from Step 3.

### **Step 5: Run Database Schema** (2 minutes)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste this SQL:

```sql
-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  avatar VARCHAR(10),
  is_admin BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  vip_level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  max_exp INTEGER DEFAULT 1000,
  gift_points INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  day_streak INTEGER DEFAULT 0,
  last_claim TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Balances table
CREATE TABLE balances (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  ton DECIMAL(18, 8) DEFAULT 0,
  cati DECIMAL(18, 8) DEFAULT 0,
  usdt DECIMAL(18, 8) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Withdrawal requests table
CREATE TABLE withdrawal_requests (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  username VARCHAR(100),
  currency VARCHAR(10),
  amount DECIMAL(18, 8),
  wallet_address TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT NOW(),
  processed_date TIMESTAMP,
  processed_by VARCHAR(100),
  rejection_reason TEXT
);

-- Game plays table
CREATE TABLE game_plays (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  game_type VARCHAR(50),
  play_date DATE DEFAULT CURRENT_DATE,
  plays_count INTEGER DEFAULT 1,
  UNIQUE(user_id, game_type, play_date)
);

-- Achievements table
CREATE TABLE achievements (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  achievement_id VARCHAR(50),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Referrals table
CREATE TABLE referrals (
  id BIGSERIAL PRIMARY KEY,
  referrer_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  referred_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  referral_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- Create indexes
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_points ON users(points DESC);
CREATE INDEX idx_balances_user_id ON balances(user_id);
CREATE INDEX idx_withdrawals_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawal_requests(status);
CREATE INDEX idx_game_plays_user_date ON game_plays(user_id, play_date);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, you can restrict later)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on balances" ON balances FOR ALL USING (true);
CREATE POLICY "Allow all operations on withdrawal_requests" ON withdrawal_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations on game_plays" ON game_plays FOR ALL USING (true);
CREATE POLICY "Allow all operations on achievements" ON achievements FOR ALL USING (true);
CREATE POLICY "Allow all operations on referrals" ON referrals FOR ALL USING (true);
```

4. Click "Run" (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### **Step 6: Verify Tables Created** (1 minute)

1. Go to **Table Editor** in Supabase Dashboard
2. You should see all 6 tables:
   - users
   - balances
   - withdrawal_requests
   - game_plays
   - achievements
   - referrals

---

## 🧪 Test the Connection

### **Option 1: Test in Browser Console**

1. Start your app: `npm start`
2. Open browser console (F12)
3. Run:
```javascript
import { db } from './src/db/supabase';
const user = await db.createUser({
  user_id: 'TEST-001',
  username: 'TestUser',
  email: 'test@example.com',
  avatar: '👤',
  is_admin: false
});
console.log('User created:', user);
```

### **Option 2: Check Supabase Dashboard**

1. Go to **Table Editor** → **users**
2. You should see test users appear as you use the app

---

## 🎯 What's Different Now?

### **Before (localStorage):**
```javascript
// Data stored in browser only
localStorage.setItem('user', JSON.stringify(userData));
```

### **After (Supabase):**
```javascript
// Data stored in cloud database
await db.createUser(userData);
```

### **Benefits:**
- ✅ Data persists across devices
- ✅ Real-time synchronization
- ✅ Centralized admin access
- ✅ Backup and recovery
- ✅ Scalable for production

---

## 🔒 Security Notes

### **Current Setup:**
- ✅ Row Level Security (RLS) enabled
- ✅ Policies allow all operations (for development)
- ✅ API keys are public (anon key is safe to expose)

### **For Production:**
Consider:
- [ ] Restrict RLS policies to user-specific data
- [ ] Add authentication (Supabase Auth)
- [ ] Enable email verification
- [ ] Add rate limiting
- [ ] Monitor API usage

---

## 📊 Monitoring

### **Check Database Usage:**
1. Go to Supabase Dashboard
2. Click **Database** → **Usage**
3. Monitor:
   - Storage used
   - API requests
   - Active connections

### **View Logs:**
1. Go to **Logs** in sidebar
2. See all database queries
3. Debug errors

---

## 🐛 Troubleshooting

### **Error: "Invalid API key"**
**Solution:** Check your `.env.local` file has correct `REACT_APP_SUPABASE_ANON_KEY`

### **Error: "relation does not exist"**
**Solution:** Run the SQL schema again in SQL Editor

### **Error: "Failed to fetch"**
**Solution:** 
1. Check internet connection
2. Verify Supabase project is active
3. Check browser console for CORS errors

### **Data not showing up**
**Solution:**
1. Check Table Editor in Supabase Dashboard
2. Verify tables have data
3. Check browser console for errors

---

## 🚀 Deploy to Production

### **Step 1: Add Environment Variables to Vercel**

1. Go to Vercel Dashboard → Your Project → Settings
2. Click **Environment Variables**
3. Add:
   - `REACT_APP_SUPABASE_URL` = your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your anon key
4. Click "Save"

### **Step 2: Redeploy**

```bash
git push origin main
```

Vercel will automatically redeploy with new environment variables.

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **JavaScript Client:** https://supabase.com/docs/reference/javascript
- **SQL Reference:** https://supabase.com/docs/guides/database
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

## ✅ Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied API credentials
- [ ] Created `.env.local` file
- [ ] Ran database schema SQL
- [ ] Verified tables created
- [ ] Tested connection
- [ ] App working with database
- [ ] Added env vars to Vercel
- [ ] Deployed to production

---

**Status:** ✅ Ready to Use  
**Time Required:** 10 minutes  
**Difficulty:** Easy  
**Cost:** Free Forever  
**Last Updated:** December 2024
