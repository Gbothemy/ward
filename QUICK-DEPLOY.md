# ⚡ Quick Deploy to Vercel - 5 Minutes

## 🚀 Super Fast Setup

### 1. Create Next.js App (2 min)
```bash
cd ..
npx create-next-app@latest reward-game-nextjs
# Answer: No, Yes, No, No, Yes, Yes, @/*
cd reward-game-nextjs
```

### 2. Copy Files (1 min)
```bash
# Windows
cd ../reward-game-dashboard
convert-to-nextjs.bat

# Mac/Linux
cd ../reward-game-dashboard
chmod +x convert-to-nextjs.sh
./convert-to-nextjs.sh
```

### 3. Quick Fixes (1 min)

Add to **every page file** (app/*/page.js):
```javascript
'use client';
```

Replace in **all files**:
```javascript
// Find and replace:
useNavigate → useRouter
navigate( → router.push(
<Link to= → <Link href=
from 'react-router-dom' → from 'next/navigation'
```

### 4. Test (30 sec)
```bash
cd ../reward-game-nextjs
npm run dev
```
Visit http://localhost:3000

### 5. Deploy (1 min)
```bash
git init
git add .
git commit -m "Initial commit"
```

Go to https://vercel.com
- Login with GitHub
- Click "New Project"
- Import repository
- Click "Deploy"

## ✅ Done!

Your site is live at: `your-project.vercel.app`

---

## 🔧 Essential Code Changes

### Navigation
```javascript
// OLD
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/game');

// NEW
'use client';
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/game');
```

### Links
```javascript
// OLD
import { Link } from 'react-router-dom';
<Link to="/game">Game</Link>

// NEW
import Link from 'next/link';
<Link href="/game">Game</Link>
```

### Client Components
```javascript
// Add at top of file if using:
// - useState, useEffect
// - onClick, onChange
// - localStorage, window

'use client';

import { useState } from 'react';
```

---

## 📝 File Structure

```
reward-game-nextjs/
├── app/
│   ├── page.js              ← Landing
│   ├── login/page.js        ← Login
│   ├── game/page.js         ← Game
│   ├── airdrop/page.js      ← Airdrop
│   ├── referral/page.js     ← Referral
│   ├── benefit/page.js      ← Benefit
│   └── leaderboard/page.js  ← Leaderboard
└── components/
    ├── Layout.js
    └── Achievements.js
```

---

## 🐛 Common Issues

**Build Error: "use client" missing**
→ Add `'use client'` at top of file

**Error: useNavigate not found**
→ Replace with `useRouter` from 'next/navigation'

**LocalStorage error**
→ Wrap in `useEffect` and check `typeof window !== 'undefined'`

**CSS not loading**
→ Rename to `.module.css` or import in layout

---

## 🎯 Deployment Checklist

- [ ] Created Next.js project
- [ ] Copied files
- [ ] Added 'use client' to interactive pages
- [ ] Replaced React Router code
- [ ] Tested locally (npm run dev)
- [ ] Pushed to GitHub
- [ ] Deployed on Vercel

---

## 💡 Pro Tips

1. **Auto-deploy**: Every git push deploys automatically
2. **Preview URLs**: Each PR gets its own URL
3. **Rollback**: Click any old deployment to restore
4. **Analytics**: Enable in Vercel dashboard
5. **Custom Domain**: Add in Settings → Domains

---

## 🆘 Need Help?

See detailed guides:
- `NEXTJS-MIGRATION.md` - Full migration guide
- `VERCEL-DEPLOYMENT.md` - Complete deployment guide

Or visit:
- https://nextjs.org/docs
- https://vercel.com/docs
