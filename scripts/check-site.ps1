$ErrorActionPreference = 'Stop'

$root = [System.IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$rootPrefix = $root + [System.IO.Path]::DirectorySeparatorChar
$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
$zeldaHomeCardFound = $false

function Add-Error([string]$message) { $errors.Add($message) }
function Add-Warning([string]$message) { $warnings.Add($message) }
function Relative([string]$path) { [System.IO.Path]::GetRelativePath($root, $path) }

function Get-AttributeValue([string]$tag, [string]$name) {
  $escapedName = [regex]::Escape($name)
  $pattern = '(?i)\b' + $escapedName + '\s*=\s*(?:"([^"]*)"|''([^'']*)'')'
  $match = [regex]::Match($tag, $pattern)
  if (-not $match.Success) { return $null }
  if ($match.Groups[1].Success) {
    return [System.Net.WebUtility]::HtmlDecode($match.Groups[1].Value)
  }
  return [System.Net.WebUtility]::HtmlDecode($match.Groups[2].Value)
}

function Resolve-LocalReference([string]$reference, [string]$baseDirectory) {
  if ([string]::IsNullOrWhiteSpace($reference)) { return $null }
  $decoded = [System.Net.WebUtility]::HtmlDecode($reference.Trim())
  if ($decoded -match '^(?i)(?:[a-z][a-z0-9+.-]*:|//|#)') { return $null }

  $pathPart = ($decoded -split '[?#]', 2)[0]
  if ([string]::IsNullOrWhiteSpace($pathPart)) { return $null }
  $pathPart = [uri]::UnescapeDataString($pathPart).Replace('/', [System.IO.Path]::DirectorySeparatorChar)

  if ($pathPart.StartsWith([System.IO.Path]::DirectorySeparatorChar)) {
    $pathPart = $pathPart.TrimStart([System.IO.Path]::DirectorySeparatorChar)
    return [System.IO.Path]::GetFullPath((Join-Path $root $pathPart))
  }
  return [System.IO.Path]::GetFullPath((Join-Path $baseDirectory $pathPart))
}

function Test-LocalReference([string]$reference, [string]$baseDirectory, [string]$context) {
  $target = Resolve-LocalReference $reference $baseDirectory
  if ($null -eq $target) { return }
  if (-not $target.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase) -and
      -not $target.Equals($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    Add-Error "$context 指向專案目錄以外：$reference"
    return
  }
  if (-not (Test-Path -LiteralPath $target)) {
    Add-Error "$context 找不到本機檔案：$reference"
  }
}

$homePath = Join-Path $root 'index.html'
if (-not (Test-Path -LiteralPath $homePath)) { throw '找不到網站入口 index.html。' }
$homeHtml = Get-Content -Raw -LiteralPath $homePath
$homeCards = [System.Collections.Generic.List[object]]::new()
$homeIds = @{}
foreach ($scriptMatch in [regex]::Matches($homeHtml, '(?is)<script\b[^>]*>')) {
  $source = Get-AttributeValue $scriptMatch.Value 'src'
  if ($source) { Test-LocalReference $source $root '主首頁 script' }
}
foreach ($linkMatch in [regex]::Matches($homeHtml, '(?is)<link\b[^>]*>')) {
  $relation = Get-AttributeValue $linkMatch.Value 'rel'
  $href = Get-AttributeValue $linkMatch.Value 'href'
  if (($relation -split '\s+') -contains 'stylesheet' -and $href) {
    Test-LocalReference $href $root '主首頁 stylesheet'
  }
}

foreach ($anchorMatch in [regex]::Matches($homeHtml, '(?is)<a\b[^>]*>')) {
  $tag = $anchorMatch.Value
  $class = Get-AttributeValue $tag 'class'
  if (($class -split '\s+') -notcontains 'article-card') { continue }

  $href = Get-AttributeValue $tag 'href'
  $id = Get-AttributeValue $tag 'data-article-id'
  $level = Get-AttributeValue $tag 'data-level'
  if (-not $href) {
    Add-Error '首頁有一張 article-card 缺少 href。'
    continue
  }
  $homeCards.Add([pscustomobject]@{ Href = $href; Id = $id; Level = $level })
  Test-LocalReference $href $root '首頁卡片連結'

  if ($id) {
    if ($homeIds.ContainsKey($id)) { Add-Error "首頁卡片 ID 重複：$id" }
    $homeIds[$id] = $href
  }
}
if ($homeIds.Count -eq 0) { Add-Error '首頁找不到任何具 data-article-id 的單元卡片。' }

$unitRoots = @('N5', 'N4', 'N3', 'Progressive') | ForEach-Object { Join-Path $root $_ } | Where-Object { Test-Path -LiteralPath $_ }
$unitPages = @($unitRoots | ForEach-Object { Get-ChildItem -LiteralPath $_ -Recurse -Filter 'index.html' -File })
$requiredModules = @('audio', 'karaoke', 'quiz', 'progress', 'ui')
$learningIds = @{}

foreach ($page in $unitPages) {
  $relative = Relative $page.FullName
  $html = Get-Content -Raw -LiteralPath $page.FullName
  $unitDir = $page.DirectoryName

  foreach ($file in @('lesson.css', 'lesson.js')) {
    if (-not (Test-Path -LiteralPath (Join-Path $unitDir $file))) {
      Add-Error "$relative 缺少 $file"
    }
  }

  foreach ($module in $requiredModules) {
    if ($html -notmatch [regex]::Escape("js/$module.js")) {
      Add-Error "$relative 未載入 js/$module.js"
    }
  }

  foreach ($scriptMatch in [regex]::Matches($html, '(?is)<script\b[^>]*>')) {
    $source = Get-AttributeValue $scriptMatch.Value 'src'
    if ($source) { Test-LocalReference $source $unitDir "$relative script" }
  }
  foreach ($linkMatch in [regex]::Matches($html, '(?is)<link\b[^>]*>')) {
    $relation = Get-AttributeValue $linkMatch.Value 'rel'
    $href = Get-AttributeValue $linkMatch.Value 'href'
    if (($relation -split '\s+') -contains 'stylesheet' -and $href) {
      Test-LocalReference $href $unitDir "$relative stylesheet"
    }
  }

  $idMatch = [regex]::Match($html, "toggleArticleLearned\(['""]([^'""]+)['""]\)")
  if (-not $idMatch.Success) {
    Add-Error "$relative 缺少可辨識的學習進度 ID"
  } else {
    $articleId = $idMatch.Groups[1].Value
    if ($learningIds.ContainsKey($articleId)) { Add-Error "單元進度 ID 重複：$articleId" }
    $learningIds[$articleId] = $relative
    if (-not $homeIds.ContainsKey($articleId)) {
      Add-Error "$relative 的進度 ID 不在首頁：$articleId"
    } else {
      $matchingCard = @($homeCards | Where-Object { $_.Id -eq $articleId })[0]
      $cardTarget = Resolve-LocalReference $matchingCard.Href $root
      if ($cardTarget -and -not $cardTarget.Equals($page.FullName, [System.StringComparison]::OrdinalIgnoreCase)) {
        Add-Error "$relative 的首頁卡片連到其他單元：$($matchingCard.Href)"
      }
      $segments = $relative -split '[\\/]'
      $expectedLevel = if ($segments[0] -eq 'Progressive') { 'Story' } else { $segments[0] }
      if ($matchingCard.Level -ne $expectedLevel) {
        Add-Error "$relative 的首頁標籤應為 $expectedLevel，實際為 $($matchingCard.Level)。"
      }
      if ($homeHtml -notmatch [regex]::Escape("data-filter=""$expectedLevel""")) {
        Add-Error "主首頁篩選列缺少 $expectedLevel 選項。"
      }
    }
  }

  $quizCalls = [regex]::Matches($html, "checkQuizQuestion\(['""]([^'""]+)['""]")
  if ($quizCalls.Count -gt 0) {
    $quizIds = @($quizCalls | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique)
    $quizModule = Get-Content -Raw -LiteralPath (Join-Path $root 'js/quiz.js')
    foreach ($quizId in $quizIds) {
      $standardBlock = $html -match ('id="quiz-block-{0}"' -f [regex]::Escape($quizId))
      $standardFeedback = $html -match ('id="quiz-fb-{0}"' -f [regex]::Escape($quizId))
      $legacyAdapter = $html -match 'quiz-opt-btn' -and $quizModule -match 'upgradeLegacyQuizMarkup'
      if (-not (($standardBlock -and $standardFeedback) -or $legacyAdapter)) {
        Add-Error "$relative 的測驗 $quizId 不符合共用測驗契約"
      }
    }
  } elseif ($html -notmatch 'submitStoryQuiz|data-quiz-option|quiz-opt-btn') {
    Add-Warning "$relative 沒找到共用或自訂測驗入口，請確認是否為刻意省略。"
  }
}

$zeldaRoot = Join-Path $root 'Zelda40'
$zeldaDataPath = Join-Path $zeldaRoot 'unit-data.js'
$zeldaSeriesPath = Join-Path $zeldaRoot 'series.js'
$zeldaIndexPath = Join-Path $zeldaRoot 'index.html'
$zeldaUnitCount = 0

if (Test-Path -LiteralPath $zeldaRoot) {
  foreach ($requiredFile in @('unit-data.js', 'series.js', 'index.html')) {
    if (-not (Test-Path -LiteralPath (Join-Path $zeldaRoot $requiredFile))) {
      Add-Error "Zelda40 缺少 $requiredFile"
    }
  }

  if (Test-Path -LiteralPath $zeldaIndexPath) {
    $seriesIndexHtml = Get-Content -Raw -LiteralPath $zeldaIndexPath
    foreach ($requiredSource in @('unit-data.js', 'series.js')) {
      if ($seriesIndexHtml -notmatch [regex]::Escape("src=""$requiredSource""")) {
        Add-Error "Zelda40/index.html 未載入 $requiredSource"
      }
      Test-LocalReference $requiredSource $zeldaRoot 'Zelda40 系列入口'
    }
    foreach ($scriptMatch in [regex]::Matches($seriesIndexHtml, '(?is)<script\b[^>]*>')) {
      $source = Get-AttributeValue $scriptMatch.Value 'src'
      if ($source) { Test-LocalReference $source $zeldaRoot 'Zelda40 系列入口 script' }
    }
    foreach ($linkMatch in [regex]::Matches($seriesIndexHtml, '(?is)<link\b[^>]*>')) {
      $relation = Get-AttributeValue $linkMatch.Value 'rel'
      $href = Get-AttributeValue $linkMatch.Value 'href'
      if (($relation -split '\s+') -contains 'stylesheet' -and $href) {
        Test-LocalReference $href $zeldaRoot 'Zelda40 系列入口 stylesheet'
      }
    }
  }

  if (Test-Path -LiteralPath $zeldaSeriesPath) {
    $seriesHtml = Get-Content -Raw -LiteralPath $zeldaSeriesPath
    foreach ($requiredMarker in @('data-article-id', 'data-level', 'getLearnedArticles')) {
      if ($seriesHtml -notmatch [regex]::Escape($requiredMarker)) {
        Add-Error "Zelda40/series.js 缺少系列整合欄位：$requiredMarker"
      }
    }
  }

  if (Test-Path -LiteralPath $zeldaDataPath) {
    $dataHtml = Get-Content -Raw -LiteralPath $zeldaDataPath
    $entryPattern = '(?s)\{\s*id:\s*"([^"]+)"\s*,\s*no:\s*"([^"]+)"\s*,\s*level:\s*"([^"]+)"\s*,(.*?)(?=\r?\n\s*\},\s*\r?\n\s*\{\s*id:|\r?\n\s*\}\s*\r?\n\];)'
    $entries = [regex]::Matches($dataHtml, $entryPattern)
    $unitIds = @{}
    $unitNumbers = @{}
    $lastEndSeconds = -1

    if ($entries.Count -eq 0) { Add-Error 'Zelda40/unit-data.js 找不到可辨識的單元資料。' }

    foreach ($entry in $entries) {
      $id = $entry.Groups[1].Value
      $number = $entry.Groups[2].Value
      $level = $entry.Groups[3].Value
      $body = $entry.Groups[4].Value
      $zeldaUnitCount += 1

      if ($unitIds.ContainsKey($id)) { Add-Error "Zelda40 單元 ID 重複：$id" }
      if ($unitNumbers.ContainsKey($number)) { Add-Error "Zelda40 單元編號重複：$number" }
      $unitIds[$id] = $number
      $unitNumbers[$number] = $id

      foreach ($field in @('subtitleRange', 'fileRange', 'start', 'end', 'startSeconds', 'endSeconds', 'sentences', 'quiz')) {
        if ($body -notmatch ('(?s)\b{0}\s*:' -f [regex]::Escape($field))) {
          Add-Error "Zelda40 單元 $id 缺少欄位 $field"
        }
      }

      $startMatch = [regex]::Match($body, '\bstartSeconds:\s*(\d+)')
      $endMatch = [regex]::Match($body, '\bendSeconds:\s*(\d+)')
      if ($startMatch.Success -and $endMatch.Success) {
        $startSeconds = [int]::Parse($startMatch.Groups[1].Value, [Globalization.CultureInfo]::InvariantCulture)
        $endSeconds = [int]::Parse($endMatch.Groups[1].Value, [Globalization.CultureInfo]::InvariantCulture)
        if ($startSeconds -ge $endSeconds) { Add-Error "Zelda40 單元 $id 的影片時間範圍無效。" }
        if ($startSeconds -lt $lastEndSeconds) { Add-Error "Zelda40 單元 $id 的時間順序倒置或與前一篇重疊。" }
        $lastEndSeconds = $endSeconds
      }

      $unitDir = Join-Path $zeldaRoot $number
      $pagePath = Join-Path $unitDir 'index.html'
      $lessonPath = Join-Path $unitDir 'lesson.js'
      if (-not (Test-Path -LiteralPath $pagePath)) {
        Add-Error "Zelda40 單元 $id 缺少 $number/index.html"
        continue
      }
      if (-not (Test-Path -LiteralPath (Join-Path $unitDir 'lesson.css'))) {
        Add-Error "Zelda40 單元 $id 缺少 $number/lesson.css"
      }
      if (-not (Test-Path -LiteralPath $lessonPath)) {
        Add-Error "Zelda40 單元 $id 缺少 $number/lesson.js"
      }

      $pageHtml = Get-Content -Raw -LiteralPath $pagePath
      foreach ($module in $requiredModules) {
        if ($pageHtml -notmatch [regex]::Escape("js/$module.js")) {
          Add-Error "Zelda40/$number/index.html 未載入 js/$module.js"
        }
      }
      foreach ($scriptMatch in [regex]::Matches($pageHtml, '(?is)<script\b[^>]*>')) {
        $source = Get-AttributeValue $scriptMatch.Value 'src'
        if ($source) { Test-LocalReference $source $unitDir "Zelda40/$number script" }
      }
      foreach ($linkMatch in [regex]::Matches($pageHtml, '(?is)<link\b[^>]*>')) {
        $relation = Get-AttributeValue $linkMatch.Value 'rel'
        $href = Get-AttributeValue $linkMatch.Value 'href'
        if (($relation -split '\s+') -contains 'stylesheet' -and $href) {
          Test-LocalReference $href $unitDir "Zelda40/$number stylesheet"
        }
      }

      if (Test-Path -LiteralPath $lessonPath) {
        $lessonHtml = Get-Content -Raw -LiteralPath $lessonPath
        $lessonId = [regex]::Match($lessonHtml, 'ZELDA40_UNIT_ID\s*=\s*"([^"]+)"')
        if (-not $lessonId.Success -or $lessonId.Groups[1].Value -ne $id) {
          Add-Error "Zelda40/$number/lesson.js 的單元 ID 與 unit-data.js 不一致：$id"
        }
      }
      if ($learningIds.ContainsKey($id)) { Add-Error "Zelda40 單元 ID 與其他教材重複：$id" }
      $learningIds[$id] = "Zelda40/$number"

      if ($level -notmatch '^N[1-5]$') { Add-Warning "Zelda40 單元 $id 使用非預期級數標籤：$level" }
    }

    $numberedDirectories = @(Get-ChildItem -LiteralPath $zeldaRoot -Directory | Where-Object { $_.Name -match '^\d+$' })
    foreach ($directory in $numberedDirectories) {
      if (-not $unitNumbers.ContainsKey($directory.Name)) {
        Add-Error "Zelda40/$($directory.Name) 有單元資料夾，但 unit-data.js 沒有對應項目。"
      }
    }
    foreach ($number in $unitNumbers.Keys) {
      if (-not (Test-Path -LiteralPath (Join-Path $zeldaRoot $number))) {
        Add-Error "Zelda40 單元 $($unitNumbers[$number]) 缺少編號資料夾 $number。"
      }
    }
    if ($numberedDirectories.Count -ne $entries.Count) {
      Add-Error "Zelda40 資料筆數 $($entries.Count) 與編號資料夾數 $($numberedDirectories.Count) 不一致。"
    }

    foreach ($card in $homeCards) {
      $target = Resolve-LocalReference $card.Href $root
      if ($target -and $target.Equals($zeldaIndexPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        $zeldaHomeCardFound = $true
      }
    }
    if (-not $zeldaHomeCardFound) {
      Add-Error '主首頁找不到連到 Zelda40/index.html 的系列入口卡片。'
    }
  }
}

foreach ($id in $homeIds.Keys) {
  if (-not $learningIds.ContainsKey($id)) { Add-Error "首頁卡片 $id 沒有對應單元進度 ID" }
}

Write-Host "檢查單元：$($unitPages.Count) 篇一般教材；Zelda40：$zeldaUnitCount 篇；首頁卡片：$($homeCards.Count) 張"
foreach ($warning in $warnings) { Write-Host "警告：$warning" -ForegroundColor Yellow }
foreach ($error in $errors) { Write-Host "錯誤：$error" -ForegroundColor Red }

if ($errors.Count -gt 0) {
  Write-Host "檢查失敗：$($errors.Count) 項錯誤" -ForegroundColor Red
  exit 1
}

Write-Host '結構檢查通過：入口、相對路徑、共用模組、學習 ID 與 Zelda40 系列資料皆符合檢查規則。' -ForegroundColor Green
