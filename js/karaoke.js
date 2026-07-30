// js/karaoke.js
class KaraokePlayer {
  constructor(data) {
    if (typeof data === 'string') {
      this.level = data;
      this.sentences = (typeof LEVEL_DATA !== 'undefined' ? LEVEL_DATA[data] : (typeof STORY_DATA !== 'undefined' ? STORY_DATA[data].sentences : [])) || [];
      this.containerSelector = `#level-${this.level} `;
    } else {
      this.level = null;
      this.sentences = data || [];
      this.containerSelector = '';
    }
    this.currentIndex = -1;
    this.state = 'idle';
    this.synth = window.speechSynthesis;
    this.rate = typeof currentSpeechRate !== 'undefined' ? currentSpeechRate : 1.0;
    this.isChangingSpeed = false;
  }

  _getElements() {
    const sel = this.containerSelector;
    return {
      lines: document.querySelectorAll(`${sel}.karaoke-line`),
      playBtn: document.querySelector(`${sel}.karaoke-play-btn`) || document.getElementById('karaoke-play-btn'),
      stopBtn: document.querySelector(`${sel}.karaoke-stop-btn`) || document.getElementById('karaoke-stop-btn'),
      progressBar: document.querySelector(`${sel}.karaoke-progress-bar`) || document.querySelector('.karaoke-progress-bar'),
      progressContainer: document.querySelector(`${sel}.karaoke-progress-container`) || document.querySelector('.karaoke-progress-container'),
      statusEl: document.querySelector(`${sel}.karaoke-status`) || document.querySelector('.karaoke-status')
    };
  }

  play() {
    if (this.state === 'playing') return;
    if (this.state === 'paused') { this.resume(); return; }
    this.synth.cancel();
    this.state = 'playing';
    this.currentIndex = 0;
    this.clearHighlights();
    this._updateButtonStates();
    this._playNext();
    this._showProgress(true);
  }

  pause() {
    if (this.state !== 'playing') return;
    this.synth.pause();
    this.state = 'paused';
    this._updateButtonStates();
    this._setStatus('paused', '已暫停');
    this._showPauseNotice(true);
  }

  resume() {
    if (this.state !== 'paused') return;
    this.synth.resume();
    this.state = 'playing';
    this._updateButtonStates();
    this._setStatus('playing', `讀取第 ${this.currentIndex + 1} 句`);
    this._showPauseNotice(false);
  }

  stop() {
    this.synth.cancel();
    this.state = 'idle';
    this.currentIndex = -1;
    this.clearHighlights();
    this._updateProgress(-1);
    this._updateButtonStates();
    this._setStatus('idle', '準備就緒');
    this._showProgress(false);
    this._showPauseNotice(false);
  }

  togglePlayPause() {
    this.state === 'playing' ? this.pause() : this.play();
  }

  _playNext() {
    if (this.currentIndex >= this.sentences.length) {
      this.state = 'idle';
      this._updateButtonStates();
      this._setStatus('idle', '朗讀完成！🎉');
      this._updateProgress(this.sentences.length - 1);
      setTimeout(() => { this._showProgress(false); setTimeout(() => this.clearHighlights(), 800); }, 2000);
      return;
    }
    const jpText = this.sentences[this.currentIndex].jp || this.sentences[this.currentIndex];
    const u = new SpeechSynthesisUtterance(jpText);
    u.lang = 'ja-JP';
    u.rate = typeof currentSpeechRate !== 'undefined' ? currentSpeechRate : this.rate;
    if (typeof applyVoiceAndPitch === 'function') applyVoiceAndPitch(u);
    
    u.onstart = () => {
      this._highlightLine(this.currentIndex);
      this._updateProgress(this.currentIndex);
      this._setStatus('playing', `朗讀第 ${this.currentIndex + 1} 句`);
    };
    
    u.onend = () => {
      if (this.state === 'playing') {
        this._markDone(this.currentIndex);
        this.currentIndex++;
        this._playNext();
      }
    };
    
    u.onerror = (ev) => { if (!this.isChangingSpeed && this.state === 'playing' && ev.error !== 'interrupted') this.stop(); };
    this.synth.speak(u);
  }

  _highlightLine(i) {
    const els = this._getElements();
    els.lines.forEach((x, n) => {
      x.classList.toggle('active', n === i);
      x.classList.toggle('done', n < i);
    });
  }

  _markDone(i) {
    const els = this._getElements();
    if (els.lines[i]) { els.lines[i].classList.remove('active'); els.lines[i].classList.add('done'); }
  }

  clearHighlights() {
    const els = this._getElements();
    els.lines.forEach(x => x.classList.remove('active', 'done'));
  }

  _updateProgress(i) {
    const els = this._getElements();
    if (!els.progressBar) return;
    const pct = this.sentences.length ? ((i + 1) / this.sentences.length) * 100 : 0;
    els.progressBar.style.width = `${pct}%`;
  }

  _showProgress(show) {
    const els = this._getElements();
    if (!els.progressContainer) return;
    if (show) { els.progressContainer.classList.add('visible'); els.progressBar.style.width = '0%'; }
    else { els.progressContainer.classList.remove('visible'); els.progressBar.style.width = '0%'; }
  }

  _setStatus(state, text) {
    const els = this._getElements();
    if (!els.statusEl) return;
    els.statusEl.className = 'karaoke-status ' + state;
    const textEl = els.statusEl.querySelector('.status-text');
    if (textEl) textEl.textContent = text;
  }

  _updateButtonStates() {
    const els = this._getElements();
    if (!els.playBtn) return;
    els.playBtn.classList.remove('is-playing', 'is-paused');
    if (this.state === 'playing') {
      els.playBtn.innerHTML = '⏸ 暫停朗讀';
      els.playBtn.classList.add('is-playing');
      if (els.stopBtn) els.stopBtn.disabled = false;
    } else if (this.state === 'paused') {
      els.playBtn.innerHTML = '▶ 繼續朗讀';
      els.playBtn.classList.add('is-paused');
      if (els.stopBtn) els.stopBtn.disabled = false;
    } else {
      els.playBtn.innerHTML = '🔊 全篇朗讀';
      if (els.stopBtn) els.stopBtn.disabled = true;
    }
  }

  _showPauseNotice(show) {
    const notice = document.querySelector(`${this.containerSelector}.pause-notice`) || document.querySelector('.pause-notice');
    if (notice) notice.classList.toggle('show', show);
  }
}

// Global player integration
let karaokePlayer = null;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof SENTENCES !== 'undefined') {
    karaokePlayer = new KaraokePlayer(SENTENCES);
    const stopBtn = document.getElementById('karaoke-stop-btn');
    if (stopBtn) stopBtn.disabled = true;
  }
});

function playFullArticleAudio() {
  if (typeof initPlayer === 'function') {
    initPlayer();
    if (typeof player !== 'undefined' && player) player.togglePlayPause();
  } else if (karaokePlayer) {
    karaokePlayer.togglePlayPause();
  }
}

function stopArticleAudio() {
  if (typeof player !== 'undefined' && player) player.stop();
  else if (karaokePlayer) karaokePlayer.stop();
}

function toggleTranslation(checkbox) {
  let selector = '';
  if (typeof currentLevel !== 'undefined') selector = `#level-${currentLevel} `;
  const allCn = document.querySelectorAll(`${selector}.karaoke-cn`);
  if (checkbox.checked) {
    allCn.forEach((el, i) => setTimeout(() => el.classList.add('show'), i * 40));
  } else {
    allCn.forEach((el, i) => setTimeout(() => el.classList.remove('show'), i * 25));
  }
}
