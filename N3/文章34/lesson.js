const LESSON_DATA = {
  "id": "article-34",
  "level": "N3",
  "sentences": [
    {
      "jp": "みずほはははのふるいミシンをいえにもちかえった。",
      "display": "<ruby>瑞穂<rt>みずほ</rt></ruby>は<ruby>母<rt>はは</rt></ruby>の<ruby>古<rt>ふる</rt></ruby>いミシンを<ruby>家<rt>いえ</rt></ruby>に<ruby>持<rt>も</rt></ruby>ち<ruby>帰<rt>かえ</rt></ruby>った。",
      "romaji": "Mizuho wa haha no furui mishin o ie ni mochikaetta.",
      "cn": "瑞穗把母親的舊縫紉機帶回家。"
    },
    {
      "jp": "うごかしたところ、ぬのがすすまないことにきづいた。",
      "display": "<ruby>動<rt>うご</rt></ruby>かしたところ、<ruby>布<rt>ぬの</rt></ruby>が<ruby>進<rt>すす</rt></ruby>まないことに<ruby>気<rt>き</rt></ruby>づいた。",
      "romaji": "Ugokashita tokoro, nuno ga susumanai koto ni kizuita.",
      "cn": "啟動之後，她發現布料不會往前送。"
    },
    {
      "jp": "みせのひとになおしてもらい、ぬのでふくろをぬってみた。",
      "display": "<ruby>店<rt>みせ</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>に<ruby>直<rt>なお</rt></ruby>してもらい、<ruby>布<rt>ぬの</rt></ruby>で<ruby>袋<rt>ふくろ</rt></ruby>を<ruby>縫<rt>ぬ</rt></ruby>ってみた。",
      "romaji": "Mise no hito ni naoshite morai, nuno de fukuro o nutte mita.",
      "cn": "請店裡的人幫忙修理後，她試著用布縫了袋子。"
    },
    {
      "jp": "じぶんでぬってはじめて、ははのぎじゅつのたかさがわかった。",
      "display": "<ruby>自<ruby>分<rt>わ</rt></ruby><rt>じぶん</rt></ruby>で<ruby>縫<rt>ぬ</rt></ruby>ってはじめて、<ruby>母<rt>はは</rt></ruby>の<ruby>技術<rt>ぎじゅつ</rt></ruby>の<ruby>高<rt>たか</rt></ruby>さが<ruby>分<rt>わ</rt></ruby>かった。",
      "romaji": "Jibun de nutte hajimete, haha no gijutsu no takasa ga wakatta.",
      "cn": "自己動手縫製後，她才體會母親的技術有多好。"
    },
    {
      "jp": "ははにさくひんをみせると、ぬいかたをおしえてくれた。",
      "display": "<ruby>母<rt>はは</rt></ruby>に<ruby>作品<rt>さくひん</rt></ruby>を<ruby>見<rt>み</rt></ruby>せると、<ruby>縫<rt>ぬ</rt></ruby>い<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてくれた。",
      "romaji": "Haha ni sakuhin o miseru to, nuikata o oshiete kureta.",
      "cn": "把作品拿給母親看時，母親教了她縫製的方法。"
    },
    {
      "jp": "しゅうりしてもらっていらい、ミシンはつくえのうえにおいてある。",
      "display": "<ruby>修理<rt>しゅうり</rt></ruby>してもらって<ruby>以来<rt>いらい</rt></ruby>、ミシンは<ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>に<ruby>置<rt>お</rt></ruby>いてある。",
      "romaji": "Shūri shite moratte irai, mishin wa tsukue no ue ni oite aru.",
      "cn": "自從請人修好之後，縫紉機就一直放在桌上。"
    }
  ]
};
window.LESSON_DATA = LESSON_DATA;
const SENTENCES = LESSON_DATA.sentences;
document.addEventListener("DOMContentLoaded", () => {
 LessonRenderer.renderPassage("#lesson-passage", SENTENCES);
 LessonRenderer.renderBreakdown("#lesson-breakdown", SENTENCES);
 LessonRenderer.bindSpeechButtons();
});
