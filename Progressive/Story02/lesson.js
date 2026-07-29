const SENTENCES_N5 = [
  { jp: 'きょうは　とても　いい　てんきです。', cn: '今天天氣非常好。' },
  { jp: 'わたしは　あさ　６じに　おきました。', cn: '我早上6點就起床了。' },
  { jp: 'あさごはんを　たべて、えきへ　いきました。', cn: '吃了早餐後，就前往車站。' },
  { jp: 'えきで　とうきょうゆきの　きっぷを　かいました。', cn: '在車站買了前往東京的車票。' },
  { jp: 'しんかんせんは　とても　はやかったです。', cn: '新幹線非常快。' },
  { jp: 'まどから　ふじさんが　みえました。', cn: '從窗戶看得到富士山。' },
  { jp: 'わたしは　とても　うれしかったです。', cn: '我感到非常開心。' }
];

const SENTENCES_N4 = [
  { jp: 'とうきょうえきに　ついたら、ひとが　おおすぎて　びっくりしました。', cn: '一抵達東京車站，人多到讓我嚇了一跳。' },
  { jp: 'スマホの　ちずを　みてみましたが、みちが　ぜんぜん　わかりませんでした。', cn: '雖然試著看了手機地圖，但完全搞不懂路。' },
  { jp: 'そのとき、おばあさんが　「どうしたの？」と　こえを　かけてくれました。', cn: '那時，一位老奶奶出聲叫住了我：「怎麼了嗎？」' },
  { jp: '「スカイツリーに　いきたいんですが…」と　いうと、', cn: '我說：「我想到晴空塔去...」，' },
  { jp: 'おばあさんは　「あっちの　でんしゃに　のるといいよ」と　おしえてくれました。', cn: '老奶奶便告訴我：「搭那一邊的電車就可以喔」。' },
  { jp: 'とうきょうの　ひとは　つめたいと　きいていましたが、とても　しんせつだなぁと　おもいました。', cn: '雖然曾聽說東京的人很冷漠，但我認為他們非常親切。' }
];

const SENTENCES_N3 = [
  { jp: 'おばあさんの　おかげで、ようやく　もくてきちに　たどりつくことが　できました。', cn: '多虧了老奶奶，我總算抵達了目的地。' },
  { jp: 'ところが、スカイツリーに　のぼろうとしたものの、きょうは　きょうふうのため　てんぼうだいが　へいさされていました。', cn: '然而，正當我打算登上晴空塔時，卻發現今天因為強風的關係，觀景台被關閉了。' },
  { jp: 'せっかく　とおくから　きたのに、のぼれなくて　本当に　がっかりしてしまいました。', cn: '難得大老遠跑來卻登不上去，真的感到非常失望。' },
  { jp: 'しかたなく　ちかくの　かわぞいを　あるいていると、きれいな　ゆうひに　てらされた　スカイツリーが　みえました。', cn: '無可奈何之下，我在附近的河畔散步時，看見了被美麗夕陽照耀著的晴空塔。' },
  { jp: 'そのけしきは　あまりにも　うつくしく、カメラを　むけずには　いられませんでした。', cn: '那景色美得讓人忍不住舉起相機。' },
  { jp: 'よていどおりには　いきませんでしたが、この　おもいがけない　けしきに　であえたことは、わたしにとって　さいこうの　おもいでに　なりました。', cn: '雖然事情沒有按照計畫進行，但能與這意想不到的景色相遇，對我來說成了最棒的回憶。' }
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

function unlockLevel(level) {
  const overlay = document.getElementById(`overlay-${level}`);
  if (overlay) {
    overlay.style.display = 'none';
  }
  switchLevel(level);
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
