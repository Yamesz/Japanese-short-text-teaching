// Lesson script for 文章8



function playFullArticleAudio() {
  const fullText = "きのう、えきのちかくにあるあたらしいみせへいききました。みせのなかはあかるくて、とてもきれいでした。たくさんのしょうひんがならんでいて、みているだけでもたのしかったです。わたしはパンとのみものをかいました。てんいんさんはとてもしんせつでした。かいものをしたあと、ともだちとすこしはなしました。またじかんがあるときにいきたいとおもいます。";
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
    fb.innerHTML = `🌸 <b>大丈夫ですよ！（別挫折喔！）</b><br>表達「想法/思考」是用『〜と思います』喔！`;
  }
}
