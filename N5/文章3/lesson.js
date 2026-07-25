// Lesson script for 文章3



function playFullArticleAudio() {
  const fullText = "ごご、にわにしごとをします。はなにみずをやります。くさをとります。つちをさわって、てがよごれます。すこしつかれますが、たのしいです。ちょうちょがきて、はなにとまります。ゆうがた、うちにはいって、てをあらいます。";
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
    fb.innerHTML = `🌸 <b>大丈夫ですよ！（別挫折喔！）</b><br>轉折助詞『が』常用在連貫句子中表達「雖然...但是...」喔！`;
  }
}
