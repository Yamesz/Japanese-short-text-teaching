const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const LESSONS = process.env.LESSON_QA_ARTICLES
  ? process.env.LESSON_QA_ARTICLES.split(',').map(Number).filter(Number.isInteger)
  : [29, 30, 31, 32, 33];
const VIEWPORTS = [
  { width: 1366, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 900 }
];
const OUTPUT = process.env.LESSON_QA_OUTPUT || path.join(os.tmpdir(), 'doc-lessons-qa');
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function createServer() {
  return http.createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end('Bad request');
      return;
    }

    let target = path.resolve(ROOT, `.${pathname}`);
    if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');

    fs.readFile(target, (error, data) => {
      if (error) {
        response.writeHead(404).end('Not found');
        return;
      }
      response.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(target)] || 'application/octet-stream' });
      response.end(data);
    });
  });
}

async function installSpeechMock(page) {
  await page.addInitScript(() => {
    let generation = 0;
    let paused = false;
    window.__spokenJapanese = [];

    class MockUtterance {
      constructor(text) {
        this.text = text;
        this.rate = 1;
        this.pitch = 1;
        this.lang = '';
      }
    }

    const mockSpeech = {
      getVoices: () => [],
      cancel: () => { generation += 1; },
      pause: () => { paused = true; },
      resume: () => { paused = false; },
      speak: utterance => {
        const currentGeneration = generation;
        let started = false;
        window.__spokenJapanese.push({ text: utterance.text, rate: utterance.rate });
        const finishWhenReady = () => {
          if (currentGeneration !== generation) return;
          if (!started) {
            started = true;
            if (utterance.onstart) utterance.onstart();
          }
          if (paused) {
            setTimeout(finishWhenReady, 10);
            return;
          }
          setTimeout(() => {
            if (currentGeneration !== generation) return;
            if (paused) {
              setTimeout(finishWhenReady, 10);
              return;
            }
            if (utterance.onend) utterance.onend();
          }, 300);
        };
        setTimeout(finishWhenReady, 0);
      }
    };

    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: MockUtterance });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: mockSpeech });
  });
}

function inspectControlLayout(metrics, width) {
  const expectedDirection = width <= 600 ? 'column' : 'row';
  assert.equal(metrics.rowDirection, expectedDirection,
    `控制列在 ${width}px 應使用 ${expectedDirection} 排列，實際為 ${metrics.rowDirection}`);
  if (width <= 600) {
    assert.equal(metrics.rowAlignItems, 'flex-start', `控制列在 ${width}px 不應拉伸成滿版`);
  }
  assert.ok(Math.abs(metrics.playTop - metrics.stopTop) <= 2,
    `「全篇朗讀」與「停止」在 ${width}px 應維持同一列`);
  assert.ok(metrics.stopLeft >= metrics.playRight - 1,
    `「停止」在 ${width}px 不應和「全篇朗讀」重疊`);
  assert.ok(metrics.stopRight <= metrics.controlsRight + 2,
    `「停止」在 ${width}px 應完整位於控制列內`);
}

