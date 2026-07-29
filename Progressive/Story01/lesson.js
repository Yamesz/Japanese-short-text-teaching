const SENTENCES_N5 = [
  { jp: 'わたしは　こうえんへ　いきました。', cn: '我去了公園。' },
  { jp: 'そこで　いぬを　みました。', cn: '在那裡看見了一隻狗。' },
  { jp: 'いぬは　とても　かわいかったです。', cn: '狗非常可愛。' },
  { jp: 'わたしは　いぬを　いえに　つれてかえりました。', cn: '我把狗帶回家了。' }
];

const SENTENCES_N4 = [
  { jp: 'こうえんへ　いったとき、いぬを　みつけました。', cn: '去公園的時候，發現了一隻狗。' },
  { jp: 'そのいぬは　ひとりで　さびしそうでした。', cn: '那隻狗獨自一隻，看起來很寂寞。' },
  { jp: 'かいぬしが　いないので、わたしは　いえに　つれてかえることに　しました。', cn: '因為沒有飼主，所以我決定把牠帶回家。' }
];

const SENTENCES_N3 = [
  { jp: 'こうえんに　すてられていた　いぬを　みつけて、かわいそうに　おもいました。', cn: '發現了被遺棄在公園的狗，覺得非常可憐。' },
  { jp: 'だれも　さがしていないようだったので、ほうっておけませんでした。', cn: '因為似乎沒有人在找牠，我無法放任不管。' },
  { jp: 'けっきょく、そのまま　いえに　つれてかえってしまいました。', cn: '結果，就那樣把牠帶回家了。' }
];

const LEVEL_DATA = {
  'n5': SENTENCES_N5,
  'n4': SENTENCES_N4,
  'n3': SENTENCES_N3
};

let currentLevel = 'n5';

class KaraokePlayer {
  constructor(level) {
    this.level = level;
    this.sentences = LEVEL_DATA[level] || [];
    this.currentIndex = 0;
    this.state = 'idle'; // idle, playing, paused
    this.synth = window.speechSynthesis;
    this.rate = window.currentSpeechRate || 1.0;
    this.isChangingSpeed = false;
  }

  playAll() {
    this.togglePlayPause();
  }

  play() {
    if (this.state === 'playing') return;

    if (this.state === 'paused') {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.state = 'playing';
      this._updateButtonStates();
      return;
    }

    if (this.synth) {
      this.synth.cancel();
    }

    this.state = 'playing';
    this.currentIndex = 0;
    this._updateButtonStates();
    this.clearHighlights();
    this._playNext();
  }

  pause() {
    if (this.state === 'playing') {
      if (this.synth) {
        this.synth.pause();
      }
      this.state = 'paused';
      this._updateButtonStates();
      this._setStatus('paused', '已暫停');
      const notice = document.querySelector(`#level-${this.level} .pause-notice`);
      if(notice) notice.style.display = 'block';
    }
  }

  resume() {
    this.play();
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.state = 'idle';
    this.currentIndex = 0;
    this._updateButtonStates();
    this.clearHighlights();
    this._updateProgress(-1);
    this._setStatus('idle', '準備就緒');
    const notice = document.querySelector(`#level-${this.level} .pause-notice`);
    if(notice) notice.style.display = 'none';
  }

