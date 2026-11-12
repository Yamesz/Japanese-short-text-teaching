# 專案網站架構參考

本文件記錄短文教學專案目前採用的路徑與整合慣例。改動前仍需檢查目標目錄的實際檔案。

## 共用入口與模組

- index.html：網站主入口、學習卡片與類型篩選。
- style.css、script.js：全站樣式、入口篩選與進度顯示。
- js/audio.js：日語 TTS 與語速設定。
- js/karaoke.js：逐句朗讀、播放狀態與進度條。
- js/quiz.js：共用測驗行為與舊版標記相容。
- js/progress.js：localStorage 學習進度。
- js/ui.js：共用介面行為。
- js/lesson-renderer.js：逐句內容呈現及舊版頁面相容處理。

一般單元的 script 路徑通常從單元資料夾引用 ../../js/。非共用頁面和系列可能使用自己的 renderer；先讀取入口頁與資料檔再決定。

## 內容類型

### N5、N4、N3 短文

路徑為 N5/文章N、N4/文章N、N3/文章N。每單元通常包含 index.html、lesson.css、lesson.js。首頁卡片以 data-level 標示級數，並以唯一 data-article-id 連結學習進度。

一般頁面通常載入 audio、karaoke、quiz、progress、ui；部分頁面另載入 lesson-renderer。不要把 lesson-renderer 當成所有既有頁面的必要條件，需依同類頁面確認。

### Progressive 階梯故事

路徑為 Progressive/StoryNN。每篇故事可切換多個級數版本，使用 Story 分類和 progressive-* 進度 ID。切換後需確認朗讀句子、解析內容、語速與翻譯顯示都對應目前級數。

### 來源型系列

目前 Zelda40 是影片來源系列：Zelda40/index.html 是系列入口；unit-data.js 保存所有單元資料；series.js 產生系列卡片、篩選及進度；每個編號資料夾保存單元入口；unit-page.js 負責呈現共用單元頁面。

主入口以 Series 作為整個系列的分類；系列內單元則各自帶有 N 級和唯一進度 ID。新來源系列請使用 japanese-source-series-generator，避免把系列專屬邏輯直接加入 Zelda40 命名的檔案。

## 整合與驗收重點

- 首頁卡片連到存在的入口頁，data-level 與篩選值一致。
- 單元進度 ID 不重複，頁面與入口資料使用同一 ID。
- script、stylesheet、圖片等本機路徑要按頁面實際深度解析。
- 新增一般 N 級或 Progressive 單元時，scripts/check-site.ps1 會檢查其檔案、共用模組、入口與進度 ID。
- 新增 Zelda40 單元時，也要更新 unit-data.js、對應編號頁面及該單元的 lesson.js ID；系列資料的字幕範圍、來源檔範圍與秒數需維持可追溯且順序正確。
