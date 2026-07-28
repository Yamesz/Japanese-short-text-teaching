const SENTENCES = [
  { jp: 'きょうは　とても　いい　てんきです。', cn: '今天天氣非常棒。' },
  { jp: 'あさ、わたしは　はやく　おきました。', cn: '早上，我早早就起床了。' },
  { jp: 'それから、コーヒーを　のんで、パンを　たべました。', cn: '然後，喝了咖啡，吃了麵包。' },
  { jp: 'あさごはんの　あとで、こうえんへ　さんぽに　いきました。', cn: '早餐後，去公園散了步。' },
  { jp: 'こうえんには　おおきい　きが　たくさん　あります。', cn: '公園裡有很多大樹。' },
  { jp: 'とりが　うたっていて、とても　きれいな　こえでした。', cn: '鳥兒在唱歌，聲音非常優美。' },
  { jp: 'こどもたちが　あそんでいて、えがおが　いっぱいでした。', cn: '孩子們在玩耍，充滿了笑容。' },
  { jp: 'わたしは　ベンチに　すわって、ほんを　よみました。', cn: '我坐在長椅上，讀了書。' },
  { jp: 'ひるに　なって、おなかが　すきました。', cn: '到了中午，肚子餓了。' },
  { jp: 'ちかくの　みせで　ラーメンを　たべました。', cn: '在附近的店裡吃了拉麵。' },
  { jp: 'そのラーメンは　あたたかくて、とても　おいしかったです。', cn: '那碗拉麵熱騰騰的，非常好吃。' },
  { jp: 'ごごは　いえに　かえって、すこし　べんきょうしました。', cn: '下午回家後，稍微讀了點書。' },
  { jp: 'にほんごの　ことばを　おぼえるのは　むずかしいですが、おもしろいです。', cn: '記日文單字雖然很難，但很有趣。' },
  { jp: 'よるは　ともだちと　でんわで　はなしました。', cn: '晚上和朋友通了電話。' },
  { jp: 'たのしい　いちにちでした。', cn: '是個開心的一天。' },
  { jp: 'あしたも　がんばります。', cn: '明天也會努力的。' }
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

    // TTS朗讀用字串：去掉全形空白
    const currentSentence = this.sentences[this.currentIndex].jp.replace(/ /g, '').replace(/　/g, '');
    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = 'ja-JP';
    utterance.rate = window.currentSpeechRate || 1.0;

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
