@echo off
echo ========================================
echo Crypto Earning - GitHub Pages Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo [2/5] Checking package.json configuration...
findstr /C:"YOUR_GITHUB_USERNAME" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo WARNING: Please update package.json!
    echo Replace YOUR_GITHUB_USERNAME with your actual GitHub username
    echo Line 5: "homepage": "https://YOUR_GITHUB_USERNAME.github.io/crypto-earning"
    echo.
    pause
)

echo.
echo [3/5] Checking .env.production...
if not exist .env.production (
    echo ERROR: .env.production not found!
    echo Please create .env.production with your Supabase credentials
    echo See GITHUB-PAGES-DEPLOY.md for instructions
    pause
    exit /b 1
)

findstr /C:"your-project.supabase.co" .env.production >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo WARNING: Please update .env.production!
    echo Add your actual Supabase URL and anon key
    echo Get them from: https://supabase.com/dashboard
    echo.
    pause
)

echo.
echo [4/5] Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [5/5] Deploying to GitHub Pages...
call npm run deploy
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Deploy failed!
    echo Make sure you have:
    echo 1. Created a GitHub repository named 'crypto-earning'
    echo 2. Pushed your code to GitHub
    echo 3. Updated package.json with your GitHub username
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Your site is deploying...
echo ========================================
echo.
echo Your site will be live in 2-3 minutes at:
echo https://YOUR_GITHUB_USERNAME.github.io/crypto-earning
echo.
echo Next steps:
echo 1. Go to GitHub repo Settings ^> Pages
echo 2. Verify branch is set to 'gh-pages'
echo 3. Wait for deployment to complete
echo.
echo Admin panel: /admin/login
echo.
pause
