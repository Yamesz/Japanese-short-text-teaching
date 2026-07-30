$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

function Add-Error([string]$message) { $errors.Add($message) }
function Relative([string]$path) { $path.Replace("$root\", '') }

$homePath = Join-Path $root 'index.html'
$homeHtml = Get-Content -Raw $homePath
$cardMatches = [regex]::Matches($homeHtml, '<a\s+href="([^"]+)"[^>]*class="article-card[^>]*data-article-id="([^"]+)"')
$cardIds = @{}

foreach ($card in $cardMatches) {
  $href = $card.Groups[1].Value
  $id = $card.Groups[2].Value
  if ($cardIds.ContainsKey($id)) { Add-Error "首頁卡片 ID 重複：$id" }
  $cardIds[$id] = $href
  if (-not (Test-Path (Join-Path $root $href))) { Add-Error "首頁卡片連結不存在：$href" }
}

if ($cardIds.Count -eq 0) { Add-Error '首頁找不到任何具 data-article-id 的單元卡片。' }

$unitPages = Get-ChildItem -Path (Join-Path $root 'N5'), (Join-Path $root 'N4'), (Join-Path $root 'N3'), (Join-Path $root 'Progressive') -Recurse -Filter index.html
$requiredModules = 'audio', 'karaoke', 'quiz', 'progress', 'ui'
$quizModule = Get-Content -Raw (Join-Path $root 'js\quiz.js')

foreach ($page in $unitPages) {
  $relative = Relative $page.FullName
  $html = Get-Content -Raw $page.FullName
  $unitDir = $page.DirectoryName

  foreach ($file in 'lesson.css', 'lesson.js') {
    if (-not (Test-Path (Join-Path $unitDir $file))) { Add-Error "$relative 缺少 $file" }
  }
  foreach ($module in $requiredModules) {
    if ($html -notmatch "js/$module\.js") { Add-Error "$relative 未載入 js/$module.js" }
  }

  $idMatch = [regex]::Match($html, "toggleArticleLearned\('([^']+)'")
  if (-not $idMatch.Success) {
    Add-Error "$relative 缺少標記為已學習按鈕或 article ID"
  } elseif (-not $cardIds.ContainsKey($idMatch.Groups[1].Value)) {
    Add-Error "$relative 的 article ID 不在首頁：$($idMatch.Groups[1].Value)"
  }

  $quizCalls = [regex]::Matches($html, "checkQuizQuestion\('([^']+)'")
  if ($quizCalls.Count -gt 0) {
    $quizIds = @($quizCalls | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique)
    foreach ($quizId in $quizIds) {
      $standardBlock = $html -match ('id="quiz-block-{0}"' -f [regex]::Escape($quizId))
      $standardFeedback = $html -match ('id="quiz-fb-{0}"' -f [regex]::Escape($quizId))
      $legacyAdapter = $html -match 'quiz-opt-btn' -and $quizModule -match 'upgradeLegacyQuizMarkup'
      if (-not (($standardBlock -and $standardFeedback) -or $legacyAdapter)) {
        Add-Error "$relative 的測驗 $quizId 不符合共用測驗契約"
      }
    }
  } else {
    $warnings.Add("$relative 沒有使用 checkQuizQuestion；請確認是否為自訂測驗。")
  }
}

$unitIds = @($unitPages | ForEach-Object {
  $text = Get-Content -Raw $_.FullName
  [regex]::Match($text, "toggleArticleLearned\('([^']+)'").Groups[1].Value
} | Where-Object { $_ })
foreach ($id in $cardIds.Keys) {
  if ($unitIds -notcontains $id) { Add-Error "首頁卡片 $id 沒有對應單元進度 ID" }
}

Write-Host "檢查單元：$($unitPages.Count) 篇；首頁卡片：$($cardIds.Count) 張"
foreach ($warning in $warnings) { Write-Host "警告：$warning" -ForegroundColor Yellow }
foreach ($error in $errors) { Write-Host "錯誤：$error" -ForegroundColor Red }

if ($errors.Count -gt 0) {
  Write-Host "檢查失敗：$($errors.Count) 項錯誤" -ForegroundColor Red
  exit 1
}

Write-Host '檢查通過：單元結構、首頁入口、進度 ID、共用模組與測驗契約皆符合規則。' -ForegroundColor Green
