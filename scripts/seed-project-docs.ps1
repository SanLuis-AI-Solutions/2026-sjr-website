# Project doc seeding for new repos (safe: only fills missing files)
param(
  [string]$Target = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$docsDir = Join-Path $Target "Docs"
New-Item -ItemType Directory -Force -Path $docsDir | Out-Null

$restartPath = Join-Path $docsDir "RESTART.md"
$handoffPath = Join-Path $docsDir "HANDOFF.md"
$operatingPath = Join-Path $docsDir "OPERATING_MODEL.md"
$operatingRootPath = Join-Path $Target "OPERATING_MODEL.md"
$readmePath = Join-Path $Target "README.md"

$restartTemplate = @"
# Restart / System Recovery Checklist

## Commands (PowerShell)
\`\`\`powershell
/installall
npm run dev
\`\`\`

## Notes
- MCP config lives at C:\Users\ninef\.codex\config.toml
- MCP master config (aggregator) lives at C:\Users\ninef\.mcp-master-config.json
- Global env overlay (optional): C:\Users\ninef\.codex\env\.env.local
"@

$handoffTemplate = @"
# Handoff Summary

## Status
- Current focus:
- Last completed:

## Key Files
- PRD:
- Plan:
- Decisions:
- Roadmap:

## Next Actions
1.
2.
3.
"@

$operatingTemplate = @"
# Adaptive Operating Model (Agents + Skills + Workflows + MCPs)

See the canonical template at:
C:\Users\ninef\.codex\templates\OPERATING_MODEL.md
"@

$readmeTemplate = @"
Project README

## Getting Started
\`\`\`powershell
/installall
npm run dev
\`\`\`

Open http://localhost:3000
"@

if (-not (Test-Path $restartPath)) {
  $restartTemplate | Set-Content $restartPath
}

if (-not (Test-Path $handoffPath)) {
  $handoffTemplate | Set-Content $handoffPath
}

if (-not (Test-Path $operatingPath) -or -not (Test-Path $operatingRootPath)) {
  $globalTemplate = Join-Path $env:USERPROFILE ".codex\templates\OPERATING_MODEL.md"
  $sourceTemplate = $operatingTemplate
  if (Test-Path $globalTemplate) {
    $sourceTemplate = Get-Content $globalTemplate -Raw
  }

  if (-not (Test-Path $operatingPath)) {
    $sourceTemplate | Set-Content $operatingPath
  }

  if (-not (Test-Path $operatingRootPath)) {
    $sourceTemplate | Set-Content $operatingRootPath
  }
}

if (-not (Test-Path $readmePath)) {
  $readmeTemplate | Set-Content $readmePath
}
