# PowerShell script to create clean Crypto Earning project
# Run this from reward-game-dashboard folder

$source = "."
$dest = "crypto-earning"

Write-Host "Creating clean Crypto Earning project..." -ForegroundColor Green

# Create directory structure
$dirs = @(
    "$dest/src/components",
    "$dest/src/games",
    "$dest/src/pages",
    "$dest/src/utils",
    "$dest/src/db",
    "$dest/src/assets",
    "$dest/public"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# Copy source files
Write-Host "Copying source files..." -ForegroundColor Yellow

# Components
Copy-Item "$source/src/components/*" "$dest/src/components/" -Recurse -Force

# Games
Copy-Item "$source/src/games/*" "$dest/src/games/" -Recurse -Force

# Pages
Copy-Item "$source/src/pages/*" "$dest/src/pages/" -Recurse -Force

# Utils
Copy-Item "$source/src/utils/*" "$dest/src/utils/" -Recurse -Force

# Database (only Supabase)
Copy-Item "$source/src/db/supabase.js" "$dest/src/db/" -Force
Copy-Item "$source/src/db/supabase-schema.sql" "$dest/src/db/" -Force

# Root src files
Copy-Item "$source/src/App.js" "$dest/src/" -Force
Copy-Item "$source/src/App.css" "$dest/src/" -Force
Copy-Item "$source/src/index.js" "$dest/src/" -Force
Copy-Item "$source/src/index.css" "$dest/src/" -Force

# Public
Copy-Item "$source/public/index.html" "$dest/public/" -Force

# Config files
Copy-Item "$source/package.json" "$dest/" -Force
Copy-Item "$source/.gitignore" "$dest/" -Force
Copy-Item "$source/webpack.config.js" "$dest/" -Force
Copy-Item "$source/.babelrc" "$dest/" -Force
Copy-Item "$source/.env.example" "$dest/" -Force
Copy-Item "$source/.env.production" "$dest/" -Force

# Copy SQL setup file
Copy-Item "$source/SUPABASE-ONE-CLICK-SETUP.sql" "$dest/" -Force

Write-Host "Files copied successfully!" -ForegroundColor Green
Write-Host "Project created at: $dest" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd crypto-earning"
Write-Host "2. Update branding (run update-branding.ps1)"
Write-Host "3. npm install"
Write-Host "4. Create .env.local with your Supabase credentials"
Write-Host "5. git init && git add . && git commit -m 'Initial commit'"
