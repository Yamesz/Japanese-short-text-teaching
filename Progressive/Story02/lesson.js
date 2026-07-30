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
