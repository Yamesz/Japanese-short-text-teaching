const LESSON_DATA = {
  id: 'article-27',
  level: 'N4',
  sentences: [
    { jp: 'ケンタはかいしゃいんで、いぬのモモといっしょにすんでいる。', display: 'ケンタは<ruby>会社員<rt>かいしゃいん</rt></ruby>で、<ruby>犬<rt>いぬ</rt></ruby>のモモといっしょに<ruby>住<rt>す</rt></ruby>んでいる。', romaji: 'Kenta wa kaishain de, inu no Momo to issho ni sunde iru.', cn: '健太是上班族，和狗狗桃子一起生活。' },
    { jp: 'ケンタがしごとでいえをあけているあいだ、モモはひとりでるすばんをしている。', display: 'ケンタが<ruby>仕事<rt>しごと</rt></ruby>で<ruby>家<rt>いえ</rt></ruby>を<ruby>空<rt>あ</rt></ruby>けている<ruby>間<rt>あいだ</rt></ruby>、モモは<ruby>一人<rt>ひとり</rt></ruby>で<ruby>留守番<rt>るすばん</rt></ruby>をしている。', romaji: 'Kenta ga shigoto de ie o akete iru aida, Momo wa hitori de rusuban o shite iru.', cn: '健太上班外出的時候，桃子會獨自在家看門。' },
    { jp: 'さいきん、かえってくると、ソファーのクッションがいつもゆかにおちているのがきになっていた。', display: '<ruby>最近<rt>さいきん</rt></ruby>、<ruby>帰<rt>かえ</rt></ruby>ってくると、ソファーのクッションがいつも<ruby>床<rt>ゆか</rt></ruby>に<ruby>落<rt>お</rt></ruby>ちているのが<ruby>気<rt>き</rt></ruby>になっていた。', romaji: 'Saikin, kaette kuru to, sofā no kusshon ga itsumo yuka ni ochite iru no ga ki ni natte ita.', cn: '最近，健太一直很在意：每次回家時，沙發靠墊總是掉在地板上。' },
    { jp: '「ぼくがいないあいだ、モモはなにをしているんだろう。」ケンタはちいさなカメラをかって、へやにおいた。', display: '「ぼくがいない<ruby>間<rt>あいだ</rt></ruby>、モモは<ruby>何<rt>なに</rt></ruby>をしているんだろう。」ケンタは<ruby>小<rt>ちい</rt></ruby>さなカメラを<ruby>買<rt>か</rt></ruby>って、<ruby>部屋<rt>へや</rt></ruby>に<ruby>置<rt>お</rt></ruby>いた。', romaji: '“Boku ga inai aida, Momo wa nani o shite iru n darō?” Kenta wa chiisana kamera o katte, heya ni oita.', cn: '「我不在家的時候，桃子都在做什麼呢？」健太買了一台小相機，放在房間裡。' },
    { jp: 'つぎのひ、ひるやすみのあいだにスマホでカメラをかくにんすると、モモはソファーのうえできもちよさそうにねていた。', display: '<ruby>次<rt>つぎ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>、<ruby>昼休<rt>ひるやす</rt></ruby>みの<ruby>間<rt>あいだ</rt></ruby>にスマホでカメラを<ruby>確認<rt>かくにん</rt></ruby>すると、モモはソファーの<ruby>上<rt>うえ</rt></ruby>で<ruby>気持<rt>きも</rt></ruby>ちよさそうに<ruby>寝<rt>ね</rt></ruby>ていた。', romaji: 'Tsugi no hi, hiruyasumi no aida ni sumaho de kamera o kakunin suru to, Momo wa sofā no ue de kimochi-yosō ni nete ita.', cn: '隔天，健太在午休期間用手機查看相機畫面時，發現桃子正舒服地睡在沙發上。' },
    { jp: '「なんだ、ねているだけか。」', display: '「なんだ、<ruby>寝<rt>ね</rt></ruby>ているだけか。」', romaji: '“Nanda, nete iru dake ka.”', cn: '「什麼嘛，原來只是在睡覺啊。」' },
    { jp: 'しかしゆうがた、もういちどみると、すこしあいていたまどからとなりのいえのねこがはいってきた。', display: 'しかし<ruby>夕方<rt>ゆうがた</rt></ruby>、もう<ruby>一度<rt>いちど</rt></ruby><ruby>見<rt>み</rt></ruby>ると、<ruby>少<rt>すこ</rt></ruby>し<ruby>開<rt>あ</rt></ruby>いていた<ruby>窓<rt>まど</rt></ruby>から<ruby>隣<rt>となり</rt></ruby>の<ruby>家<rt>いえ</rt></ruby>の<ruby>猫<rt>ねこ</rt></ruby>が<ruby>入<rt>はい</rt></ruby>ってきた。', romaji: 'Shikashi yūgata, mō ichido miru to, sukoshi aite ita mado kara tonari no ie no neko ga haitte kita.', cn: '然而到了傍晚，再看一次時，隔壁家的貓從微微敞開的窗戶進來了。' },
    { jp: 'ねこはクッションをぜんぶゆかにおとして、モモのとなりにすわった。', display: '<ruby>猫<rt>ねこ</rt></ruby>はクッションを<ruby>全部<rt>ぜんぶ</rt></ruby><ruby>床<rt>ゆか</rt></ruby>に<ruby>落<rt>お</rt></ruby>として、モモの<ruby>隣<rt>となり</rt></ruby>に<ruby>座<rt>すわ</rt></ruby>った。', romaji: 'Neko wa kusshon o zenbu yuka ni otoshite, Momo no tonari ni suwatta.', cn: '貓把靠墊全弄到地板上，然後坐在桃子旁邊。' },
    { jp: 'それからにひきはくっついて、いっしょにねはじめた。', display: 'それから<ruby>二匹<rt>にひき</rt></ruby>はくっついて、いっしょに<ruby>寝<rt>ね</rt></ruby><ruby>始<rt>はじ</rt></ruby>めた。', romaji: 'Sorekara nihiki wa kuttsuite, issho ni ne-hajimeta.', cn: '接著，兩隻動物靠在一起，開始一起睡覺。' },
    { jp: 'そのよる、ケンタはクッションをかたづけながらわらった。', display: 'その<ruby>夜<rt>よる</rt></ruby>、ケンタはクッションを<ruby>片付<rt>かたづ</rt></ruby>けながら<ruby>笑<rt>わら</rt></ruby>った。', romaji: 'Sono yoru, Kenta wa kusshon o katazukenagara waratta.', cn: '那天晚上，肯太一邊收拾靠墊，一邊笑了。' },
    { jp: '「ぼくがしごとをしているあいだに、ともだちができたんだね。」モモはうれしそうにしっぽをふった。', display: '「ぼくが<ruby>仕事<rt>しごと</rt></ruby>をしている<ruby>間<rt>あいだ</rt></ruby>に、<ruby>友達<rt>ともだち</rt></ruby>ができたんだね。」モモはうれしそうにしっぽを<ruby>振<rt>ふ</rt></ruby>った。', romaji: '“Boku ga shigoto o shite iru aida ni, tomodachi ga dekita n da ne.” Momo wa ureshisō ni shippo o futta.', cn: '「我工作的時候，妳交到朋友了呢。」桃子高興地搖了搖尾巴。' }
  ]
};

const SENTENCES = LESSON_DATA.sentences;

document.addEventListener('DOMContentLoaded', () => {
  LessonRenderer.renderPassage('#lesson-passage', LESSON_DATA.sentences);
  LessonRenderer.renderBreakdown('#lesson-breakdown', LESSON_DATA.sentences);
  LessonRenderer.bindSpeechButtons();
});
