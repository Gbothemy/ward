@echo off
REM Reward Game Dashboard - Next.js Conversion Script for Windows

echo.
echo 🚀 Reward Game Dashboard - Next.js Conversion Helper
echo ==================================================
echo.

REM Check if Next.js project exists
if not exist "..\reward-game-nextjs" (
    echo ❌ Next.js project not found!
    echo.
    echo Please create it first by running:
    echo cd .. ^&^& npx create-next-app@latest reward-game-nextjs
    echo.
    pause
    exit /b 1
)

echo ✅ Found Next.js project
echo.

REM Create directory structure
echo 📁 Creating directory structure...
mkdir "..\reward-game-nextjs\app\login" 2>nul
mkdir "..\reward-game-nextjs\app\game" 2>nul
mkdir "..\reward-game-nextjs\app\airdrop" 2>nul
mkdir "..\reward-game-nextjs\app\referral" 2>nul
mkdir "..\reward-game-nextjs\app\benefit" 2>nul
mkdir "..\reward-game-nextjs\app\leaderboard" 2>nul
mkdir "..\reward-game-nextjs\components" 2>nul

echo ✅ Directories created
echo.

REM Copy components
echo 📋 Copying components...
xcopy "src\components\*.js" "..\reward-game-nextjs\components\" /Y /Q 2>nul
xcopy "src\components\*.css" "..\reward-game-nextjs\components\" /Y /Q 2>nul

echo ✅ Components copied
echo.

REM Copy page files
echo 📋 Copying pages...
copy "src\pages\LandingPage.js" "..\reward-game-nextjs\app\page.js" /Y >nul 2>&1
copy "src\pages\LandingPage.css" "..\reward-game-nextjs\app\page.module.css" /Y >nul 2>&1

copy "src\pages\LoginPage.js" "..\reward-game-nextjs\app\login\page.js" /Y >nul 2>&1
copy "src\pages\LoginPage.css" "..\reward-game-nextjs\app\login\page.module.css" /Y >nul 2>&1

copy "src\pages\GamePage.js" "..\reward-game-nextjs\app\game\page.js" /Y >nul 2>&1
copy "src\pages\GamePage.css" "..\reward-game-nextjs\app\game\page.module.css" /Y >nul 2>&1

copy "src\pages\AirdropPage.js" "..\reward-game-nextjs\app\airdrop\page.js" /Y >nul 2>&1
copy "src\pages\AirdropPage.css" "..\reward-game-nextjs\app\airdrop\page.module.css" /Y >nul 2>&1

copy "src\pages\ReferralPage.js" "..\reward-game-nextjs\app\referral\page.js" /Y >nul 2>&1
copy "src\pages\ReferralPage.css" "..\reward-game-nextjs\app\referral\page.module.css" /Y >nul 2>&1

copy "src\pages\BenefitPage.js" "..\reward-game-nextjs\app\benefit\page.js" /Y >nul 2>&1
copy "src\pages\BenefitPage.css" "..\reward-game-nextjs\app\benefit\page.module.css" /Y >nul 2>&1

copy "src\pages\LeaderboardPage.js" "..\reward-game-nextjs\app\leaderboard\page.js" /Y >nul 2>&1
copy "src\pages\LeaderboardPage.css" "..\reward-game-nextjs\app\leaderboard\page.module.css" /Y >nul 2>&1

echo ✅ Pages copied
echo.

echo 🎉 Files copied successfully!
echo.
echo ⚠️  IMPORTANT: You still need to:
echo 1. Add 'use client' directive to interactive components
echo 2. Replace React Router with Next.js navigation
echo 3. Update import statements
echo 4. Test the application
echo.
echo 📖 See NEXTJS-MIGRATION.md for detailed instructions
echo.
pause
