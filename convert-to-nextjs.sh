#!/bin/bash

# Reward Game Dashboard - Next.js Conversion Script
# This script helps convert the React app to Next.js structure

echo "🚀 Reward Game Dashboard - Next.js Conversion Helper"
echo "=================================================="
echo ""

# Check if Next.js project exists
if [ ! -d "../reward-game-nextjs" ]; then
    echo "❌ Next.js project not found!"
    echo ""
    echo "Please create it first by running:"
    echo "cd .. && npx create-next-app@latest reward-game-nextjs"
    echo ""
    exit 1
fi

echo "✅ Found Next.js project"
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p ../reward-game-nextjs/app/login
mkdir -p ../reward-game-nextjs/app/game
mkdir -p ../reward-game-nextjs/app/airdrop
mkdir -p ../reward-game-nextjs/app/referral
mkdir -p ../reward-game-nextjs/app/benefit
mkdir -p ../reward-game-nextjs/app/leaderboard
mkdir -p ../reward-game-nextjs/components

echo "✅ Directories created"
echo ""

# Copy components
echo "📋 Copying components..."
cp src/components/*.js ../reward-game-nextjs/components/ 2>/dev/null
cp src/components/*.css ../reward-game-nextjs/components/ 2>/dev/null

echo "✅ Components copied"
echo ""

# Copy page files
echo "📋 Copying pages..."
cp src/pages/LandingPage.js ../reward-game-nextjs/app/page.js 2>/dev/null
cp src/pages/LandingPage.css ../reward-game-nextjs/app/page.module.css 2>/dev/null

cp src/pages/LoginPage.js ../reward-game-nextjs/app/login/page.js 2>/dev/null
cp src/pages/LoginPage.css ../reward-game-nextjs/app/login/page.module.css 2>/dev/null

cp src/pages/GamePage.js ../reward-game-nextjs/app/game/page.js 2>/dev/null
cp src/pages/GamePage.css ../reward-game-nextjs/app/game/page.module.css 2>/dev/null

cp src/pages/AirdropPage.js ../reward-game-nextjs/app/airdrop/page.js 2>/dev/null
cp src/pages/AirdropPage.css ../reward-game-nextjs/app/airdrop/page.module.css 2>/dev/null

cp src/pages/ReferralPage.js ../reward-game-nextjs/app/referral/page.js 2>/dev/null
cp src/pages/ReferralPage.css ../reward-game-nextjs/app/referral/page.module.css 2>/dev/null

cp src/pages/BenefitPage.js ../reward-game-nextjs/app/benefit/page.js 2>/dev/null
cp src/pages/BenefitPage.css ../reward-game-nextjs/app/benefit/page.module.css 2>/dev/null

cp src/pages/LeaderboardPage.js ../reward-game-nextjs/app/leaderboard/page.js 2>/dev/null
cp src/pages/LeaderboardPage.css ../reward-game-nextjs/app/leaderboard/page.module.css 2>/dev/null

echo "✅ Pages copied"
echo ""

echo "🎉 Files copied successfully!"
echo ""
echo "⚠️  IMPORTANT: You still need to:"
echo "1. Add 'use client' directive to interactive components"
echo "2. Replace React Router with Next.js navigation"
echo "3. Update import statements"
echo "4. Test the application"
echo ""
echo "📖 See NEXTJS-MIGRATION.md for detailed instructions"
