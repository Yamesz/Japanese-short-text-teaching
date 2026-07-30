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
