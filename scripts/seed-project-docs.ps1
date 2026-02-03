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

## Selection Rules
1. Clarify scope + risk
2. Pick primary workflow (optional)
3. Pick best agent (if needed)
4. Pick minimal skills
5. Use MCPs only if needed
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

if (-not (Test-Path $operatingPath)) {
  $operatingTemplate | Set-Content $operatingPath
}

if (-not (Test-Path $readmePath)) {
  $readmeTemplate | Set-Content $readmePath
}
