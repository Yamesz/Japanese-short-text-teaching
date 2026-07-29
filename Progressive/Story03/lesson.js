const SENTENCES_N5 = [
  { jp: 'きのうの　ごご３じごろ、わたしは　こうえんに　いました。', cn: '昨天下午三點左右，我在公園裡。' },
  { jp: 'くろい　ふくの　おとこのひとが　はしってきました。', cn: '一個穿黑衣服的男人跑了過來。' },
  { jp: 'おとこのひとは　とても　いそいでいました。', cn: '那個男人非常著急。' },
  { jp: 'そして、きっさてんの　ほうへ　いきました。', cn: '然後，他往咖啡廳的方向去了。' },
  { jp: 'そのあと、わたしは　じめんに　あかい　いしを　みつけました。', cn: '在那之後，我在地上發現了一顆紅色的石頭。' },
  { jp: 'とても　きれいでした。', cn: '非常漂亮。' }
];

const SENTENCES_N4 = [
  { jp: 'きのうの　３じすぎに、くろい　ふくを　きた　おとこのひとが　みせに　はいってきました。', cn: '昨天三點多，一個穿著黑衣的男人進了店裡。' },
  { jp: 'そのひとは　とても　あせっているようで、コーヒーを　ちゅうもんしたあと、コップの　みずを　こぼしてしまいました。', cn: '那個人似乎非常焦慮，點了咖啡之後，不小心把杯子裡的水弄翻了。' },
  { jp: 'わたしが　「だいじょうぶですか」と　きくと、かれは　あわてて　でんわを　かけはじめました。', cn: '當我問他「不要緊吧？」的時候，他慌慌張張地開始打電話。' },
  { jp: 'でんわで　「しんじゅくえきの　ロッカーに　いれた」と　いっているのが　きこえました。', cn: '我聽到他在電話裡說「已經放進新宿車站的置物櫃了」。' },
  { jp: 'コーヒーを　のむと、すぐに　みせを　でていきました。', cn: '他喝完咖啡後，立刻就出了店門。' },
  { jp: 'テーブルの　うえには、なにか　あかい　いしの　かけらのような　ものが　おちていました。', cn: '桌子上，掉著一個像是紅色石頭碎片的物品。' }
];

const SENTENCES_N3 = [
  { jp: 'しょうがくせいから　とどけられた　あかい　いしは、はくぶつかんから　ぬすまれた　ほうせきの　いちぶである　ことが　はんめいした。', cn: '從小學生那裡交來的紅色石頭，已經判明是從博物館被盜的寶石的一部分。' },
  { jp: 'けいさつは、きっさてんの　てんいんの　しょうげんを　もとに、しんじゅくえきを　そうさした。', cn: '警方根據咖啡廳店員的證詞，搜索了新宿車站。' },
  { jp: 'そのけっか、コインロッカーの　なかから、のこりの　ほうせきが　はっけんされた。', cn: '結果，從投幣式置物櫃中，發現了剩餘的寶石。' },
  { jp: 'ロッカーを　あけようとした　ようぎしゃは、そのばで　けいさつに　たいほされた。', cn: '正打算打開置物櫃的嫌疑犯，當場被警方逮捕。' },
  { jp: 'ようぎしゃは、「こうえんで　いしを　おとしてしまい、あわてて　かくした」と　きょうじゅつしている。', cn: '嫌疑犯供稱：「在公園裡不小心把石頭弄掉了，於是慌慌張張地把它藏了起來」。' },
  { jp: 'しみんの　きょうりょくによって、じけんは　ぶじに　かいけつへと　みちびかれた。', cn: '因為有市民的協助，事件平安地導向了解決。' }
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
