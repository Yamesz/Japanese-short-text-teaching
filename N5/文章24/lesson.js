const LESSON_DATA = {
  id: 'article-24',
  level: 'N5',
  sentences: [
    { jp: 'きのう、としょかんへいきました。', display: 'きのう、<ruby>図書館<rt>としょかん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きました。', romaji: 'Kinō, toshokan e ikimashita.', cn: '昨天去了圖書館。' },
    { jp: 'ほんをかりました。', display: '<ruby>本<rt>ほん</rt></ruby>を<ruby>借<rt>か</rt></ruby>りました。', romaji: 'Hon o karimashita.', cn: '借了書。' },
    { jp: 'しずかなばしょでべんきょうしました。', display: '<ruby>静<rt>しず</rt></ruby>かな<ruby>場所<rt>ばしょ</rt></ruby>で<ruby>勉強<rt>べんきょう</rt></ruby>しました。', romaji: 'Shizuka na basho de benkyō shimashita.', cn: '在安靜的地方讀書。' },
    { jp: 'にほんごのほんもよみました。', display: '<ruby>日本語<rt>にほんご</rt></ruby>の<ruby>本<rt>ほん</rt></ruby>も<ruby>読<rt>よ</rt></ruby>みました。', romaji: 'Nihongo no hon mo yomimashita.', cn: '也讀了日文書。' },
    { jp: 'わからないことばをじしょでしらべました。', display: '<ruby>分<rt>わ</rt></ruby>からない<ruby>言葉<rt>ことば</rt></ruby>を<ruby>辞書<rt>じしょ</rt></ruby>で<ruby>調<rt>しら</rt></ruby>べました。', romaji: 'Wakaranai kotoba o jisho de shirabemashita.', cn: '用字典查了不懂的單字。' },
    { jp: 'にじかんべんきょうしました。', display: '<ruby>二時間<rt>にじかん</rt></ruby><ruby>勉強<rt>べんきょう</rt></ruby>しました。', romaji: 'Ni-jikan benkyō shimashita.', cn: '讀了兩個小時的書。' },
    { jp: 'ほんをかえすひをかくにんしました。', display: '<ruby>本<rt>ほん</rt></ruby>を<ruby>返<rt>かえ</rt></ruby>す<ruby>日<rt>ひ</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>しました。', romaji: 'Hon o kaesu hi o kakunin shimashita.', cn: '確認了還書的日期。' },
    { jp: 'とてもゆういぎなじかんでした。', display: 'とても<ruby>有意義<rt>ゆういぎ</rt></ruby>な<ruby>時間<rt>じかん</rt></ruby>でした。', romaji: 'Totemo yūigi na jikan deshita.', cn: '度過了非常有收穫的時間。' },
    { jp: 'またとしょかんへいきたいです。', display: 'また<ruby>図書館<rt>としょかん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きたいです。', romaji: 'Mata toshokan e ikitai desu.', cn: '還想再去圖書館。' }
  ]
};

const SENTENCES = LESSON_DATA.sentences;

document.addEventListener('DOMContentLoaded', () => {
  LessonRenderer.renderPassage('#lesson-passage', LESSON_DATA.sentences);
  LessonRenderer.renderBreakdown('#lesson-breakdown', LESSON_DATA.sentences);
  LessonRenderer.bindSpeechButtons();
});
