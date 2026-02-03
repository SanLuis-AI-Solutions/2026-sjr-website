# Project bootstrap: ensure env + MCP readiness hints
# - Creates .env.local from .env.example if missing
# - Optionally overlays a global env file (user-managed)
# - Prints warnings for missing critical files

$ErrorActionPreference = "Stop"

$projectRoot = Get-Location
$envExample = Join-Path $projectRoot ".env.example"
$envLocal = Join-Path $projectRoot ".env.local"
$globalEnv = Join-Path $env:USERPROFILE ".codex\env\.env.local"
$packageJson = Join-Path $projectRoot "package.json"
$nodeModules = Join-Path $projectRoot "node_modules"
$missing = @()

if (Test-Path $envExample) {
  if (-not (Test-Path $envLocal)) {
    Copy-Item $envExample $envLocal
    Write-Host "Created .env.local from .env.example"
  } else {
    Write-Host ".env.local already exists"
  }
} else {
  Write-Warning "Missing .env.example"
}

if (Test-Path $globalEnv) {
  # Overlay global env values onto project .env.local
  $globalLines = Get-Content $globalEnv
  if (-not (Test-Path $envLocal)) {
    $globalLines | Set-Content $envLocal
    Write-Host "Created .env.local from global env"
  } else {
    $localLines = Get-Content $envLocal
    $merged = @()

    # Preserve local order, overwrite with global values by key
    $globalMap = @{}
    foreach ($line in $globalLines) {
      if ($line -match '^[A-Za-z_][A-Za-z0-9_]*=') {
        $parts = $line.Split('=',2)
        $globalMap[$parts[0]] = $line
      }
    }

    foreach ($line in $localLines) {
      if ($line -match '^[A-Za-z_][A-Za-z0-9_]*=') {
        $key = $line.Split('=',2)[0]
        if ($globalMap.ContainsKey($key)) {
          $merged += $globalMap[$key]
          $globalMap.Remove($key) | Out-Null
        } else {
          $merged += $line
        }
      } else {
        $merged += $line
      }
    }

    # Append remaining global keys
    foreach ($kv in $globalMap.GetEnumerator()) {
      $merged += $kv.Value
    }

    $merged | Set-Content $envLocal
    Write-Host "Overlayed global env into .env.local"
  }
} else {
  Write-Host "Global env not found (optional): $globalEnv"
}

$masterConfig = Join-Path $env:USERPROFILE ".mcp-master-config.json"
if (-not (Test-Path $masterConfig)) {
  Write-Warning "Missing MCP master config: $masterConfig"
}

if (Test-Path $packageJson) {
  if (-not (Test-Path $nodeModules)) {
    Write-Host "Installing npm dependencies..."
    try {
      npm install
    } catch {
      Write-Warning "npm install failed. Please run manually."
    }
  } else {
    Write-Host "node_modules already present"
  }
}

if ((Test-Path $envExample) -and (Test-Path $envLocal)) {
  $requiredKeys = @()
  foreach ($line in Get-Content $envExample) {
    if ($line -match '^[A-Za-z_][A-Za-z0-9_]*=') {
      $requiredKeys += $line.Split('=', 2)[0]
    }
  }

  $localMap = @{}
  foreach ($line in Get-Content $envLocal) {
    if ($line -match '^[A-Za-z_][A-Za-z0-9_]*=') {
      $parts = $line.Split('=', 2)
      $localMap[$parts[0]] = $parts[1]
    }
  }

  foreach ($key in $requiredKeys) {
    if (-not $localMap.ContainsKey($key)) {
      $missing += $key
    } elseif ($localMap[$key].Trim().Trim('\"') -eq '') {
      $missing += $key
    }
  }

  if ($missing.Count -gt 0) {
    Write-Warning ("Missing or empty env keys in .env.local: " + ($missing -join ", "))
  }
}

$summary = [ordered]@{
  "ProjectRoot"       = $projectRoot
  "EnvExample"        = (Test-Path $envExample)
  "EnvLocal"          = (Test-Path $envLocal)
  "GlobalEnv"         = (Test-Path $globalEnv)
  "MasterMcpConfig"   = (Test-Path $masterConfig)
  "NodeModules"       = (Test-Path $nodeModules)
  "MissingEnvKeys"    = if ($missing.Count -gt 0) { $missing -join ", " } else { "none" }
}

Write-Host ""
Write-Host "Bootstrap summary:"
foreach ($item in $summary.GetEnumerator()) {
  Write-Host ("- {0}: {1}" -f $item.Key, $item.Value)
}
