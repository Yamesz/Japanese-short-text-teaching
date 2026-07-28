const SENTENCES = [
  { jp: 'きょう、ワタシは　トウキョウの　ビジネスセンターへ　いきました。', cn: '今天，我去了東京的商業中心。' },
  { jp: 'コノ　エリアは　モダンで、タカイ　ビルが　たくさん　あります。', cn: '這個地區很現代，有很多高樓大廈。' },
  { jp: 'アサ、オフィスに　とうちゃくして、コンピューターを　つかって　データを　チェックしました。', cn: '早上抵達辦公室，使用了電腦並確認資料。' },
  { jp: 'プロジェクトの　スケジュールは　とても　タイトでしたが、チームで　コミュニケーションを　とって　スムーズに　すすめることが　できました。', cn: '專案的時程非常緊湊，但透過團隊溝通，得以順利進行。' },
  { jp: 'ヒルには、レストランで　パスタと　コーヒーを　オーダーしました。', cn: '中午在餐廳點了義大利麵和咖啡。' },
  { jp: 'サービスは　とても　プロフェッショナルで、フードも　おいしかったです。', cn: '服務非常專業，食物也很好吃。' },
  { jp: 'ゴゴは　クライアントと　ミーティングが　ありました。', cn: '下午和客戶有會議。' },
  { jp: 'プレゼンテーションを　して、フィードバックを　もらいました。', cn: '進行了簡報，並獲得了回饋。' },
  { jp: 'とても　ポジティブな　コメントが　おおくて、じしんに　なりました。', cn: '有很多非常正面的評價，讓我增加了自信。' },
  { jp: 'ユウガタ、オフィスを　でて、カフェで　リラックス　しました。', cn: '傍晚離開辦公室，在咖啡廳放鬆了一下。' },
  { jp: 'おんがくを　ききながら、きょうの　ワークを　ふりかえりました。', cn: '一邊聽音樂，一邊回顧了今天的工作。' },
  { jp: 'きょうは　とても　いそがしい　いちにちでしたが、とても　じゅうじつした　いい　いちにちでした。', cn: '今天雖然是非常忙碌的一天，但也是十分充實美好的一天。' }
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
