# 🚀 Vercel Postgres Quick Setup Guide

## ✅ Prerequisites Completed
- [x] `@vercel/postgres` installed
- [x] Database schema created (`src/db/schema.sql`)
- [x] Database helper functions created (`src/db/database.js`)
- [x] Environment variables template created (`.env.example`)

---

## 📋 Step-by-Step Setup

### **Step 1: Create Vercel Postgres Database**

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Navigate to Storage**
   - Click on your project (or create one)
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"

3. **Create Database**
   - Name: `reward-game-db` (or any name you prefer)
   - Region: Choose closest to your users
   - Click "Create"
   - Wait for database to be provisioned (~30 seconds)

4. **Get Connection Strings**
   - After creation, click on your database
   - Go to ".env.local" tab
   - Copy all the environment variables

---

### **Step 2: Set Up Environment Variables**

1. **Create `.env.local` file** in project root:
   ```bash
   # In reward-game-dashboard folder
   copy .env.example .env.local
   ```

2. **Paste your Vercel Postgres credentials** into `.env.local`:
   ```env
   POSTGRES_URL="postgres://default:***@***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_PRISMA_URL="postgres://default:***@***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NON_POOLING="postgres://default:***@***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_USER="default"
   POSTGRES_HOST="***-pooler.us-east-1.postgres.vercel-storage.com"
   POSTGRES_PASSWORD="***"
   POSTGRES_DATABASE="verceldb"
   ```

3. **Save the file** (it's already in .gitignore, so it won't be committed)

---

### **Step 3: Run Database Schema**

1. **Go to Vercel Dashboard** → Your Database → "Query" tab

2. **Copy the contents** of `src/db/schema.sql`

3. **Paste into the Query editor** and click "Run Query"

4. **Verify tables were created**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

   You should see:
   - users
   - balances
   - withdrawal_requests
   - game_plays
   - achievements
   - referrals

---

### **Step 4: Test Database Connection**

1. **Create a test file** `src/db/test-connection.js`:
   ```javascript
   import { sql } from '@vercel/postgres';

   async function testConnection() {
     try {
       const result = await sql`SELECT NOW()`;
       console.log('✅ Database connected successfully!');
       console.log('Current time:', result.rows[0].now);
       return true;
     } catch (error) {
       console.error('❌ Database connection failed:', error);
       return false;
     }
   }

   testConnection();
   ```

2. **Run the test**:
   ```bash
   node src/db/test-connection.js
   ```

3. **Expected output**:
   ```
   ✅ Database connected successfully!
   Current time: 2024-12-25T10:30:00.000Z
   ```

---

### **Step 5: Update Your Code to Use Database**

The database helper (`src/db/database.js`) is already set up with **dual storage**:
- Writes to both database AND localStorage
- Reads from database first, falls back to localStorage
- Ensures no data loss during migration

**Example usage in your components:**

```javascript
import { db } from '../db/database';

// Create user
const user = await db.createUser({
  user_id: 'USR-12345',
  username: 'Player123',
  email: 'player@example.com',
  avatar: '👤',
  is_admin: false
});

// Update user points
await db.addPoints('USR-12345', 100);

// Get user
const userData = await db.getUser('USR-12345');

// Create withdrawal request
await db.createWithdrawalRequest({
  id: 'WD-' + Date.now(),
  user_id: 'USR-12345',
  username: 'Player123',
  currency: 'TON',
  amount: 50,
  wallet_address: 'TQm2...abc123'
});

// Get leaderboard
const topPlayers = await db.getLeaderboard('points', 10);
```

---

### **Step 6: Deploy to Vercel**

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add Vercel Postgres integration"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Vercel will automatically detect the push
   - Or manually deploy from Vercel Dashboard

3. **Add Environment Variables to Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all the POSTGRES_* variables from your `.env.local`
   - Click "Save"

4. **Redeploy** if needed:
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment

---

## 🎯 Migration Strategy

### **Phase 1: Dual Storage (Current Setup)** ✅

The database helper is already configured for dual storage:

```javascript
// Writes to BOTH database and localStorage
await db.createUser(userData);
// ✅ Saved to Postgres
// ✅ Saved to localStorage (backup)

// Reads from database first, falls back to localStorage
const user = await db.getUser(userId);
// 1. Try Postgres first
// 2. If fails, use localStorage
// 3. Never lose data!
```

**Benefits:**
- ✅ No breaking changes
- ✅ Gradual migration
- ✅ Fallback if database fails
- ✅ Easy rollback

### **Phase 2: Database Primary (Future)**

Once you're confident the database is stable:

1. Keep database as primary source
2. Use localStorage only as cache
3. Sync from database on page load

### **Phase 3: Database Only (Future)**

Eventually remove localStorage dependency:

1. All data in database
2. No localStorage writes
3. Full cloud synchronization

---

## 🔒 Security Checklist

- [x] Environment variables in `.env.local` (not committed)
- [x] `.env.local` in `.gitignore`
- [x] Parameterized SQL queries (prevents SQL injection)
- [x] Connection pooling enabled
- [ ] Add rate limiting (future)
- [ ] Add JWT authentication (future)
- [ ] Enable SSL/TLS (Vercel does this automatically)

---

## 🐛 Troubleshooting

### **Error: "Cannot find module '@vercel/postgres'"**
```bash
npm install @vercel/postgres
```

### **Error: "Connection refused"**
- Check your `.env.local` file exists
- Verify environment variables are correct
- Make sure you're using the correct connection string

### **Error: "relation 'users' does not exist"**
- Run the schema SQL in Vercel Dashboard
- Verify tables were created with the SELECT query

### **Database works locally but not on Vercel**
- Add environment variables to Vercel Dashboard
- Redeploy after adding variables
- Check Vercel deployment logs

### **Data not syncing between database and localStorage**
- Check browser console for errors
- Verify database connection is working
- The helper functions have fallback to localStorage

---

## 📊 Monitoring & Maintenance

### **Check Database Usage**
- Go to Vercel Dashboard → Your Database → "Usage" tab
- Monitor storage, queries, and connections

### **View Database Logs**
- Go to "Logs" tab in Vercel Dashboard
- Check for errors or slow queries

### **Backup Data**
```sql
-- Export users
COPY users TO '/tmp/users_backup.csv' CSV HEADER;

-- Or use Vercel's backup feature
-- Dashboard → Database → Settings → Backups
```

---

## 🎉 Next Steps

1. **Test locally** with your `.env.local` file
2. **Verify database connection** works
3. **Test user registration** and login
4. **Test game plays** and point updates
5. **Test withdrawals** and admin functions
6. **Deploy to Vercel** with environment variables
7. **Monitor** for any issues

---

## 📚 Additional Resources

- **Vercel Postgres Docs**: https://vercel.com/docs/storage/vercel-postgres
- **SQL Reference**: https://www.postgresql.org/docs/
- **Vercel CLI**: https://vercel.com/docs/cli

---

## ✅ Checklist

- [ ] Created Vercel Postgres database
- [ ] Copied environment variables to `.env.local`
- [ ] Ran schema SQL in Vercel Dashboard
- [ ] Tested database connection
- [ ] Committed code changes
- [ ] Added environment variables to Vercel
- [ ] Deployed to production
- [ ] Tested in production

---

**Status:** 🚀 Ready to Deploy  
**Difficulty:** Easy  
**Time Required:** 15-20 minutes  
**Last Updated:** December 2024
