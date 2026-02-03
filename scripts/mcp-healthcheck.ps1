$ErrorActionPreference = 'Stop'
$timestamp = Get-Date -Format o
Write-Host "MCP health check - $timestamp"

$config = Join-Path $env:USERPROFILE '.codex\config.toml'
if (-not (Test-Path $config)) {
  Write-Warning "Config not found: $config"
  exit 1
}

Write-Host "Config: $config"
$configText = Get-Content -Raw -Path $config

function Get-McpSection {
  param([string]$Name)
  $escaped = [regex]::Escape($Name)
  $pattern = "(?s)\[mcp_servers\.$escaped\](.*?)(?=\r?\n\[mcp_servers\.|\r?\n\[security\]|\z)"
  if ($configText -match $pattern) { return $Matches[1] }
  $pattern = '(?s)\[mcp_servers\."{0}"\](.*?)(?=\r?\n\[mcp_servers\.|\r?\n\[security\]|\z)' -f $escaped
  if ($configText -match $pattern) { return $Matches[1] }
  return $null
}

function Get-McpEnvSection {
  param([string]$Name)
  $escaped = [regex]::Escape($Name)
  $pattern = "(?s)\[mcp_servers\.$escaped\.env\](.*?)(?=\r?\n\[mcp_servers\.|\r?\n\[security\]|\z)"
  if ($configText -match $pattern) { return $Matches[1] }
  $pattern = '(?s)\[mcp_servers\."{0}"\.env\](.*?)(?=\r?\n\[mcp_servers\.|\r?\n\[security\]|\z)' -f $escaped
  if ($configText -match $pattern) { return $Matches[1] }
  return $null
}

$aggregatedServers = $null
$aggregatorConfigPath = $null
$masterSection = Get-McpSection -Name 'master-aggregator'
if ($masterSection) {
  $envSection = Get-McpEnvSection -Name 'master-aggregator'
  $searchText = if ($envSection) { $envSection } else { $masterSection }
  if ($searchText -match 'MCP_CONFIG\s*=\s*''([^'']+)''') {
    $aggregatorConfigPath = $Matches[1]
  } elseif ($searchText -match 'MCP_CONFIG\s*=\s*"([^"]+)"') {
    $aggregatorConfigPath = $Matches[1]
  }
  if ($aggregatorConfigPath) {
    $resolved = $aggregatorConfigPath -replace '^~', $env:USERPROFILE
    if (Test-Path $resolved) {
      try {
        $aggregatedServers = (Get-Content -Raw -Path $resolved | ConvertFrom-Json).mcpServers
      } catch {
        Write-Warning "Unable to parse aggregator config: $resolved"
      }
    } else {
      Write-Warning "Aggregator config not found: $resolved"
    }
  }
  if (-not $aggregatedServers) {
    $defaultPath = Join-Path $env:USERPROFILE '.mcp-master-config.json'
    if (Test-Path $defaultPath) {
      try {
        $aggregatedServers = (Get-Content -Raw -Path $defaultPath | ConvertFrom-Json).mcpServers
      } catch {
        Write-Warning "Unable to parse aggregator config: $defaultPath"
      }
    }
  }
  if (-not $aggregatedServers) {
    if ($masterSection -match "-v'\\s*,\\s*'([^']+)'") {
      $volume = $Matches[1]
      $lastColon = $volume.LastIndexOf(':')
      if ($lastColon -gt 0) {
        $hostPath = $volume.Substring(0, $lastColon)
        if (Test-Path $hostPath) {
          try {
            $aggregatedServers = (Get-Content -Raw -Path $hostPath | ConvertFrom-Json).mcpServers
          } catch {
            Write-Warning "Unable to parse aggregator config: $hostPath"
          }
        } else {
          Write-Warning "Aggregator config not found: $hostPath"
        }
      }
    }
  }
}

function Get-AggregatedServer {
  param([string]$Name)
  if (-not $aggregatedServers) { return $null }
  $prop = $aggregatedServers.PSObject.Properties[$Name]
  if ($prop) { return $prop.Value }
  return $null
}

function Get-AggregatedEnv {
  param([string]$Name)
  $server = Get-AggregatedServer -Name $Name
  if ($server -and $server.env) { return $server.env }
  return $null
}

$criticalServers = @(
  'google-workspace',
  'chrome_devtools',
  'MCP_DOCKER',
  'google_maps',
  'supabase-mcp-server',
  'github',
  'vercel',
  'context7',
  'sequential-thinking',
  'stitch'
)

