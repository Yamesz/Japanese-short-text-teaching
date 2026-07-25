// Lesson script for 文章4



function playFullArticleAudio() {
  const fullText = "きょうはとてもいいてんきです。わたしはともだちといっしょに、うみのちかくのカフェへいきました。まどからあおいうみとひこうきがみえました。わたしたちはつめたいアイスクリームをたべながら、たくさんおはなしをしました。とてもたのしいじかんでした。ゆうがた、うみのすなはまをさんぽしました。ゆうひがとてもきれいでした。またともだちといっしょにここにきたいです。";
  speakJapanese(fullText);
}

function checkLessonAnswer(choice, correct, explanation) {
  const fb = document.getElementById('lesson-quiz-feedback');
  fb.style.display = 'block';
  if (choice === correct) {
    fb.style.background = '#D1FAE5';
    fb.style.color = '#065F46';
    fb.innerHTML = `🌸 <b>よくできました！（做得很好！）</b><br>${explanation}`;
    speakJapanese("よくできました！");
  } else {
    fb.style.background = '#FEE2E2';
    fb.style.color = '#991B1B';
    fb.innerHTML = `🌸 <b>大丈夫ですよ！（別挫折喔！）</b><br>表達「想再來這裡」是用動詞希望形『来たいです』喔！`;
  }
}
