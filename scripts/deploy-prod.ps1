# Deploy to Vercel production in a deterministic way (no reliance on Vercel Git integration).
# Requirements:
# - VERCEL_TOKEN available via $env:VERCEL_TOKEN or present in .env.local as VERCEL_TOKEN=...
# - Repo must be clean and pushed (HEAD == origin/<branch>) to avoid deploying uncommitted work.
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

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "git is required"
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm is required"
}

$dirty = (git status --porcelain)
if ($dirty) {
  throw "Refusing to deploy: working tree is dirty. Commit/stash changes first."
}

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
$head = (git rev-parse HEAD).Trim()
$remoteHead = (git rev-parse ("origin/" + $branch)).Trim()
if ($head -ne $remoteHead) {
  throw "Refusing to deploy: HEAD ($head) != origin/$branch ($remoteHead). Push first."
}

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

Write-Host "Deploying to Vercel production..."

# `--yes` avoids prompts; `--prod` targets production.
$url = (npx vercel deploy --prod --yes --token $token).Trim()
Write-Host ""
Write-Host "Deployed:"
Write-Host "  $url"

