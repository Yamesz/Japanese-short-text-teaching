// ================================================
// 🎵 文章5 Lesson Script — Karaoke Player Engine
// ================================================

// --- Sentence Data ---
const SENTENCES = [
  { jp: '今日、公園へ　行きました。', cn: '今天去了公園。' },
  { jp: '友だちと　いっしょに　散歩しました。', cn: '和朋友一起散步了。' },
  { jp: '犬が　たくさん　いました。', cn: '有很多狗。' },
  { jp: 'ベンチで　少し　休みました。', cn: '在長椅上休息了一下。' },
  { jp: 'ジュースを　飲みました。', cn: '喝了果汁。' },
  { jp: '友だちと　たくさん　話しました。', cn: '和朋友聊了很多。' },
  { jp: '子どもたちが　元気に　遊んでいました。', cn: '小孩子們正精神充沛地玩耍著。' },
  { jp: '天気が　よかったです。', cn: '天氣很好。' },
  { jp: '写真を　撮りました。', cn: '拍了照片。' },
  { jp: 'とても　楽しかったです。', cn: '非常開心。' },
  { jp: 'また　公園へ　行きたいです。', cn: '還想再來公園。' }
];

// --- KaraokePlayer Class ---
class KaraokePlayer {
  constructor(sentences) {
    this.sentences = sentences;
    this.currentIndex = -1;
    this.state = 'idle'; // 'idle' | 'playing' | 'paused'
    this.utterances = [];

    // Cache DOM elements
    this.lines = document.querySelectorAll('.karaoke-line');
    this.playBtn = document.getElementById('karaoke-play-btn');
    this.stopBtn = document.getElementById('karaoke-stop-btn');
    this.progressBar = document.querySelector('.karaoke-progress-bar');
    this.progressContainer = document.querySelector('.karaoke-progress-container');
    this.statusEl = document.querySelector('.karaoke-status');
  }

  // --- Build utterance queue ---
  _buildQueue() {
    this.utterances = [];
    const rate = typeof currentSpeechRate !== 'undefined' ? currentSpeechRate : 1.0;

    this.sentences.forEach((s, i) => {
      const u = new SpeechSynthesisUtterance(s.jp.replace(/　/g, ' '));
      u.lang = 'ja-JP';
      u.rate = rate;

      // Use preferred Japanese voice
      if (typeof getPreferredJapaneseVoice === 'function') {
        const preferredVoice = getPreferredJapaneseVoice();
        if (preferredVoice) u.voice = preferredVoice;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(v => v.lang.includes('ja'));
        if (jaVoice) u.voice = jaVoice;
      }

      u.onstart = () => {
        this.currentIndex = i;
        this._highlightLine(i);
        this._updateProgress(i);
        this._setStatus('playing', `正在朗讀第 ${i + 1}/${this.sentences.length} 句...`);
      };

      u.onend = () => {
        this._markDone(i);
        // If last sentence
        if (i === this.sentences.length - 1) {
          this._onFinished();
        }
      };

      u.onerror = (ev) => {
        // On error (e.g. interrupted), stop gracefully
        if (ev.error !== 'interrupted') {
          console.warn('Speech error:', ev.error);
        }
      };

      this.utterances.push(u);
    });
  }

  // --- Play ---
  play() {
    if (!('speechSynthesis' in window)) {
      alert('您的瀏覽器不支援語音功能');
      return;
    }

    // If paused, resume
    if (this.state === 'paused') {
      this.resume();
      return;
    }

    // Fresh start
    window.speechSynthesis.cancel();
    this.clearHighlights();
    this._buildQueue();

    // Enqueue all utterances
    this.utterances.forEach(u => {
      window.speechSynthesis.speak(u);
    });

    this.state = 'playing';
    this._updateButtonStates();
    this._showProgress(true);
  }

  // --- Pause ---
  pause() {
    if (this.state !== 'playing') return;
    window.speechSynthesis.pause();
    this.state = 'paused';
    this._updateButtonStates();
    this._setStatus('paused', '已暫停');
    this._showPauseNotice(true);
  }

  // --- Resume ---
  resume() {
    if (this.state !== 'paused') return;
    window.speechSynthesis.resume();
    this.state = 'playing';
    this._updateButtonStates();
    this._showPauseNotice(false);
  }

  // --- Stop ---
  stop() {
    window.speechSynthesis.cancel();
    this.state = 'idle';
    this.currentIndex = -1;
    this.clearHighlights();
    this._updateButtonStates();
    this._showProgress(false);
    this._showPauseNotice(false);
    this._setStatus('idle', '準備就緒');
  }

