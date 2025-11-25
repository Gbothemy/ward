# 📋 Deployment Checklist

## Before First Deploy

- [ ] **Set up Supabase account** (free at supabase.com)
- [ ] **Create Supabase project** (~2 minutes)
- [ ] **Update `.env.production`** with your Supabase credentials
- [ ] **Run database setup SQL** in Supabase SQL Editor

## Deploy Commands

### Windows:
```bash
deploy.bat
```

### Manual:
```bash
npm run build
npm run deploy
```

## After First Deploy

- [ ] **Enable GitHub Pages**:
  1. Go to https://github.com/Gbothemy/ward/settings/pages
  2. Select branch: `gh-pages`
  3. Click Save

- [ ] **Verify deployment**:
  - Visit: https://Gbothemy.github.io/ward
  - Test login/registration
  - Check admin portal

## Database Setup (One-Time)

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy content from `SUPABASE-ONE-CLICK-SETUP.sql`
4. Paste and Run
5. Verify tables created in Table Editor

## Environment Variables Needed

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get these from: **Supabase Dashboard > Project Settings > API**

## Current Status

- ✅ GitHub repo connected: https://github.com/Gbothemy/ward
- ✅ Package.json configured
- ✅ Webpack configured for GitHub Pages
- ✅ 404 redirect handling set up
- ⏳ Waiting for Supabase credentials
- ⏳ Ready to deploy

## Quick Deploy (Copy-Paste)

```bash
cd reward-game-dashboard
npm run deploy
```

## Troubleshooting

**Build fails?**
- Run `npm install` first
- Check for syntax errors

**Blank page after deploy?**
- Check browser console
- Verify `.env.production` has correct values
- Ensure Supabase credentials are valid

**Database not working?**
- Run the SQL setup in Supabase
- Check Supabase project is active
- Verify API keys are correct

## Your URLs

- **Live App**: https://Gbothemy.github.io/ward
- **Admin Portal**: https://Gbothemy.github.io/ward/#/admin-login
- **GitHub Repo**: https://github.com/Gbothemy/ward
- **Supabase Dashboard**: https://supabase.com/dashboard

## Cost: $0/month 🎉

Both GitHub Pages and Supabase free tiers are generous enough for production use!