async function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const failures = [];
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.LESSON_QA_CHANNEL || 'chrome'
  });

  try {
    for (const article of LESSONS) {
      const pageErrors = [];
      const page = await browser.newPage({ viewport: VIEWPORTS[0] });
      page.setDefaultTimeout(5000);
      await page.route('**/*', route => route.request().url().startsWith(baseUrl)
        ? route.continue()
        : route.abort());
      page.on('pageerror', error => pageErrors.push(error.message));
      page.on('console', message => {
        const source = message.location().url;
        if (message.type() === 'error' && (!source || source.startsWith(baseUrl))) {
          pageErrors.push(`console: ${message.text()}`);
        }
      });
      page.on('requestfailed', request => {
        if (request.url().startsWith(baseUrl)) pageErrors.push(`request failed: ${request.url()}`);
      });
      page.on('response', response => {
        if (response.url().startsWith(baseUrl) && response.status() >= 400) {
          pageErrors.push(`${response.status()} ${response.url()}`);
        }
      });
      await installSpeechMock(page);
      await page.goto(`${baseUrl}/N3/文章${article}/index.html`, { waitUntil: 'domcontentloaded' });
      await page.locator('.karaoke-line').first().waitFor();

      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport);
        const metrics = await page.evaluate(() => {
          const row = document.querySelector('.short-text-controls-row');
          const controls = document.querySelector('.karaoke-controls');
          const play = document.querySelector('#karaoke-play-btn').getBoundingClientRect();
          const stop = document.querySelector('#karaoke-stop-btn').getBoundingClientRect();
          return {
            rowDirection: getComputedStyle(row).flexDirection,
            rowAlignItems: getComputedStyle(row).alignItems,
            playTop: play.top,
            playRight: play.right,
            stopTop: stop.top,
            stopLeft: stop.left,
            stopRight: stop.right,
            controlsRight: controls.getBoundingClientRect().right,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: document.documentElement.clientWidth
          };
        });

        try {
          inspectControlLayout(metrics, viewport.width);
          assert.ok(metrics.documentWidth <= metrics.viewportWidth,
            `文章${article} 在 ${viewport.width}px 不應有整頁水平溢出`);
        } catch (error) {
          failures.push(`文章${article} 播放控制：${error.message}`);
        }

        await page.screenshot({
          path: path.join(OUTPUT, `article-${article}-${viewport.width}.png`),
          fullPage: false
        });
      }

      try {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator('#vocabulary-section').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(OUTPUT, `article-${article}-examples-390.png`) });

        const detailsList = page.locator('#verb-classroom-section details.conjugation-table-wrapper');
        const detailsCount = await detailsList.count();
        assert.ok(detailsCount > 0, '動詞教室應有活用表');
        for (let index = 0; index < detailsCount; index++) {
          const details = detailsList.nth(index);
          await details.locator('summary').click();
          if (index === 0) {
            await page.screenshot({ path: path.join(OUTPUT, `article-${article}-verb-open-390.png`) });
          }
          const tableState = await details.locator('table').evaluate(table => ({
            open: table.closest('details').open,
            display: getComputedStyle(table).display,
            height: table.getBoundingClientRect().height
          }));
          assert.equal(tableState.open, true, `第 ${index + 1} 張活用表應展開`);
          assert.notEqual(tableState.display, 'none', `第 ${index + 1} 張活用表不能被 CSS 隱藏`);
          assert.ok(tableState.height > 0, `第 ${index + 1} 張活用表應有可見高度`);
          await details.locator('summary').click();
        }
      } catch (error) {
        failures.push(`文章${article} 動詞活用表：${error.message}`);
      }

      try {
        const missingExamples = await page.locator('.example-box').evaluateAll(boxes => boxes
          .map((box, index) => ({ index, example: box.querySelector('.example-jp'), speaker: box.querySelector('.example-jp .audio-btn') }))
          .filter(item => item.example && !item.speaker)
          .map(item => item.index));
        assert.deepEqual(missingExamples, [], `以下例句缺少朗讀按鈕：${missingExamples.join(', ')}`);

        for (const section of ['vocabulary', 'verb-classroom', 'particle', 'grammar']) {
          const button = page.locator(`#${section}-section .example-jp .audio-btn`).first();
          const expectedText = await button.getAttribute('data-speak-text');
          assert.ok(expectedText, `${section} 例句朗讀按鈕缺少日文文字`);
          const before = await page.evaluate(() => window.__spokenJapanese.length);
          await button.click();
          await page.waitForFunction(count => window.__spokenJapanese.length === count + 1, before);
          const actualText = await page.evaluate(() => window.__spokenJapanese.at(-1).text);
          assert.equal(actualText, expectedText, `${section} 例句朗讀內容不符合顯示例句`);
        }
      } catch (error) {
        failures.push(`文章${article} 例句朗讀：${error.message}`);
      }

      try {
        for (const section of ['vocabulary', 'verb-classroom']) {
          const cards = page.locator(`#${section}-section .vocab-card`);
          for (let index = 0; index < await cards.count(); index++) {
            const card = cards.nth(index);
            const speaker = card.locator('.vocab-header .audio-btn');
            assert.equal(await speaker.count(), 1, `${section} 第 ${index + 1} 張卡缺少詞條發音按鈕`);
            assert.ok(await card.locator('.vocab-romaji').count(), `${section} 第 ${index + 1} 張卡缺少讀音`);
            assert.ok(await speaker.getAttribute('aria-label'), '詞條發音按鈕應有無障礙標籤');
            const text = await speaker.getAttribute('data-speak-text');
            const inline = await speaker.getAttribute('onclick');
            const expected = text || inline?.match(/speakJapanese\(['"]([^'"]+)['"]\)/)?.[1];
            assert.ok(expected, '詞條發音必須指定日文讀音');
            const before = await page.evaluate(() => window.__spokenJapanese.length);
            await speaker.click();
            await page.waitForFunction(count => window.__spokenJapanese.length === count + 1, before);
            assert.equal(await page.evaluate(() => window.__spokenJapanese.at(-1).text), expected);
          }
        }
      } catch (error) {
        failures.push(`文章${article} 詞條發音：${error.message}`);
      }

      let playbackStage = 'start';
      try {
        const play = page.locator('#karaoke-play-btn');
        await play.click();
        await page.waitForFunction(() => document.querySelector('#karaoke-play-btn').classList.contains('is-playing'));
        playbackStage = 'pause';
        await play.click();
        await page.waitForFunction(() => document.querySelector('#karaoke-play-btn').classList.contains('is-paused'));
        playbackStage = 'resume';
        await play.click();
        await page.waitForFunction(() => document.querySelector('#karaoke-play-btn').classList.contains('is-playing'));
        playbackStage = 'stop';
        await page.locator('#karaoke-stop-btn').click();
        assert.equal(await play.evaluate(button => button.classList.contains('is-playing')), false,
          '按停止後播放器不應保留播放狀態');
        playbackStage = 'replay';
        await play.click();
        await page.waitForFunction(() => document.querySelector('#karaoke-play-btn').classList.contains('is-playing'));
        playbackStage = 'final stop';
        await page.locator('#karaoke-stop-btn').click();
      } catch (error) {
        failures.push(`文章${article} 播放與停止（${playbackStage}）：${error.message}`);
      }

      if (pageErrors.length) failures.push(`文章${article} 頁面錯誤：${pageErrors.join('；')}`);
      await page.close();
      console.log(`已檢查文章${article}`);
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  console.log(`截圖與測試結果位置：${OUTPUT}`);
  if (failures.length) {
    console.error(`FAIL：${failures.length} 項`);
    failures.forEach(failure => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(`PASS：文章${LESSONS.join('、')}的控制列、活用表、詞條與例句朗讀、播放停止互動皆正常。`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
