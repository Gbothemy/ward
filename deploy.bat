@echo off
echo ========================================
echo   Crypto Earning - GitHub Pages Deploy
echo ========================================
echo.

echo Step 1: Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Check errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo Step 2: Deploying to GitHub Pages...
call npm run deploy
if %errorlevel% neq 0 (
    echo Deploy failed! Check errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo   SUCCESS! Your app is deploying...
echo ========================================
echo.
echo Your app will be live at:
echo https://Gbothemy.github.io/ward
echo.
echo It may take 1-2 minutes to go live.
echo.
echo Next steps:
echo 1. Go to https://github.com/Gbothemy/ward/settings/pages
echo 2. Ensure "gh-pages" branch is selected
echo 3. Set up Supabase database (see GITHUB-PAGES-COMPLETE-SETUP.md)
echo.
pause
