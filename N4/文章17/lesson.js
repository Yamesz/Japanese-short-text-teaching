const SENTENCES = [
  { jp: 'きのう、わたしは　はじめて　ひとりで　りょこうを　しました。', cn: '昨天，我第一次獨自去旅行。' },
  { jp: 'すこし　ふあんでしたが、とても　わくわく　していました。', cn: '雖然有點不安，但也非常興奮。' },
  { jp: 'あさ　はやく　おきて、えきへ　いきました。', cn: '早上很早起床，去了車站。' },
  { jp: 'きっぷを　かって、でんしゃに　のりました。', cn: '買了車票，搭上了電車。' },
  { jp: 'でんしゃの　なかで、まどの　そとを　みながら、いろいろな　ことを　かんがえました。', cn: '在電車裡，一邊看著窗外，一邊思考了各式各樣的事。' },
  { jp: 'ひるごろ、ちいさな　まちに　つきました。', cn: '中午左右，到達了一座小鎮。' },
  { jp: 'しずかで、きれいな　ところでした。', cn: '是個安靜且美麗的地方。' },
  { jp: 'レストランに　はいって、はじめての　りょうりを　たべました。', cn: '進入餐廳，吃了第一次吃的料理。' },
  { jp: 'すこし　へんな　あじでしたが、おもしろかったです。', cn: '雖然味道有點怪怪的，但很有趣。' },
  { jp: 'ごごは、まちを　さんぽしました。', cn: '下午在小鎮散步。' },
  { jp: 'みちに　まよいましたが、やさしい　ひとが　おしえてくれました。', cn: '雖然迷路了，但親切的人指引了我。' },
  { jp: 'ゆうがたに、ホテルに　チェックイン　しました。', cn: '傍晚時辦理了飯店入住。' },
  { jp: 'つかれていましたが、たのしい　きもちでした。', cn: '雖然很累，但心情很愉快。' },
  { jp: 'ひとりの　りょこうは　たいへんでしたが、とても　いい　けいけんに　なりました。', cn: '獨自一人的旅行雖然很辛苦，但成為了非常好的經驗。' }
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
