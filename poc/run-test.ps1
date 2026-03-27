# TransTaste POC 테스트 실행
# 사용법: .\run-test.ps1 [이미지경로(선택)]

$envFile = Join-Path $PSScriptRoot "..\.env.local"
if (-Not (Test-Path $envFile)) {
    Write-Host "`.env.local` 파일이 없습니다. 프로젝트 루트에 생성해주세요." -ForegroundColor Red
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.+)$") {
        [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), "Process")
    }
}

Push-Location $PSScriptRoot
node test-menu.mjs $args
Pop-Location
