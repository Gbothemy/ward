# 🚀 Vercel Environment Variables Setup

## Issue: Admin Login Not Showing on Production

If the admin login button (🛡️) is not showing on your deployed site, follow these steps:

---

## ✅ Step 1: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Select your project:** `ward` or your project name
3. **Go to Settings** → **Environment Variables**
4. **Add these variables:**

```
REACT_APP_SUPABASE_URL
Value: https://ppeucykbvevlfzfwsgyn.supabase.co

REACT_APP_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZXVjeWtidmV2bGZ6ZndzZ3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMjQyOTgsImV4cCI6MjA3OTYwMDI5OH0.yaIs6RjKr6FY0EBFM72y6xXAhDc-H_JMgenPPtLHZpg
```

5. **Select Environment:** Production, Preview, Development (select all)
6. **Click "Save"**

---

## ✅ Step 2: Redeploy Your Site

### **Option A: Automatic Redeploy**
```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

### **Option B: Manual Redeploy**
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Find the latest deployment
4. Click the **⋯** menu → **Redeploy**
5. Check "Use existing Build Cache" (optional)
6. Click **Redeploy**

---

## ✅ Step 3: Clear Browser Cache

After redeployment:
1. Go to your site: https://ward-sigma.vercel.app/
2. **Hard refresh:**
   - **Windows/Linux:** Ctrl + Shift + R
   - **Mac:** Cmd + Shift + R
3. Or open in **Incognito/Private mode**

---

## ✅ Step 4: Verify Admin Button Shows

1. Go to: https://ward-sigma.vercel.app/
2. Look for the **🛡️ shield icon** in the top navigation
3. Click it to access admin login

---

## 🐛 Troubleshooting

### **Admin button still not showing?**

**Check 1: Verify Latest Code is Deployed**
```bash
# Check last commit
git log -1 --oneline

# Should show recent commits with admin login
```

**Check 2: Check Vercel Build Logs**
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check **Build Logs** for errors
4. Look for "Compiled successfully"

**Check 3: Check Browser Console**
1. Open your site
2. Press F12 (Developer Tools)
3. Go to **Console** tab
4. Look for any errors (red text)
5. Check **Network** tab for failed requests

**Check 4: Verify Files Exist**
1. Go to Vercel Dashboard → Deployments
2. Click latest deployment
3. Click **Source** tab
4. Verify these files exist:
   - `src/pages/AdminLoginPage.js`
   - `src/pages/AdminLoginPage.css`
   - `src/pages/LandingPage.js` (with shield button)

---

## 🔍 Common Issues

### **Issue 1: Old Cache**
**Solution:** Clear browser cache or use Incognito mode

### **Issue 2: Build Failed**
**Solution:** Check Vercel build logs for errors

### **Issue 3: Environment Variables Missing**
**Solution:** Add Supabase env vars to Vercel (Step 1)

### **Issue 4: Route Not Configured**
**Solution:** Verify `vercel.json` has proper rewrites

---

## 📋 Verify Deployment Checklist

- [ ] Environment variables added to Vercel
- [ ] Latest code pushed to GitHub
- [ ] Vercel redeployed successfully
- [ ] Browser cache cleared
- [ ] Admin button (🛡️) visible on homepage
- [ ] Admin login page accessible at `/admin/login`
- [ ] Can login as admin
- [ ] Admin dashboard accessible

---

## 🎯 Quick Fix Commands

```bash
# 1. Ensure latest code is committed
git add -A
git commit -m "Update admin login"
git push origin main

# 2. Trigger Vercel redeploy
git commit --allow-empty -m "Redeploy"
git push origin main

# 3. Wait 1-2 minutes for deployment
# 4. Clear browser cache (Ctrl+Shift+R)
# 5. Check site
```

---

## ✅ Expected Result

After following these steps, you should see:

**On Homepage (https://ward-sigma.vercel.app/):**
```
Navigation Bar:
[🛡️] [Login] [Sign Up]
  ↑
Admin Portal Button
```

**Clicking 🛡️ takes you to:**
```
https://ward-sigma.vercel.app/admin/login
```

---

## 📞 Still Having Issues?

If admin button still doesn't show:

1. **Check this file exists in your repo:**
   - `src/pages/LandingPage.js` (line ~70-75 should have shield button)

2. **Verify the code:**
   ```javascript
   <button onClick={() => navigate('/admin/login')} className="nav-btn admin-btn">
     🛡️
   </button>
   ```

3. **Check Vercel deployment status:**
   - Should say "Ready" with green checkmark
   - Build time should be recent (within last few minutes)

---

**Status:** 🔧 Troubleshooting Guide  
**Last Updated:** December 2024
