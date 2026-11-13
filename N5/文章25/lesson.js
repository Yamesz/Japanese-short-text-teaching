const LESSON_DATA = {
  id: 'article-25',
  level: 'N5',
  sentences: [
    { jp: 'きょうはあめです。', display: '<ruby>今日<rt>きょう</rt></ruby>は　<ruby>雨<rt>あめ</rt></ruby>です。', romaji: 'Kyō wa ame desu.', cn: '今天下雨。' },
    { jp: 'あさ、わたしはおきて、まどをあけます。', display: '<ruby>朝<rt>あさ</rt></ruby>、わたしは　<ruby>起<rt>お</rt></ruby>きて、<ruby>窓<rt>まど</rt></ruby>を　<ruby>開<rt>あ</rt></ruby>けます。', romaji: 'Asa, watashi wa okite, mado o akemasu.', cn: '早上我起床後打開窗戶。' },
    { jp: 'そらはくらいです。', display: '<ruby>空<rt>そら</rt></ruby>は　<ruby>暗<rt>くら</rt></ruby>いです。', romaji: 'Sora wa kurai desu.', cn: '天空很陰暗。' },
    { jp: 'かさをもって、がっこうにいきます。', display: '<ruby>傘<rt>かさ</rt></ruby>を　<ruby>持<rt>も</rt></ruby>って、<ruby>学校<rt>がっこう</rt></ruby>に　<ruby>行<rt>い</rt></ruby>きます。', romaji: 'Kasa o motte, gakkō ni ikimasu.', cn: '我帶著傘去學校。' },
    { jp: 'がっこうで、せんせいのはなしをききます。', display: '<ruby>学校<rt>がっこう</rt></ruby>で、<ruby>先生<rt>せんせい</rt></ruby>の　<ruby>話<rt>はなし</rt></ruby>を　<ruby>聞<rt>き</rt></ruby>きます。', romaji: 'Gakkō de, sensei no hanashi o kikimasu.', cn: '在學校聽老師說話。' },
    { jp: 'ともだちといっしょにべんきょうします。', display: '<ruby>友達<rt>ともだち</rt></ruby>と　<ruby>一緒<rt>いっしょ</rt></ruby>に　<ruby>勉強<rt>べんきょう</rt></ruby>します。', romaji: 'Tomodachi to issho ni benkyō shimasu.', cn: '和朋友一起讀書。' },
    { jp: 'ひるやすみ、そとにいけません。', display: '<ruby>昼休<rt>ひるやす</rt></ruby>み、<ruby>外<rt>そと</rt></ruby>に　<ruby>行<rt>い</rt></ruby>けません。', romaji: 'Hiruyasumi, soto ni ikemasen.', cn: '午休時不能到外面去。' },
    { jp: 'へやでほんをよみます。', display: '<ruby>部屋<rt>へや</rt></ruby>で　<ruby>本<rt>ほん</rt></ruby>を　<ruby>読<rt>よ</rt></ruby>みます。', romaji: 'Heya de hon o yomimasu.', cn: '在房間裡看書。' },
    { jp: 'ゆうがた、うちにかえって、あたたかいおちゃをのみます。', display: '<ruby>夕方<rt>ゆうがた</rt></ruby>、<ruby>家<rt>うち</rt></ruby>に　<ruby>帰<rt>かえ</rt></ruby>って、<ruby>暖<rt>あたた</rt></ruby>かい　<ruby>お茶<rt>おちゃ</rt></ruby>を　<ruby>飲<rt>の</rt></ruby>みます。', romaji: 'Yūgata, uchi ni kaette, atatakai ocha o nomimasu.', cn: '傍晚回家後喝熱茶。' },
    { jp: 'よる、テレビをみて、ねます。', display: '<ruby>夜<rt>よる</rt></ruby>、テレビを　<ruby>見<rt>み</rt></ruby>て、<ruby>寝<rt>ね</rt></ruby>ます。', romaji: 'Yoru, terebi o mite, nemasu.', cn: '晚上看電視，然後睡覺。' }
  ]
};

const SENTENCES = LESSON_DATA.sentences;

document.addEventListener('DOMContentLoaded', () => {
  LessonRenderer.renderPassage('#lesson-passage', LESSON_DATA.sentences);
  LessonRenderer.renderBreakdown('#lesson-breakdown', LESSON_DATA.sentences);
  LessonRenderer.bindSpeechButtons();
});