$envRequirements = @{
  'google_maps' = @('GOOGLE_MAPS_API_KEY')
  'github' = @('GITHUB_PERSONAL_ACCESS_TOKEN')
  'github-mcp-server' = @('GITHUB_PERSONAL_ACCESS_TOKEN')
  'vercel' = @('VERCEL_OIDC_TOKEN')
  'supabase-mcp-server' = @('access-token')
  'google-workspace' = @('GOOGLE_OAUTH_CREDENTIALS')
  'stitch' = @('GOOGLE_CLOUD_PROJECT','GOOGLE_APPLICATION_CREDENTIALS')
}

Write-Host "Critical MCPs:"
foreach ($name in $criticalServers) {
  if ($aggregatedServers) {
    $server = Get-AggregatedServer -Name $name
    if (-not $server) {
      Write-Warning ("- {0}: missing from aggregator config" -f $name)
      continue
    }
    if ($server.enabled -eq $false) {
      Write-Warning ("- {0}: disabled" -f $name)
      continue
    }
    Write-Host ("- {0}: configured (aggregated)" -f $name)
  } else {
    $section = Get-McpSection -Name $name
    if (-not $section) {
      Write-Warning ("- {0}: missing from config" -f $name)
      continue
    }
    if ($section -match 'enabled\s*=\s*false') {
      Write-Warning ("- {0}: disabled" -f $name)
      continue
    }
    Write-Host ("- {0}: configured" -f $name)
  }
}

Write-Host "Env checks:"
foreach ($pair in $envRequirements.GetEnumerator()) {
  if ($aggregatedServers) {
    $server = Get-AggregatedServer -Name $pair.Key
    if (-not $server) {
      Write-Warning ("- {0}: missing section" -f $pair.Key)
      continue
    }
    $envSection = Get-AggregatedEnv -Name $pair.Key
    foreach ($key in $pair.Value) {
      $found = $false
      if ($envSection -and $envSection.PSObject.Properties.Name -contains $key) {
        $found = $true
      } elseif ($pair.Key -eq 'supabase-mcp-server' -and $key -eq 'access-token') {
        if ($server.args -and ($server.args -contains '--access-token')) { $found = $true }
      }

      if ($found) {
        Write-Host ("- {0}.{1}: present" -f $pair.Key, $key)
      } else {
        if ($pair.Key -eq 'stitch' -and $key -eq 'GOOGLE_APPLICATION_CREDENTIALS') {
          Write-Host ("- {0}.{1}: not set (ADC ok)" -f $pair.Key, $key)
        } else {
          Write-Warning ("- {0}.{1}: missing" -f $pair.Key, $key)
        }
      }
    }
  } else {
    $section = Get-McpSection -Name $pair.Key
    if (-not $section) {
      Write-Warning ("- {0}: missing section" -f $pair.Key)
      continue
    }
    $envSection = Get-McpEnvSection -Name $pair.Key
    $searchText = if ($envSection) { $envSection } else { $section }
    foreach ($key in $pair.Value) {
      $found = $false
      if ($searchText -match ("{0}\s*=" -f [regex]::Escape($key))) {
        $found = $true
      } elseif ($pair.Key -eq 'stitch' -and $key -eq 'GOOGLE_CLOUD_PROJECT') {
        if ($section -match 'GOOGLE_CLOUD_PROJECT=') { $found = $true }
      } elseif ($pair.Key -eq 'supabase-mcp-server' -and $key -eq 'access-token') {
        if ($section -match '--access-token') { $found = $true }
      }

      if ($found) {
        Write-Host ("- {0}.{1}: present" -f $pair.Key, $key)
      } else {
        if ($pair.Key -eq 'stitch' -and $key -eq 'GOOGLE_APPLICATION_CREDENTIALS') {
          Write-Host ("- {0}.{1}: not set (ADC ok)" -f $pair.Key, $key)
        } else {
          Write-Warning ("- {0}.{1}: missing" -f $pair.Key, $key)
        }
      }
    }
  }
}

Write-Host "Optional MCPs:"
foreach ($name in @('google_cloud','cloudrun')) {
  $section = Get-McpSection -Name $name
  if ($section) {
    if ($section -match 'enabled\s*=\s*false') {
      $enabled = 'disabled'
    } else {
      $enabled = 'enabled'
    }
    Write-Host ("- {0}: {1}" -f $name, $enabled)
  } else {
    Write-Host ("- {0}: not configured" -f $name)
  }
}

if (Get-Command docker -ErrorAction SilentlyContinue) {
  Write-Host "Docker MCP servers:"
  docker mcp server ls
} else {
  Write-Warning 'Docker is not installed or not on PATH.'
}
