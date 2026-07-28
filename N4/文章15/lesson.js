const SENTENCES = [
  { jp: 'きのう、わたしは　6じに　おきました。', cn: '昨天，我六點起床。' },
  { jp: 'それから、みずを　のんで、あさごはんを　たべました。', cn: '然後，喝了水，吃了早餐。' },
  { jp: 'あさごはんの　あとで、へやの　そうじを　しました。', cn: '早餐之後，打掃了房間。' },
  { jp: '10じごろ、ともだちと　こうえんへ　いきました。', cn: '十點左右，和朋友去了公園。' },
  { jp: 'こうえんで　サッカーを　したり、しゃしんを　とったり　しました。', cn: '在公園裡踢了足球、拍了照。' },
  { jp: 'とても　たのしかったです。', cn: '非常好玩。' },
  { jp: 'おひるは、ラーメンを　たべました。', cn: '午餐吃了拉麵。' },
  { jp: 'そのあと、コンビニで　ジュースを　かいました。', cn: '在那之後，在便利商店買了果汁。' },
  { jp: 'ゆうがたに　いえへ　かえって、かぞくと　ばんごはんを　たべました。', cn: '傍晚回家，和家人吃了晚餐。' },
  { jp: 'よるは、すこし　にほんごを　べんきょうしました。', cn: '晚上稍微讀了日文。' },
  { jp: 'そして、11じごろ　ねました。', cn: '然後，十一點左右睡覺了。' },
  { jp: 'とても　いい　いちにちでした。', cn: '是個非常美好的一天。' }
];

class KaraokePlayer {
  constructor(sentences) {
    this.sentences = sentences;
    this.currentIndex = 0;
    this.state = 'idle';
    this.synth = window.speechSynthesis;
    this.rate = window.currentSpeechRate || 1.0;
  }

  play() {
    if (this.state === 'playing') return;

    if (this.state === 'paused') {
      this.synth.resume();
      this.state = 'playing';
      this._updateButtonStates();
      return;
    }

    this.state = 'playing';
    this.currentIndex = 0;
    this._updateButtonStates();
    this.clearHighlights();
    this._playNext();
  }

  pause() {
    if (this.state === 'playing') {
      this.synth.pause();
      this.state = 'paused';
      this._updateButtonStates();
      document.querySelector('.karaoke-status').className = 'karaoke-status paused';
      document.querySelector('.status-text').textContent = '已暫停';
      document.querySelector('.pause-notice').style.display = 'block';
    }
  }

  resume() {
    this.play();
  }

  stop() {
    this.synth.cancel();
    this.state = 'idle';
    this.currentIndex = 0;
    this._updateButtonStates();
    this.clearHighlights();
    this._updateProgress(-1);
    document.querySelector('.karaoke-status').className = 'karaoke-status idle';
    document.querySelector('.status-text').textContent = '準備就緒';
    document.querySelector('.pause-notice').style.display = 'none';
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
      document.querySelector('.karaoke-status').className = 'karaoke-status done';
      document.querySelector('.status-text').textContent = '朗讀完成！🎉';
      setTimeout(() => this.clearHighlights(), 2000);
      return;
    }

    const currentSentence = this.sentences[this.currentIndex].jp.replace(/ /g, '');
    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = 'ja-JP';
    utterance.rate = window.currentSpeechRate || 1.0;

    if (typeof applyVoiceAndPitch === 'function') {
      applyVoiceAndPitch(utterance);
    } else if (typeof getPreferredJapaneseVoice === 'function') {
      const preferredVoice = getPreferredJapaneseVoice();
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this._highlightLine(this.currentIndex);
      this._updateProgress(this.currentIndex);
      document.querySelector('.karaoke-status').className = 'karaoke-status playing';
      document.querySelector('.status-text').textContent = `正在朗讀第 ${this.currentIndex + 1} 句`;
      document.querySelector('.pause-notice').style.display = 'none';
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

    this.synth.speak(utterance);
  }

  _highlightLine(index) {
    const lines = document.querySelectorAll('.karaoke-line');
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
    const lines = document.querySelectorAll('.karaoke-line');
    lines.forEach(line => line.classList.remove('active', 'done'));
  }

  _updateProgress(index) {
    const progressBar = document.querySelector('.karaoke-progress-bar');
    if (!progressBar) return;
    if (index === -1) {
      progressBar.style.width = '0%';
      return;
    }
    const percent = ((index + 1) / this.sentences.length) * 100;
    progressBar.style.width = `${percent}%`;
  }

  _updateButtonStates() {
    const playBtn = document.getElementById('karaoke-play-btn');
    const stopBtn = document.getElementById('karaoke-stop-btn');

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
}

let player = null;

function initPlayer() {
  if (!player) {
    player = new KaraokePlayer(SENTENCES);
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
  const translations = document.querySelectorAll('.karaoke-cn');
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

window.addEventListener('speechRateChanged', (e) => {
  if (player) {
    player.rate = e.detail;
    if (player.state === 'playing') {
      player.stop();
      player.play();
    }
  }
});
