# 一般教材的互動驗收

新增／修改一般短文時閱讀本文件。先看同類完成頁與共用模組，確認頁面使用的 DOM、資料和樣式介面；不要只確認 script 有載入。

## 共用介面容易漏掉的條件

- `js/audio.js` 以 `.speed-control .speed-btn` 同步全站語速、選取狀態與 `data-rate`。語速按鈕須放在 `.speed-control`，不可只加 `.speed-btn` 或寫死 active。驗證點選、重載及首頁自訂語速後都一致。
- 全文播放、例句、測驗鼓勵語音共用瀏覽器的 speech queue。單句接管時要透過共用 `speakJapanese` 協調播放器狀態，不可只 cancel 聲音而留下播放中 UI。驗證播放、暫停、繼續、停止、播完重播與播放途中點例句。
- 播放器會加 `.karaoke-line.active`、`.done` 與 `.karaoke-progress-container.visible`；頁面須沿用有定義這些狀態的 lesson CSS。只看到 class 改變並不表示使用者看得到高亮或進度。
- 資料型頁面若提供 `LESSON_DATA`，在載入 lesson.js 時立即設定 `window.LESSON_DATA = LESSON_DATA`，讓 `lesson-renderer.js` 的 legacy 自動轉換辨識到它。頂層 `const LESSON_DATA` 不等於 window 屬性。每個朗讀按鈕只綁定一次，實測一次點擊只送出一個 utterance。
- 沿用同類頁的逐句解析：日文 Ruby、羅馬字、中文與逐句發音須與同一份本文資料對應。保留 `jp` 純文字供 TTS，`display` 才放 ruby；不要以含 rt 讀音的 textContent 作為朗讀文字。
- `.audio-btn` 是圖示按鈕；補上 aria-label，避免把「例句朗讀」等長文字擠進固定寬度的圓形按鈕。若要文字按鈕，使用適合文字的樣式。
- 單字、動詞、助詞、文法教室的每個 `.example-jp` 都要有可操作的朗讀按鈕，且實際送進 `speakJapanese()` 的文字需等於日文例句。資料型 `.doc-lesson` 可由 `LessonRenderer.bindSpeechButtons()` 補按鈕，但仍要確認四個教學區都涵蓋、沒有重複綁定。
- 動詞活用表若沿用文章 1 的按鈕介面，點擊後確認 `.conjugation-table-wrapper` 加上可見狀態且表格高度大於零。若採用原生 `<details>`，不要讓全站 `.conjugation-table-wrapper { display:none }` 隱藏整個 details；需驗證摘要可見、點開後表格可見。
- 比照 `N5/文章1` 檢查朗讀控制：桌機 `.short-text-controls-row` 為水平排列；手機語速控制移到播放列上方，但「全篇朗讀」和「停止」維持同一列且都在容器內。避免 `flex: 1 1 auto` 將按鈕拉寬到造成換行或跑版。
- 測驗置於 `.lesson-quiz-container`，讓共用 CSS 正確重設題號計數。每題使用 `.quiz-question-block`、唯一的 feedback ID、合理的選項與答案索引，完成後顯示百分制總分。
- 首頁完成狀態使用 `.article-card.completed`；單元的完成按鈕使用 `.is-learned`。測試依實際介面確認，不把測試選錯 class 當成產品缺陷。

## 驗證範圍

1. 檢查本次新增的頁面元素、區塊與互動，都能對應使用者明確要求、Skill 必備規範或指定範本；沒有依據的功能（例如未要求的單元導覽列）應移除。
2. 執行 `pwsh -NoProfile -File scripts/check-site.ps1`；用 PowerShell 7 讀取 UTF-8 腳本，避免 Windows PowerShell 5 的編碼誤判。
3. 對本次所有教材頁，在瀏覽器確認本機資源載入、console／pageerror、錨點、語速及重新載入、翻譯開關、逐句與全文朗讀、單字／動詞／助詞／文法例句朗讀、活用表、測驗各選項回饋及總分、完成狀態與首頁篩選。快速切換或停止後重播也要維持最後一次操作的狀態。
4. 至少看桌機與手機的實際截圖；建議寬度 1366、390，另以 320 檢查窄螢幕。除了水平溢出，也看「全篇朗讀／停止」是否同列、控制按鈕是否擠成直排或被拉伸、例句喇叭是否擠壓文字、ruby 是否重疊、長翻譯是否裁切、題號是否依序遞增、播放狀態是否可見。
5. 修改共用 JS／CSS 時，加驗一篇既有一般教材與受影響的其他模式；不需要重寫所有舊頁。
6. 核對內容：精簡後的故事轉折、核心文法、日中對照、假名／羅馬字、動詞分類與活用，以及每題正解。自動檢查只能驗證對應關係，不能取代日文內容校對。

## 可重跑的現有工具

- `scripts/test-doc-lessons.cjs`：文章 29–33 的瀏覽器回歸測試，自建 localhost server，涵蓋語速、翻譯、朗讀狀態、測驗、進度與不同螢幕寬度；另抽查既有教材的共用朗讀。此測試限定這五篇與其已知答案，不代表所有新教材的通用驗收。
- 使用環境已有的 Playwright，可先透過 workspace dependencies 工具定位，再以 `NODE_PATH` 指向其 node_modules。預設使用已安裝 Chrome，可用 `LESSON_QA_CHANNEL=msedge` 切換 Edge；`LESSON_QA_OUTPUT` 指定截圖與 results.json 的輸出位置。
- 語音測試以可控的 speechSynthesis 替身驗證 utterance 文字、語速、順序與播放器狀態；它不證明真實音色、發音品質或裝置的語音服務。交付時區分模擬流程測試、原生 API 檢查與實際聆聽，不誇大驗證範圍。

發現 bug 時，先讓一個操作檢查能在舊版失敗，再修正並重跑同一檢查。截圖檢查與內容校對的結果另外記錄，不用結構檢查的綠燈取代。
