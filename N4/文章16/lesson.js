const SENTENCES = [
  { jp: 'おとうと、きみは　ぼくの　じんせいで　いちばん　だいすきな　しょうだ。', cn: '弟弟，你是我人生中最重要的存在。' },
  { jp: 'よむと　えがおに　なり、おもいだすと　めに　なみだが　うかぶ。', cn: '讀到（這些文字）就會露出笑容，回想起來眼眶就泛起淚水。' },
  { jp: 'きみが　とおくに　いても、こころは　いつも　ちかくに　ある。', cn: '即使你在遠方，心卻始終在身邊。' },
  { jp: 'きみを　おもうたびに、めいっぱい　なみだが　あふれる。', cn: '每次想起你，滿滿的淚水就會溢出來。' },
  { jp: 'いっしょに　すごした　あの　こどもじだいの　ひび。', cn: '一起度過的那些童年時光。' },
  { jp: 'おもいだす　だけで、いまでも　この　めが　うるむ。', cn: '光是回想，到現在眼眶仍會泛紅。' },
  { jp: 'きみが　ころんだ　とき、てを　さしのべるのは　いつも　ぼくだ。', cn: '你跌倒的時候，伸出手的總是我。' },
  { jp: 'きみが　くじけそうな　とき、はげます　こえは　いつも　ぼくだ。', cn: '你快要放棄的時候，鼓勵的聲音總是我。' },
  { jp: 'もし　いつか　じかんが　ぼくたちを　ひきはなしても、', cn: '如果有一天時間將我們分隔，' },
  { jp: 'ぼくの　あいは　けっして　きみから　はなれない。', cn: '我的愛也絕不會離開你。' }
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

    const currentSentence = this.sentences[this.currentIndex].jp.replace(/　/g, '');
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