  togglePlayPause() {
    if (this.state === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  _playNext() {
    if (this.currentIndex >= this.sentences.length) {
      this.state = 'idle';
      this._updateButtonStates();
      this._setStatus('done', '朗讀完成！🎉');
      setTimeout(() => this.clearHighlights(), 2000);
      return;
    }

    const currentSentence = this.sentences[this.currentIndex].jp;
    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = 'ja-JP';

    if (typeof applyVoiceAndPitch === 'function') {
      applyVoiceAndPitch(utterance);
    } else if (typeof getPreferredJapaneseVoice === 'function') {
      const preferredVoice = getPreferredJapaneseVoice();
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    utterance.rate = window.currentSpeechRate || currentSpeechRate || 1.0;

    utterance.onstart = () => {
      this._highlightLine(this.currentIndex);
      this._updateProgress(this.currentIndex);
      this._setStatus('playing', `正在朗讀第 ${this.currentIndex + 1} 句`);
      const notice = document.querySelector(`#level-${this.level} .pause-notice`);
      if(notice) notice.style.display = 'none';
    };

    utterance.onend = () => {
      if (this.state === 'playing') {
        this.currentIndex++;
        this._playNext();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error', e);
      if (this.state === 'playing') {
        this.stop();
      }
    };

    if (this.synth) {
      this.synth.speak(utterance);
    }
  }

  _highlightLine(index) {
    const container = document.getElementById(`level-${this.level}`);
    if (!container) return;
    const lines = container.querySelectorAll('.karaoke-line');
    lines.forEach((line, i) => {
      line.classList.remove('active', 'done');
      if (i < index) {
        line.classList.add('done');
      } else if (i === index) {
        line.classList.add('active');
      }
    });
  }

  clearHighlights() {
    const container = document.getElementById(`level-${this.level}`);
    if (!container) return;
    const lines = container.querySelectorAll('.karaoke-line');
    lines.forEach(line => line.classList.remove('active', 'done'));
  }

  _updateProgress(index) {
    const container = document.getElementById(`level-${this.level}`);
    const progressBar = container ? container.querySelector('.karaoke-progress-bar') : document.querySelector('.karaoke-progress-bar');
    if (!progressBar) return;
    if (index === -1) {
      progressBar.style.width = '0%';
      return;
    }
    const percent = ((index + 1) / this.sentences.length) * 100;
    progressBar.style.width = `${percent}%`;
  }

  _updateButtonStates() {
    const container = document.getElementById(`level-${this.level}`);
    if (!container) return;
    const playBtn = container.querySelector('.karaoke-play-btn, .play-btn');
    const stopBtn = container.querySelector('.karaoke-stop-btn, .stop-btn');
    if (!playBtn || !stopBtn) return;

    if (this.state === 'playing') {
      playBtn.innerHTML = '⏸ 暫停朗讀';
      playBtn.classList.add('is-playing');
      stopBtn.disabled = false;
    } else if (this.state === 'paused') {
      playBtn.innerHTML = '▶️ 繼續朗讀';
      playBtn.classList.remove('is-playing');
      playBtn.classList.add('is-paused');
      stopBtn.disabled = false;
    } else {
      playBtn.innerHTML = '🔊 全篇朗讀';
      playBtn.classList.remove('is-playing', 'is-paused');
      stopBtn.disabled = true;
    }
  }

  _setStatus(className, text) {
    const container = document.getElementById(`level-${this.level}`);
    if (!container) return;
    const statusEl = container.querySelector('.karaoke-status');
    const statusTextEl = container.querySelector('.status-text');
    if (statusEl) statusEl.className = `karaoke-status ${className}`;
    if (statusTextEl) statusTextEl.textContent = text;
  }
}

let player = null;

function initPlayer() {
  if (!player || player.level !== currentLevel) {
    if(player) player.stop();
    player = new KaraokePlayer(currentLevel);
  }
}

function playFullArticleAudio() {
  initPlayer();
  player.togglePlayPause();
}

function stopArticleAudio() {
  if (player) {
    player.stop();
  }
}

function toggleTranslation(checkbox) {
  const container = document.getElementById(`level-${currentLevel}`);
  if(!container) return;
  const translations = container.querySelectorAll('.karaoke-cn');
  translations.forEach((el, index) => {
    if (checkbox.checked) {
      setTimeout(() => {
        el.classList.add('show');
      }, index * 40);
    } else {
      el.classList.remove('show');
    }
  });
}

function switchLevel(level) {
  if(player) {
    player.stop();
  }
  
  currentLevel = level;
  player = new KaraokePlayer(level);

  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.classList.remove('active');
    if(btn.dataset.level === level) {
      btn.classList.add('active');
    }
  });

  document.querySelectorAll('.level-content').forEach(content => {
    content.classList.remove('active');
  });
  const activeContainer = document.getElementById(`level-${level}`);
  if (activeContainer) {
    activeContainer.classList.add('active');
    const toggle = activeContainer.querySelector('.lang-toggle input');
    if(toggle) toggle.checked = false;
  }
  
  toggleTranslation({checked: false});
}

window.addEventListener('speechRateChanged', (e) => {
  if (player) {
    player.rate = e.detail;
    if (player.state === 'playing') {
      if (player.synth) player.synth.cancel();
      player._playNext();
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  switchLevel('n5');
});
