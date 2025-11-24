# 🚀 Next.js Migration Guide for Vercel Deployment

## Quick Setup Instructions

### Step 1: Create New Next.js Project

Open a terminal in your parent directory and run:

```bash
npx create-next-app@latest reward-game-nextjs --typescript --no --use-npm --app --no-src-dir --import-alias "@/*"
```

Answer the prompts:
- TypeScript? **No** (we'll use JavaScript)
- ESLint? **Yes**
- Tailwind CSS? **No** (we have custom CSS)
- `src/` directory? **No**
- App Router? **Yes**
- Import alias? **Yes** (@/*)

### Step 2: Copy Files

After creating the Next.js project, copy these files from your current project:

#### Copy All Page Components:
```bash
# From reward-game-dashboard/src/pages/ to reward-game-nextjs/app/
- LandingPage.js → page.js (in app/)
- LoginPage.js → login/page.js
- GamePage.js → game/page.js
- AirdropPage.js → airdrop/page.js
- ReferralPage.js → referral/page.js
- BenefitPage.js → benefit/page.js
- LeaderboardPage.js → leaderboard/page.js
```

#### Copy All CSS Files:
```bash
# From reward-game-dashboard/src/pages/ to reward-game-nextjs/app/
- All .css files to their respective folders
```

#### Copy Components:
```bash
# From reward-game-dashboard/src/components/ to reward-game-nextjs/components/
- Layout.js
- Layout.css
- Achievements.js
- Achievements.css
```

### Step 3: Install Dependencies

```bash
cd reward-game-nextjs
npm install
```

### Step 4: Update package.json

Your `package.json` should look like this:

```json
{
  "name": "reward-game-nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "eslint": "^8",
    "eslint-config-next": "14.0.4"
  }
}
```

### Step 5: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js
6. Click "Deploy"

## File Structure for Next.js

```
reward-game-nextjs/
├── app/
│   ├── page.js                 (Landing Page)
│   ├── page.module.css
│   ├── layout.js               (Root Layout)
│   ├── globals.css
│   ├── login/
│   │   ├── page.js
│   │   └── page.module.css
│   ├── game/
│   │   ├── page.js
│   │   └── page.module.css
│   ├── airdrop/
│   │   ├── page.js
│   │   └── page.module.css
│   ├── referral/
│   │   ├── page.js
│   │   └── page.module.css
│   ├── benefit/
│   │   ├── page.js
│   │   └── page.module.css
│   └── leaderboard/
│       ├── page.js
│       └── page.module.css
├── components/
│   ├── Layout.js
│   ├── Layout.module.css
│   ├── Achievements.js
│   └── Achievements.module.css
├── public/
│   └── (static assets)
├── package.json
├── next.config.js
└── .gitignore
```

## Key Changes Needed

### 1. Remove React Router
Next.js uses file-based routing. Remove all:
- `import { BrowserRouter, Routes, Route, Navigate }`
- `<Router>`, `<Routes>`, `<Route>` components
- `useNavigate()` → use `useRouter()` from 'next/navigation'
- `<Link>` from react-router → `<Link>` from 'next/link'

### 2. Update Imports
```javascript
// Old (React Router)
import { useNavigate, Link } from 'react-router-dom';

// New (Next.js)
import { useRouter } from 'next/navigation';
import Link from 'next/link';
```

### 3. Client Components
Add `'use client'` at the top of files that use:
- useState
- useEffect
- Event handlers
- Browser APIs

Example:
```javascript
'use client';

import { useState } from 'react';

export default function GamePage() {
  const [mining, setMining] = useState({});
  // ...
}
```

### 4. CSS Modules
Rename CSS files:
```
GamePage.css → GamePage.module.css
```

Import as:
```javascript
import styles from './GamePage.module.css';

// Use as:
<div className={styles.gamePage}>
```

Or keep global CSS and import in layout.js

### 5. Update Navigation
```javascript
// Old
navigate('/game');

// New
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/game');
```

### 6. LocalStorage (Client-Side Only)
Wrap localStorage calls:
```javascript
'use client';

useEffect(() => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('key');
  }
}, []);
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_APP_NAME=Reward Game Dashboard
NEXT_PUBLIC_API_URL=your-api-url
```

## Vercel Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Benefits of Next.js + Vercel

✅ **Automatic Deployments** - Push to GitHub, auto-deploy
✅ **Server-Side Rendering** - Better SEO
✅ **API Routes** - Built-in backend
✅ **Image Optimization** - Automatic image optimization
✅ **Fast Refresh** - Instant feedback during development
✅ **Zero Config** - Works out of the box
✅ **Edge Functions** - Deploy globally
✅ **Analytics** - Built-in performance monitoring
✅ **Free Hosting** - Generous free tier

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. **Done!** 🎉
   Your app will be live at: `your-project.vercel.app`

## Custom Domain

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

## Troubleshooting

### Build Errors
- Check all imports are correct
- Ensure 'use client' is added where needed
- Verify no React Router code remains

### LocalStorage Errors
- Wrap in useEffect
- Check for window object
- Use 'use client' directive

### CSS Not Loading
- Use CSS Modules or global CSS in layout
- Check import paths
- Verify file names

## Need Help?

- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Discord: https://discord.gg/nextjs

## Quick Command Reference

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

---

**Note**: I can help you with the actual file conversions if you create the Next.js project first!
