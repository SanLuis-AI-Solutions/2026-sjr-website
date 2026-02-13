# Audit Supabase-hosted site assets referenced in the repo.
# Fails if any referenced Supabase public asset returns non-200.
param(
  [string]$ProjectRoot = (Get-Location).Path,
  [int]$TimeoutSec = 12
)

$ErrorActionPreference = 'Stop'

$root = (Resolve-Path $ProjectRoot).Path
Set-Location $root

$supabaseHost = 'lrzrltjlfvvrdvxqqklm.supabase.co'

function Get-RepoTextFiles([string]$dir) {
  # Keep it cheap: only scan src/ and public-facing docs where URLs live.
  $targets = @(
    (Join-Path $dir 'src'),
    (Join-Path $dir 'scripts'),
    (Join-Path $dir 'Docs')
  )

  $files = @()
  foreach ($t in $targets) {
    if (-not (Test-Path $t)) { continue }
    $files += Get-ChildItem -Path $t -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Extension -in @('.ts', '.tsx', '.md', '.json', '.ps1') }
  }
  return $files | Select-Object -ExpandProperty FullName -Unique
}

function Extract-SupabaseUrls([string[]]$paths, [string]$hostname) {
  $urls = New-Object System.Collections.Generic.HashSet[string]
  # PowerShell escaping is easiest with single-quoted strings. Double single-quotes represent a literal '.
  $patternText = 'https://' + [regex]::Escape($hostname) + '/storage/v1/object/public/[^\s"''\)<>]+'
  $pattern = [regex]$patternText

  foreach ($p in $paths) {
    $raw = Get-Content -LiteralPath $p -Raw -ErrorAction SilentlyContinue
    if (-not $raw) { continue }
    foreach ($m in $pattern.Matches($raw)) {
      $urls.Add($m.Value) | Out-Null
    }
  }
  return $urls
}

function Head-Url([string]$url, [int]$timeoutSec) {
  try {
    $r = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec $timeoutSec -UseBasicParsing
    return [int]$r.StatusCode
  } catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      return [int]$_.Exception.Response.StatusCode.value__
    }
    return -1
  }
}

Write-Host "== Image Audit =="
Write-Host "Host: $supabaseHost"

$files = Get-RepoTextFiles $root
$urls = Extract-SupabaseUrls $files $supabaseHost

if ($urls.Count -eq 0) {
  Write-Host "No Supabase public asset URLs found. SKIP"
  exit 0
}

$bad = @()
$ok = 0
$total = $urls.Count

foreach ($u in ($urls | Sort-Object)) {
  $code = Head-Url $u $TimeoutSec
  if ($code -ne 200) {
    $bad += [pscustomobject]@{ url = $u; status = $code }
    Write-Host ("FAIL {0} {1}" -f $code, $u)
  } else {
    $ok++
  }
}

Write-Host ""
Write-Host ("OK: {0}/{1}" -f $ok, $total)

if ($bad.Count -gt 0) {
  Write-Host ""
  Write-Host "Broken URLs:"
  foreach ($b in $bad) { Write-Host ("- {0} {1}" -f $b.status, $b.url) }
  exit 1
}

exit 0
