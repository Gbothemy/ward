# 🚀 Complete Vercel Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account (free)

## Step-by-Step Deployment

### 1. Create Next.js Project

```bash
# Navigate to parent directory
cd ..

# Create Next.js app
npx create-next-app@latest reward-game-nextjs

# Answer prompts:
# ✔ Would you like to use TypeScript? › No
# ✔ Would you like to use ESLint? › Yes
# ✔ Would you like to use Tailwind CSS? › No
# ✔ Would you like to use `src/` directory? › No
# ✔ Would you like to use App Router? › Yes
# ✔ Would you like to customize the default import alias? › Yes
# ✔ What import alias would you like configured? › @/*

# Enter the project
cd reward-game-nextjs
```

### 2. Run Conversion Script

**Windows:**
```bash
cd ../reward-game-dashboard
convert-to-nextjs.bat
```

**Mac/Linux:**
```bash
cd ../reward-game-dashboard
chmod +x convert-to-nextjs.sh
./convert-to-nextjs.sh
```

### 3. Manual Updates Required

#### A. Update app/layout.js

```javascript
export const metadata = {
  title: 'Reward Game Dashboard',
  description: 'Earn crypto rewards while playing games',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

#### B. Update app/page.js (Landing Page)

```javascript
'use client';

import { useRouter } from 'next/navigation';
import './page.module.css';

export default function LandingPage() {
  const router = useRouter();

  // Replace all navigate('/path') with router.push('/path')
  // Replace all <Link to="/path"> with <Link href="/path">
  
  return (
    // Your landing page JSX
  );
}
```

#### C. Update All Page Components

Add `'use client'` at the top of each page file:

```javascript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ... rest of imports

export default function GamePage() {
  // Your component code
}
```

#### D. Update Navigation

Replace React Router with Next.js:

```javascript
// OLD (React Router)
import { useNavigate, Link } from 'react-router-dom';
const navigate = useNavigate();
navigate('/game');

// NEW (Next.js)
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const router = useRouter();
router.push('/game');
```

#### E. Update Links

```javascript
// OLD
<Link to="/game">Game</Link>

// NEW
<Link href="/game">Game</Link>
```

### 4. Test Locally

```bash
cd reward-game-nextjs
npm run dev
```

Visit `http://localhost:3000` and test all features.

### 5. Initialize Git

```bash
git init
git add .
git commit -m "Initial Next.js setup"
```

### 6. Push to GitHub

```bash
# Create new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/reward-game-nextjs.git
git branch -M main
git push -u origin main
```

### 7. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"
4. Click "New Project"
5. Import your `reward-game-nextjs` repository
6. Vercel auto-detects Next.js settings
7. Click "Deploy"
8. Wait 2-3 minutes
9. Your site is live! 🎉

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 8. Configure Custom Domain (Optional)

1. Go to Vercel Dashboard
2. Select your project
3. Click "Settings" → "Domains"
4. Add your domain
5. Update DNS records:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

### 9. Environment Variables

If you need environment variables:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Settings" → "Environment Variables"
4. Add variables:
   ```
   NEXT_PUBLIC_APP_NAME=Reward Game Dashboard
   NEXT_PUBLIC_API_URL=your-api-url
   ```

### 10. Automatic Deployments

Every push to `main` branch will automatically deploy to production!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys! 🚀
```

## Vercel Features

### ✅ What You Get Free

- **Unlimited Deployments**
- **Automatic HTTPS**
- **Global CDN**
- **Serverless Functions**
- **Analytics**
- **100GB Bandwidth/month**
- **Custom Domains**
- **Preview Deployments**

### 🚀 Performance Optimizations

Vercel automatically:
- Optimizes images
- Minifies code
- Enables compression
- Caches assets
- Serves from edge locations

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Check all imports are correct
# Ensure no React Router imports remain
```

**Error: 'use client' missing**
```bash
# Add 'use client' to components using:
# - useState, useEffect
# - Event handlers
# - Browser APIs
```

### LocalStorage Errors

```javascript
'use client';

useEffect(() => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('key');
    // Use data
  }
}, []);
```

### CSS Not Loading

```javascript
// Use CSS Modules
import styles from './page.module.css';

// Or global CSS in layout.js
import './globals.css';
```

## Monitoring & Analytics

### View Deployment Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on any deployment
5. View logs and errors

### Enable Analytics

1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics"
4. Enable Web Analytics
5. View real-time data

## Rollback Deployment

If something goes wrong:

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find working deployment
4. Click "..." → "Promote to Production"

## Custom Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'],
  },
  // Add redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## Performance Tips

1. **Use Next.js Image Component**
   ```javascript
   import Image from 'next/image';
   <Image src="/logo.png" width={200} height={200} alt="Logo" />
   ```

2. **Enable Compression**
   - Vercel does this automatically

3. **Lazy Load Components**
   ```javascript
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('./HeavyComponent'));
   ```

4. **Use Server Components**
   - Remove 'use client' where possible
   - Fetch data on server

## Security

### Environment Variables

Never commit:
- API keys
- Database credentials
- Secret tokens

Use Vercel Environment Variables instead.

### Headers

Add security headers in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
      ],
    },
  ]
}
```

## Cost Estimation

### Free Tier (Hobby)
- Perfect for personal projects
- 100GB bandwidth
- Unlimited deployments
- 100 serverless function executions/day

### Pro Tier ($20/month)
- 1TB bandwidth
- Unlimited serverless executions
- Team collaboration
- Advanced analytics

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: support@vercel.com
- **Community**: https://github.com/vercel/next.js/discussions

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

## Success Checklist

- [ ] Next.js project created
- [ ] Files copied and converted
- [ ] 'use client' added where needed
- [ ] React Router removed
- [ ] Navigation updated
- [ ] LocalStorage wrapped
- [ ] Tested locally
- [ ] Git repository created
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] Environment variables set
- [ ] Analytics enabled

## 🎉 Congratulations!

Your Reward Game Dashboard is now live on Vercel!

Share your link: `https://your-project.vercel.app`

---

**Need Help?** Check NEXTJS-MIGRATION.md for detailed code examples.
