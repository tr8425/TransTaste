# TransTaste 개발 서버 실행
# 사용법: .\run-dev.ps1

$envFile = Join-Path $PSScriptRoot ".env.local"
if (-Not (Test-Path $envFile)) {
    Write-Host "`.env.local` 파일이 없습니다. 프로젝트 루트에 생성해주세요." -ForegroundColor Red
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.+)$") {
        [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), "Process")
    }
}

Write-Host "TransTaste dev server starting..." -ForegroundColor Cyan
Write-Host "http://localhost:3000" -ForegroundColor Green
npm run dev
