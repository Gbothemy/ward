# 🗑️ Clear Storage Guide

## How to Clear All User Data

The app now uses **live user data** from localStorage. To clear all stored user records and start fresh:

### Method 1: Using the Clear Storage Page

1. Open your browser and navigate to:
   ```
   http://localhost:3000/clear-storage.html
   ```
   (Or wherever your app is hosted + `/clear-storage.html`)

2. You'll see a page showing:
   - Total storage keys
   - Number of user profiles
   - Daily play records
   - Cooldown data
   - Auth sessions

3. Click **"Clear All User Data"** button

4. Confirm the action

5. All user data will be cleared (except dark mode and sound preferences)

6. Click **"Back to App"** to return to the dashboard

### Method 2: Using Browser Console

1. Open your app in the browser
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Run this command:

```javascript
// Clear all user data
const keys = Object.keys(localStorage);
keys.forEach(key => {
  if (key.startsWith('rewardGameUser_') || 
      key.startsWith('dailyPlays_') || 
      key === 'miningCooldowns' ||
      key === 'authUser') {
    localStorage.removeItem(key);
  }
});
console.log('✅ User data cleared!');
location.reload();
```

### Method 3: Clear Specific User

To clear data for a specific user only:

```javascript
const userId = 'USR-12345'; // Replace with actual user ID
const keys = Object.keys(localStorage);
keys.forEach(key => {
  if (key.includes(userId)) {
    localStorage.removeItem(key);
  }
});
console.log(`✅ Cleared data for user: ${userId}`);
```

### Method 4: Clear Everything (Nuclear Option)

To clear ALL localStorage data including preferences:

```javascript
localStorage.clear();
console.log('✅ All localStorage cleared!');
location.reload();
```

## What Gets Cleared

When you clear user data, the following are removed:

- ✅ User profiles (`rewardGameUser_*`)
- ✅ Daily play limits (`dailyPlays_*`)
- ✅ Game cooldowns (`miningCooldowns`)
- ✅ Authentication sessions (`authUser`)

## What's Preserved

These settings are kept:

- ✅ Dark mode preference (`darkMode`)
- ✅ Sound settings (`soundEnabled`)

## Live Data Features

The app now uses **real-time data** from localStorage:

### Leaderboard
- Shows actual users who have played
- Ranks based on real points, earnings, and streaks
- Updates automatically as users play

### User Stats
- All points, levels, and progress are real
- No mock data or fake users
- Each user has their own isolated data

### Demo Account
- The demo account is preserved
- You can always create new accounts
- Each account maintains separate progress

## Troubleshooting

### Leaderboard is Empty
- This is normal if no users have played yet
- Create a few accounts and play games to populate it
- The leaderboard shows top 10 real users

### Mining Modes Not Showing
- Make sure you're logged in
- Check that GamePage.css has the `.mining-grid` styles
- Refresh the page if needed

### Data Not Persisting
- Check browser localStorage is enabled
- Make sure you're not in incognito/private mode
- Check browser console for errors

## For Developers

### Storage Structure

```javascript
// User data
localStorage.setItem('rewardGameUser_USR-12345', JSON.stringify({
  username: 'Player',
  userId: 'USR-12345',
  points: 1000,
  vipLevel: 2,
  // ... other user data
}));

// Daily plays
localStorage.setItem('dailyPlays_USR-12345_Mon Dec 25 2024', JSON.stringify({
  puzzle: 2,
  spin: 1,
  memory: 0
}));

// Cooldowns
localStorage.setItem('miningCooldowns', JSON.stringify({
  puzzle: 1703520000000,
  spin: 1703520060000
}));

// Auth
localStorage.setItem('authUser', JSON.stringify({
  userId: 'USR-12345',
  username: 'Player',
  avatar: '👤'
}));
```

### Getting All Users

```javascript
function getAllUsers() {
  const keys = Object.keys(localStorage);
  const userKeys = keys.filter(key => key.startsWith('rewardGameUser_'));
  
  return userKeys.map(key => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  }).filter(u => u !== null);
}

const users = getAllUsers();
console.log(`Total users: ${users.length}`);
```

### Storage Stats

```javascript
function getStorageStats() {
  const keys = Object.keys(localStorage);
  return {
    total: keys.length,
    users: keys.filter(k => k.startsWith('rewardGameUser_')).length,
    dailyPlays: keys.filter(k => k.startsWith('dailyPlays_')).length,
    cooldowns: keys.filter(k => k === 'miningCooldowns').length
  };
}

console.table(getStorageStats());
```

## Notes

- All data is stored locally in the browser
- No backend database is used (yet)
- Each browser/device has separate data
- Clearing browser data will clear all progress
- Consider implementing backend storage for production

---

**Need Help?** Check the browser console for any errors or warnings.
