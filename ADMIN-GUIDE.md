# 🛡️ Admin Panel Guide

## Accessing the Admin Panel

Navigate to: **`/admin`** (e.g., `http://localhost:3000/admin`)

Or click **"🛡️ Admin Panel"** from the mobile menu.

## Features Overview

The Admin Panel provides complete control over your reward game dashboard with three main sections:

### 1. 📊 Overview Tab

**Real-time Statistics:**
- **Total Users** - Number of registered users
- **Total Points** - Combined points across all users
- **Tasks Completed** - Total tasks finished by all users
- **Avg VIP Level** - Average VIP level of all users
- **Active Today** - Users who played today

**Quick Actions:**
- **📥 Export All Data** - Download all user data as JSON
- **🔄 Refresh Data** - Reload statistics from localStorage

### 2. 👥 Users Tab

**User Management Table:**

View all users with:
- Avatar
- Username
- User ID
- Points
- VIP Level
- Completed Tasks

**Actions per User:**
- **✏️ Edit** - Modify user data
- **🗑️ Delete** - Remove user permanently

**Edit User Modal:**
- Change username
- Adjust points
- Modify VIP level
- Update completed tasks
- Save or cancel changes

### 3. ⚙️ Settings Tab

**Danger Zone:**
- **🗑️ Clear All User Data** - Delete all users and game data
  - Requires typing "DELETE ALL" to confirm
  - Cannot be undone!

**Storage Information:**
- Total localStorage keys
- Number of user profiles
- Daily play records count

## How to Use

### Viewing Statistics

1. Navigate to Admin Panel
2. Overview tab shows real-time stats
3. Click "Refresh Data" to update

### Managing Users

1. Go to **Users** tab
2. Browse the user table
3. Click **✏️** to edit a user:
   - Modify any field
   - Click **💾 Save** to apply
   - Click **❌ Cancel** to discard
4. Click **🗑️** to delete a user:
   - Confirm deletion
   - User data is permanently removed

### Exporting Data

1. Go to **Overview** tab
2. Click **📥 Export All Data**
3. JSON file downloads automatically
4. Contains:
   - All user profiles
   - Statistics
   - Export timestamp

**Export Format:**
```json
{
  "users": [
    {
      "userId": "USR-12345",
      "username": "Player",
      "points": 1000,
      "vipLevel": 2,
      ...
    }
  ],
  "stats": {
    "totalUsers": 10,
    "totalPoints": 50000,
    ...
  },
  "exportDate": "2024-01-01T00:00:00.000Z"
}
```

### Clearing All Data

⚠️ **WARNING: This is irreversible!**

1. Go to **Settings** tab
2. Click **🗑️ Clear All User Data**
3. Type "DELETE ALL" in the prompt
4. Confirm to proceed
5. All user data is deleted
6. Redirects to login page

## Admin Features

### User Editing

**What You Can Edit:**
- ✅ Username
- ✅ Points (any amount)
- ✅ VIP Level (1-99)
- ✅ Completed Tasks

**What You Cannot Edit:**
- ❌ User ID (permanent)
- ❌ Avatar (user-controlled)
- ❌ Balance (TON, CATI, USDT)
- ❌ Daily play records

### Data Management

**Automatic Features:**
- Real-time data loading
- Instant updates after edits
- Automatic sorting and ranking
- Live statistics calculation

**Manual Actions:**
- Export data backups
- Delete individual users
- Clear all data
- Refresh statistics

## Use Cases

### 1. Testing & Development

```
Scenario: Test high-level gameplay
Action: Edit user → Set points to 100,000 → Set VIP level to 10
Result: Test high-level features without grinding
```

### 2. User Support

```
Scenario: User reports lost progress
Action: View user in table → Edit → Restore points/level
Result: User progress recovered
```

### 3. Data Analysis

```
Scenario: Analyze user engagement
Action: Export data → Analyze JSON → Identify patterns
Result: Insights for game improvements
```

### 4. Cleanup

```
Scenario: Remove test accounts
Action: Users tab → Delete test users one by one
Result: Clean production data
```

### 5. Fresh Start

```
Scenario: Reset entire system
Action: Settings → Clear All User Data → Confirm
Result: Clean slate for new deployment
```

## Security Considerations

### Current Implementation

⚠️ **No Authentication** - Anyone can access `/admin`

**Recommendations for Production:**

1. **Add Admin Authentication:**
```javascript
// Example: Check if user is admin
const isAdmin = user.userId === 'ADMIN-001' || user.email?.endsWith('@admin.com');

if (!isAdmin) {
  return <Navigate to="/" replace />;
}
```