  // --- Toggle play/pause ---
  togglePlayPause() {
    switch (this.state) {
      case 'idle':
        this.play();
        break;
      case 'playing':
        this.pause();
        break;
      case 'paused':
        this.resume();
        break;
    }
  }

  // --- Highlight management ---
  _highlightLine(index) {
    this.lines.forEach((line, i) => {
      line.classList.remove('active');
      if (i < index) {
        line.classList.add('done');
      }
    });

    const activeLine = this.lines[index];
    if (activeLine) {
      activeLine.classList.remove('done');
      activeLine.classList.add('active');
    }
  }

  _markDone(index) {
    const line = this.lines[index];
    if (line) {
      line.classList.remove('active');
      line.classList.add('done');
    }
  }

  clearHighlights() {
    this.lines.forEach(line => {
      line.classList.remove('active', 'done');
    });
  }

  // --- Progress bar ---
  _updateProgress(index) {
    if (!this.progressBar) return;
    const pct = ((index + 1) / this.sentences.length) * 100;
    this.progressBar.style.width = `${pct}%`;
  }

  _showProgress(show) {
    if (!this.progressContainer) return;
    if (show) {
      this.progressContainer.classList.add('visible');
      this.progressBar.style.width = '0%';
    } else {
      this.progressContainer.classList.remove('visible');
      this.progressBar.style.width = '0%';
    }
  }

  // --- Status indicator ---
  _setStatus(state, text) {
    if (!this.statusEl) return;
    this.statusEl.className = 'karaoke-status ' + state;
    const textEl = this.statusEl.querySelector('.status-text');
    if (textEl) textEl.textContent = text;
  }

  // --- Button states ---
  _updateButtonStates() {
    if (!this.playBtn) return;

    this.playBtn.classList.remove('is-playing', 'is-paused');

    switch (this.state) {
      case 'playing':
        this.playBtn.innerHTML = '⏸ 暫停朗讀';
        this.playBtn.classList.add('is-playing');
        if (this.stopBtn) this.stopBtn.disabled = false;
        break;
      case 'paused':
        this.playBtn.innerHTML = '▶ 繼續朗讀';
        this.playBtn.classList.add('is-paused');
        if (this.stopBtn) this.stopBtn.disabled = false;
        break;
      case 'idle':
      default:
        this.playBtn.innerHTML = '🔊 全篇朗讀';
        if (this.stopBtn) this.stopBtn.disabled = true;
        break;
    }
  }

  // --- Pause notice ---
  _showPauseNotice(show) {
    const notice = document.querySelector('.pause-notice');
    if (!notice) return;
    if (show) {
      notice.classList.add('show');
    } else {
      notice.classList.remove('show');
    }
  }

  // --- On finished ---
  _onFinished() {
    this.state = 'idle';
    this.currentIndex = -1;
    this._updateButtonStates();
    this._setStatus('idle', '朗讀完成！🎉');
    this._showPauseNotice(false);

    // Keep progress bar full for a moment, then fade
    if (this.progressBar) {
      this.progressBar.style.width = '100%';
    }
    setTimeout(() => {
      this._showProgress(false);
      // Remove done states after a brief pause
      setTimeout(() => {
        this.clearHighlights();
      }, 800);
    }, 2000);
  }
}


// --- Global player instance ---
let karaokePlayer = null;

document.addEventListener('DOMContentLoaded', () => {
  karaokePlayer = new KaraokePlayer(SENTENCES);

  // Ensure voices are loaded (some browsers load asynchronously)
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      // Voices loaded, player will pick them up on next play()
    }, { once: true });
  }

  // Initialize stop button disabled state
  const stopBtn = document.getElementById('karaoke-stop-btn');
  if (stopBtn) stopBtn.disabled = true;
});


// --- Public API for HTML onclick ---

function playFullArticleAudio() {
  if (karaokePlayer) {
    karaokePlayer.togglePlayPause();
  }
}

function stopArticleAudio() {
  if (karaokePlayer) {
    karaokePlayer.stop();
  }
}


// --- Bilingual Toggle ---

function toggleTranslation(checkbox) {
  const allCn = document.querySelectorAll('.karaoke-cn');
  if (checkbox.checked) {
    allCn.forEach((el, i) => {
      // Stagger the animation for a cascade effect
      setTimeout(() => {
        el.classList.add('show');
      }, i * 40);
    });
  } else {
    allCn.forEach((el, i) => {
      setTimeout(() => {
        el.classList.remove('show');
      }, i * 25);
    });
  }
}
