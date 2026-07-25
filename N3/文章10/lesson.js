// Lesson script for 文章10 (将来の夢 - 未來的夢想 / N3短文)



function playFullArticleAudio() {
  const fullText = "わたしのしょうらいのゆめは、ただせいこうするだけでなく、じぶんがまなんだちしきやけいけんをいかして、ひとびとによいえいきょうをあたえられるひとになることです。けいざいてきにじりつし、かぞくのせきにんをはたしながら、じぶんじしんのみちをきずくことがもくひょうです。";
  speakJapanese(fullText);
}

function checkLessonAnswer(choice, correct, explanation) {
  const fb = document.getElementById('lesson-quiz-feedback');
  if (!fb) return;
  fb.style.display = 'block';
  if (choice === correct) {
    fb.style.background = '#D1FAE5';
    fb.style.color = '#065F46';
    fb.innerHTML = `🌸 <b>よくできました！（做得很好！）</b><br>${explanation}`;
    speakJapanese("よくできました！");
  } else {
    fb.style.background = '#FEE2E2';
    fb.style.color = '#991B1B';
    fb.innerHTML = `🌸 <b>大丈夫ですよ！（別挫折喔！）</b><br>表達「一邊做A一邊做B」是用『動詞連用形 ＋ ながら』喔！`;
  }
}