2. **Add Password Protection:**
```javascript
const [adminPassword, setAdminPassword] = useState('');
const ADMIN_PASSWORD = 'your-secure-password';

if (adminPassword !== ADMIN_PASSWORD) {
  return <AdminLogin onLogin={setAdminPassword} />;
}
```

3. **Use Backend API:**
- Move admin functions to backend
- Require JWT authentication
- Log all admin actions
- Implement role-based access

### Best Practices

1. **Don't expose admin panel in production** without authentication
2. **Use environment variables** for admin credentials
3. **Log all admin actions** for audit trail
4. **Backup data** before bulk operations
5. **Test on staging** before production changes

## Troubleshooting

### Admin Panel Not Loading

**Issue:** Blank page or 404
**Solution:** 
- Check URL is `/admin` not `/admin/`
- Ensure you're logged in
- Clear browser cache
- Check console for errors

### Users Not Showing

**Issue:** Empty user table
**Solution:**
- Click "Refresh Data"
- Check localStorage has user data
- Create a test user first
- Check browser console

### Edit Not Saving

**Issue:** Changes don't persist
**Solution:**
- Check browser localStorage is enabled
- Not in incognito/private mode
- Check for JavaScript errors
- Try refreshing the page

### Export Not Working

**Issue:** No file downloads
**Solution:**
- Check browser allows downloads
- Disable popup blocker
- Try different browser
- Check console for errors

## Advanced Usage

### Bulk User Creation

Use browser console:
```javascript
// Create 10 test users
for (let i = 1; i <= 10; i++) {
  const user = {
    userId: `TEST-${i.toString().padStart(5, '0')}`,
    username: `TestUser${i}`,
    avatar: '🎮',
    points: Math.floor(Math.random() * 10000),
    vipLevel: Math.floor(Math.random() * 5) + 1,
    completedTasks: Math.floor(Math.random() * 50),
    balance: { ton: 0, cati: 0, usdt: 0 },
    exp: 0,
    maxExp: 1000,
    giftPoints: 0,
    dayStreak: 0
  };
  localStorage.setItem(`rewardGameUser_${user.userId}`, JSON.stringify(user));
}
console.log('✅ Created 10 test users');
location.reload();
```

### Batch Point Award

```javascript
// Give all users 1000 bonus points
const keys = Object.keys(localStorage);
keys.filter(k => k.startsWith('rewardGameUser_')).forEach(key => {
  const user = JSON.parse(localStorage.getItem(key));
  user.points += 1000;
  localStorage.setItem(key, JSON.stringify(user));
});
console.log('✅ Awarded 1000 points to all users');
location.reload();
```

### Find Top Users

```javascript
// Get top 5 users by points
const keys = Object.keys(localStorage);
const users = keys
  .filter(k => k.startsWith('rewardGameUser_'))
  .map(k => JSON.parse(localStorage.getItem(k)))
  .sort((a, b) => b.points - a.points)
  .slice(0, 5);

console.table(users.map(u => ({
  username: u.username,
  points: u.points,
  level: u.vipLevel
})));
```

## API Reference

### Admin Functions

```javascript
// Get all users
function getAllUsers() {
  const keys = Object.keys(localStorage);
  return keys
    .filter(key => key.startsWith('rewardGameUser_'))
    .map(key => JSON.parse(localStorage.getItem(key)));
}

// Update user
function updateUser(userId, updates) {
  const key = `rewardGameUser_${userId}`;
  const user = JSON.parse(localStorage.getItem(key));
  const updated = { ...user, ...updates };
  localStorage.setItem(key, JSON.stringify(updated));
}

// Delete user
function deleteUser(userId) {
  localStorage.removeItem(`rewardGameUser_${userId}`);
  // Also remove related data
  const keys = Object.keys(localStorage);
  keys.filter(k => k.includes(userId)).forEach(k => {
    localStorage.removeItem(k);
  });
}

// Get statistics
function getStats() {
  const users = getAllUsers();
  return {
    totalUsers: users.length,
    totalPoints: users.reduce((sum, u) => sum + u.points, 0),
    avgLevel: users.reduce((sum, u) => sum + u.vipLevel, 0) / users.length
  };
}
```

## Future Enhancements

Planned features:
- [ ] User activity logs
- [ ] Bulk operations (select multiple users)
- [ ] Advanced filtering and search
- [ ] Charts and graphs
- [ ] Email notifications
- [ ] Scheduled tasks
- [ ] Backup/restore functionality
- [ ] Import data from JSON
- [ ] User ban/suspend feature
- [ ] Admin action history

## Support

For issues or questions:
1. Check browser console for errors
2. Review this guide
3. Check CLEAR-STORAGE-GUIDE.md
4. Test in different browser
5. Report bugs with screenshots

---

**Admin Panel Version:** 1.0.0  
**Last Updated:** December 2024
