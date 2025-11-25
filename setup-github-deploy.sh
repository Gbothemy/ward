#!/bin/bash

echo "========================================"
echo "Crypto Earning - GitHub Pages Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "[1/5] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed!"
    exit 1
fi

echo ""
echo "[2/5] Checking package.json configuration..."
if grep -q "YOUR_GITHUB_USERNAME" package.json; then
    echo ""
    echo "WARNING: Please update package.json!"
    echo "Replace YOUR_GITHUB_USERNAME with your actual GitHub username"
    echo "Line 5: \"homepage\": \"https://YOUR_GITHUB_USERNAME.github.io/crypto-earning\""
    echo ""
    read -p "Press Enter to continue..."
fi

echo ""
echo "[3/5] Checking .env.production..."
if [ ! -f .env.production ]; then
    echo "ERROR: .env.production not found!"
    echo "Please create .env.production with your Supabase credentials"
    echo "See GITHUB-PAGES-DEPLOY.md for instructions"
    exit 1
fi

if grep -q "your-project.supabase.co" .env.production; then
    echo ""
    echo "WARNING: Please update .env.production!"
    echo "Add your actual Supabase URL and anon key"
    echo "Get them from: https://supabase.com/dashboard"
    echo ""
    read -p "Press Enter to continue..."
fi

echo ""
echo "[4/5] Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi

echo ""
echo "[5/5] Deploying to GitHub Pages..."
npm run deploy
if [ $? -ne 0 ]; then
    echo "ERROR: Deploy failed!"
    echo "Make sure you have:"
    echo "1. Created a GitHub repository named 'crypto-earning'"
    echo "2. Pushed your code to GitHub"
    echo "3. Updated package.json with your GitHub username"
    exit 1
fi

echo ""
echo "========================================"
echo "SUCCESS! Your site is deploying..."
echo "========================================"
echo ""
echo "Your site will be live in 2-3 minutes at:"
echo "https://YOUR_GITHUB_USERNAME.github.io/crypto-earning"
echo ""
echo "Next steps:"
echo "1. Go to GitHub repo Settings > Pages"
echo "2. Verify branch is set to 'gh-pages'"
echo "3. Wait for deployment to complete"
echo ""
echo "Admin panel: /admin/login"
echo ""
