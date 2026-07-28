const SENTENCES = [
  { jp: 'せんしゅうの にちようび、わたしは ともだちと えいがを みに いきました。', cn: '上個星期天，我和朋友去看電影。' },
  { jp: 'あさ 8じに おきて、あさごはんを たべました。', cn: '早上8點起床，吃了早餐。' },
  { jp: 'そのあと、でんしゃで えいがかんへ いきました。', cn: '在那之後，搭電車去電影院。' },
  { jp: 'えいがは とても おもしろかったです。', cn: '電影非常有趣。' },
  { jp: 'ともだちも とても よろこんでいました。', cn: '朋友也非常高興。' },
  { jp: 'えいがの あとで、レストランへ いって パスタを たべました。', cn: '電影結束後，去餐廳吃了義大利麵。' },
  { jp: 'デザートに アイスクリームも たべました。', cn: '甜點也吃了冰淇淋。' },
  { jp: 'とても おいしかったです。', cn: '真的很好吃。' },
  { jp: 'そのあと、ショッピングを しました。', cn: '在那之後去購物。' },
  { jp: 'わたしは ペンと ノートを かいました。', cn: '我買了筆和筆記本。' },
  { jp: 'ゆうがたに いえへ かえって、すこし やすみました。', cn: '傍晚回家，稍微休息了一下。' },
  { jp: 'よるは にほんごを べんきょうしてから ねました。', cn: '晚上讀了日文之後才睡覺。' },
  { jp: 'とても たのしい にちようびでした。', cn: '是個非常愉快的星期天。' }
];

class KaraokePlayer {
  constructor(sentences) {
    this.sentences = sentences;
    this.currentIndex = 0;
    this.state = 'idle'; // idle, playing, paused
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

    const currentSentence = this.sentences[this.currentIndex].jp;
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
      // Sometimes it interrupts, we can try to recover or stop
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

// 覆寫 lesson-common.js 的語速變更，讓 player 可以感知
window.addEventListener('speechRateChanged', (e) => {
  if (player) {
    player.rate = e.detail;
    // 若正在播放，需要中斷重播才能套用新語速 (依賴 speechSynthesis 機制)
    if (player.state === 'playing') {
      player.stop();
      player.play();
    }
  }
});
