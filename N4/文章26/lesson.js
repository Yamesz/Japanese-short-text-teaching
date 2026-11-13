const LESSON_DATA = {
  id: 'article-26',
  level: 'N4',
  sentences: [
    { jp: 'ハナはロンドンのフラットにすんでいる。', display: 'ハナは　ロンドンの　フラットに　<ruby>住<rt>す</rt></ruby>んでいる。', romaji: 'Hana wa Rondon no furatto ni sunde iru.', cn: '哈娜住在倫敦的公寓裡。' },
    { jp: 'せんしゅう、あたらしいルームメイトのトムがひっこしてきた。', display: '<ruby>先週<rt>せんしゅう</rt></ruby>、<ruby>新<rt>あたら</rt></ruby>しい　ルームメイトの　トムが　<ruby>引<rt>ひ</rt></ruby>っ<ruby>越<rt>こ</rt></ruby>してきた。', romaji: 'Senshū, atarashii rūmumeito no Tomu ga hikkoshite kita.', cn: '上週，新室友湯姆搬了進來。' },
    { jp: 'ハナはトムにケーキをやいてあげようとおもったが、トムがあまいものがすきかどうかわからない。', display: 'ハナは　トムに　ケーキを　<ruby>焼<rt>や</rt></ruby>いてあげようと<ruby>思<rt>おも</rt></ruby>ったが、トムが　<ruby>甘<rt>あま</rt></ruby>いものが　<ruby>好<rt>す</rt></ruby>きかどうか<ruby>分<rt>わ</rt></ruby>からない。', romaji: 'Hana wa Tomu ni kēki o yaite ageyō to omotta ga, Tomu ga amai mono ga suki ka dō ka wakaranai.', cn: '哈娜想為湯姆烤蛋糕，卻不知道湯姆喜不喜歡甜食。' },
    { jp: 'ちょくせつきいたら、サプライズにならない。', display: '<ruby>直接<rt>ちょくせつ</rt></ruby><ruby>聞<rt>き</rt></ruby>いたら、サプライズにならない。', romaji: 'Chokusetsu kiitara, sapuraizu ni naranai.', cn: '如果直接問他，就不算驚喜了。' },
    { jp: 'そこで、ハナはともだちのサラにでんわし、トムがあまいものをたべるかどうかたずねた。', display: 'そこで、ハナは　<ruby>友達<rt>ともだち</rt></ruby>の　サラに　<ruby>電話<rt>でんわ</rt></ruby>し、トムが　<ruby>甘<rt>あま</rt></ruby>いものを　<ruby>食<rt>た</rt></ruby>べるかどうか<ruby>尋<rt>たず</rt></ruby>ねた。', romaji: 'Sokode, Hana wa tomodachi no Sara ni denwa shi, Tomu ga amai mono o taberu ka dō ka tazuneta.', cn: '於是哈娜打電話給朋友莎拉，詢問湯姆會不會吃甜食。' },
    { jp: 'サラもわからなかったが、「トムのおねえさんにきいてみたら？」といい、でんわばんごうをおしえてくれた。', display: 'サラも<ruby>分<rt>わ</rt></ruby>からなかったが、「トムの　お<ruby>姉<rt>ねえ</rt></ruby>さんに<ruby>聞<rt>き</rt></ruby>いてみたら？」と<ruby>言<rt>い</rt></ruby>い、<ruby>電話番号<rt>でんわばんごう</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてくれた。', romaji: 'Sara mo wakaranakatta ga, “Tomu no oneesan ni kiite mitara?” to ii, denwa bangō o oshiete kureta.', cn: '莎拉也不知道，但建議：「要不要問問湯姆的姊姊？」並把電話號碼告訴了她。' },
    { jp: 'おねえさんのこたえは「たぶんだいじょうぶ」だったので、ハナはあんしんして、おおきなチョコレートケーキをつくった。', display: 'お<ruby>姉<rt>ねえ</rt></ruby>さんの<ruby>答<rt>こた</rt></ruby>えは「たぶん<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>」だったので、ハナは<ruby>安心<rt>あんしん</rt></ruby>して、<ruby>大<rt>おお</rt></ruby>きな　チョコレートケーキを<ruby>作<rt>つく</rt></ruby>った。', romaji: 'Oneesan no kotae wa “tabun daijōbu” datta node, Hana wa anshin shite, ōkina chokorēto kēki o tsukutta.', cn: '姊姊回答「大概沒問題」，哈娜放心地做了一個大巧克力蛋糕。' },
    { jp: 'よる、トムがかえってくると、テーブルのうえにケーキがあった。', display: '<ruby>夜<rt>よる</rt></ruby>、トムが<ruby>帰<rt>かえ</rt></ruby>ってくると、テーブルの<ruby>上<rt>うえ</rt></ruby>にケーキがあった。', romaji: 'Yoru, Tomu ga kaette kuru to, tēburu no ue ni kēki ga atta.', cn: '晚上湯姆回來時，桌上放著蛋糕。' },
    { jp: '「ようこそ！」とハナがいうと、トムはとてもよろこんで「ありがとう！」とこたえた。', display: '「ようこそ！」とハナが<ruby>言<rt>い</rt></ruby>うと、トムはとても<ruby>喜<rt>よろこ</rt></ruby>んで「ありがとう！」と<ruby>答<rt>こた</rt></ruby>えた。', romaji: '“Yōkoso!” to Hana ga iu to, Tomu wa totemo yorokonde, “Arigatō!” to kotaeta.', cn: '哈娜說「歡迎！」湯姆很高興地回答「謝謝！」' },
    { jp: 'それから、すこしこまったかおでつづけた。', display: 'それから、<ruby>少<rt>すこ</rt></ruby>し<ruby>困<rt>こま</rt></ruby>った<ruby>顔<rt>かお</rt></ruby>で<ruby>続<rt>つづ</rt></ruby>けた。', romaji: 'Sorekara, sukoshi komatta kao de tsuzuketa.', cn: '接著，他帶著有些為難的表情繼續說。' },
    { jp: '「じつは、ぼくはケーキやではたらいているんだ。まいにちケーキばかりみているから……」', display: '「<ruby>実<rt>じつ</rt></ruby>は、ぼくはケーキ<ruby>屋<rt>や</rt></ruby>で<ruby>働<rt>はたら</rt></ruby>いているんだ。<ruby>毎日<rt>まいにち</rt></ruby>ケーキばかり<ruby>見<rt>み</rt></ruby>ているから……」', romaji: '“Jitsu wa, boku wa kēkiya de hataraite iru n da. Mainichi kēki bakari mite iru kara...”', cn: '「其實，我在蛋糕店工作。每天都只看得到蛋糕……」' },
    { jp: 'ハナはすこしかんがえてから、ナイフをトムにわたした。', display: 'ハナは<ruby>少<rt>すこ</rt></ruby>し<ruby>考<rt>かんが</rt></ruby>えてから、ナイフをトムに<ruby>渡<rt>わた</rt></ruby>した。', romaji: 'Hana wa sukoshi kangaete kara, naifu o Tomu ni watashita.', cn: '哈娜想了一下，便把刀子遞給湯姆。' },
    { jp: '「じゃあ、おいしいかどうか、プロのいけんをきかせて」といった。', display: '「じゃあ、<ruby>美味<rt>おい</rt></ruby>しいかどうか、プロの<ruby>意見<rt>いけん</rt></ruby>を<ruby>聞<rt>き</rt></ruby>かせて」と<ruby>言<rt>い</rt></ruby>った。', romaji: '“Jā, oishii ka dō ka, puro no iken o kikasete,” to itta.', cn: '「那麼，告訴我好不好吃，讓我聽聽專家的意見吧。」' }
  ]
};

const SENTENCES = LESSON_DATA.sentences;

document.addEventListener('DOMContentLoaded', () => {
  LessonRenderer.renderPassage('#lesson-passage', LESSON_DATA.sentences);
  LessonRenderer.renderBreakdown('#lesson-breakdown', LESSON_DATA.sentences);
  LessonRenderer.bindSpeechButtons();
});
