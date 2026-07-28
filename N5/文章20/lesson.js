const SENTENCES = [
  { jp: 'きのうは　とても　いそがしい　いちにちでした。', cn: '昨天是非常忙碌的一天。' },
  { jp: 'あさ、わたしは　はやく　おきて、シャワーを　あびました。', cn: '早上，我早早起床洗了澡。' },
  { jp: 'それから、あさごはんを　たべて、いえを　でました。', cn: '然後吃了早餐，出了門。' },
  { jp: 'でんしゃに　のって、がっこうへ　いきました。', cn: '搭上電車，去了學校。' },
  { jp: 'でんしゃの　なかは　とても　こんでいました。', cn: '電車裡面非常擁擠。' },
  { jp: 'がっこうに　ついてから、すぐに　べんきょうを　はじめました。', cn: '到了學校之後，馬上開始學習。' },
  { jp: 'ごぜんちゅうは、にほんごを　べんきょうしました。', cn: '上午學習了日文。' },
  { jp: 'せんせいの　はなしは　とても　おもしろかったです。', cn: '老師說的話非常有趣。' },
  { jp: 'ともだちと　いっしょに　れんしゅうも　しました。', cn: '也和朋友一起練習了。' },
  { jp: 'ひるやすみに、パンと　ジュースを　たべました。', cn: '午休時，吃了麵包和果汁。' },
  { jp: 'ともだちと　たくさん　はなして、たのしかったです。', cn: '和朋友聊了很多，很開心。' },
  { jp: 'ごごは、すこし　つかれましたが、さいごまで　がんばりました。', cn: '下午雖然稍微有點累，但堅持到了最後。' },
  { jp: 'いえに　かえってから、しゅくだいを　しました。', cn: '回家之後，做了作業。' },
  { jp: 'そのあと、テレビを　みて、ゆっくり　やすみました。', cn: '在那之後，看了電視，好好地休息了。' },
  { jp: 'とても　いそがしかったですが、いい　いちにちでした。', cn: '雖然非常忙碌，但是是個美好的一天。' }
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

    if (typeof getPreferredJapaneseVoice === 'function') {
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
