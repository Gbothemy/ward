# 🚀 Quick Deploy Commands

## First Time Setup

```bash
cd reward-game-dashboard

# Install dependencies (including gh-pages)
npm install

# Update package.json with your GitHub username
# Edit line 5: "homepage": "https://YOUR_GITHUB_USERNAME.github.io/crypto-earning"

# Setup Supabase and update .env.production with your credentials
# See GITHUB-PAGES-DEPLOY.md for full instructions
```

## Deploy to GitHub Pages

```bash
# Make sure you're in the reward-game-dashboard directory
cd reward-game-dashboard

# Build and deploy in one command
npm run deploy
```

That's it! Your site will be live at: `https://YOUR_GITHUB_USERNAME.github.io/crypto-earning`

## First Time Git Setup

If you haven't pushed to GitHub yet:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Crypto Earning Dashboard"

# Add your GitHub repository (replace YOUR_GITHUB_USERNAME)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/crypto-earning.git

# Push to main branch
git branch -M main
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

## Update After Changes

```bash
# After making any code changes:
git add .
git commit -m "Your update message"
git push

# Deploy the changes
npm run deploy
```

## Troubleshooting

**Command not found: npm**
- Install Node.js from https://nodejs.org

**Permission denied**
- Run: `npm install` first

**Deploy fails**
- Check you updated the homepage in package.json
- Make sure you pushed to GitHub first
- Verify gh-pages package is installed

**Site shows 404**
- Wait 2-3 minutes after first deploy
- Check GitHub repo Settings > Pages
- Ensure branch is set to `gh-pages`

## Quick Links

- **Your Live Site:** https://YOUR_GITHUB_USERNAME.github.io/crypto-earning
- **Admin Panel:** https://YOUR_GITHUB_USERNAME.github.io/crypto-earning/admin/login
- **GitHub Repo:** https://github.com/YOUR_GITHUB_USERNAME/crypto-earning
- **Supabase Dashboard:** https://supabase.com/dashboard

## Environment Setup

Before deploying, create `.env.production`:

```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from Supabase Dashboard > Project Settings > API

---

Need detailed instructions? See **GITHUB-PAGES-DEPLOY.md**
