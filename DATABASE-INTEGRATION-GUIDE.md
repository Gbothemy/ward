# 🗄️ Database Integration Guide

## Overview
This guide shows how to migrate from localStorage to a real database using free options like **Vercel Postgres**, **Supabase**, or **MongoDB Atlas**.

---

## 🎯 Why Use a Database?

### **Current Limitations (localStorage)**
- ❌ Data only stored on user's browser
- ❌ No cross-device synchronization
- ❌ Limited to ~5-10MB storage
- ❌ Data lost if browser cache cleared
- ❌ No real-time sync between users
- ❌ Admin can't see all users' data centrally

### **Benefits of Database**
- ✅ Centralized data storage
- ✅ Cross-device synchronization
- ✅ Unlimited storage capacity
- ✅ Real-time updates
- ✅ Data persistence and backup
- ✅ Admin can manage all users
- ✅ Analytics and reporting
- ✅ Scalable for production

---

## 🚀 Recommended Free Database Options

### **1. Vercel Postgres (Recommended)**
- **Free Tier**: 256MB storage, 60 hours compute/month
- **Best For**: Apps deployed on Vercel
- **Setup Time**: 5 minutes
- **Pros**: Seamless Vercel integration, serverless
- **Cons**: Limited free tier

### **2. Supabase**
- **Free Tier**: 500MB database, 50MB file storage
- **Best For**: Full-featured backend
- **Setup Time**: 10 minutes
- **Pros**: PostgreSQL, real-time, auth, storage
- **Cons**: Requires more setup

### **3. MongoDB Atlas**
- **Free Tier**: 512MB storage
- **Best For**: NoSQL/document-based data
- **Setup Time**: 10 minutes
- **Pros**: Flexible schema, easy to use
- **Cons**: Different query language

### **4. PlanetScale**
- **Free Tier**: 5GB storage, 1 billion row reads/month
- **Best For**: MySQL-based apps
- **Setup Time**: 10 minutes
- **Pros**: Generous free tier, branching
- **Cons**: MySQL syntax

---

## 📋 Option 1: Vercel Postgres Integration

### **Step 1: Create Vercel Postgres Database**

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Navigate to Storage**
   - Click on your project
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"

3. **Create Database**
   - Name: `reward-game-db`
   - Region: Choose closest to users
   - Click "Create"

4. **Get Connection String**
   - Copy the connection string
   - It looks like: `postgres://user:pass@host:5432/dbname`

### **Step 2: Install Dependencies**

```bash
cd reward-game-dashboard
npm install @vercel/postgres
npm install dotenv
```

### **Step 3: Create Environment Variables**

Create `.env.local` file:
```env
POSTGRES_URL="postgres://user:pass@host:5432/dbname"
POSTGRES_PRISMA_URL="postgres://user:pass@host:5432/dbname?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://user:pass@host:5432/dbname"
POSTGRES_USER="user"
POSTGRES_HOST="host"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="dbname"
```

### **Step 4: Create Database Schema**

Create `src/db/schema.sql`:
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  avatar VARCHAR(10),
  is_admin BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  vip_level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  max_exp INTEGER DEFAULT 1000,
  completed_tasks INTEGER DEFAULT 0,
  day_streak INTEGER DEFAULT 0,
  last_claim TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Balances table
