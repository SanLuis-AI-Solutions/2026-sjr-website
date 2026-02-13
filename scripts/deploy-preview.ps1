# Deploy to a Vercel preview URL (useful for quick validation before prod).
# Requirements:
# - VERCEL_TOKEN available via $env:VERCEL_TOKEN or present in .env.local as VERCEL_TOKEN=...
param(
  [string]$ProjectRoot = (Get-Location).Path,
  [switch]$SkipVerify
)

$ErrorActionPreference = 'Stop'

function Get-EnvValueFromDotEnv([string]$path, [string]$key) {
  if (-not (Test-Path $path)) { return $null }
  foreach ($line in (Get-Content $path -ErrorAction SilentlyContinue)) {
    if ($line -match ("^" + [regex]::Escape($key) + "=(.*)$")) {
      $val = $Matches[1].Trim()
      if ($val.StartsWith('"') -and $val.EndsWith('"')) { $val = $val.Trim('"') }
      return $val
    }
  }
  return $null
}

$root = (Resolve-Path $ProjectRoot).Path
Set-Location $root

if (-not $SkipVerify) {
  pwsh -File (Join-Path $root 'scripts/verify.ps1')
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$token = $env:VERCEL_TOKEN
if (-not $token) {
  $token = Get-EnvValueFromDotEnv (Join-Path $root '.env.local') 'VERCEL_TOKEN'
}
if (-not $token) {
  throw "Missing VERCEL_TOKEN (set $env:VERCEL_TOKEN or add VERCEL_TOKEN=... to .env.local)."
}

Write-Host "Deploying to Vercel preview..."
$out = (npx -y vercel@50.15.1 deploy --yes --token $token)
if (-not $out) { throw "Vercel deploy failed (no output)." }
$url = ($out | Select-Object -Last 1).Trim()
Write-Host ""
Write-Host "Deployed:"
Write-Host "  $url"
