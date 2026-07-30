const LESSON_DATA = {
  id: 'article-22',
  level: 'N5',
  sentences: [
    { jp: 'サッカーのワールドカップは　せかいで　いちばん　ゆうめいな　たいかいです。', display: 'サッカーのワールドカップは　<ruby>世界<rt>せかい</rt></ruby>で　いちばん　<ruby>有名<rt>ゆうめい</rt></ruby>な　<ruby>大会<rt>たいかい</rt></ruby>です。', romaji: 'Sa-k-ka-a no wa-a-ru-do-ka-p-pu wa se-ka-i de i-chi-ba-n yu-u-me-i na ta-i-ka-i de-su.', cn: '足球世界盃是世界上最有名的比賽。' },
    { jp: '４ねんに　いちど　あります。', display: '４<ruby>年<rt>ねん</rt></ruby>に　<ruby>一度<rt>いちど</rt></ruby>　あります。', romaji: 'Yo-ne-n ni i-chi-do a-ri-ma-su.', cn: '每四年舉辦一次。' },
    { jp: 'たくさんの　くにが　さんかします。', display: 'たくさんの　<ruby>国<rt>くに</rt></ruby>が　<ruby>参加<rt>さんか</rt></ruby>します。', romaji: 'Ta-ku-sa-n no ku-ni ga sa-n-ka shi-ma-su.', cn: '有許多國家會參加。' },
    { jp: 'せんしゅたちは　じぶんの　くにの　ために　がんばります。', display: '<ruby>選手<rt>せんしゅ</rt></ruby>たちは　<ruby>自分<rt>じぶん</rt></ruby>の　<ruby>国<rt>くに</rt></ruby>の　ために　がんばります。', romaji: 'Se-n-shu-ta-chi wa ji-bu-n no ku-ni no ta-me ni ga-n-ba-ri-ma-su.', cn: '選手們為了自己的國家而努力。' },
    { jp: 'しあいは　とても　おもしろいです。', display: '<ruby>試合<rt>しあい</rt></ruby>は　とても　おもしろいです。', romaji: 'Shi-a-i wa to-te-mo o-mo-shi-ro-i de-su.', cn: '比賽非常有趣。' },
    { jp: 'おおぜいの　ひとが　テレビで　みます。', display: '<ruby>大勢<rt>おおぜい</rt></ruby>の　<ruby>人<rt>ひと</rt></ruby>が　テレビで　<ruby>見<rt>み</rt></ruby>ます。', romaji: 'O-o-ze-i no hi-to ga te-re-bi de mi-ma-su.', cn: '許多人會在電視上觀看。' },
    { jp: 'わたしは　ワールドカップが　だいすきです。', display: 'わたしは　ワールドカップが　<ruby>大好<rt>だいす</rt></ruby>きです。', romaji: 'Wa-ta-shi wa wa-a-ru-do-ka-p-pu ga da-i-su-ki de-su.', cn: '我最喜歡世界盃了。' }
  ]
};

const SENTENCES = LESSON_DATA.sentences;

document.addEventListener('DOMContentLoaded', () => {
  LessonRenderer.renderPassage('#lesson-passage', LESSON_DATA.sentences);
  LessonRenderer.renderBreakdown('#lesson-breakdown', LESSON_DATA.sentences);
  LessonRenderer.bindSpeechButtons();
});

