// ================================================
// 🎵 文章5 Lesson Script — Karaoke Player Engine
// ================================================

// --- Sentence Data ---
const SENTENCES = [
  { jp: 'わたしの　しょうらいの　ゆめは、ただ　せいこうする　だけでなく、', cn: '我的未來夢想，不單純只是成功，' },
  { jp: 'じぶんが　まなんだ　ちしきや　けいけんを　いかして、', cn: '而是活用自己所學到的知識與經驗，' },
  { jp: 'ひとびとに　よい　えいきょうを　あたえられる　ひとに　なることです。', cn: '成為能夠給予人們良好影響的人。' },
  { jp: 'けいざいてきに　じりつし、かぞくの　せきにんを　はたしながら、', cn: '在經濟上自立、履行對家庭的責任的同時，' },
  { jp: 'じぶんじしんの　みちを　きずくことが　もくひょうです。', cn: '努力開闢走出一條屬於自己的道路，是我的目標。' }
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

      // Try to find a Japanese voice
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang.includes('ja'));
      if (jaVoice) u.voice = jaVoice;

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
