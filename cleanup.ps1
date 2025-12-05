# Cleanup Script - Remove Old Files
# This script removes duplicate files after restructuring

Write-Host "Cleaning up old files..." -ForegroundColor Cyan

# Remove old CSS files from root (keeping originals as backup)
$filesToCheck = @(
    ".\style.css",
    ".\scroll-button.css",
    ".\debug-overlay.css"
)

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        $newPath = $file -replace '\.css$', '.old.css'
        Move-Item -Path $file -Destination $newPath -Force
        Write-Host "Renamed: $file -> $newPath" -ForegroundColor Yellow
    }
}

Write-Host "`nCleanup complete! Old files renamed with .old.css extension" -ForegroundColor Green
Write-Host "You can delete them if everything works correctly." -ForegroundColor Gray
