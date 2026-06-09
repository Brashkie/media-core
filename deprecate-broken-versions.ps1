# ═══════════════════════════════════════════════════════════════════════════
# Deprecate broken versions of @brashkie/media-core
#
# Run this once after publishing 0.1.4 to mark older versions as broken.
# Requires being logged in to npm: `npm whoami` should print your username.
# ═══════════════════════════════════════════════════════════════════════════

Write-Host "🔍 Verificando login a npm..." -ForegroundColor Cyan
npm whoami
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ No logueado en npm. Corre 'npm login' primero." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "🗑️  Deprecando versiones rotas de @brashkie/media-core..." -ForegroundColor Yellow

$brokenVersions = @("0.1.0", "0.1.1", "0.1.2", "0.1.3")
$message = "Broken — upgrade to @brashkie/media-core@^0.1.4 (this version has missing/incorrect .d.cts types and broken native loader)"

foreach ($v in $brokenVersions) {
  Write-Host "  → @brashkie/media-core@$v" -ForegroundColor Gray
  npm deprecate "@brashkie/media-core@$v" $message
}

Write-Host ""
Write-Host "🗑️  Deprecando sub-packages por plataforma..." -ForegroundColor Yellow

$platforms = @(
  "win32-x64-msvc",
  "win32-arm64-msvc",
  "darwin-x64",
  "darwin-arm64",
  "linux-x64-gnu",
  "linux-x64-musl",
  "linux-arm64-gnu"
)

foreach ($v in $brokenVersions) {
  foreach ($p in $platforms) {
    $pkg = "@brashkie/media-core-$p@$v"
    Write-Host "  → $pkg" -ForegroundColor Gray
    npm deprecate $pkg $message 2>$null
  }
}

Write-Host ""
Write-Host "✅ Done. Verifica con:" -ForegroundColor Green
Write-Host "   npm view @brashkie/media-core versions"
Write-Host "   npm view '@brashkie/media-core@0.1.2' deprecated"