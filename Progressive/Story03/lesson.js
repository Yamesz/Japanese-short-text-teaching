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