CREATE TABLE balances (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
  ton DECIMAL(18, 8) DEFAULT 0,
  cati DECIMAL(18, 8) DEFAULT 0,
  usdt DECIMAL(18, 8) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Withdrawal requests table
CREATE TABLE withdrawal_requests (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
  username VARCHAR(100),
  currency VARCHAR(10),
  amount DECIMAL(18, 8),
  wallet_address TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_date TIMESTAMP,
  processed_by VARCHAR(100),
  rejection_reason TEXT
);

-- Game plays table (for daily limits)
CREATE TABLE game_plays (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
  game_type VARCHAR(50),
  play_date DATE DEFAULT CURRENT_DATE,
  plays_count INTEGER DEFAULT 1,
  UNIQUE(user_id, game_type, play_date)
);

-- Achievements table
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
  achievement_id VARCHAR(50),
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Referrals table
CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  referrer_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
  referred_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
  referral_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(referred_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_balances_user_id ON balances(user_id);
CREATE INDEX idx_withdrawals_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawal_requests(status);
CREATE INDEX idx_game_plays_user_date ON game_plays(user_id, play_date);
```

### **Step 5: Create Database Helper**

Create `src/db/database.js`:
```javascript
import { sql } from '@vercel/postgres';

export const db = {
  // User operations
  async createUser(userData) {
    const { user_id, username, email, avatar, is_admin } = userData;
    const result = await sql`
      INSERT INTO users (user_id, username, email, avatar, is_admin)
      VALUES (${user_id}, ${username}, ${email}, ${avatar}, ${is_admin})
      RETURNING *
    `;
    
    // Create initial balance
    await sql`
      INSERT INTO balances (user_id, ton, cati, usdt)
      VALUES (${user_id}, 0, 0, 0)
    `;
    
    return result.rows[0];
  },

  async getUser(user_id) {
    const result = await sql`
      SELECT u.*, b.ton, b.cati, b.usdt
      FROM users u
      LEFT JOIN balances b ON u.user_id = b.user_id
      WHERE u.user_id = ${user_id}
    `;
    return result.rows[0];
  },

  async updateUser(user_id, updates) {
    const { points, vip_level, exp, completed_tasks, day_streak } = updates;
    const result = await sql`
      UPDATE users
      SET points = ${points},
          vip_level = ${vip_level},
          exp = ${exp},
          completed_tasks = ${completed_tasks},
          day_streak = ${day_streak},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user_id}
      RETURNING *
    `;
    return result.rows[0];
  },

  async getAllUsers() {
    const result = await sql`
      SELECT u.*, b.ton, b.cati, b.usdt
      FROM users u
      LEFT JOIN balances b ON u.user_id = b.user_id
      ORDER BY u.points DESC
    `;
    return result.rows;
  },

  // Balance operations
  async updateBalance(user_id, currency, amount) {
    const result = await sql`
      UPDATE balances
      SET ${sql(currency)} = ${amount},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user_id}
      RETURNING *
    `;
    return result.rows[0];
  },

  async addPoints(user_id, points) {
    const result = await sql`
      UPDATE users
      SET points = points + ${points},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user_id}
      RETURNING *
    `;
    return result.rows[0];
  },

  // Withdrawal operations
  async createWithdrawalRequest(requestData) {
    const { id, user_id, username, currency, amount, wallet_address } = requestData;
    const result = await sql`
      INSERT INTO withdrawal_requests 
      (id, user_id, username, currency, amount, wallet_address, status)
      VALUES (${id}, ${user_id}, ${username}, ${currency}, ${amount}, ${wallet_address}, 'pending')
      RETURNING *
    `;
    return result.rows[0];
  },

  async getWithdrawalRequests(status = null) {
    if (status) {
      const result = await sql`
        SELECT * FROM withdrawal_requests
        WHERE status = ${status}
        ORDER BY request_date DESC
      `;
      return result.rows;
    } else {
      const result = await sql`
        SELECT * FROM withdrawal_requests
        ORDER BY request_date DESC
      `;
      return result.rows;
    }
  },

  async updateWithdrawalStatus(id, status, processed_by) {
    const result = await sql`
      UPDATE withdrawal_requests
      SET status = ${status},
          processed_date = CURRENT_TIMESTAMP,
          processed_by = ${processed_by}
      WHERE id = ${id}
      RETURNING *
    `;
    return result.rows[0];
  },

  // Game plays operations
  async recordGamePlay(user_id, game_type) {
    const result = await sql`
      INSERT INTO game_plays (user_id, game_type, play_date, plays_count)
      VALUES (${user_id}, ${game_type}, CURRENT_DATE, 1)
      ON CONFLICT (user_id, game_type, play_date)
      DO UPDATE SET plays_count = game_plays.plays_count + 1
      RETURNING *
    `;
    return result.rows[0];
  },

  async getGamePlays(user_id, game_type, date) {
    const result = await sql`
      SELECT * FROM game_plays
      WHERE user_id = ${user_id}
        AND game_type = ${game_type}
        AND play_date = ${date}
    `;
    return result.rows[0];
  },

  // Leaderboard operations
  async getLeaderboard(type = 'points', limit = 10) {
    if (type === 'points') {
      const result = await sql`
        SELECT user_id, username, avatar, points, vip_level
        FROM users
        WHERE is_admin = FALSE
        ORDER BY points DESC
        LIMIT ${limit}
      `;
      return result.rows;
    } else if (type === 'earnings') {
      const result = await sql`
        SELECT u.user_id, u.username, u.avatar, b.ton
        FROM users u
        LEFT JOIN balances b ON u.user_id = b.user_id
        WHERE u.is_admin = FALSE
        ORDER BY b.ton DESC
        LIMIT ${limit}
      `;
      return result.rows;
    } else if (type === 'streak') {
      const result = await sql`
        SELECT user_id, username, avatar, day_streak, points
        FROM users
        WHERE is_admin = FALSE
        ORDER BY day_streak DESC
        LIMIT ${limit}
      `;
      return result.rows;
    }
  }
};
```

### **Step 6: Create API Routes**

Since this is a React app, you'll need to add API routes. The easiest way is to convert to Next.js or add a simple Express backend.

**Option A: Add Express Backend**

Create `server/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
const { db } = require('../src/db/database');

const app = express();
app.use(cors());
app.use(express.json());

// User routes
app.post('/api/users', async (req, res) => {
  try {
    const user = await db.createUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await db.getUser(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  try {
    const user = await db.updateUser(req.params.userId, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Withdrawal routes
app.post('/api/withdrawals', async (req, res) => {
  try {
    const request = await db.createWithdrawalRequest(req.body);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/withdrawals', async (req, res) => {
  try {
    const requests = await db.getWithdrawalRequests(req.query.status);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard routes
app.get('/api/leaderboard/:type', async (req, res) => {
  try {
    const leaderboard = await db.getLeaderboard(req.params.type);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Option B: Convert to Next.js (Recommended)**

See `NEXTJS-MIGRATION.md` for full migration guide.

---

## 📋 Option 2: Supabase Integration

### **Step 1: Create Supabase Project**

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in details:
   - Name: `reward-game-db`
   - Database Password: (save this!)
   - Region: Choose closest
4. Wait for project to be created

### **Step 2: Create Tables**

1. Go to SQL Editor in Supabase dashboard
2. Run the same SQL schema from Step 4 above
3. Enable Row Level Security (RLS) for security

### **Step 3: Install Supabase Client**

```bash
npm install @supabase/supabase-js
```

### **Step 4: Create Supabase Client**

Create `src/db/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const db = {
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    if (error) throw error;
    
    // Create initial balance
    await supabase
      .from('balances')
      .insert([{ user_id: userData.user_id, ton: 0, cati: 0, usdt: 0 }]);
    
    return data[0];
  },

  async getUser(user_id) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        balances (ton, cati, usdt)
      `)
      .eq('user_id', user_id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(user_id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', user_id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        balances (ton, cati, usdt)
      `)
      .order('points', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateBalance(user_id, currency, amount) {
    const { data, error} = await supabase
      .from('balances')
      .update({ [currency]: amount })
      .eq('user_id', user_id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async createWithdrawalRequest(requestData) {
    const { data, error } = await supabase
      .from('withdrawal_requests')
      .insert([requestData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async getWithdrawalRequests(status = null) {
    let query = supabase
      .from('withdrawal_requests')
      .select('*')
      .order('request_date', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getLeaderboard(type = 'points', limit = 10) {
    if (type === 'points') {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, username, avatar, points, vip_level')
        .eq('is_admin', false)
        .order('points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
    // Similar for other types...
  }
};
```

### **Step 5: Update Environment Variables**

Add to `.env.local`:
```env
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📋 Option 3: MongoDB Atlas Integration

### **Step 1: Create MongoDB Atlas Cluster**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (M0 Free tier)
4. Create database user
5. Whitelist IP (0.0.0.0/0 for development)
6. Get connection string

### **Step 2: Install MongoDB Driver**

```bash
npm install mongodb
```

### **Step 3: Create MongoDB Client**

Create `src/db/mongodb.js`:
```javascript
import { MongoClient } from 'mongodb';

const uri = process.env.REACT_APP_MONGODB_URI;
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (db) return db;
  
  await client.connect();
  db = client.db('reward-game');
  return db;
}

export const mongodb = {
  async createUser(userData) {
    const db = await connectDB();
    const result = await db.collection('users').insertOne({
      ...userData,
      balance: { ton: 0, cati: 0, usdt: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  },

  async getUser(user_id) {
    const db = await connectDB();
    return await db.collection('users').findOne({ user_id });
  },

  async updateUser(user_id, updates) {
    const db = await connectDB();
    return await db.collection('users').findOneAndUpdate(
      { user_id },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
  },

  async getAllUsers() {
    const db = await connectDB();
    return await db.collection('users')
      .find({ is_admin: { $ne: true } })
      .sort({ points: -1 })
      .toArray();
  },

  async createWithdrawalRequest(requestData) {
    const db = await connectDB();
    return await db.collection('withdrawals').insertOne({
      ...requestData,
      createdAt: new Date()
    });
  },

  async getWithdrawalRequests(status = null) {
    const db = await connectDB();
    const query = status ? { status } : {};
    return await db.collection('withdrawals')
      .find(query)
      .sort({ request_date: -1 })
      .toArray();
  }
};
```

---

## 🔄 Migration Strategy

### **Phase 1: Dual Storage (Recommended)**

Keep localStorage AND database running simultaneously:

```javascript
// Example: Update user points
async function updatePoints(userId, points) {
  // Update localStorage (existing)
  const user = JSON.parse(localStorage.getItem(`rewardGameUser_${userId}`));
  user.points = points;
  localStorage.setItem(`rewardGameUser_${userId}`, JSON.stringify(user));
  
  // Also update database (new)
  try {
    await db.updateUser(userId, { points });
  } catch (error) {
    console.error('Database update failed:', error);
    // localStorage still works as fallback
  }
}
```

### **Phase 2: Database Primary**

Once stable, make database primary:

```javascript
async function updatePoints(userId, points) {
  try {
    // Update database first
    await db.updateUser(userId, { points });
    
    // Update localStorage as cache
    const user = JSON.parse(localStorage.getItem(`rewardGameUser_${userId}`));
    user.points = points;
    localStorage.setItem(`rewardGameUser_${userId}`, JSON.stringify(user));
  } catch (error) {
    console.error('Update failed:', error);
  }
}
```

### **Phase 3: Database Only**

Remove localStorage dependency completely.

---

## 🎯 Implementation Checklist

### **Setup**
- [ ] Choose database provider
- [ ] Create database account
- [ ] Create database/project
- [ ] Run schema SQL
- [ ] Get connection credentials
- [ ] Add environment variables

### **Code Changes**
- [ ] Install database client library
- [ ] Create database helper file
- [ ] Create API routes (if needed)
- [ ] Update user registration
- [ ] Update user login
- [ ] Update game plays
- [ ] Update withdrawals
- [ ] Update leaderboard
- [ ] Update admin panel

### **Testing**
- [ ] Test user registration
- [ ] Test user login
- [ ] Test game plays
- [ ] Test point updates
- [ ] Test withdrawals
- [ ] Test leaderboard
- [ ] Test admin functions
- [ ] Test error handling

### **Deployment**
- [ ] Add environment variables to Vercel
- [ ] Deploy to production
- [ ] Test production database
- [ ] Monitor for errors
- [ ] Backup database

---

## 🔒 Security Best Practices

### **1. Environment Variables**
- Never commit `.env` files
- Use different credentials for dev/prod
- Rotate credentials regularly

### **2. SQL Injection Prevention**
- Always use parameterized queries
- Never concatenate user input into SQL
- Use ORM/query builder when possible

### **3. Authentication**
- Implement proper JWT authentication
- Validate all API requests
- Use HTTPS only

### **4. Rate Limiting**
- Limit API requests per user
- Prevent abuse and spam
- Use services like Upstash Rate Limit

### **5. Data Validation**
- Validate all inputs server-side
- Sanitize user data
- Use TypeScript for type safety

---

## 📊 Performance Optimization

### **1. Indexing**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_points ON users(points DESC);
CREATE INDEX idx_users_created ON users(created_at DESC);
```

### **2. Caching**
- Cache leaderboard data (5-10 minutes)
- Cache user profiles (1-5 minutes)
- Use Redis for session storage

### **3. Connection Pooling**
- Use connection pooling for better performance
- Limit concurrent connections
- Close connections properly

---

## 🎉 Next Steps

1. **Choose your database** (Vercel Postgres recommended for Vercel deployments)
2. **Follow the setup guide** for your chosen database
3. **Implement dual storage** (localStorage + database)
4. **Test thoroughly** before going database-only
5. **Deploy to production** with proper monitoring

---

## 📚 Additional Resources

- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Supabase Docs**: https://supabase.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Next.js API Routes**: https://nextjs.org/docs/api-routes/introduction
- **Prisma ORM**: https://www.prisma.io/docs (Alternative to raw SQL)

---

**Status:** 📖 Implementation Guide  
**Difficulty:** Intermediate  
**Time Required:** 2-4 hours  
**Last Updated:** December 2024
